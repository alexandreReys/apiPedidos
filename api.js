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

app.get('/itensmesa/:nummesa', (req, res) => {
  var sql = 'select * from appPed where PedMesaComanda = ?'
  connection.query(sql, [req.params.nummesa], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows)
  });
})

app.get('/cadpro/:codpro', (req, res) => {
    var sql = 
      'SELECT p1.Cadpro1NetLoja, p1.Cadpro1NetCodigo, ' +
          'p.CadproNetDescricao, p1.Cadpro1NetPreco ' +
      'FROM Cadpro1Net p1 ' +
      'INNER JOIN CadproNet p  ' +
          'ON ( p.CadproNetCodigo = p1.Cadpro1NetCodigo ) ' +
          'AND ( p.CadproNetLoja = p1.Cadpro1NetLoja ) ' +
      'WHERE ( p1.Cadpro1NetCodigo = ? )'
/*
    var sql = 
    'select * from CadproNet where CadproNetCodigo = ?'
*/
    connection.query(sql, [req.params.codpro], function(err, rows, fields) {
        if (err) throw err;
        res.json(rows[0])
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
*/

app.get('/itensmesa/:id', (req, res) => {
  connection.query('select * from contatos where id = ?',[req.params.id], function(err, rows, fields) {
    if (err) throw err;
    res.json(rows[0])
  });
})

app.post('/itensmesa', (req, res) => {
    var usuario = req.body
    var sql = 'insert into contatos (nome, email) values (?, ?)'
    connection.query(sql, [usuario.nome, usuario.email], function(err, rows, fields) {
      if (err) throw err;
      res.json(rows)
    });
})

app.put('/itensmesa', (req, res) => {
    var usuario = req.body
    var sql = 'update contatos set nome=?, email=? where id=?'
    connection.query(sql, [usuario.nome, usuario.email, usuario.id], function(err, rows, fields) {
      if (err) throw err;
      res.json(rows)
    });
})

app.listen(3000, () => console.log('API rodando na porta 3000') )