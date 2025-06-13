const WeddingService = require("../models/wedding_service.model");
const Owner = require("../models/owner.model");
const ServiceType = require("../models/service_type.model");
const District = require("../models/district.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const {
  createWeddingServiceSchema,
  updateWeddingServiceSchema,
} = require("../validations/wedding_service.validation");

const createWeddingService = async (req, res) => {
  try {
    const { error, value } = createWeddingServiceSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { owner_id, service_type_id, district_id } = value;

    const owner = await Owner.findByPk(owner_id);
    if (!owner) return res.status(404).json({ message: "Owner topilmadi" });

    const serviceType = await ServiceType.findByPk(service_type_id);
    if (!serviceType)
      return res.status(404).json({ message: "Service type topilmadi" });

    const district = await District.findByPk(district_id);
    if (!district)
      return res.status(404).json({ message: "District topilmadi" });

    const weddingService = await WeddingService.create(value);
    res
      .status(201)
      .send({ message: "Wedding service yaratildi", weddingService });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

// 🔁 GET ALL
const getAllWeddingServices = async (req, res) => {
  try {
    const weddingServices = await WeddingService.findAll({
      include: [
        { model: Owner, attributes: ["full_name", "email"] },
        { model: ServiceType, attributes: ["name"] },
        { model: District, attributes: ["name"] },
      ],
      order: [["id", "ASC"]],
    });

    res.send({ message: "Wedding service ro'yxati", weddingServices });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// 🔎 GET ONE
const getWeddingService = async (req, res) => {
  try {
    const { id } = req.params;

    const weddingService = await WeddingService.findOne({
      where: { id },
      include: [
        { model: Owner, attributes: ["full_name", "email"] },
        { model: ServiceType, attributes: ["name"] },
        { model: District, attributes: ["name"] },
      ],
    });

    if (!weddingService) {
      return res.status(404).send({ message: "Wedding service topilmadi" });
    }

    res.send({ message: "Wedding service ma'lumotlari", weddingService });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

// ✏️ UPDATE
const updateWeddingService = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateWeddingServiceSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const weddingService = await WeddingService.findByPk(id);
    if (!weddingService)
      return res.status(404).send({ message: "Wedding service topilmadi" });

    const { owner_id, service_type_id, district_id } = value;

    if (owner_id) {
      const owner = await Owner.findByPk(owner_id);
      if (!owner) return res.status(404).json({ message: "Owner topilmadi" });
    }

    if (service_type_id) {
      const serviceType = await ServiceType.findByPk(service_type_id);
      if (!serviceType)
        return res.status(404).json({ message: "Service type topilmadi" });
    }

    if (district_id) {
      const district = await District.findByPk(district_id);
      if (!district)
        return res.status(404).json({ message: "District topilmadi" });
    }

    await weddingService.update(value);
    res.send({ message: "Wedding service yangilandi", weddingService });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const deleteWeddingService = async (req, res) => {
  try {
    const { id } = req.params;

    const weddingService = await WeddingService.findByPk(id);
    if (!weddingService)
      return res.status(404).send({ message: "Wedding service topilmadi" });

    await weddingService.destroy();
    res.send({ message: "Wedding service o'chirildi" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

module.exports = {
  createWeddingService,
  getAllWeddingServices,
  getWeddingService,
  updateWeddingService,
  deleteWeddingService,
};
