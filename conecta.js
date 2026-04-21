const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "trab4"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Conectado");
});

module.exports = con;
