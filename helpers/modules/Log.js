async function getLogActivity(changelog) {
  const logActivity = [];
  const array = await splitChangelog(changelog);
  for (let i = 0; i < array.length; i++) {
    const date = array[i][0].substr(0, 19);
    if (
      array[i][0].includes("update_time") ||
      array[i][0].substr(0, 2) === "in"
    ) {
      continue;
    } else {
      for (let j = 0; j < array[i].length; j++) {
        // console.log(`${j}: ${array[i][j]}`)
        const text = array[i][j];
        if (text.substring(0, text.indexOf(":")) === "license_no") {
          const value = await getLogValue(text, date);
          if (!(await checkLogActivity(logActivity, value))) {
            logActivity.push(value);
          }
        } else if (text.substring(0, text.indexOf(":")) === "province") {
          const value = await getLogValue(text, date);
          if (!(await checkLogActivity(logActivity, value))) {
            logActivity.push(value);
          }
        } else if (text.substring(0, text.indexOf(":")) === "purpose") {
          const value = await getLogValue(text, date);
          if (!(await checkLogActivity(logActivity, value))) {
            logActivity.push(value);
          }
        } else if (text.substring(0, text.indexOf(":")) === "quick_id") {
          const value = await getLogValue(text, date);
          if (!(await checkLogActivity(logActivity, value))) {
            logActivity.push(value);
          }
        } else {
          continue;
        }
      }
    }
    // console.log('------------------------------------------------------------------------------')
  }
  return logActivity;
}

async function checkLogActivity(array, value) {
  const boolean = await array.some((element) => {
    return (
      element.datetime === value.datetime &&
      element.name === value.name &&
      element.from === value.from &&
      element.to === value.to
    );
  });
  return boolean;
}

async function splitChangelog(changelog) {
  const array = changelog.split("<BR><BR>");
  const array2 = [];
  for (let i = 0; i < array.length; i++) {
    const arr = await array[i].split("<BR>");
    array2.push(arr);
  }
  // await array2[0].splice(0, 1)
  // await array2[array2.length - 1].splice(-1)
  if (array2[0][0].length <= 2) {
    await array2[0].splice(0, 1);
  }
  if (
    array2[array2.length - 1][array2[array2.length - 1].length - 1].length <= 2
  ) {
    await array2[array2.length - 1].splice(-1);
  }
  return array2;
}

async function getLogValue(value, date) {
  const fieldname = await value.substring(0, value.indexOf(":"));
  const data = value.substring(value.indexOf(":") + 1);
  const array = data.split("to");
  var logObject = {
    vehicle_id: null,
    name: fieldname,
    from: array[0].trim() === "" ? null : array[0].trim(),
    to: array[1].trim(),
    app_request_no: null,
    veh_log_activity: null,
    datetime: date,
  };
  return logObject;
}

module.exports = {
  getLogActivity,
};
