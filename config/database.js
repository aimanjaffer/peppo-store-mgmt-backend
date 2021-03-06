const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE,  process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  });
async function connect(){
    try {
        await sequelize.authenticate();
        console.log('DB Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
connect();
module.exports = sequelize;
