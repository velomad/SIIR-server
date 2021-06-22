'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shayri extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Shayri.init({
    shayri: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: "Users",
        key:"id"
      },
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: "Categories",
        key:"id"
      },
    },
    shayriBackgroundImageUrl: {
      type: Sequelize.STRING,
    },
  }, {
    sequelize,
    modelName: 'Shayri',
  });
  return Shayri;
};