const fs = require('fs');
const crypto = require('crypto');
const formidable = require('formidable');
const path = require('path');
const usuarioModel = require("../model/usuario");

module.exports = {
    index: async function (req, res) {
        let dados = await usuarioModel.findAll();
        res.render('estoque', { dadosusuario: dados });
    },

    edit: async function (req, res) {
        var id = req.params.id;
        let dados = await usuarioModel.findAll({
            where: {
                id: id
            }
        })
        res.render('editar', { dadosusuario: dados });
    },

    update: async function (req, res) {
        var form = new formidable.IncomingForm();
        form.options.allowEmptyFiles = true;
        form.options.minFileSize = 0;

        form.parse(req, async (err, fields, files) => {
            if (err) throw err;
            var id = req.params.id;
            var nome = fields.nome[0];
            var descricao = fields.descricao[0];
            var quantidade = fields.quantidade[0];
            var preco = fields.preco[0];
            var arquivo;

            const usuarioAtual = await usuarioModel.findOne({ where: { id: id } });

            if (files.arquivo[0]['originalFilename'].length !== 0) {
                var oldpath = files.arquivo[0].filepath;
                var ext = path.extname(files.arquivo[0].originalFilename);
                var nomeimg = files.arquivo[0].newFilename + ext;
                var newpath = path.join(__dirname, '../public/imagens_produtos/', nomeimg);
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
                arquivo = nomeimg;
            } else {
                arquivo = usuarioAtual.arquivo;
            }

            await usuarioModel.update(
                { nome: nome, descricao: descricao, quantidade: quantidade, preco: preco, arquivo: arquivo },
                { where: { id: id } }
            );

            res.redirect('/estoque');
        });
    },

    destroy: async function (req, res) {
        var id = req.params.id;
        usuarioModel.findAll({
            where: { id: id }
        }).then(result => {
            var img = path.join(__dirname, '../public/imagens/', result[0]['arquivo']);
            fs.unlink(img, (err) => { });
        })
            .catch(err =>
                console.error(err)
            );
        usuarioModel.destroy({
            where: { id: id }
        });
        res.redirect('/estoque');
    }
}