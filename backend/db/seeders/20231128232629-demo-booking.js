'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoBookings = [
  {
    "userId": 1,
    "spotId": 1,
    "startDate": "2024-11-19",
    "endDate": "2024-11-23"
  },
  {
    "userId": 3,
    "spotId": 4,
    "startDate": "2024-06-10",
    "endDate": "2024-06-13"
  },
  {
    "userId": 2,
    "spotId": 2,
    "startDate": "2024-09-23",
    "endDate": "2024-09-28"
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(demoBookings, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.or]: demoBookings }, {});
  }
};
