const express = require('express')
const sequelize = require('./config/dbConfig.js')
const Todo = require('./models/todoModel')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000
const todosRoutes = require('./routes/todosRoute')
const categoryRoutes = require('./routes/categoriesRoute');
const userRoutes = require('./routes/userRoute')

app.use(express.json())

// Sync Sequelize models with the database
sequelize.sync({force:true}).then(() => {
  console.log('Database and tables created!')
})

app.use('/todos', todosRoutes)
app.use('/category', categoryRoutes)
app.use('/user', userRoutes)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
