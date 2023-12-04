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

      Booking.belongsTo(models.Spot,
        { foreignKey: 'spotId' });

      Booking.belongsTo(models.User,
        { foreignKey: 'userId' });
    }
  }
  Booking.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    spot: DataTypes.STRING,
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "endDate cannot be on or before startDate"},
        isAfter(value) {
          if(value <= this.startDate) {
            throw new Error("endDate cannot be on or before startDate")
          }
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
