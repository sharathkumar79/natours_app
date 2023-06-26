const express = require('express');

const userController = require('./../controllers/usercontroller');

const authController = require('../controllers/authController');

const Router = express.Router();

Router.post('/forgetPassword', authController.forgetPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

Router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserImage,
  userController.resizeUserPhoto,
  userController.updateMe
);

Router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

Router.delete('/deleteUser', authController.protect, userController.deleteMe);

Router.post('/signup', authController.signUp);

Router.post('/login', authController.login);

Router.get('/logout', authController.logout);

Router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

Router.route('/').get(userController.getallusers).post(userController.adduser);

Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
