'use strict';

const connection = require('../mysql/mysql-connection');
const repository = require('../repositories/autocom-repository');

exports.getAutocomCnpj = (req, res, next) => {
  repository.getAutocomCnpj(req, res);
};

exports.postAutocom = (req, res, next) => {
  repository.postAutocom(req, res);
};