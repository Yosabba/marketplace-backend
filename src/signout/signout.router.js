const router = require('express').Router();
const controller = require('./signout.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

router.route('/').post(controller.signout).all(methodNotAllowed);