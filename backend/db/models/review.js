'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      Review.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Review'
        }
      });

      Review.belongsTo(models.User,
        { foreignKey: 'userId' });

      Review.belongsTo(models.Spot,
        { foreignKey: 'spotId' })
    }
  }
  Review.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [10, 200], msg: "Review must be between 10 and 200 characters"},
        notNull: {msg: "Review text is required"},
        notEmpty: {msg: "Review text is required"},
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: "Stars must be an integer from 1 to 5"},
        min: { args: 1, msg: "Stars must be an integer from 1 to 5" },
        max: { args: 5, msg: "Stars must be an integer from 1 to 5" }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
