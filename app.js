const config = require("config");
const express = require("express");
const sequelize = require("./config/db");

const PORT = config.get("port");
const indexRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api", indexRouter);

app.use((req, res, next) => {
  res.status(404).send({
    message: "Route not found",
  });
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
