'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    getImageable(options) {
      if(!this.imageableType) return Promise.resolve(null);
      const mixinMethodName = `get${this.imageableType}`;
      return this[mixinMethodName](options);
    }

    static associate(models) {
      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        constraints: false
      });
      Image.belongsTo(models.Spot, {
        foreignKey: 'imageableId',
        constraints: false
      });
    }
  }
  Image.init({
    imageableId: DataTypes.INTEGER,
    imageableType: DataTypes.STRING,
    url:{
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
        isLessThan10(value) {
          if(this.url.length > 10) {
            throw new Error("Maximum number of images for this resource was reached")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
