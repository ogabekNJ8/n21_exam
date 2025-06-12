const Region = require("../models/region.model");
const District = require("../models/district.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const { Op } = require("sequelize");

const addDistrict = async (req, res) => {
  try {
    const { name, region_id } = req.body;

    const region = await Region.findByPk(region_id);
    if (!region) {
      return res.status(404).send({ message: "Region topilmadi" });
    }
    const existing = await District.findOne({
      where: { name, region_id },
    });

    if (existing) {
      return res.status(400).send({
        message: `Bu region ichida "${name}" nomli district allaqachon mavjud`,
      });
    }
    const district = await District.create({ name, region_id });
    res.status(201).send({ message: "District yaratildi", district });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.findAll({
      include: {
        model: Region,
        attributes: ["name"],
      },
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });
    res.send({ message: "Districtlar ro'yxati", districts });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const getDistrict = async (req, res) => {
  try {
    const { id } = req.params;

    const district = await District.findOne({
      where: { id },
      include: {
        model: Region,
        attributes: ["name"],
      },
    });

    if (!district) {
      return res.status(404).send({ message: "District topilmadi" });
    }

    res.send({ message: "District ma'lumotlari", district });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const updateDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region_id } = req.body;

    const district = await District.findByPk(id);
    if (!district) {
      return res.status(404).send({ message: "District topilmadi" });
    }

    if (region_id) {
      const region = await Region.findByPk(region_id);
      if (!region) {
        return res.status(404).send({ message: "Region topilmadi" });
      }
    }
    const duplicate = await District.findOne({
      where: {
        name: name || district.name,
        region_id: region_id || district.region_id,
        id: { [Op.ne]: id }, // o'zidan boshqa bo'lishi kerak
      },
    });

    if (duplicate) {
      return res.status(400).send({
        message: `"${name}" nomli district shu region ichida allaqachon mavjud`,
      });
    }

    await district.update({ name, region_id });
    res.send({ message: "District yangilandi", district });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const deleteDistrict = async (req, res) => {
  try {
    const { id } = req.params;

    const district = await District.findByPk(id);
    if (!district) {
      return res.status(404).send({ message: "District topilmadi" });
    }

    await district.destroy();
    res.send({ message: "District o'chirildi" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

module.exports = {
  addDistrict,
  getAllDistricts,
  getDistrict,
  updateDistrict,
  deleteDistrict,
};
