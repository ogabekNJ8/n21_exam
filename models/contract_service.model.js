const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Contract = require("./contract.model");
const WeddingService = require("./wedding_service.model");

const ContractService = sequelize.define(
  "contract_service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contract_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Contract,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    wedding_service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: WeddingService,
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

// 🔗 Associations
// Contract.hasMany(ContractService, {
//   foreignKey: "contract_id",
//   onDelete: "CASCADE",
// });

// ContractService.belongsTo(Contract, {
//   foreignKey: "contract_id",
// });

// WeddingService.hasMany(ContractService, {
//   foreignKey: "wedding_service_id",
//   onDelete: "CASCADE",
// });
// ContractService.belongsTo(WeddingService, {
//   foreignKey: "wedding_service_id",
// });

module.exports = ContractService;
