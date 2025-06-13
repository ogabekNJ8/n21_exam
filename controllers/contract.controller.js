const Contract = require("../models/contract.model");
const Client = require("../models/client.model");
const WeddingService = require("../models/wedding_service.model");
const ContractService = require("../models/contract_service.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const {
  createContractSchema,
  updateContractSchema,
} = require("../validations/contract.validation");

const createContract = async (req, res) => {
  try {
    const { error, value } = createContractSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { client_id, wedding_service_ids, ...contractData } = value;

    const client = await Client.findByPk(client_id);
    if (!client) return res.status(404).json({ message: "Client topilmadi" });

    const contract = await Contract.create({ client_id, ...contractData });

    // create contract_services
    const contractServicesData = wedding_service_ids.map((wsId) => ({
      contract_id: contract.id,
      wedding_service_id: wsId,
    }));

    await ContractService.bulkCreate(contractServicesData);

    res.status(201).send({ message: "Contract yaratildi", contract });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

// 🔁 GET ALL (ADMIN)
const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["full_name", "email"],
        },
        {
          model: WeddingService,
          as: "wedding_services",
        },
      ],
      order: [["id", "ASC"]],
    });

    res.send({ message: "Contractlar ro'yxati", contracts });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// 🔎 GET ONE
const getContract = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findOne({
      where: { id },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["full_name", "email"],
        },
        {
          model: WeddingService,
          as: "wedding_services",
        },
      ],
    });

    if (!contract)
      return res.status(404).json({ message: "Contract topilmadi" });

    res.send({ message: "Contract ma'lumotlari", contract });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// ✏️ UPDATE
const updateContract = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = updateContractSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const contract = await Contract.findByPk(id);
    if (!contract)
      return res.status(404).json({ message: "Contract topilmadi" });

    const { wedding_service_ids, ...contractData } = value;

    await contract.update(contractData);

    // Update many-to-many
    if (wedding_service_ids) {
      await ContractService.destroy({ where: { contract_id: id } });

      const newLinks = wedding_service_ids.map((wsId) => ({
        contract_id: id,
        wedding_service_id: wsId,
      }));

      await ContractService.bulkCreate(newLinks);
    }

    res.send({ message: "Contract yangilandi", contract });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

// ❌ DELETE
const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findByPk(id);
    if (!contract)
      return res.status(404).json({ message: "Contract topilmadi" });

    await ContractService.destroy({ where: { contract_id: id } });
    await contract.destroy();

    res.send({ message: "Contract o'chirildi" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

// 🔁 UPDATE STATUS
const updateContractStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contract = await Contract.findByPk(id);
    if (!contract)
      return res.status(404).json({ message: "Contract topilmadi" });

    contract.status = status;
    await contract.save();

    res.send({ message: "Contract status yangilandi", contract });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

// 🔍 FILTERING FUNCTIONS

// Date range
const getContractsByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    const contracts = await Contract.findAll({
      where: {
        event_date: {
          [require("sequelize").Op.between]: [from, to],
        },
      },
    });

    res.send({ message: "Sana bo‘yicha contractlar", contracts });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// Clients who used services
const getClientsByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    const clients = await Client.findAll({
      include: [
        {
          model: Contract,
          as: "contracts",
          where: {
            event_date: {
              [require("sequelize").Op.between]: [from, to],
            },
          },
        },
      ],
    });

    res.send({
      message: "Ko‘rsatilgan sanalarda xizmatdan foydalangan clientlar",
      clients,
    });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// Cancelled clients
const getCancelledClientsByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    const clients = await Client.findAll({
      include: [
        {
          model: Contract,
          as: "contracts",
          where: {
            is_cancelled: true,
            event_date: {
              [require("sequelize").Op.between]: [from, to],
            },
          },
        },
      ],
    });

    res.send({
      message: "Bekor qilingan xizmatlar bo‘yicha clientlar",
      clients,
    });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// Top owners by service name
const getTopOwnersByServiceName = async (req, res) => {
  try {
    const { service_name } = req.query;

    const results = await WeddingService.findAll({
      where: { name: service_name },
      include: [
        {
          model: Contract,
          as: "contracts",
          through: { attributes: [] },
        },
      ],
      group: ["WeddingService.id"],
      order: [[require("sequelize").fn("COUNT", "contracts.id"), "DESC"]],
      limit: 5,
    });

    res.send({ message: "Eng mashhur xizmat egalari", results });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// Client payments by contract
const getClientPayments = async (req, res) => {
  try {
    const { client_id } = req.query;

    const contracts = await Contract.findAll({
      where: { client_id },
      include: ["payments"],
    });

    res.send({ message: "Client to‘lovlari", contracts });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

module.exports = {
  createContract,
  getAllContracts,
  getContract,
  updateContract,
  deleteContract,
  updateContractStatus,
  getContractsByDateRange,
  getClientsByDateRange,
  getCancelledClientsByDateRange,
  getTopOwnersByServiceName,
  getClientPayments,
};
