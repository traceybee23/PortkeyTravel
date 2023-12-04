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
      type: DataTypes.DATE,
      unique: { msg: "Start date conflicts with an existing booking" }
      // validate: {
      //   bookingExists(value){
      //     if(value === this.startDate) {
      //       throw new Error("Start date conflicts with an existing booking")

      //     }
      //   }
      // },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: { msg: "Start date conflicts with an existing booking" },
      validate: {
        notNull: { msg: "End date conflicts with an existing booking"},
        isAfter(value) {
          if(value <= this.startDate) {
            throw new Error("endDate cannot be on or before startDate")
          }
        },
        // endDateExists(value) {
        //   if(value === this.endDate) {
        //     throw new Error("End date conflicts with an existing booking")
        //   }
        // }
      },
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
