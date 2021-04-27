'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.User, {
        through: models.Cart
      })
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name is required"
        }
      }
    },
    image_url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Url is required"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Price is required"
        },
        isInt: {
          args: true,
          msg: "Price must be an integer"
        },
        negativeInput(value){
          if(value < 0){
            throw new Error("Negative value is not allowed");
          }
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: false,
          msg: "Stock is required"
        },
        isInt: {
          args: true,
          msg: "Stock must be an integer"
        },
        negativeInput(value){
          if(value < 0){
            throw new Error("Negative value is not allowed");
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: false,
          msg: "Stock is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};