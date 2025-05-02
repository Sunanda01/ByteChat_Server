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
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(CustomErrorHandler.tokenError("Token Not Available"));
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return next(CustomErrorHandler.tokenError("Token Not Found"));
  try {
    jwt.verify(token, JWTHASHVALUE, (err, user) => {
      if (err) return next(CustomErrorHandler.tokenError("Invalid Token"));
      console.log(req.user)
      req.user = user;
      console.log(req.user)
      return next();
    });
  } catch (err) {
    return next(
      CustomErrorHandler.tokenError("Something went wrong in VerifyToken")
    );
  }
};
module.exports = { generateToken, verifyToken };
