'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controller/autocom-controller');

router.post('/', controller.postAutocom)
router.get('/cnpj/:cnpj', controller.getAutocomCnpj);

module.exports = router;