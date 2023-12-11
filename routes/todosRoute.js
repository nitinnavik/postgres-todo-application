// routes.js
const express = require("express");
const { TodoModel, CategoryModel, Assignee } = require("../models/todoModel");
const router = express.Router();
const { Op } = require("sequelize");
const { handleValidationError } = require("../utils/utils");

router.get("/", async (req, res) => {
  try {
    const order = req.query.order === "DESC" ? "DESC" : "ASC";
    const totalCount = await TodoModel.count();
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * pageSize;
    const searchQuery = req.query.search || "";
    const searchCondition = {
      [Op.or]: [{ title: { [Op.iLike]: `%${searchQuery}%` } }],
    };
    const categoryFilter = req.query.categoryFilter
    const catFilter = categoryFilter
      ? { CategoryId: { [Op.in]: categoryFilter.split(",") } }
      : {};
    const assigneeFilter = req.query.assigneeFilter;
    const assignFilter = assigneeFilter
      ? { AssigneeId: { [Op.in]: assigneeFilter.split(",") } }
      : {};
    const todos = await TodoModel.findAll({
      where: {
        ...searchCondition,
        ...catFilter,
        ...assignFilter,
      },
      order: [["createdAt", order]],
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: CategoryModel,
          attributes: ["id", "status", "createdAt", "updatedAt"],
        },
        {
          model: Assignee,
          attributes: ["id", "name", "createdAt", "updatedAt"],
        },
      ],
    });

    // Map the results to the desired format
    const formattedTodos = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      isCompleted: todo.isCompleted,
      categoryName: todo.Category ? todo.Category : null,
      assigneeName: todo.Assignee ? todo.Assignee : null,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));

    res.json({
      data: formattedTodos,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: totalCount,
      },
    });
  } catch (error) {
    handleValidationError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await TodoModel.findByPk(id);
    if (todo) {
      res.status(200).send({ data: todo });
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    handleValidationError(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    let assignees = req.body.assignee;
    if (!Array.isArray(assignees)) {
      assignees = [assignees];
    }
    console.log(assignees)
    const todo = await TodoModel.create({
      ...req.body,
      assignee: assignees,
    });
    res.status(201).json(todo);
  } catch (error) {
    handleValidationError(res, error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [updatedRowsCount, updatedRows] = await TodoModel.update(req.body, {
      where: { id },
      returning: true,
    });

    if (updatedRowsCount > 0) {
      res.json(updatedRows[0]);
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    handleValidationError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRowCount = await TodoModel.destroy({ where: { id } });
    if (deletedRowCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    handleValidationError(res, error);
  }
});

module.exports = router;
