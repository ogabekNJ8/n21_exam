const Client = require("../models/client.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/mail.service");
const { sendErrorResponse } = require("../helpers/send_error_response");
const {
  createClientSchema,
  loginClientSchema,
  updateClientSchema,
  changePasswordSchema,
} = require("../validations/client.validation");

const register = async (req, res) => {
  try {
    const { error } = createClientSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { full_name, email, phone, password } = req.body;

    const existing = await Client.findOne({ where: { email } });
    if (existing) return res.status(400).send({ message: "Bu email band" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const activation_link = uuid.v4();

    await Client.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
      activation_link,
    });

    const activationUrl = `${config.get(
      "api_url"
    )}/api/clients/activate/${activation_link}`;
    await mailService.sendActivationMail(email, activationUrl);

    res.status(201).send({
      message: "Client yaratildi. Emailga aktivatsiya xati yuborildi.",
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const client = await Client.findOne({ where: { activation_link: token } });

    if (!client) {
      return sendErrorResponse(res, "Token noto'g'ri!", 400);
    }

    client.is_active = true;
    await client.save();

    res.status(200).json({ message: "Akkaunt faollashtirildi!" });
  } catch (error) {
    sendErrorResponse(res, error, 500);
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginClientSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { email, password } = req.body;

    const client = await Client.findOne({ where: { email } });
    if (!client) return res.status(404).send({ message: "Client topilmadi" });

    if (!client.is_active)
      return res.status(403).send({ message: "Email faollashtirilmagan" });

    const valid = await bcrypt.compare(password, client.password);
    if (!valid) return res.status(401).send({ message: "Noto'g'ri parol" });

    const accessToken = jwt.sign(
      { id: client.id, role: "client", email: client.email },
      config.get("clientAccess_key"),
      { expiresIn: config.get("clientAccess_time") }
    );

    const refreshToken = jwt.sign(
      { id: client.id, role: "client" },
      config.get("clientRefresh_key"),
      { expiresIn: config.get("clientRefresh_time") }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: config.get("clientCookie_refresh_time"),
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

    res.status(200).json({ message: "Client tizimdan chiqdi (logout)" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token)
      return res.status(401).send({ message: "Token topilmadi" });

    const payload = jwt.verify(refresh_token, config.get("clientRefresh_key"));
    const accessToken = jwt.sign(
      { id: payload.id, role: "client" },
      config.get("clientAccess_key"),
      { expiresIn: config.get("clientAccess_time") }
    );

    res.send({ accessToken });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      attributes: { exclude: ["password"] },
    });
    res.send(clients);
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!client) return res.status(404).send({ message: "Client topilmadi" });
    res.send(client);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateClient = async (req, res) => {
  try {
    const { error } = updateClientSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { id } = req.params;
    const { full_name, email, phone, password, is_active } = req.body;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).send({ message: "Client topilmadi" });

    if (full_name !== undefined) client.full_name = full_name;
    if (email !== undefined) client.email = email;
    if (phone !== undefined) client.phone = phone;
    if (typeof is_active === "boolean") client.is_active = is_active;
    if (password !== undefined) {
      const hashed = await bcrypt.hash(password, 10);
      client.password = hashed;
    }

    await client.save();

    const updatedClient = {
      id: client.id,
      full_name: client.full_name,
      email: client.email,
      phone: client.phone,
      is_active: client.is_active,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };

    res.send({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Client.destroy({ where: { id } });
    if (!deleted) return res.status(404).send({ message: "Client topilmadi" });
    res.send({ message: "Client o'chirildi" });
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

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).send({ message: "Client topilmadi" });

    const isMatch = await bcrypt.compare(old_password, client.password);
    if (!isMatch)
      return res.status(401).send({ message: "Eski parol noto'g'ri" });

    const hashed = await bcrypt.hash(new_password, 10);
    client.password = hashed;
    await client.save();

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
  getAllClients,
  getClient,
  updateClient,
  deleteClient,
  changePassword,
};
