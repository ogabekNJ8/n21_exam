const Region = require("../models/region.model");
const District = require("../models/district.model");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const { sendErrorResponse } = require("../helpers/send_error_response");
const {
  createRegionSchema,
  updateRegionSchema,
} = require("../validations/region.validation");

// CREATE
const addRegion = async (req, res) => {
  try {
    const { error, value } = createRegionSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const region = await Region.create(value);
    res.status(201).send({ message: "Region created", region });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .send({ message: "Bu nomdagi region allaqachon mavjud" });
    }

    if (error instanceof ValidationError) {
      return res.status(400).send({ message: error.message });
    }
    sendErrorResponse(res, error, 400);
  }
};

const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.findAll({
      include: [
        {
          model: District,
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "ASC"]],
    });
    res.send(regions);
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const getRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findByPk(id, {
      include: [
        {
          model: District,
          attributes: ["id", "name"],
        },
      ],
    });
    if (!region) return res.status(404).send({ message: "Region not found" });
    res.send(region);
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = updateRegionSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const region = await Region.findByPk(id);
    if (!region) return res.status(404).send({ message: "Region not found" });

    await region.update(value);
    res.send({ message: "Region updated", region });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await Region.findByPk(id);
    if (!region) return res.status(404).send({ message: "Region not found" });

    await region.destroy();
    res.send({ message: "Region deleted" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

module.exports = {
  addRegion,
  getAllRegions,
  getRegion,
  updateRegion,
  deleteRegion,
};
