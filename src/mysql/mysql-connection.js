'use strict'

const mysql = require('mysql');

const connection = mysql.createPool({
	connectionLimit : 1000,
	connectTimeout : 60 * 60 * 1000, 
	acquireTimeout : 60 * 60 * 1000, 
	timeout : 60 * 60 * 1000, 
	host     : process.env.db_host,  // Variavel Ambiental
	user     : process.env.db_user,  // Variavel Ambiental
	password : process.env.db_pass,  // Variavel Ambiental
	database : process.env.db_data   // Variavel Ambiental
});

module.exports = connection;