const {handleValidationError} = require("../utils/utils")
const { Op } = require("sequelize")
const express = require("express")
const { Assignee, TodoModel, CategoryModel } = require("../models/todoModel")
const getAllUsers = async (req, res) => {
  try {
    const {
      order = "ASC",
      page = 1,
      pageSize = 10,
      search = "",
      filter,
    } = req.query;
    const totalCount = await Assignee.count();

    const offset = (page - 1) * pageSize;
    const searchCondition = {
      [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
    };
    const categoryFilter = filter
      ? { CategoryId: { [Op.in]: filter.split(",") } }
      : {};
    console.log(categoryFilter)
    const user = await Assignee.findAll({
      where: {
        ...searchCondition,
        ...categoryFilter,
      },
      order: [["createdAt", order]],
      limit: pageSize,
      offset: offset,
      // include: [
      //   {
      //     model: TodoModel,
      //     attributes: ["id", "title", "createdAt", "updatedAt", "CategoryId"],
      //   },
      //   {
      //     model: CategoryModel,
      //     attributes: ["id", "createdAt", "updatedAt", "status"],
      //   },
      // ],
    });

    res.json({
      data: user,
      pagination: {
        page: page,
        pageSize: parseInt(pageSize),
        total: totalCount,
      },
    });
  } catch (error) {
    console.error(error);
    handleValidationError(res, error);
  }
};


const getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await Assignee.findByPk(id)
    if (user) {
      res.status(200).send({ data: user })
    } else {
      res.status(404).send("User not found")
    }
  } catch (error) {
    handleValidationError(res, error)
  }
}

const createUser = async (req, res) => {
  try {
    const user = await Assignee.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    handleValidationError(res, error)
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params
  try {
    const [updatedRowsCount, updatedRows] = await Assignee.update(req.body, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount > 0) {
      res.json(updatedRows[0])
    } else {
      res.status(404).send("User not found")
    }
  } catch (error) {
    console.error(error)
    handleValidationError(res, error)
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const deletedRowCount = await Assignee.destroy({ where: { id } })
    if (deletedRowCount > 0) {
      res.status(204).send()
    } else {
      res.status(404).send("User not found")
    }
  } catch (error) {
    handleValidationError(res, error)
  }
}

module.exports = {getAllUsers,createUser,updateUser,getUserById,deleteUser}