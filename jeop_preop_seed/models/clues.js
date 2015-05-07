'use strict';
module.exports = function(sequelize, DataTypes) {
  var clues = sequelize.define('clues', {
    question: DataTypes.TEXT,
    answer: DataTypes.STRING,
    value: DataTypes.INTEGER,
    daily_double: DataTypes.BOOLEAN,
    category_id: DataTypes.INTEGER
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return clues;
};