var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var homeRouter = require('./routes/home');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var formRouter = require('./routes/formulario');
var estoqueRouter = require('./routes/estoque');
var cadastro_ProdutoRouter = require('./routes/cadastro_produto');
var cadastro_usuarioRouter = require('./routes/cadastro_usuario');
var editar = require('./routes/editar');
var atualiza = require('./routes/atualizar');
var apaga = require('./routes/apagar');

const passport = require('passport');
var session = require('express-session');
const instrumentoController = require('./controllers/instrumentoController.js');
require('./auth.js')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./auth.js')(passport);
const MySQLStore = require('express-mysql-session')(session);
app.use(session({
  store: new MySQLStore({
    host: 'localhost', port: '3306', user: "root", password: "",
    database: "trab4"
  }),
  secret: '2C44-4D44-WppQ38S',//configure um segredo seu aqui,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30min
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "trab4"
});

function authenticationMiddleware(req, res, next) {
  if (req.session.loggedin) return next();
  res.redirect('/login?erro=1');
}

app.use((req, res, next) => {
  res.locals.logado = req.session.loggedin || false;
  res.locals.usuario = {
    id: req.session.usuarioId || null,
    nome: req.session.username || null,
    foto: req.session.imagem || null
  };
  next();
});

app.use((req, res, next) => {
  res.locals.mensagem = req.session.mensagem || null;
  req.session.mensagem = null;
  next();
});


app.use('/', homeRouter);
app.use('/user', usersRouter);
app.use('/login', loginRouter);
app.use('/estoque', authenticationMiddleware, estoqueRouter);
app.use('/formulario', authenticationMiddleware, formRouter);
app.use('/enviar', authenticationMiddleware, formRouter);
app.use('/cadastro_produto', authenticationMiddleware, cadastro_ProdutoRouter);
app.use('/cadastro_usuario', cadastro_usuarioRouter);
app.use('/users', usersRouter);
app.use('/editar', authenticationMiddleware, editar);
app.use('/atualizar', authenticationMiddleware, atualiza);
app.use('/apagar', authenticationMiddleware, apaga);

app.get('/editar/:id', instrumentoController.edit);
app.post('/atualizar/:id', instrumentoController.update);
app.get('/apagar/:id', instrumentoController.destroy);

app.get('/logout', function (req, res) {
  const mensagem = "Logout realizado!";
  req.session.destroy(function (err) {
    req.session = null;
  });
  res.locals.mensagem = mensagem;
  res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
