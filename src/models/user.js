'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    userName: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    emailId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profileImageUrl: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.STRING(150),
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};