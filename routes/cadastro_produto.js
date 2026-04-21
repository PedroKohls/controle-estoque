const express = require('express');
const con = require('../conecta');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/', function (req, res) {
    if (req.query.erro == 1)
        res.render('formulario', { mensagem: 'Por favor envie um arquivo que tenha as extensões.jpeg/.jpg/.png/.gif .' });
    else {
        res.render('formulario', { mensagem: null });
    }
});

router.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        var nomeArquivo = files.arquivo[0].originalFilename;
        var extensoesPermitidas = /(\.jpg|\.jpeg|\.png|\.gif\.jfif)$/i;
        if (!extensoesPermitidas.exec(nomeArquivo)) {
            res.redirect('/cadastro_produto?erro=1');
        }
        else {
            var oldpath = files.arquivo[0].filepath;
            var ext = path.extname(nomeArquivo);
            var nomeimg = files.arquivo[0].newFilename + ext;
            var newpath = path.join(__dirname, '../public/imagens_produtos/', nomeimg);

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
            });

            var sql = "INSERT INTO instrumentos (nome, descricao, quantidade, preco, arquivo, usuarioId) VALUES ?";
            var values = [[fields['nome'][0], fields['descricao'][0], fields['quantidade'][0], fields['preco'][0], nomeimg, req.session.usuarioId]];
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Número de registros inseridos: " + result.affectedRows);
                req.session.loggedin = true;
                res.redirect('/estoque');
            });
        }
    });
});
module.exports = router;