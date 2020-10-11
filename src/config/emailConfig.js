'use strict'

let email_site_service = process.env.email_site_service;    // variavel ambiente  
let email_site_user = process.env.email_site_user;          // variavel ambiente
let email_site_pass = process.env.email_site_pass;          // variavel ambiente
let email_site_from = process.env.email_site_from;          // variavel ambiente
let email_site_to = process.env.email_site_to;              // variavel ambiente

if (process.env.NODE_ENV === 'development') {
	const process_env = require('../../.env.json');

    email_site_service = process_env.email_site_service;
    email_site_user = process_env.email_site_user;
    email_site_pass = process_env.email_site_pass;
    email_site_from = process_env.email_site_from;
    email_site_to = process_env.email_site_to;
};

const emailSiteConfig = {
    email_site_service,
    email_site_user,
    email_site_pass,
    email_site_from,
    email_site_to,
};

module.exports = emailSiteConfig;
