const mysql = require("mysql");
const obj = {
  port: 3306,
  user: "root",
  password: "root",
  database: "user_pk",
  connectionLimit: 100
};

var pool = mysql.createPool(obj);
let getQuery = async (sql, arr) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, con) => {
      if (err) {
        reject(err);
      }
      con.query(sql, arr, (err, result, filed) => {
        if (err) {
          reject(err);
        }
        resolve(result);
        con.release();
      });
    });
  });
};
module.exports = getQuery;
