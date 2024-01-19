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
      validate: {
        notNull: {msg: "Street address is required"},
        notEmpty: {msg: "Street address is required"},
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "City is required"},
        notEmpty:  {msg: "City is required"},
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "State is required"},
        notEmpty: {msg: "State is required"},
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Country is required" },
        notEmpty: { msg: "Country is required" }
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Latitude is not valid" },
        max: { args: 90, msg: "Latitude is not valid" },
        min: { args: -90, msg: "Latitude is not valid" }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {msg: "Longitude is not valid"},
        max: { args: 180, msg: "Longitude is not valid" },
        min: { args: -180, msg: "Longitude is not valid" },
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [4, 50], msg: "Name must be less than 50 characters"},
        notNull: {msg: "Name must be less than 50 characters"},
        notEmpty: { msg: "Name is required" }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Description is required"},
        notEmpty: {msg: "Description needs a minimum of 30 characters"}
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {msg: "Price is required"},
        min: { args: 1, msg: "Price per day is required" },
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
