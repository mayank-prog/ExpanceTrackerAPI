const Sequelize = require('sequelize');
const { USER_NAME, DATABASE_NAME, USER_PASSWORD, HOST_NAME } = require('../config.js');

const sequelize = new Sequelize('bx4rdvybeipvsecj02c9', 'uz0fyinu6kau3cu7', 'DoJi1GYRZZrIr5q4FONM', {
  dialect: 'mysql',
  host: HOST_NAME
});

module.exports = sequelize;