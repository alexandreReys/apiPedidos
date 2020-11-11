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

	try {
		getPorCnpj();
	} catch (error) {
		console.error("[ERROR - postAutocomAPI] ==> getPorCnpj", error);
	};

	function getPorCnpj() {
		var sql = 'select RazaoDadosCadastrais, VersaoAutocom, Produto ' +
			'from apiAutocom ' +
			'where Cnpj = ?';
		connection.query(sql, [req.params.cnpj], function (err, rows, fields) {
			if (err) {
				res.status(400).send({ getByCnpj: "error" });
			} else {
				res.status(200).send(jsonVerify(rows));
			};
		});
	};
};

exports.postAutocom = (req, res) => {
	if (deactivated == "true") return res.status(400).send({ message: "Desativado" });
	if (!validate()) return res.status(400).send({ message: "Campos Obrigatorios não preenchidos" });

	try {
		postAutocomAPI();
	} catch (error) {
		console.error("[ERROR - postAutocomAPI] ==> ", error);
	};

	function validate() {
		if (!req.body.Cnpj) return false;
		if (!req.body.Produto) return false;
		return true;
	};
	function postAutocomAPI() {
		verificaStatusCliente(req, (operationCode) => {

			let interval = 0;
			if (operationCode) {
				interval = parseInt(operationCode) * 1000;
			};

			if (interval == 0) {
				try {
					InsertAutocom(req, res);
				} catch (error) {
					console.error("[ERROR - InsertAutocom] ==> ", error);
				}

			} else {
				setTimeout(function () {
					try {
						InsertAutocom(req, res);
					} catch (error) {
						console.error("[InsertAutocom] ==> ", error);
					}
				}, interval);
			}
		});

		function verificaStatusCliente(req, callback) {
			var sql = 'select Cnpj, OperationCode, Produto from apiAutocom where (Cnpj = ?) and (Produto = ?)';

			connection.query(sql, [req.body.Cnpj, req.body.Produto], function (err, rows, fields) {
				if (err) {
					console.log("[ERROR QUERY - verificaStatusCliente] ==> ", err);
					return callback('');
				};

				let operationCode = '';
				if (!!rows.length) {
					try {
						operationCode = rows[0].OperationCode;
					} catch (error) {
						console.log("[ERROR ROWS[0] - verificaStatusCliente] ==> ", error.message);
					};
				};
				return callback(operationCode);
			});
		};

		function InsertAutocom(req, res) {
			var dados = jsonVerify(req.body);

			if ( !dados ) {
				console.error("[ERROR - InsertAutocom]  => " + "INVALID JSON", req.body);
				return res.status(400).send({ message: "[ERROR]  => " + "INVALID JSON" });
			};
			
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
						console.log("[ERROR - InsertAutocom]  => QUERY", err);
						return res.status(400).send({ message: "" });
					} else {
						return res.status(201).send({ message: "OK" });
					};
				}
			);
		};

	};
};

function jsonVerify(p) {
	// preserve newlines, etc - use valid JSON
	var s = JSON.stringify(p);

	if ( !IsValidJSONString(s) ) return null;

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
	s = s.replace("�", "a");

	return JSON.parse(s);
};

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

