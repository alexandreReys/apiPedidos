'use strict';

const connection = require('../mysql/mysql-connection');

var deactivated;
if (process.env.NODE_ENV === 'development') {
	deactivated = require('../../.env.json').deactivated;
} else {
	deactivated = process.env.deactivated;
};

exports.getAutocomCnpj = (req, res) => {
	if (deactivated == "true") return res.status(400).send({ message: "Desativado" });

	getPorCnpj();

	function getPorCnpj() {
		var sql = 'select RazaoDadosCadastrais, VersaoAutocom, Produto ' +
			'from apiAutocom ' +
			'where Cnpj = ?';
		connection.query(sql, [req.params.cnpj], function (err, rows, fields) {
			if (err) {
				res.status(400).json(">>>>>>>> GETPORCNPJ", err);
			} else {
				res.status(200).json(rows);
			};
		});
	};
};

exports.postAutocom = (req, res) => {
	if (deactivated == "true") return res.status(400).send({ message: "Desativado" });
	if (!validate()) return res.status(400).send({ message: "Campos Obrigatorios não preenchidos" });

	postAutocomData();

	function validate() {
		if (!req.body.Cnpj) return false;
		if (!req.body.Produto) return false;
		return true;
	};
	function postAutocomData() {
		verificaStatusCliente(req, (operationCode) => {
			if (process.env.NODE_ENV === 'development') console.log(`POST_AUTOCOM.VERIFICA_STATUS_CLIENTE.operationCode : "${operationCode}"`);

			let interval = 0;
			if (operationCode) {
				interval = parseInt(operationCode) * 1000;
				if (process.env.NODE_ENV === 'development') console.log("POST_AUTOCOM.VERIFICA_STATUS_CLIENTE.interval : ", interval);
			};

			if (interval == 0) {
				InsertAutocom(req, res);
			} else {
				setTimeout(function () { InsertAutocom(req, res); }, interval);
			}
		});

		function verificaStatusCliente(req, callback) {
			var sql = 'select Cnpj, OperationCode, Produto from apiAutocom where (Cnpj = ?) and (Produto = ?)';

			if (process.env.NODE_ENV === 'development') console.log("VERIFICA_STATUS_CLIENTE.sql : ", sql);

			connection.query(sql, [req.body.Cnpj, req.body.Produto], function (err, rows, fields) {
				if (err) {
					console.log(">>>>>>>> VERIFICA_STATUS_CLIENTE.ERR", err);
					return callback('');
				};

				if (process.env.NODE_ENV === 'development') console.log("VERIFICA_STATUS_CLIENTE.rows : ", rows);

				let operationCode = '';
				if (!!rows.length) {
					if (process.env.NODE_ENV === 'development') console.log("VERIFICA_STATUS_CLIENTE.rows.true");
					try {
						operationCode = rows[0].OperationCode;
					} catch (error) {
						console.log('>>>>>>>> VERIFICA_STATUS_CLIENTE.ROW(0).ERROR', error.message);
					};
				};
				return callback(operationCode);
			});
		};

		function InsertAutocom(req, res) {
			function jsonVerify(p) {
				// preserve newlines, etc - use valid JSON
				var s = JSON.stringify(p);
				
				s = s.replace(/\\n/g, "\\n")
					.replace(/\\'/g, "\\'")
					.replace(/\\"/g, '\\"')
					.replace(/\\&/g, "\\&")
					.replace(/\\r/g, "\\r")
					.replace(/\\t/g, "\\t")
					.replace(/\\b/g, "\\b")
					.replace(/\\f/g, "\\f");
	
				// remove non-printable and other non-valid JSON chars
				s = s.replace(/[\u0000-\u0019]+/g, "");
				
				return JSON.parse(s);
			};
			
			var dados = jsonVerify(req.body);

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

			let params = [
				dados.Cnpj, dados.Produto, dados.Versao, data,
				sVersaoAutocom, sSatAtivacao, dados.RazaoDadosCadastrais, dados.TelefoneDC,
				dados.ContatoDC, dados.EnderecoDC, dados.NumeroDC, dados.CidadeDC,
				dados.BairroDC, dados.EstadoDC, dados.CepDC,

				dados.Versao, data, sVersaoAutocom, sSatAtivacao,
				dados.RazaoDadosCadastrais, dados.TelefoneDC, dados.ContatoDC, dados.EnderecoDC,
				dados.NumeroDC, dados.CidadeDC, dados.BairroDC, dados.EstadoDC,
				dados.CepDC
			];

			let sql =
				'INSERT INTO apiAutocom ' +
				'( ' +
				'Cnpj, Produto, Versao, Data, ' +
				'VersaoAutocom, SatAtivacao, RazaoDadosCadastrais, TelefoneDC, ' +
				'ContatoDC, EnderecoDC, NumeroDC, CidadeDC, ' +
				'BairroDC, EstadoDC, CepDC ' +
				')' +
				'VALUE ( ?, ?, ?, ?,  ?, ?, ?, ?,  ?, ?, ?, ?,  ?, ?, ?  ) ' +
				'ON DUPLICATE KEY ' +
				'UPDATE ' +
				'Versao = ?, Data = ?, VersaoAutocom = ?, SatAtivacao = ?, ' +
				'RazaoDadosCadastrais = ?, TelefoneDC = ?, ContatoDC = ?, EnderecoDC = ?, ' +
				'NumeroDC = ?, CidadeDC = ?, BairroDC = ?, EstadoDC = ?, ' +
				'CepDC = ? ';

			connection.query(sql, params,
				function (err, rows, fields) {
					if (err) {
						console.log(">>>>>>>> INSERT AUTOCOM.ERR", err);
						res.status(400).json(err);
					} else {
						res.status(201).json(rows);
					};
				}
			);
		};

	};
};
