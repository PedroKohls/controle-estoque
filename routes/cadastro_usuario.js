const express = require('express');
const con = require('../conecta');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10;

router.get('/', function (req, res) {
    if (req.query.erro == 1)
        res.render('cadastro', { mensagem: 'E-mail já existente!' });
    if (req.query.erro == 2)
        res.render('cadastro', { mensagem: 'Por favor envie um arquivo que tenha as extensões.jpeg/.jpg/.png/.gif .' });
    else {
        res.render('cadastro', { mensagem: null });
    }
});

router.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) throw err;

        var sql = "SELECT * FROM usuarios where email = ?";
        var email = fields['email'][0];
        con.query(sql, [email], function (err, result) {
            if (err) throw err;
            if (result.length) {
                res.redirect('/cadastro_usuario?erro=1');
            }
            var nomeArquivo = files.arquivo[0].originalFilename;
            var extensoesPermitidas = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            if (!extensoesPermitidas.exec(nomeArquivo)) {
                res.redirect('/cadastro_usuario?erro=2');
            }
            else {
                var oldpath = files.arquivo[0].filepath;
                var ext = path.extname(files.arquivo[0].originalFilename);
                var nomeimg = files.arquivo[0].newFilename + ext;
                var newpath = path.join(__dirname, '../public/imagens_usuario/', nomeimg);

                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });

                bcrypt.hash(fields['senha'][0], saltRounds, function (err, hash) {
                    if (err) throw err;

                    var sql = "INSERT INTO usuarios (nome, email, senha, imagem) VALUES ?";
                    var values = [[fields['nome'][0], fields['email'][0], hash, nomeimg]];

                    con.query(sql, [values], function (err, result) {
                        if (err) throw err;
                        console.log("Numero de registros inseridos: " + result.affectedRows);
                        res.redirect('/login');
                    });
                });
            }
        });
    });
});

module.exports = router;