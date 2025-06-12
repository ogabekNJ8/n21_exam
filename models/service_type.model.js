const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceType = sequelize.define(
  "service_type",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = ServiceType;
