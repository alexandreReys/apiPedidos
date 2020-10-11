'use strict';

const connection = require('../mysql/mysql-connection');

exports.getAutocomCnpj = (req, res) => {
	// res.status(400).send({message: "Desativado"});

	getPorCnpj(req, res);
};

function getPorCnpj (req, res) {
	var sql = 'select RazaoDadosCadastrais, VersaoAutocom, Produto ' +
			  'from apiAutocom ' +
			  'where Cnpj = ?';
	connection.query(sql, [req.params.cnpj], function(err, rows, fields) {
		if (err) {
			res.status(400).json(err);
		} else {
			res.status(200).json(rows);
		};
	});
};

exports.postAutocom = (req, res) => {
	// res.status(400).send({message: "Desativado"});
	
	verificaStatusCliente(req, (operationCode) => {
		if (process.env.NODE_ENV === 'development') console.log("verificaStatusCliente.operationCode : ", operationCode);

		let interval = 0;
		if (operationCode) { 
			interval = parseInt(operationCode) * 1000; 
			if (process.env.NODE_ENV === 'development') console.log("verificaStatusCliente.Interval : ", interval);
		};
		
		if (interval == 0) {
			InsertAutocom(req, res);
		} else {
			setTimeout(function() { InsertAutocom(req, res); }, interval);
		}
	});
};

function verificaStatusCliente (req, callback) {
	var sql = 'select Cnpj, OperationCode, Produto from apiAutocom where (Cnpj = ?) and (Produto = ?)';
	connection.query(sql, [req.body.Cnpj, req.body.Produto], function(err, rows, fields) {
		if (err) {
			if (process.env.NODE_ENV === 'development') console.log("verificaStatusCliente.err");
			return callback('');
		};
		
		let operationCode = '';
		if (rows) {
			if (process.env.NODE_ENV === 'development') console.log("verificaStatusCliente.rows.true");
			try {
				operationCode = rows[0].OperationCode;
			} catch (error) {
				console.log('verificaStatusCliente.row(0).error', error.message);
			}

			return callback(operationCode);
		};
	});
};

function InsertAutocom(req, res) {
	var dados = req.body;

	let data = new Date;
	let dia = data.getDate();
	let mes = data.getMonth() + 1;
	let ano = data.getFullYear();
	data = ano + '/' + mes + '/' + dia;

	let sVersaoAutocom = dados.VersaoAutocom;
	if (sVersaoAutocom == 'undefined') {
		sVersaoAutocom = '';
	}
	let sSatAtivacao = dados.SatAtivacao;
	if (sSatAtivacao == 'undefined') {
		sSatAtivacao = '';
	}

	let sql =
		'INSERT INTO apiAutocom ' +
			'( ' +
				'Cnpj, Produto, Versao, Data, ' +
				'VersaoAutocom, SatAtivacao, RazaoDadosCadastrais, TelefoneDC, ' +
				'ContatoDC, EnderecoDC, NumeroDC, CidadeDC, ' +
				'BairroDC, EstadoDC, CepDC ' +
			')' +
		'VALUE ( ' +
			'"' + dados.Cnpj + '", ' +
			'"' + dados.Produto + '", ' +
			'"' + dados.Versao + '", ' +
			'"' + data + '", ' +

			'"' + sVersaoAutocom + '", ' +
			'"' + sSatAtivacao + '", ' +
			'"' + dados.RazaoDadosCadastrais + '", ' +
			'"' + dados.TelefoneDC + '", ' +

			'"' + dados.ContatoDC + '", ' +
			'"' + dados.EnderecoDC + '", ' +
			'"' + dados.NumeroDC + '", ' +
			'"' + dados.CidadeDC + '", ' +

			'"' + dados.BairroDC + '", ' +
			'"' + dados.EstadoDC + '", ' +
			'"' + dados.CepDC + '"  ' +
		') ' +
		'ON DUPLICATE KEY ' +
		'UPDATE ' +
			'Versao = "'               + dados.Versao + '", ' +
			'Data = "'                 + data + '", ' +
			'VersaoAutocom = "'        + sVersaoAutocom + '", ' +
			'SatAtivacao = "'          + sSatAtivacao + '", ' +

			'RazaoDadosCadastrais = "' + dados.RazaoDadosCadastrais + '", ' +
			'TelefoneDC = "' 					 + dados.TelefoneDC + '", ' +
			'ContatoDC = "'  					 + dados.ContatoDC + '", ' +
			'EnderecoDC = "' 					 + dados.EnderecoDC + '", ' +

			'NumeroDC = "' 						 + dados.NumeroDC + '", ' +
			'CidadeDC = "' 						 + dados.CidadeDC + '", ' +
			'BairroDC = "' 						 + dados.BairroDC + '", ' +
			'EstadoDC = "' 						 + dados.EstadoDC + '", ' +

			'CepDC = "'    						 + dados.CepDC + '" ';

	connection.query(sql, [],
    function(err, rows, fields) {
			if (err) {
				res.status(400).json(err)
			} else {
				res.status(201).json(rows)
			}
		}
	);
};
