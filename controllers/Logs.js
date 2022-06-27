const logFunc = require("../helpers/modules/Log");
const clc = require("cli-color");
const connection = require("../config/env");

async function createNewLog(log) {
  return new Promise((resolve, resject) => {
    connection.query("INSERT INTO vehicle_logs SET ?", log, (err, result) => {
      if (err) resject(err);
      console.log(clc.green(`Create log from id: ${log.vehicle_id} success.`));
      resolve(true);
    });
  });
}

module.exports = {
  addChange_log(Id) {
    return new Promise((resolve, resject) => {
      connection.query(
        "SELECT * FROM `vehicle_logs` where vehicle_id =" + Id + " ",
        (err, result) => {
          if (err) {
            resject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  async craeteLog(changelog, id) {
    if (changelog === null || changelog === "") {
      return "Log is null";
    } else {
      try {
        var log = await logFunc
          .getLogActivity(changelog)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            console.log(err);
            throw "Error at getLogActivity";
          });

        //check data into change log
        await this.addChange_log(id).then(async (result) => {
          if (result.length == 0) {
            for (let i = 0; i < log.length; i++) {
              log[i].vehicle_id = id;
              await createNewLog(log[i]).catch((err) => {
                throw err;
              });
            }
          } else {
            for (let i = 0; i < log.length; i++) {
              log[i].vehicle_id = id;
              const index = result.findIndex(
                (value) =>
                  value.vehicle_id === log[i].vehicle_id &&
                  value.name === log[i].name &&
                  value.from === log[i].from &&
                  value.to === log[i].to &&
                  value.app_request_no === log[i].app_request_no &&
                  value.veh_log_activity === log[i].veh_log_activity &&
                  value.datetime === log[i].datetime
              );
              if (index === -1) {
                await createNewLog(log[i]).catch((err) => {
                  throw err;
                });
              } else {
                console.log(clc.red("Log already exist"));
              }
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
