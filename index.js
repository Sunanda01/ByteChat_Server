const express = require("express");
const cors = require("cors");
const PORT = require("./config/config").PORT;
const authRoutes = require("./routes/authRoutes");
const db_connection = require("./utils/db_connection");
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.listen(PORT, async () => {
  console.log(`Connected @ PORT ${PORT}`);
  await db_connection();
});
