'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoSpots = [
  {
    "ownerId": 1,
    "address": "123 Disney Lane",
    "city": "San Francisco",
    "state": "California",
    "country": "United States of America",
    "lat": 37.7645358,
    "lng": -122.4730327,
    "name": "App Academy",
    "description": "Place where web developers are created",
    "price": 123
  },
  {
    "ownerId": 3,
    "address": "990 Far Away Land",
    "city": "Honolulu",
    "state": "Hawaii",
    "country": "United States of America",
    "lat": 21.315603,
    "lng": -157.858093,
    "name": "Stitch's Place",
    "description": "Place where aliens live",
    "price": 140
  },
  {
    "ownerId": 2,
    "address": "456 Rainy Day Ln.",
    "city": "Seattle",
    "state": "Washington",
    "country": "United States of America",
    "lat": 47.608013,
    "lng": -122.335167,
    "name": "Coffee Haus",
    "description": "Place where coffee is created",
    "price": 158
  },
  {
    "ownerId": 1,
    "address": "987 Keep it Weird",
    "city": "Austin",
    "state": "Texas",
    "country": "United States of America",
    "lat": 30.266666,
    "lng": -97.733330,
    "name": "BBQ Place",
    "description": "Place where BBQ is created",
    "price": 111
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(demoSpots, { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.in]: demoSpots }, {});
  }
};
