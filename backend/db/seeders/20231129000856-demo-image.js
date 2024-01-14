'use strict';

const { Image } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoImages = [
  {
    "imageableId": "1",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1426122402199-be02db90eb90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FuJTIwZnJhbmNpc2NvJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1594064424123-5ef1eb9070ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRyb3BpY2FsJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "3",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1608463123864-40a2961b7d00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhvdXNlJTIwaW4lMjBzZWF0dGxlfGVufDB8fDB8fHww",
    "preview": true
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "5",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1631571592741-c28339e0e5ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmV3JTIwb3JsZWFucyUyMGhvdXNlfGVufDB8fDB8fHww",
    "preview": true
  },
  {
    "imageableId": "1",
    "imageableType": "Review",
    "url": "https://plus.unsplash.com/premium_photo-1674815329488-c4fc6bf4ced8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJpb3J8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "2",
    "imageableType": "Review",
    "url": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGludGVyaW9yfGVufDB8fDB8fHww",
    "preview": true
  },
  {
    "imageableId": "3",
    "imageableType": "Review",
    "url": "https://images.unsplash.com/photo-1618219944342-824e40a13285?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGludGVyaW9yfGVufDB8fDB8fHww",
    "preview": true
  },
  {
    "imageableId": "4",
    "imageableType": "Review",
    "url": "https://plus.unsplash.com/premium_photo-1680100256127-e73d3f1f3376?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGludGVyaW9yfGVufDB8fDB8fHww",
    "preview": true
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Image.bulkCreate(demoImages, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.or]: demoImages }, {});
  }
};
