const compare = require("./Compare.js");

async function cleansingData(car, cleansingData) {
  const color = compare.compareValue(car.color_t, cleansingData.color); // 0
  const provDistrict = compare.compareProvinceAndDistrict(
    car.province_t,
    car.district_t,
    cleansingData.province_district
  ); // 1
  const steering = compare.compareValue(
    car.driverseat_t,
    cleansingData.steering
  ); // 2
  const gas = compare.compareValue(car.energy_t, cleansingData.energy); // 3
  const brandModel = compare.compareBrandAndModel(
    car.make_t,
    car.model_t,
    cleansingData.brand_model,
    cleansingData.brand
  ); // 4
  const motorMake = compare.compareValue(car.motor_make_t, cleansingData.brand); // 5
  const commercePermitDate = compare.checkDate(car.commerce_permit_date_t); // 6
  const expireDate = compare.checkDate(car.expire_date_t, true); // 7
  const importPermitDate = compare.checkDate(car.import_permit_date_t); // 8
  const industrialDocDate = compare.checkDate(car.industrial_doc_date_t); // 9
  const issueDate = compare.checkDate(car.issue_date_t); // 10
  const policeDocDate = compare.checkDate(car.police_doc_date_t); // 11
  const purpose = compare.compareValue(car.purpose_t, cleansingData.purpose); // 12
  const specialDate = compare.checkDate(car.special_date_t); // 13
  const taxDate = compare.checkDate(car.tax_date_t); // 14
  const taxPaymentDate = compare.checkDate(car.tax_payment_date_t); // 15
  const technicalDocDate = compare.checkDate(car.technical_doc_date_t); // 16
  const dateTimeUpdate = compare.checkDate(car.update_time.toString()); // 17
  const vehicleType = compare.compareValue(
    car.vehicletype_t,
    cleansingData.vehicletype
  ); // 18

  return Promise.all([
    color,
    provDistrict,
    steering,
    gas,
    brandModel,
    motorMake,
    commercePermitDate,
    expireDate,
    importPermitDate,
    industrialDocDate,
    issueDate,
    policeDocDate,
    purpose,
    specialDate,
    taxDate,
    taxPaymentDate,
    technicalDocDate,
    dateTimeUpdate,
    vehicleType,
  ])
    .then(async (result) => {
      return {
        _olddata: await checkNaN(car._olddata_t),
        _ver: await checkNaN(car._ver_t),
        access: await checkNull(car.access_t),
        advance: await checkNull(car.advance_t),
        axis: await checkNull(car.axis_t),
        cc: await checkNull(car.cc_t),
        certcode: await checkNull(car.certcode_t),
        certdate: await checkNull(car.certdate_t),
        certify_doc_date: await checkNull(car.certify_doc_date_t),
        certify_doc_number: await checkNull(car.certify_doc_number_t),
        certify_doc_remark: await checkNull(car.certify_doc_remark_t),
        certlicense: await checkNull(car.certlicense_t),
        certno: await checkNull(car.certno_t),
        certolddate: await checkNull(car.certolddate_t),
        certperm: await checkNull(car.certperm_t),
        certprintdate: await checkNull(car.certprintdate_t),
        certtemp: await checkNull(car.certtemp_t),
        log_activity: await checkNull(car.changelog_t),
        chassis_no: await checkNull(car.chassis_no_t),
        color_id: result[0], // color data
        color_old: await checkId(result[0], car.color_t), // check id = 99999 or null ?
        comerce_permit_date: result[6],
        commerce_permit_date_old: await checkId(
          result[6],
          car.commerce_permit_date_t
        ),
        comerce_permit_no: await checkNull(car.commerce_permit_no_t),
        commerce_permit: await checkNull(car.commerce_permit_t),
        counted: await checkNull(car.counted_t),
        cylinder: await checkNull(car.cylinder_t),
        deleted: await checkNaN(car.deleted_t),
        district_code: result[1].district, // district data
        district_old: await checkId(result[1].district, car.district_t), // check id = 99999 or null ?
        division_no: await checkNull(car.division_no_t),
        division_no_old: await checkNull(car.division_no_t),
        steering_id: result[2], // steering data
        steering_old: await checkId(result[2], car.driverseat_t), // check id = 99999 or null ?
        gas_id: result[3], // gas data
        gas_old: await checkId(result[3], car.energy_t), // check id = 99999 or null ?
        engine_no: await checkNull(car.engine_no_t),
        expire_date: result[7],
        expire_date_old: await checkId(result[7], car.expire_date_t),
        height: await checkNull(car.height_t),
        import_permit_date: result[8],
        import_permit_date_old: await checkId(
          result[8],
          car.import_permit_date_t
        ),
        import_permit_hsny: await checkNaN(car.import_permit_hsny_t),
        import_permit_invest: await checkNaN(car.import_permit_invest_t),
        import_permit_no: await checkNaN(car.import_permit_no_t),
        industrial_doc_date: result[9],
        industrial_doc_date_old: await checkId(
          result[9],
          car.industrial_doc_date_t
        ),
        industrial_doc_no: await checkNull(car.industrial_doc_no_t),
        issue_date: result[10],
        issue_date_old: await checkId(result[10], car.issue_date_t),
        issue_date_var: await checkNull(car.issue_date_var_t),
        issue_place: await checkNull(car.issue_place_t),
        keyby: await checkNull(car.keyby_t),
        owner_lastname: await checkNull(car.lastname_t),
        long: await checkNull(car.length_t),
        licence_no: await checkNull(car.license_no_t),
        log: await checkNull(car.log_t),
        brand_id: result[4].brand,
        brand_old: await checkId(result[4].brand, car.make_t),
        model_id: result[4].model,
        model_old: await checkId(result[4].model, car.model_t),
        motor_brand_id: result[5],
        motor_brand_old: await checkId(result[5], car.motor_make_t),
        owner_name: await checkNull(car.name_t),
        note_id: await checkNull(car.note_id_t),
        police_doc_date: result[11],
        police_doc_date_old: await checkId(result[11], car.police_doc_date_t),
        police_doc_no: await checkNull(car.police_doc_no_t),
        province_abbr: await checkNull(car.province_abbr_t),
        province_no: await checkNull(car.province_no_t),
        province_code: result[1].province,
        province_old: await checkId(result[1].province, car.province_t),
        purpose_id: result[12],
        purpose_old: await checkId(result[12], car.purpose_t),
        quick_id: await checkNull(car.quick_id_t),
        remark: await checkNull(car.remark_t),
        seat: await checkNull(car.seats_t),
        special_date: result[13],
        special_date_old: await checkId(result[13], car.special_date_t),
        special_remark: await checkNull(car.special_remark_t),
        special: await checkNull(car.special_t),
        tax_10_40: await checkNaN(car.tax_10_40_t),
        tax_12: await checkNaN(car.tax_12_t),
        tax_50: await checkNaN(car.tax_50_t),
        tax_date: result[14],
        tax_date_old: await checkId(car.tax_date_t),
        tax_exam: await checkNaN(car.tax_exem_t),
        tax_no: await checkNull(car.tax_no_t),
        tax_payment_date: result[15],
        tax_payment_date_old: await checkId(result[15], car.tax_payment_date_t),
        tax_payment_no: await checkNull(car.tax_payment_no_t),
        tax_permit: await checkNull(car.tax_permit_t),
        tax_receip: await checkNull(car.tax_receipt_t),
        tax: await checkNull(car.tax_t),
        technical_doc_date: result[16],
        technical_doc_date_old: await checkId(
          result[16],
          car.technical_doc_date_t
        ),
        technical_doc_no: await checkNull(car.technical_doc_no_t),
        technicalcheck: await checkNull(car.technicalcheck_t),
        tnic_date: await checkNull(car.tnic_date_t),
        tnic_expire_date: await checkNull(car.tnic_expire_date_t),
        tnic_result: await checkNull(car.tnic_result_t),
        update_time_old: await checkNull(car.update_time),
        datetime_update: result[17],
        vehicle_type_id: result[18],
        vehicle_type_old: await checkId(result[18], car.vehicletype_t),
        village_name: await checkNull(car.village_t),
        weight: await checkNull(car.weight_empty_t),
        weight_filled: await checkNull(car.weight_filled_t),
        total_weight: await checkNull(car.weight_total_t),
        wheels: await checkNull(car.wheels_t),
        width: await checkNull(car.width_t),
        year_manufacture: await checkNull(car.year_manufactured_t),
        vehicle_send: await checkNull(car.email_address_t),
      };
    })
    .catch((err) => {
      console.error(err);
      throw "Cleansing data error";
    });
}

async function checkNaN(value) {
  return isNaN(parseInt(value)) ? null : parseInt(value);
}

async function checkNull(value) {
  return value === null || value === "" ? null : value;
}

async function checkId(id, value) {
  return id === 99999 || id !== null ? value : null;
}

module.exports = {
  cleansingData,
};
