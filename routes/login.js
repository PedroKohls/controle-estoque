const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const con = require('../conecta');
const formidable = require('formidable');

router.get('/', (req, res, next) => {
    if (req.query.erro == 1)
        res.render('login', { mensagem: 'É necessário realizar login' });
    else if (req.query.erro == 2)
        res.render('login', { mensagem: 'Email e/ou senha incorretos!' });
    else
        res.render('login', { mensagem: null });
});

router.post('/', function (req, res) {
    var senha = req.body.senha;
    var email = req.body.email;
    var sql = "SELECT * FROM usuarios where email = ?";
    con.query(sql, [email], function (err, result) {
        if (err) throw err;
        if (result.length) {
            bcrypt.compare(senha, result[0]['senha'], function (err, resultado) {
                if (err) throw err;
                if (resultado) {
                    req.session.loggedin = true;
                    req.session.usuarioId = result[0]['id'];
                    req.session.username = result[0]['nome'];
                    req.session.imagem = result[0]['imagem'];
                    if (req.session.mensagem) {
                        mensagem = req.session.mensagem;
                        req.session.mensagem = null;
                    }
                    res.redirect('/');
                } else {
                    req.session.mensagem = "Senha inválida";
                    res.redirect('login');
                }
            });
        } else {
            req.session.mensagem = "E-mail não encontrado";
            res.redirect('login');
        }
    });
});


module.exports = router;
