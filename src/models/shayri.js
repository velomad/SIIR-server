"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shayri extends Model {
    static associate(models) {
      // define association here
      Shayri.belongsTo(models.User, { as: "user" });
      Shayri.belongsTo(models.Category, { as: "category" });
      Shayri.hasMany(models.Like, { as: "likes" });
      Shayri.hasMany(models.PinnedShayri, {
        as: "pinned",
        foreignKey: "shayriId",
      });
    }
  }
  Shayri.init(
    {
      shayri: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      shayriBackgroundImageUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Shayri",
    }
  );
  return Shayri;
};
