'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    spot: DataTypes.STRING,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isBefore: this.endDate
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: this.startDate
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
