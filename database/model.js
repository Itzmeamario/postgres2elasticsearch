const connection = require('.');
const Sequelize = require('sequelize');

const BahamaEntity = connection.define('bahamas_entity', {
  node_id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  countries: {
    type: Sequelize.STRING
  },
  country_codes: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  timestamps: false
});

const BahamaIntermediary = connection.define('bahamas_intermediary', {
  node_id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  countries: {
    type: Sequelize.STRING
  },
  country_codes: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  timestamps: false
});

connection.sync({force: false})
.then(() => console.log('Table created in postgres!'))
.catch((error) => console.error(`Error creating table: ${error}`));

module.exports = { BahamaEntity, BahamaIntermediary };
// module.exports = connection;