const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Tashqi modellarga bog'lanish uchun
const Owner = require("./owner.model");
const ServiceType = require("./service_type.model");
const Region = require("./region.model");
const District = require("./district.model");

const WeddingService = sequelize.define(
  "wedding_service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    available_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    available_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Owner,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    service_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceType,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: District,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// Bog‘lanishlar
WeddingService.belongsTo(Owner, { foreignKey: "owner_id" });
WeddingService.belongsTo(ServiceType, { foreignKey: "service_type_id" });
WeddingService.belongsTo(District, { foreignKey: "district_id" });

module.exports = WeddingService;
