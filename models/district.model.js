const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Region = require("./region.model");

const District = sequelize.define(
  "district",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Region.hasMany(District, { foreignKey: "region_id" });
District.belongsTo(Region, { foreignKey: "region_id" });

module.exports = District;
