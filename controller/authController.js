const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const CustomErrorHandler = require("../services/customErrorHandler");
const userController = {
  async register(req, res, next) {
    const { name, email, password, picture } = req.body;
    try {
      if (!name || !email || !password || !picture)
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
        picture,
      });
      await newUser.save();
      return res.status(200).json({
        success: true,
        msg: "User Created Successfully",
        user: {
          id: newUser._id,
          name,
          email,
          picture,
          newMessages: newUser.newMessages,
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
      existUser.status = "online";
      await existUser.save();
      return res.status(200).json({
        success: true,
        msg: "Welcome Back",
        user: {
          id: existUser._id,
          name: existUser.name,
          email,
          picture: existUser.picture,
          newMessages: existUser.newMessages,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
};
module.exports = userController;
