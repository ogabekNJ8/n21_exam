const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Modelni yaratish
const Contract = sequelize.define(
  "contract",
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    event_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "rejected",
        "in_progress",
        "completed"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    cancelled_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_cancelled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  }
);

// Bog'lanishlar (associations)
const Client = require("./client.model");
const WeddingService = require("./wedding_service.model");
const ContractService = require("./contract_service.model");

Contract.belongsTo(Client, {
  foreignKey: "client_id",
  as: "client",
});

Client.hasMany(Contract)

Contract.belongsToMany(WeddingService, {
  through: ContractService,
  foreignKey: "contract_id",
  otherKey: "wedding_service_id",
  as: "wedding_services",
});

module.exports = Contract;
