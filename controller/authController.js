const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const CustomErrorHandler = require("../services/customErrorHandler");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/authToken");
const JWTHASHVALUE = require("../config/config").JWTHASHVALUE;
const JWTEXPIRY = require("../config/config").JWTEXPIRY;
const userController = {
  async register(req, res, next) {
    const { name, email, password, picture } = req.body;
    try {
      if (!name || !email || !password)
        return res
          .status(400)
          .json({ success: false, msg: "All fields are required" });
      const existUser = await User.findOne({ email });
      if (existUser)
        return next(CustomErrorHandler.alreadyExist("User Already Exists"));
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        status: "online",
      });
      const accessToken = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          status: newUser.status,
        },
        JWTHASHVALUE,
        { expiresIn: JWTEXPIRY }
      );
      await newUser.save();
      return res.status(200).json({
        success: true,
        msg: "User Created Successfully",
        accessToken: accessToken,
        user: {
          id: newUser._id,
          name,
          email,
          password: newUser.password,
          status: newUser.status,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email || !password)
        return res
          .status(400)
          .json({ success: false, msg: "All fields are required" });
      const existUser = await User.findOne({ email });
      if (!existUser)
        return next(CustomErrorHandler.notFound("User Not Found"));
      const passwordCheck = bcrypt.compareSync(password, existUser.password);
      if (!passwordCheck)
        return next(CustomErrorHandler.wrongCredentials("Incorrect Password"));
      const accessToken = await generateToken(existUser._id);
      existUser.status = "online";
      await existUser.save();
      return res.status(200).json({
        success: true,
        msg: "Welcome Back",
        accessToken: accessToken,
        user: {
          id: existUser.id,
          name: existUser.name,
          email,
          status: existUser.status,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
  async logout(req, res, next) {
    // const id = req.user.id;
    try {
      // await User.findByIdAndUpdate(id, { status: "offline" }, { new: true });
      return res.status(200).json({
        success: true,
        msg: "Loggout Successfull",
      });
    } catch (err) {
      return next(err);
    }
  },
};
module.exports = userController;
