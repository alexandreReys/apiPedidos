const express = require('express')
const cors = require('cors')
const app = express()
var mysql = require('mysql');
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())

var db_host = process.env.db_host
var db_user = process.env.db_user
var db_pass = process.env.db_pass
var db_data = process.env.db_data

var connection = mysql.createPool({
	connectionLimit : 10,
	host     : db_host,
	user     : db_user,
	password : db_pass,
	database : db_data
});

/*
//////////////////////////////////////////////////////////////////////////////////////////
Controle de Mesas / Pedidos
//////////////////////////////////////////////////////////////////////////////////////////
*/

app.get('/itensmesa/:nummesa', (req, res) => {
	var sql = 'select * from appPed where PedMesaComanda = ?'
	connection.query(sql, [req.params.nummesa], function(err, rows, fields) {
		if (err) throw err;
		res.json(rows)
	});
});

app.get('/tiposCadpro', (req, res) => {
	var sql = 'select * from Class2Net'
	connection.query(sql, [req.params.nummesa], function(err, rows, fields) {
		if (err) throw err;
		res.json(rows)
	});
});

app.get('/cadpro/:codpro', (req, res) => {
	var sql = 
		'SELECT p1.Cadpro1NetLoja, p1.Cadpro1NetCodigo, ' +
				'p.CadproNetDescricao, p1.Cadpro1NetPreco ' +
		'FROM Cadpro1Net p1 ' +
		'INNER JOIN CadproNet p  ' +
				'ON ( p.CadproNetCodigo = p1.Cadpro1NetCodigo ) ' +
				'AND ( p.CadproNetLoja = p1.Cadpro1NetLoja ) ' +
		'WHERE ( p1.Cadpro1NetCodigo = ? )'
	connection.query(sql, [req.params.codpro], function(err, rows, fields) {
			if (err) throw err;
			res.json(rows[0])
	});
});

app.get('/cadproporid/:id', (req, res) => {
	var sql = 
		'SELECT p1.Cadpro1NetLoja, p1.Cadpro1NetCodigo, ' +
		'p.CadproNetId, p.CadproNetDescricao, p1.Cadpro1NetPreco ' +
		'FROM Cadpro1Net p1 ' +
		'INNER JOIN CadproNet p  ' +
				'ON ( p.CadproNetCodigo = p1.Cadpro1NetCodigo ) ' +
				'AND ( p.CadproNetLoja = p1.Cadpro1NetLoja ) ' +
		'WHERE ( p.CadproNetId = ? )'
	connection.query(sql, [req.params.id], function(err, rows, fields) {
			if (err) throw err;
			res.json(rows[0])
	});
})

app.get('/cadproportipo/:tipo', (req, res) => {
	var sql = 
			'SELECT p1.Cadpro1NetLoja, p.CadproNetClass2, p1.Cadpro1NetCodigo, '+
			'p.CadproNetDescricao, p1.Cadpro1NetPreco, p.CadproNetId '+
			'FROM Cadpro1Net p1 '+
			'INNER JOIN CadproNet p '+
			'ON ( p.CadproNetCodigo = p1.Cadpro1NetCodigo ) '+
			'AND ( p.CadproNetLoja = p1.Cadpro1NetLoja ) '+
			'WHERE ( p.CadproNetClass2 = ? ) '
	connection.query(sql, [req.params.tipo], function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
	});
})

