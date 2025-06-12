const Admin = require("../models/admin.model");
const { sendErrorResponse } = require("../helpers/send_error_response");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const {
  createAdminSchema,
  updateAdminSchema,
  loginAdminSchema,
  changePasswordSchema,
} = require("../validations/admin.validation");

const createAdmin = async (req, res) => {
  try {
    const { error } = createAdminSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { full_name, email, phone, password } = req.body;

    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(409).send({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).send({ message: "Admin created", newAdmin });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
    });
    res.send(admins);
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!admin) return res.status(404).send({ message: "Admin not found" });
    res.send(admin);
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { error } = updateAdminSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { id } = req.params;
    const { full_name, email, phone, password, is_active } = req.body;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).send({ message: "Admin not found" });

    if (full_name) admin.full_name = full_name;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;
    if (typeof is_active === "boolean") admin.is_active = is_active;
    if (password) admin.password = await bcrypt.hash(password, 10);

    await admin.save();
    res.send({ message: "Admin updated", admin });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).send({ message: "Admin not found" });

    await admin.destroy();
    res.send({ message: "Admin deleted" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const changePassword = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).send({ message: "Admin not found" });

    const valid = await bcrypt.compare(old_password, admin.password);
    if (!valid)
      return res.status(401).send({ message: "Old password incorrect" });

    admin.password = await bcrypt.hash(new_password, 10);
    await admin.save();

    res.send({ message: "Password changed successfully" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};
const login = async (req, res) => {
  try {
    const { error } = loginAdminSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).send({ message: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).send({ message: "Invalid password" });

    const accessToken = jwt.sign(
      { id: admin.id, role: "admin" },
      config.get("adminAccess_key"),
      { expiresIn: config.get("adminAccess_time") }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, role: "admin" },
      config.get("adminRefresh_key"),
      { expiresIn: config.get("adminRefresh_time") }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: config.get("adminCookie_refresh_time"),
    });

    res.send({ message: "Login successful", accessToken });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(400).send({ message: "Token yo'q" });
    }
    res.clearCookie("refresh_token");

    // res.clearCookie("refresh_token");
    res.send({ message: "Admin logout qilindi" });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).send({ message: "No refresh token" });

    const decoded = jwt.verify(token, config.get("adminRefresh_key"));
    const accessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      config.get("adminAccess_key"),
      { expiresIn: config.get("adminAccess_time") }
    );

    res.send({ accessToken });
  } catch (error) {
    sendErrorResponse(res, error, 400);
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
  login,
  logout,
  refreshToken,
};
