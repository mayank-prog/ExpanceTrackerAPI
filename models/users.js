const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('users_e', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ispremiumuser:Sequelize.BOOLEAN,
  totalExpenses: {
    type: Sequelize.STRING,
    defaultValue: "0"
  },
});

module.exports = User;