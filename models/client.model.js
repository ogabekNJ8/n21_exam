const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Client = sequelize.define(
  "client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activation_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// Client.hasMany(Contract, {
//   foreignKey: "client_id",
//   as: "contracts", // Shu aliasni controllerda ishlatyapsiz
// });

module.exports = Client;
