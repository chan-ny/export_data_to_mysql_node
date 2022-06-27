const clc = require("cli-color");
const connection = require("../config/env");
const cleansing = require("../helpers/modules/Cleansing");

async function getCleansing(vehicle, cleansingData) {
  return await cleansing
    .cleansingData(vehicle, cleansingData)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw err;
    });
}

function findVehicle(noteId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM `vehicles` WHERE note_id = N'" + noteId + "'",
      (err, result) => {
        if (result.length == 0) {
          resolve(false);
        } else {
          resolve(result[0].id);
        }
        reject(err);
      }
    );
  });
}

async function createNewVehicle(vehicle, cleansingData) {
  return await getCleansing(vehicle, cleansingData).then((data) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO vehicles SET ?", data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(clc.green("Create new vehicle success"));
          resolve(result.insertId);
        }
      });
    });
  });
}

async function updateVehicle(vehicle, cleansingData, id) {
  return await getCleansing(vehicle, cleansingData).then((data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE `vehicles` SET ? WHERE id =" + id + "",
        data,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(clc.yellow("Update vehicle success"));
            resolve(id);
          }
        }
      );
    });
  });
}

module.exports = { findVehicle, createNewVehicle, updateVehicle };
