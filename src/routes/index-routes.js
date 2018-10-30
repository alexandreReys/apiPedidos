'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controller/index-controller');

router.get('/', controller.getIndex);

module.exports = router;