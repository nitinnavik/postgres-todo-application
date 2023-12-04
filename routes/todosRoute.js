// routes.js
const express = require('express')
const { TodoModel } = require('../models/todoModel')
const router = express.Router()

router.get('/', async (req, res) => {
  const todos = await TodoModel.findAll()
  res.json(todos)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const todo = await TodoModel.findByPk(id)
    if (todo) {
      res.status(200).send({ data: todo })
    } else {
      res.status(404).send('Todo not found')
    }
  } catch (error) {
   if (
     error.name === 'SequelizeValidationError' ||
     error.name === 'SequelizeDatabaseError'
   ) {
     return res.status(400).json({ error: error?.message })
   }

   res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const todo = await TodoModel.create(req.body)
    res.status(201).json(todo)
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeDatabaseError'
    ) {
      return res.status(400).json({ error: error?.message })
    }

    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [updatedRowsCount, updatedRows] = await TodoModel.update(req.body, {
      where: { id },
      returning: true,
    })

    if (updatedRowsCount > 0) {
      res.json(updatedRows[0])
    } else {
      res.status(404).send('Todo not found')
    }
  } catch (error) {
    console.error(error)
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeDatabaseError'
    ) {
      return res
        .status(400)
        .json({ error: error?.message })
    }
    

    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedRowCount = await TodoModel.destroy({ where: { id } })
    if (deletedRowCount > 0) {
      res.status(204).send()
    } else {
      res.status(404).send('Todo not found')
    }
  } catch (error) {
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeDatabaseError'
    ) {
      return res.status(400).json({ error: error?.message })
    }

    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
