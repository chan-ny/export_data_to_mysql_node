const vehicles_pre_upload = require("./controllers/VihicelPreupload");
const VehiclesController = require("./controllers/Vehicles");
const illegaltraffic_and_acident = require("./controllers/illegaltraffic_and_acident");
const ChangeLog = require("./controllers/Logs");
const historyController = require("./controllers/Histories");
const xlsx = require("xlsx");
const clc = require("cli-color");
const history = require("./helpers/modules/History");

Serve();

async function Serve() {
  const cleansingData = await readExcel();

  await vehicles_pre_upload.TruncateTable().then((result) => {
    console.log(result);
  });
  await vehicles_pre_upload.savetoVehiclepreupload();

  const arr = await vehicles_pre_upload
    .Allvehicles_preupload()
    .then((result) => {
      console.log(clc.red("Data have:", result.length, "records."));
      return result;
    })
    .catch((err) => {
      console.log(err);
    });

  let vehicleId;
  let createError = "";
  let updateError = "";
  let logError = "";
  let historyError = "";
  let num = 0;
  for (let i = 0; i < arr.length; i++) {
    const vehicle = arr[i];
    const isFind = await VehiclesController.findVehicle(vehicle.note_id_t)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });

    // update Vehicles
    if (isFind) {
      vehicleId = await VehiclesController.updateVehicle(
        vehicle,
        cleansingData,
        isFind
      )
        .then((vehicles_id) => {
          return vehicles_id;
        })
        .catch((error) => {
          console.log(error);
          updateError = updateError + `${vehicle.note_id_t}, ${err}\n`;
        });
    } else {
      /// Insert Vehicles
      vehicleId = await VehiclesController.createNewVehicle(
        vehicle,
        cleansingData
      )
        .then((vehicles_id) => {
          return vehicles_id;
        })
        .catch((error) => {
          console.log(error);
          createError = createError + `${vehicle.note_id_t}, ${err}\n`;
        });
    }
    if (vehicle.finedate_t != null) {
      // illegal traffic and accident
      let traffic_Id = await illegaltraffic_and_acident
        .createIllegaltraffic(vehicle, vehicleId)
        .then((result) => {
          if (result != undefined) {
            return result;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // create accident
      if (traffic_Id) {
        await illegaltraffic_and_acident
          .crateAcident(vehicle, traffic_Id)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
            process.exit(0);
          });
      }
    }

    await ChangeLog.craeteLog(vehicle.changelog_t, vehicleId).catch((err) => {
      console.log(err);
      logError = logError + `${vehicleId}, ${err}\n`;
    });

    // history
    await historyController.createHistory(vehicleId).catch((err) => {
      console.log(err);
      historyError = historyError + `${vehicleId}, ${err}\n`;
    });
    console.log(
      clc.blue(
        `---------------------------------------------------------- Counts: ${++num}`
      )
    );
    //error
    await creteErrorFile(createError, updateError, logError, historyError);
    setTimeout(() => {
      process.exit(0);
    }, 5000);
  }

  //reas xlsx
  async function readExcel() {
    const workbook = xlsx.readFile("./files/cleansing-solr.xls");
    const workSheet = workbook.SheetNames;
    const object = {};
    await workSheet.forEach(async (sheetName) => {
      const excelData = await xlsx.utils.sheet_to_row_object_array(
        workbook.Sheets[sheetName]
      );
      const obj = {
        [sheetName]: excelData,
      };
      Object.assign(object, obj);
    });
    return object;
  }
}

async function creteErrorFile(
  createError,
  updateError,
  logError,
  historyError
) {
  if (createError !== "") {
    await fileController
      .createErrorFile(__dirname, "Update_crete", createError, "_", "_")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (updateError !== "") {
    await fileController
      .createErrorFile(__dirname, "Update_update", updateError, "_", "_")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (logError !== "") {
    await fileController
      .createErrorFile(__dirname, "Update_log", logError, "_", "_")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (historyError !== "") {
    await fileController
      .createErrorFile(__dirname, "Update_history", historyError, "_", "_")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
