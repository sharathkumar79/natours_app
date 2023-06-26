const express = require('express');
const viewController = require('../controllers/viewController');
const Router = express.Router();

Router.get('/overview', viewController.userlogged, viewController.getOverview);
Router.get('/tour/:id', viewController.userlogged, viewController.getTour);

Router.get('/login', viewController.userlogged, viewController.loginPage);
Router.get('/me', viewController.userlogged, viewController.account);

module.exports = Router;
