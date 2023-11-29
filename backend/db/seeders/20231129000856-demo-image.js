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
    "url": "https://images.unsplash.com/photo-1426122402199-be02db90eb90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FuJTIwZnJhbmNpc2NvJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1633511090164-b43840ea1607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGF3YWlpJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
  },
  {
    "imageableId": "3",
    "imageableType": "Review",
    "url": "https://images.unsplash.com/photo-1608463123864-40a2961b7d00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhvdXNlJTIwaW4lMjBzZWF0dGxlfGVufDB8fDB8fHww",
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2UlMjBpbiUyMGF1c3RpbiUyMFRYfGVufDB8fDB8fHww",
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate(demoImages, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.or]: demoImages }, {});
  }
};
