const Owner = require("../models/owner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/mail.service");
const { sendErrorResponse } = require("../helpers/send_error_response");
const {
  createOwnerSchema,
  loginOwnerSchema,
  updateOwnerSchema,
  changePasswordSchema,
} = require("../validations/owner.validation");

const register = async (req, res) => {
  try {
    const { error } = createOwnerSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { full_name, email, phone, password } = req.body;

    const existing = await Owner.findOne({ where: { email } });
    if (existing) return res.status(400).send({ message: "Bu email band" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const activation_link = uuid.v4();

    await Owner.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
      activation_link,
    });

    const activationUrl = `${config.get(
      "api_url"
    )}/api/owners/activate/${activation_link}`;
    await mailService.sendActivationMail(email, activationUrl);

    res.status(201).send({
      message: "Owner yaratildi. Emailga aktivatsiya xati yuborildi.",
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const owner = await Owner.findOne({ where: { activation_link: token } });

    if (!owner) {
      return sendErrorResponse(res, "Token noto'g'ri!", 400);
    }

    owner.is_active = true;
    await owner.save();

    res.status(200).json({ message: "Akkaunt faollashtirildi!" });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginOwnerSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { email, password } = req.body;

    const owner = await Owner.findOne({ where: { email } });
    if (!owner) return res.status(404).send({ message: "Owner topilmadi" });

    if (!owner.is_active)
      return res.status(403).send({ message: "Email faollashtirilmagan" });

    const valid = await bcrypt.compare(password, owner.password);
    if (!valid) return res.status(401).send({ message: "Noto'g'ri parol" });

    const accessToken = jwt.sign(
      { id: owner.id, role: "owner", email: owner.email },
      config.get("ownerAccess_key"),
      { expiresIn: config.get("ownerAccess_time") }
    );

    const refreshToken = jwt.sign(
      { id: owner.id, role: "owner" },
      config.get("ownerRefresh_key"),
      { expiresIn: config.get("ownerRefresh_time") }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: config.get("ownerCookie_refresh_time"),
    });

    res.send({ message: "Kirish muvaffaqiyatli", accessToken });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token topilmadi" });
    }
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Owner tizimdan chiqdi (logout)" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token)
      return res.status(401).send({ message: "Token topilmadi" });

    const payload = jwt.verify(refresh_token, config.get("ownerRefresh_key"));
    const accessToken = jwt.sign(
      { id: payload.id, role: "owner" },
      config.get("ownerAccess_key"),
      { expiresIn: config.get("ownerAccess_time") }
    );

    res.send({ accessToken });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll({
      attributes: { exclude: ["password"] },
    });
    res.send(owners);
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const getOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!owner) return res.status(404).send({ message: "Owner topilmadi" });
    res.send(owner);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateOwner = async (req, res) => {
  try {
    const { error } = updateOwnerSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { id } = req.params;
    const { full_name, email, phone, password, is_active } = req.body;

    const owner = await Owner.findByPk(id);
    if (!owner) return res.status(404).send({ message: "Owner topilmadi" });

    if (full_name !== undefined) owner.full_name = full_name;
    if (email !== undefined) owner.email = email;
    if (phone !== undefined) owner.phone = phone;
    if (typeof is_active === "boolean") owner.is_active = is_active;
    if (password !== undefined) {
      const hashed = await bcrypt.hash(password, 10);
      owner.password = hashed;
    }

    await owner.save();

    // Faqat kerakli ma’lumotlarni yuboramiz
    const updatedOwner = {
      id: owner.id,
      full_name: owner.full_name,
      email: owner.email,
      phone: owner.phone,
      is_active: owner.is_active,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
    };

    res.send({
      message: "Owner updated successfully",
      owner: updatedOwner,
    });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};
const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Owner.destroy({ where: { id } });
    if (!deleted) return res.status(404).send({ message: "Owner topilmadi" });
    res.send({ message: "Owner o'chirildi" });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const owner = await Owner.findByPk(id);
    if (!owner) return res.status(404).send({ message: "Owner topilmadi" });

    const isMatch = await bcrypt.compare(old_password, owner.password);
    if (!isMatch)
      return res.status(401).send({ message: "Eski parol noto'g'ri" });

    const hashed = await bcrypt.hash(new_password, 10);
    owner.password = hashed;
    await owner.save();

    res.send({ message: "Parol muvaffaqiyatli yangilandi" });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

module.exports = {
  register,
  activateAccount,
  login,
  logout,
  refreshToken,
  getAllOwners,
  getOwner,
  updateOwner,
  deleteOwner,
  changePassword,
};
