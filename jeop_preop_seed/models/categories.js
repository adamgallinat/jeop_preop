'use strict';
module.exports = function(sequelize, DataTypes) {
  var categories = sequelize.define('categories', {
    title: DataTypes.STRING,
    season: DataTypes.INTEGER,
    air_date: DataTypes.STRING,
    round: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return categories;
};