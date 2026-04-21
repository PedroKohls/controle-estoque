const database = require('../db');
const Sequelize = require('sequelize');
const Usuario = require('./usuario'); 

const Instrumento = database.define('instrumento', {
  id: {type: Sequelize.INTEGER, autoIncrement: true, allowNull: false,primaryKey: true},
  nome: { type: Sequelize.STRING, allowNull: false },
  descricao: { type: Sequelize.STRING, allowNull: false },
  quantidade: { type: Sequelize.INTEGER, allowNull: false },
  preco: { type: Sequelize.INTEGER, allowNull: false },
  arquivo: { type: Sequelize.STRING },
  usuarioId: {type: Sequelize.INTEGER, allowNull: false,references: {model: Usuario, key: 'id'}}
});

Usuario.hasMany(Instrumento, { foreignKey: 'usuarioId' });
Instrumento.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Instrumento;