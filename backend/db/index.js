const Sequelize = require('sequelize');

const sequelize = new Sequelize('notes', 'root', '', {
  dialect: 'mariadb',
  host: 'localhost'
});

const Notes = require('./notes')(sequelize);

module.exports = {
  sequelize,
  notes: Notes
};
