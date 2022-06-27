const dataJson = require("../../files/update_data2016_1-4.json");
const connection = require("../config/env");

function TruncateTable() {
  // delete
  return new Promise((resolve, reject) => {
    connection.query("TRUNCATE table vehicles_pre_upload", (err, result) => {
      if (err) console.log(err);
      resolve("TrunCate table is Sucess!!!");
    });
  });
}

function Allvehicles_preupload() {
  // addd
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM `vehicles_pre_upload`", (err, result) => {
      if (err) console.log(err);
      resolve(result);
      reject(err);
    });
  });
}

async function savetoVehiclepreupload() {
  //   insert;
  let num = 0;
  const cashData = await dataJson.response.docs;
  for (let index = 0; index < cashData.length; index++) {
    connection.query(
      "INSERT INTO vehicles_pre_upload SET ?",
      cashData[index],
      (err, results) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("Sucess " + ++num);
      }
    );
  }
  //   reading
  connection.query(
    "SELECT count(*) as counts FROM `vehicles_pre_upload`",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Data Insert is : " + result[0].counts);
      }
    }
  );
}

module.exports = {
  savetoVehiclepreupload,
  TruncateTable,
  Allvehicles_preupload,
};
