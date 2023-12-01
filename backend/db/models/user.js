'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {


    static associate(models) {
      // define association here
      User.hasMany(
        models.Spot,
        { foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true }
      );
      User.belongsToMany(
        models.Spot,
        {
          through: models.Booking,
          foreignKey: 'userId',
          otherKey: 'spotId',
          onDelete: 'CASCADE'
        }
      );
      User.belongsToMany(
        models.Spot,
        {
          through: models.Review,
          foreignKey: 'userId',
          otherKey: 'spotId',
          onDelete: 'CASCADE'
        }
      )
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "User with that username already exists"},
        validate: {
          len: [1, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: { msg: "User with that email already exists"},
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true,
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
