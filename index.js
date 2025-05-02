const express = require("express");
const cors = require("cors");
const PORT = require("./config/config").PORT;
const authRoutes = require("./routes/authRoutes");
const db_connection = require("./utils/db_connection");
const HealthCheckController = require("./controller/health_check");
const errorHandler = require("./middleware/errorHandler");
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.get("/health-check", HealthCheckController.HealthCheck);
app.use(errorHandler);
app.listen(PORT, async () => {
  console.log(`Connected @ PORT ${PORT}`);
  await db_connection();
});
