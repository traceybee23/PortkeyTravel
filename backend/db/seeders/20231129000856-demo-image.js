'use strict';

const { Image } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoImages = [
  {
    "imageableId": "1",
    "imageableType": "Review",
    "url": "fkjd",
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "fkjd",
  },
  {
    "imageableId": "3",
    "imageableType": "Review",
    "url": "fkjd",
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "fkjd",
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
