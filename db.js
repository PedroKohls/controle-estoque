const Sequelize = require('sequelize');
const sequelize = new Sequelize('projeto_node', 'root', '', {dialect: 'mysql', host: 'localhost', query:{raw:true}});
module.exports = sequelize;