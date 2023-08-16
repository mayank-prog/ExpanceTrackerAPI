const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const S3report = sequelize.define('S3report', {
  
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  
  fileURL: Sequelize.STRING,
  
});

module.exports = S3report;