app.post('/cadpro', (req, res) => {
	var par = req.body
	var sql = 
		'insert into appPed ' + 
			'(PedMesaComanda, PedCodProduto, PedDescricaoProduto, PedEmbalagem, PedQtdePorEmbalagem, ' +
			'PedUnidadeEmbalagem, PedQtde, PedValorUnitario, PedValorTotal) '+
		'values (?, ?, ?, ?, ?, ?, ?, ?, ?)'
	connection.query( 
		sql, 
		[par.mesa, par.cod, par.descr, par.emb, par.qtEmb, par.unEmb, par.qtd, par.vlUni, par.vlTot], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})

app.delete('/itensmesa/:id', (req, res) => {
	connection.query('delete from appPed where pedid = ?',[req.params.id], function(err, rows, fields) {
		if (err) throw err;
		res.end('Deletado')
	});
})

/*
//////////////////////////////////////////////////////////////////////////////////////////
Contatos - Teste do Curso Tecnospeed
//////////////////////////////////////////////////////////////////////////////////////////
*/


// app.get('/itensmesa/:id', (req, res) => {
// 	connection.query('select * from contatos where id = ?',[req.params.id], function(err, rows, fields) {
// 		if (err) throw err;
// 		res.json(rows[0])
// 	});
// })

// app.post('/itensmesa', (req, res) => {
// 		var usuario = req.body
// 		var sql = 'insert into contatos (nome, email) values (?, ?)'
// 		connection.query(sql, [usuario.nome, usuario.email], function(err, rows, fields) {
// 			if (err) throw err;
// 			res.json(rows)
// 		});
// })

// app.put('/itensmesa', (req, res) => {
// 		var usuario = req.body
// 		var sql = 'update contatos set nome=?, email=? where id=?'
// 		connection.query(sql, [usuario.nome, usuario.email, usuario.id], function(err, rows, fields) {
// 			if (err) throw err;
// 			res.json(rows)
// 		});
// })

/*
//////////////////////////////////////////////////////////////////////////////////////////
Controle de Serviços e Vistorias
//////////////////////////////////////////////////////////////////////////////////////////
*/

app.get('/api/v1/clienteLocais/:id', (req, res) => {
	connection.query('select * from csvClienteLocal where csvCliLocIdCliente = ?',[req.params.id], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})
app.get('/api/v1/clienteLocaisUnid/:idCliente/:idLocal', (req, res) => {
	let sql = 'select * ' +
			  'from csvClienteLocalUnid ' +
			  'where ( csvCliLocUniIdCliente = ? ) and ( csvCliLocUniIdClienteLocal = ? )';
	connection.query(sql, [req.params.idCliente, req.params.idLocal], 
		function(err, rows, fields) {
			if (err) throw err;
		res.json(rows)
	});
})
app.get('/api/v1/Checklist/:idCliente/:idLocal/:idUnidade', (req, res) => {
	let sql = 
		'SELECT csvChkId, csvChkIdCliente, csvChkIdClienteLocal, csvChkIdClienteLocalUnid, ' +
		'  csvChkDescricao, csvCliLocDescricao, csvCliLocUniDescricao ' +
		'FROM csvChecklist ' +
		'LEFT JOIN csvClienteLocal ' +
		'      ON  (csvChkIdCliente      = csvCliLocIdCliente)  ' +
		'      AND (csvChkIdClienteLocal = csvCliLocId) ' +
		'LEFT JOIN csvClienteLocalUnid ' +
		'      ON  (csvChkIdCliente          = csvCliLocUniIdCliente) ' +
		'      AND (csvChkIdClienteLocal     = csvCliLocUniIdClienteLocal) ' +
		'      AND (csvChkIdClienteLocalUnid = csvCliLocUniId) ' +
		'WHERE (csvChkIdCliente = ?) ' +
		'  AND (csvChkIdClienteLocal = ?) ' +
		'  AND (csvChkIdClienteLocalUnid = ?) ' +
		'ORDER BY csvChkId';
	connection.query(sql, [req.params.idCliente, req.params.idLocal, req.params.idUnidade], 
		function(err, rows, fields) {
			if (err) throw err;
		res.json(rows)
	});
})
app.get('/api/v1/ChecklistItem/:idCliente/:idLocal/:idUnidade/:idChecklist', (req, res) => {
	let sql = 
		'SELECT csvChkItemId, csvChkItemIdCliente, csvChkItemIdLocal, ' +
		'  csvChkItemIdUnidade, csvChkItemIdChecklist, csvChkItemDescricao,  ' +
		'  csvCliLocDescricao, csvCliLocUniDescricao, csvChkDescricao ' +
		'FROM csvChecklistItem ' +
		'LEFT JOIN csvClienteLocal ' +
		'       ON  (csvChkItemIdCliente = csvCliLocIdCliente)  ' +
		'       AND (csvChkItemIdLocal   = csvCliLocId) ' +
		'LEFT JOIN csvClienteLocalUnid ' +
		'       ON  (csvChkItemIdCliente = csvCliLocUniIdCliente) ' +
		'       AND (csvChkItemIdLocal   = csvCliLocUniIdClienteLocal) ' +
		'       AND (csvChkItemIdUnidade = csvCliLocUniId) ' +
		'LEFT JOIN csvChecklist ' +
		'   	ON  (csvChkItemIdCliente   = csvChkIdCliente) ' +
		'   	AND (csvChkItemIdLocal     = csvChkIdClienteLocal) ' +
		'   	AND (csvChkItemIdUnidade   = csvChkIdClienteLocalUnid) ' +
		'   	AND (csvChkItemIdChecklist = csvChkId) ' +
		'WHERE (csvChkItemIdCliente = ?) ' +
		'	AND (csvChkItemIdLocal = ?) ' +
		'  	AND (csvChkItemIdUnidade = ?) ' +
		'  	AND (csvChkItemIdChecklist = ?) ' +
		'ORDER BY csvChkItemId';
	connection.query(sql, [req.params.idCliente, req.params.idLocal, req.params.idUnidade, req.params.idChecklist], 
		function(err, rows, fields) {
			if (err) throw err;
		res.json(rows)
	});
})
app.get('/api/v1/usuario/:usuario/:senha', (req, res) => {
	let sql = 
		'SELECT * ' +
		'FROM csvUsuario ' +
		'WHERE (csvUsuarioLogin = ?) ' +
		'  AND (csvUsuarioSenha = ?) ';
	connection.query(sql, [req.params.usuario, req.params.senha], 
		function(err, rows, fields) {
			if (err) throw err;
		res.json(rows)
	});
})
app.post('/api/v1/vistoria', (req, res) => {
	var usuario = req.body

	var sql  = 'insert into csvVistoria(';
        sql += '  csvVisUsuario,    csvVisData,    	   csvVisHora,';
        sql += '  csvVisIdCliente,  csvVisIdLocal,';
        sql += '  csvVisIdUnidade,  csvVisIdChecklist, csvVisIdItem,';
        sql += '  csvVisStatus,     csvVisOcorrencia,  csvVisImagem01,';
        sql += '  csvVisImagem02,   csvVisImagem03,    csvVisImagem04,';
        sql += '  csvVisImagem05,   csvVisImagem06,    csvVisImagem07,';
        sql += '  csvVisImagem08,   csvVisImagem09,    csvVisImagem10';
        sql += ') ';
        sql += 'value ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? )';

	connection.query(sql, [
            usuario.csvVistoriaUsuario,    usuario.csvVistoriaData,        usuario.csvVistoriaHora,
            usuario.csvVistoriaIdCliente,  usuario.csvVistoriaIdLocal,
            usuario.csvVistoriaIdUnidade,  usuario.csvVistoriaIdChecklist, usuario.csvVistoriaIdItem,
            usuario.csvVistoriaStatus,     usuario.csvVistoriaOcorrencia,  usuario.csvVistoriaImagem01,
            usuario.csvVistoriaImagem02,   usuario.csvVistoriaImagem03,    usuario.csvVistoriaImagem04,
            usuario.csvVistoriaImagem05,   usuario.csvVistoriaImagem06,    usuario.csvVistoriaImagem07,
            usuario.csvVistoriaImagem08,   usuario.csvVistoriaImagem09,    usuario.csvVistoriaImagem10
        ], 
        function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})
app.get('/api/v1/vistoriaspordata/:data', (req, res) => {
	let sql = 
		'SELECT csvVisId, csvVisUsuario, csvVisData, csvVisHora, csvVisIdCliente, csvVisIdLocal, ' + 
		       'csvVisIdUnidade, csvVisIdChecklist, csvVisIdItem, csvVisStatus, csvVisOcorrencia, ' +
		       'csvCliLocDescricao, csvCliLocUniDescricao, csvChkDescricao, csvChkItemDescricao, ' +
		       'csvVisImagem01, csvVisImagem02, csvVisImagem03, csvVisImagem04 ' +
		'FROM csvVistoria ' +
			'LEFT JOIN csvClienteLocal ' +
				'ON  (csvVisIdCliente = csvCliLocIdCliente)  ' +
				'AND (csvVisIdLocal   = csvCliLocId) ' +
			'LEFT JOIN csvClienteLocalUnid ' +
				'ON  (csvVisIdCliente = csvCliLocUniIdCliente) ' +
				'AND (csvVisIdLocal   = csvCliLocUniIdClienteLocal) ' +
				'AND (csvVisIdUnidade = csvCliLocUniId) ' +
			'LEFT JOIN csvChecklist ' +
				'ON  (csvVisIdCliente   = csvChkIdCliente) ' +
				'AND (csvVisIdLocal     = csvChkIdClienteLocal) ' +
				'AND (csvVisIdUnidade   = csvChkIdClienteLocalUnid) ' +
				'AND (csvVisIdChecklist = csvChkId) ' +
			'LEFT JOIN csvChecklistItem ' +
				'ON  (csvVisIdCliente   = csvChkItemIdCliente) ' +
				'AND (csvVisIdLocal     = csvChkItemIdLocal) ' +
				'AND (csvVisIdUnidade   = csvChkItemIdUnidade) ' +
				'AND (csvVisIdChecklist = csvChkItemIdChecklist) ' +
				'AND (csvVisIdItem      = csvChkItemId) ' +
		'WHERE (csvVisData = ?)';
	connection.query(sql, [req.params.data], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})


app.get('/api/v1/clientes', (req, res) => {
	var sql = 'select * from csvCliente'
	connection.query(
		sql, [], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})
app.get('/api/v1/usuarios', (req, res) => {
	let sql = 'SELECT * FROM csvUsuario ';
	connection.query(
		sql, [], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})
app.get('/api/v1/locais', (req, res) => {
	let sql = 'SELECT * FROM csvClienteLocal ';
	connection.query(
		sql, [], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})
app.get('/api/v1/unidades', (req, res) => {
	let sql = 'SELECT * FROM csvClienteLocalUnid ';
	connection.query(
		sql, [], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})
app.get('/api/v1/checklists', (req, res) => {
	let sql = 'SELECT * FROM csvChecklist ';
	connection.query(
		sql, [], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})
app.get('/api/v1/ChecklistItens', (req, res) => {
	let sql = 'SELECT * FROM csvChecklistItem ';
	connection.query(
		sql, [], 
		function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})

/*
//////////////////////////////////////////////////////////////////////////////////////////
Api Sistema AutoCom
//////////////////////////////////////////////////////////////////////////////////////////
*/

// app.post('/api/v1/autocom', (req, res) => {
// 	var dados = req.body
// 	let sql = 'INSERT IGNORE INTO apiAutocom ( Cnpj, Produto, RazaoDadosCadastrais ) VALUE ( ?, ?, ? ) ';
// 	connection.query(
// 		sql, [], 
//         function(err, rows, fields) {
// 			if (err) throw err;
// 			res.json(rows)
// 		}
// 	);
// })

app.post('/api/v1/autocom', (req, res) => {
	var dados = req.body;
	let sql = 
		'INSERT INTO apiAutocom ' +
			'( ' + 
				'Cnpj, Produto, Versao, Data, VersaoAutocom, RazaoDadosCadastrais, ' +
		      	'TelefoneDC, ContatoDC, EnderecoDC, NumeroDC, CidadeDC, BairroDC, '  + 
		      	'EstadoDC, CepDC ' + 
		     ')' +
		'VALUE ( ' + 
			'"' + dados.Cnpj + '", ' + 
			'"' + dados.Produto + '", ' + 
			'"' + dados.Versao + '", ' + 

			'"' + dados.Data + '", ' + 
			'"' + dados.VersaoAutocom + '", ' + 
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
			'Data = "'                 + dados.Data + '", ' +
			'VersaoAutocom = "'        + dados.VersaoAutocom + '", ' +
			'RazaoDadosCadastrais = "' + dados.RazaoDadosCadastrais + '", ' +

			'TelefoneDC = "' + dados.TelefoneDC + '", ' + 
			'ContatoDC = "'  + dados.ContatoDC + '", ' + 
			'EnderecoDC = "' + dados.EnderecoDC + '", ' + 

			'NumeroDC = "' + dados.NumeroDC + '", ' + 
			'CidadeDC = "' + dados.CidadeDC + '", ' + 
			'BairroDC = "' + dados.BairroDC + '", ' + 

			'EstadoDC = "' + dados.EstadoDC + '", ' + 
			'CepDC = "'    + dados.CepDC + '" ';

	// console.log(sql);
	connection.query(sql, [], 
        function(err, rows, fields) {
			if (err) throw err;
			res.json(rows)
		}
	);
})

app.listen(3000, () => console.log('API rodando na porta 3000') )
