const vehicles_pre_upload = require("./controllers/VihicelPreupload");
const schedule = require("node-schedule");

Clock_time();

function Clock_time() {
  console.log("into process !!!");
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 4)];
  rule.hour = 13;
  rule.minute = 12;
  rule.second = 10;

  schedule.scheduleJob(rule, function () {
    console.log("Start system:");
    Serve();
  });
}

async function Serve() {
  await vehicles_pre_upload.TruncateTable().then((result) => {
    console.log(result);
  });
  await vehicles_pre_upload.savetoVehiclepreupload();
  console.log("Just moment awit other process ...");
}
