const mysql = require("mysql2");
var connection = mysql.createPool({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "",
  database: "vrms_dev",
  queueLimit: 0,
});

module.exports = connection;
