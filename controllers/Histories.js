const connection = require("../config/env");
const clc = require("cli-color");
const hisFunc = require("../helpers/modules/History");

function createHistory(historyData, vehicle) {
  return new Promise((resolve, resject) => {
    connection.query(
      "INSERT INTO license_no_history SET ?",
      historyData,
      (err, result) => {
        if (err) {
          console.log(err);
          resject(err);
        } else {
          resolve(
            clc.green(`Create history of vehicle_id: ${vehicle.id} success`)
          );
        }
      }
    );
  });
}

module.exports = {
  async createHistory(vehicleId) {
    // check vehicles
    const vehicle = await hisFunc.getVehicle(vehicleId).then((result) => {
      if (result === null) throw `No data at vehicle_id: ${vehicleId}`;
      else return result;
    });

    //check quick id
    const log = await hisFunc
      .getLogOnlyQuickId(vehicleId)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    if (log.length > 0) {
      for (let i = 0; i < log.length; i++) {
        const history = await hisFunc
          .getHistory(vehicleId)
          .then((result) => {
            return result;
          })
          .catch((err) => {
            throw err;
          });
        // change data
        const quick_id = log[i].to;
        if (history.length == 0) {
          const historyData = await hisFunc.checkQuickId(
            quick_id,
            vehicle.vehicle_type_id,
            vehicleId
          );
          if (historyData) {
            let obj = {
              vehicle_id: vehicle.id,
              vehicle_kind_code: historyData.vehicle_kind_id,
              licence_no: historyData.lice_no_number,
              province_code: historyData.lice_no_province_code,
              start_date: vehicle.issue_date,
              end_date: vehicle.expire_date,
              license_no_status: "uses",
            };
            await createHistory(obj, vehicle)
              .then((rs) => {
                console.log(rs);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log(
              clc.red(
                `quick_id at vehicle_id: ${vehicleId} is invalid -- ${quick_id}`
              )
            );
          }
        } else {
          // If have history >= 1
          const historyData = await hisFunc.checkQuickId(
            quick_id,
            vehicle.vehicle_type_id,
            vehicleId
          );
          if (historyData) {
            for (let index = 0; index < history.length; index++) {
              const element = history[index].licence_no;
              if (historyData.lice_no_number == element) {
                console.log(clc.red(`History licence is Already : ${element}`));
              } else {
                if (
                  historyData.lice_no_province_code ==
                  history[index].province_code
                ) {
                  console.log(
                    clc.cyan(`Do not save of History licence this: ${element}`)
                  );
                } else {
                  let obj = {
                    vehicle_id: vehicle.id,
                    vehicle_kind_code: historyData.vehicle_kind_id,
                    licence_no: historyData.lice_no_number,
                    province_code: historyData.lice_no_province_code,
                    start_date: vehicle.issue_date,
                    end_date: vehicle.expire_date,
                    license_no_status: "not_uses",
                  };
                  await createHistory(obj, vehicle)
                    .then((rs) => {
                      console.log(rs);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            }
          } else {
            console.log(
              clc.red(
                `quick_id at vehicle_id: ${vehicleId} is invalid -- ${quick_id}`
              )
            );
          }
        }
      }
    }
  },
};
