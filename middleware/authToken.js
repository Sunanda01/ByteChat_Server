const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const CustomErrorHandler = require("../services/customErrorHandler");
const JWTHASHVALUE = require("../config/config").JWTHASHVALUE;
const JWTEXPIRY = require("../config/config").JWTEXPIRY;
const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User Not Found");
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      status: user.status,
    },
    JWTHASHVALUE,
    { expiresIn: JWTEXPIRY }
  );

  return token;
};
module.exports = { generateToken };
