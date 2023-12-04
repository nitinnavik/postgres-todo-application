const { DataTypes } = require('sequelize')
const sequelize = require('../config/dbConfig')

const TodoModel = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'title',
    required: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    required: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
    validate: {
      async isInCategoryModel(value) {
        const category = await CategoryModel.findOne({
          where: { status: value },
        })
        if (!category) {
          throw new Error('Invalid category. Category not defined.')
        }
      },
    },
  },
})

const CategoryModel = sequelize.define('Category', {
  status: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
  },
})

// Establishing the association
TodoModel.belongsTo(CategoryModel)

module.exports = { TodoModel, CategoryModel }
