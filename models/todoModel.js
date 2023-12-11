
// module.exports = (sequelize, DataTypes) => {
//   const Todo = sequelize.define("Todo", {
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       required: true,
//       unique: true,
//     },
//     isCompleted: {
//       type: DataTypes.BOOLEAN,
//       required: true,
//       allowNull: false,
//     },
//   });

//   Todo.associate = (models) => {
//     Todo.belongsToMany(models.User, {
//       through: "TodoUser", // the junction table
//       foreignKey: "todoId",
//     });
//   };

//   return Todo;
// };


module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      allowNull: false,
    },
  });

  Category.associate = (models) => {
    Category.belongsToMany(models.Todo, {
      through: "TodoCategory", // the junction table
      foreignKey: "categoryId",
    });
  };

  return User;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Todo, {
      through: "TodoUser", // the junction table
      foreignKey: "userId",
    });
  };

  return User;
};

