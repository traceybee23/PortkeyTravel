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
    "imageableId": "1",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    "preview": false
  },
  {
    "imageableId": "1",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2FuJTIwZnJhbmNpc2NvJTIwaG9tZSUyMGludGVyaW9yfGVufDB8fDB8fHww",
    "preview": false
  },
  {
    "imageableId": "1",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGtpdGNoZW58ZW58MHx8MHx8fDA%3D",
    "preview": false
  },
  {
    "imageableId": "1",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fGJhY2t5YXJkJTIwc2FuJTIwZnJhbmNpc2NvfGVufDB8fDB8fHww",
    "preview": false
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1594064424123-5ef1eb9070ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRyb3BpY2FsJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1633511090164-b43840ea1607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGF3YWlpJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
    "preview": false
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGluZG9vciUyMGtpdGNoZW4lMjB0cm9waWNhbHxlbnwwfHwwfHx8MA%3D%3D",
    "preview": false
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGluZG9vciUyMGJlZHJvb20lMjB0cm9waWNhbHxlbnwwfHwwfHx8MA%3D%3D",
    "preview": false
  },
  {
    "imageableId": "2",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1584077804610-45fa278123a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEzfHxpbmRvb3IlMjBoYXdhaWl8ZW58MHx8MHx8fDA%3D",
    "preview": false
  },
  {
    "imageableId": "3",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1608463123864-40a2961b7d00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhvdXNlJTIwaW4lMjBzZWF0dGxlfGVufDB8fDB8fHww",
    "preview": true
  },
  {
    "imageableId": "3",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1604769319166-010643ace337?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhdHRsZSUyMGluZG9vcnN8ZW58MHx8MHx8fDA%3D",
    "preview": false
  },
  {
    "imageableId": "3",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHNlYXR0bGUlMjBpbmRvb3JzJTIwYmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    "preview": false
  },
  {
    "imageableId": "3",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1535581652167-3a26c90bbf86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNlYXR0bGUlMjBpbmRvb3JzJTIwYmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    "preview": false
  },
  {
    "imageableId": "3",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9tZSUyMGtpdGNoZW58ZW58MHx8MHx8fDA%3D",
    "preview": false
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXVzdGluJTIwbGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    "preview": false
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJpb3IlMjBob21lfGVufDB8fDB8fHww",
    "preview": false
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1603572176297-b839bd088d96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGF1c3RpbiUyMGhvdXNlfGVufDB8fDB8fHww",
    "preview": false
  },
  {
    "imageableId": "4",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXVzdGlufGVufDB8fDB8fHww",
    "preview": false
  },
  {
    "imageableId": "5",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1631571592741-c28339e0e5ee?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2UlMjBpbiUyMG5ldyUyMG9ybGVhbnN8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "5",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1582081805815-01c22171fbcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5vbGF8ZW58MHx8MHx8fDA%3D",
    "preview": false
  },
  {
    "imageableId": "5",
    "imageableType": "Spot",
    "url": "https://images.unsplash.com/photo-1571893544028-06b07af6dade?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmV3JTIwb3JsZWFuc3xlbnwwfHwwfHx8MA%3D%3D",
    "preview": false
  },
  {
    "imageableId": "1",
    "imageableType": "Review",
    "url": "https://plus.unsplash.com/premium_photo-1674815329488-c4fc6bf4ced8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJpb3J8ZW58MHx8MHx8fDA%3D",
    "preview": true
  },
  {
    "imageableId": "1",
    "imageableType": "Review",
    "url": "https://plus.unsplash.com/premium_photo-1674815329488-c4fc6bf4ced8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJpb3J8ZW58MHx8MHx8fDA%3D",
    "preview": false
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
  {
    "imageableId": "5",
    "imageableType": "Review",
    "url": "https://images.unsplash.com/photo-1661796428181-ffc414240d58?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhvdXNlJTIwaW4lMjBuZXclMjBvcmxlYW5zJTIwaW5kb29yc3xlbnwwfHwwfHx8MA%3D%3D",
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
