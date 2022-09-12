const { DataTypes } = require('sequelize');
const { INTEGER } = DataTypes;

const up = async (query) => {
  await query.addColumn('weather', 'rain', {
    type: INTEGER,
  });
};

const down = async (query) => {
  await query.removeColumn('weather', 'rain');
};

module.exports = {
  up,
  down,
};
