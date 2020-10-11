'use strict'

const mysql = require('mysql');

var mysql_host = process.env.db_host;  // variavel ambiente
var mysql_user = process.env.db_user;  // variavel ambiente
var mysql_pass = process.env.db_pass;  // variavel ambiente
var mysql_data = process.env.db_data;  // variavel ambiente

if (process.env.NODE_ENV === 'development') {
	const process_env = require('../../.env.json');

	mysql_host = process_env.db_host;
	mysql_user = process_env.db_user;
	mysql_pass = process_env.db_pass;
	mysql_data = process_env.db_data;
};

const connection = mysql.createPool({
	connectionLimit : 1000,
	connectTimeout : 60 * 60 * 1000, 
	acquireTimeout : 60 * 60 * 1000, 
	timeout : 60 * 60 * 1000, 
	host     : mysql_host,  // Variavel Ambiental
	user     : mysql_user,  // Variavel Ambiental
	password : mysql_pass,  // Variavel Ambiental
	database : mysql_data   // Variavel Ambiental
});

module.exports = connection;
