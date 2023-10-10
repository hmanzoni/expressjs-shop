const Sequelize = require('sequelize');

const dbCredentials = {
  host: '127.0.0.1',
  user: 'wp-funghi',
  password: 'masalongo1!',
  database: 'node-complete',
};

const sequelize = new Sequelize(
  dbCredentials.database,
  dbCredentials.user,
  dbCredentials.password,
  {
    dialect: 'mysql',
    host: dbCredentials.host,
  }
);

module.exports = sequelize;
