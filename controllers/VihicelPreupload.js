const filename =
  "../../update-solr-to-vrms/files/update_data_" +
  new Date().toISOString().slice(0, 10) +
  ".json";
const dataJson = require(filename);
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

async function Import_jsondata() {
  //   insert;
  let num = 0;
  const cashData = dataJson.response.docs;
  if (cashData != undefined) {
    for (let index = 0; index < cashData.length; index++) {
      new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO vehicles_pre_upload SET ?",
          cashData[index],
          (err, results) => {
            if (err) {
              console.error(err);
              console.log("note_id: " + cashData[index].note_id_t);
              process.exit(0);
            }
            console.log("Sucess " + ++num);
          }
        );
      });
    }
  } else {
    console.log("Script is not working");
  }
}

function Number_insert() {
  return new Promise((resolve, reject) => {
    //   reading
    connection.query(
      "SELECT count(*) as counts FROM `vehicles_pre_upload`",
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve("Data Insert is : " + result[0].counts);
        }
      }
    );
  });
}

async function savetoVehiclepreupload() {
  await Import_jsondata((result) => {
    console.log(result);
  });

  await Number_insert()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  savetoVehiclepreupload,
  TruncateTable,
};
