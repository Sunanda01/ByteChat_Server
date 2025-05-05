const mongoose = require("mongoose");
const DB_URL = require("../config/config").DB_URL;
const connection = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database Connected successfully");
  } catch (err) {
    console.log(err);
  }
};
module.exports = connection;
