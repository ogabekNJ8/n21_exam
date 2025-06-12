const ServiceType = require("../models/service_type.model");
const {
  createServiceTypeSchema,
  updateServiceTypeSchema,
} = require("../validations/service_type.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

const createServiceType = async (req, res) => {
  try {
    const { error } = createServiceTypeSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { name } = req.body;

    const exists = await ServiceType.findOne({ where: { name } });
    if (exists)
      return res.status(409).send({ message: "Bunday service turi mavjud" });

    const serviceType = await ServiceType.create({ name });

    res.status(201).send(serviceType);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getAllServiceTypes = async (req, res) => {
  try {
    const types = await ServiceType.findAll({ order: [["id", "ASC"]] });
    res.send(types);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getServiceType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await ServiceType.findByPk(id);
    if (!type)
      return res.status(404).send({ message: "Service turi topilmadi" });

    res.send(type);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updateServiceTypeSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const type = await ServiceType.findByPk(id);
    if (!type)
      return res.status(404).send({ message: "Service turi topilmadi" });

    const { name } = req.body;

    const duplicate = await ServiceType.findOne({ where: { name } });
    if (duplicate && duplicate.id !== +id) {
      return res
        .status(409)
        .send({ message: "Bu nomdagi service turi allaqachon mavjud" });
    }

    await type.update({ name });
    res.send({ message: "Service turi yangilandi", serviceType: type });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const deleteServiceType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await ServiceType.findByPk(id);
    if (!type)
      return res.status(404).send({ message: "Service turi topilmadi" });

    await type.destroy();
    res.send({ message: "Service turi o'chirildi" });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  createServiceType,
  getAllServiceTypes,
  getServiceType,
  updateServiceType,
  deleteServiceType,
};
