// routes.js
const express = require('express')
const { CategoryModel } = require('../models/todoModel')
const { handleValidationError } = require('../utils/utils')
const router = express.Router()

router.get('/', async (req, res) => {
  const Categories = await CategoryModel.findAll()
  res.json(Categories)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const category = await CategoryModel.findByPk(id)
    if (category) {
      res.status(200).send({ data: category })
    } else {
      res.status(404).send('Category not found')
    }
  } catch (error) {
    console.log(error);
    handleValidationError(res, error);
  }
})

router.post('/', async (req, res) => {
  try {
    const category = await CategoryModel.create(req.body)
    res.status(201).json(category)
  } catch (error) {
    console.error(error);
    handleValidationError(res, error);
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [updatedRowsCount, updatedRows] = await CategoryModel.update(req.body, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount > 0) {
      res.json(updatedRows[0])
    } else {
      res.status(404).send('Category not found')
    }
  } catch (error) {
    console.error(error)
    handleValidationError(res, error);
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedRowCount = await CategoryModel.destroy({ where: { id } })
    if (deletedRowCount > 0) {
      res.status(204).send()
    } else {
      res.status(404).send('Category not found')
    }
  } catch (error) {
    console.log(error);
    handleValidationError(res, error);
  }
})

module.exports = router
