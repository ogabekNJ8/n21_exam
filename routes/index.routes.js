const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin.routes");
const ownerRoutes = require("./owner.routes");
// const clientRoutes = require("./client.routes");
const regionRoutes = require("./region.routes");
const districtRoutes = require("./district.routes");
const serviceTypeRoutes = require("./service_type.routes");
// const weddingServiceRoutes = require("./wedding_service.routes");
// const serviceMediaRoutes = require("./service_media.routes");
// const contractRoutes = require("./contract.routes");
// const paymentRoutes = require("./payment.routes");
// const reviewRoutes = require("./review.routes");
// const scheduleRoutes = require("./schedule.routes");
// const contractServiceRoutes = require("./contract_service.routes");

router.use("/admins", adminRoutes);
router.use("/owners", ownerRoutes);
// router.use("/clients", clientRoutes);
router.use("/regions", regionRoutes);
router.use("/districts", districtRoutes);
router.use("/service-types", serviceTypeRoutes);
// router.use("/wedding-services", weddingServiceRoutes);
// router.use("/service-medias", serviceMediaRoutes);
// router.use("/contracts", contractRoutes);
// router.use("/payments", paymentRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/schedules", scheduleRoutes);
// router.use("/contract-services", contractServiceRoutes);

module.exports = router;
