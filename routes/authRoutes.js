const authController = require('../controller/authController');
const routes=require('express').Router();
routes.post('/register',authController.register);
routes.post('/login',authController.login);
module.exports=routes;