const authController = require('../controller/authController');
const { verifyToken } = require('../middleware/authToken');
const routes=require('express').Router();
routes.post('/register',authController.register);
routes.post('/login',authController.login);
routes.post('/logout',verifyToken,authController.logout);
module.exports=routes;