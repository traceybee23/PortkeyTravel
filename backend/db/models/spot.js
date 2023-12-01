'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,
        { foreignKey: 'ownerId' }
      );

      Spot.hasMany(
        models.Booking, {
        foreignKey: 'spotId',
        otherKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      }
      );

      Spot.belongsToMany(
        models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId',
        onDelete: 'CASCADE'
      });

      Spot.belongsToMany(
        models.User,
        {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId',
          onDelete: 'CASCADE'
        });

      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        }
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        otherKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 50],
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
