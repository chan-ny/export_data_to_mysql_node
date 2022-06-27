const clc = require("cli-color");

async function compareValue(rawData, compareData) {
  const index = await compareData
    .map((e) => {
      return e.name;
    })
    .indexOf(rawData);
  return index === -1 || !compareData[index].id ? 99999 : compareData[index].id;
}

async function compareProvinceAndDistrict(province, district, compareData) {
  const provIndex = await compareData.findIndex(
    (value) => value.province === province
  );
  if (provIndex !== -1 && compareData[provIndex].province_code) {
    const bothIndex = await compareData.findIndex(
      (value) => value.province === province && value.district === district
    );
    if (bothIndex !== -1) {
      return {
        province: `0${compareData[bothIndex].province_code}`.substr(-2),
        district: compareData[bothIndex].district_code
          ? `0${compareData[bothIndex].district_code}`.substr(-4)
          : 99999,
      };
    } else {
      return {
        province: `0${compareData[provIndex].province_code}`.substr(-2),
        district: 99999,
      };
    }
  } else {
    return {
      province: 99999,
      district: 99999,
    };
  }
}

async function compareBrandAndModel(brand, model, compareData, brandArr) {
  let brandIndex = 0;
  if (brand === null) {
    brandIndex = await brandArr.findIndex((value) =>
      value.name ? value.name.toUpperCase() === brand : ""
    );
  } else {
    brandIndex = await brandArr.findIndex((value) =>
      value.name
        ? value.name.toUpperCase() === brand.toUpperCase()
        : "" === brand.toUpperCase()
    );
  }
  if (brandIndex !== -1 && brandArr[brandIndex].id) {
    const brandId = brandArr[brandIndex].id;
    // const bothIndex = await compareData.findIndex(value => value.brand_id === brandId && !value.model ? value.model.toString().toUpperCase() : '' === model.toUpperCase())
    let bothIndex = 0;
    if (model === null) {
      bothIndex = await compareData.findIndex((value) => {
        const str = value.model ? value.model.toString() : "";
        return str.toUpperCase() === model;
      });
    } else {
      bothIndex = await compareData.findIndex((value) => {
        const str = value.model ? value.model.toString() : "";
        return str.toUpperCase() === model.toUpperCase();
      });
    }
    if (bothIndex !== -1) {
      return {
        brand: brandId,
        model: compareData[bothIndex].model_id
          ? compareData[bothIndex].model_id
          : 99999,
      };
    } else {
      return {
        brand: brandId,
        model: 99999,
      };
    }
  } else {
    return {
      brand: 99999,
      model: 99999,
    };
  }
}

async function checkDate(date, ...flag) {
  let dateTime = null;
  let time = "00:00:00";
  const format1 = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // DD/MM/YYYY
  const format2 = /^\d{1,2}\/\d{1,2}\/\d{2}$/; // DD/MM/YY
  const format3 = /^\d{1,2}\.\d{1,2}\.\d{4}$/; // DD.MM.YYYY
  const format4 = /^\d{1,2}\.\d{1,2}\.\d{2}$/; // DD.MM.YY
  const format5 = /^\d{1,2}-\d{1,2}-\d{4}$/; // DD-MM-YYYY
  const format6 = /^\d{1,2}-\d{1,2}-\d{2}$/; // DD-MM-YY

  const format7 = /^\d{4}\/\d{1,2}\/\d{1,2}$/; // YYYY/MM/DD
  const format8 = /^\d{4}\.\d{1,2}\.\d{1,2}$/; // YYYY.MM.DD
  const format9 = /^\d{4}-\d{1,2}-\d{1,2}$/; // YYYY-MM-DD

  const format10 = /^(\d{4}\/\d{1,2}\/\d{1,2})T(\d{2}:\d{2}:\d{2})Z$/; // YYYY/MM/DDTHH:MM:SSZ
  const format11 = /^(\d{4}-\d{1,2}-\d{1,2})T(\d{2}:\d{2}:\d{2})Z$/; // YYYY-MM-DDTHH:MM:SSZ
  const format12 = /^(\d{4}.\d{1,2}.\d{1,2})T(\d{2}:\d{2}:\d{2})Z$/; // YYYY.MM.DDTHH:MM:SSZ

  const format13 = /^(\d{4}\/\d{1,2}\/\d{1,2}) (\d{2}:\d{2}:\d{2})$/; // YYYY/MM/DD HH:MM:SS
  const format14 = /^(\d{4}-\d{1,2}-\d{1,2}) (\d{2}:\d{2}:\d{2})$/; // YYYY-MM-DD HH:MM:SS
  const format15 = /^(\d{4}.\d{1,2}.\d{1,2}) (\d{2}:\d{2}:\d{2})$/; // YYYY.MM.DD HH:MM:SS

  if (
    format1.test(date) ||
    format2.test(date) ||
    format3.test(date) ||
    format4.test(date) ||
    format5.test(date) ||
    format6.test(date)
  ) {
    const currentDate = new Date();
    const currentYear = `${currentDate.getFullYear()}`.substr(-2);
    const newDate = date.replace(/\//g, "-").replace(/\./g, "-");
    const arr = newDate.split("-");
    arr[2] =
      arr[2].length === 4
        ? arr[2]
        : flag.length > 0
        ? Number(arr[2]) >= 0 && Number(arr[2]) <= Number(currentYear) + 6
          ? `20${arr[2]}`
          : null
        : Number(arr[2]) > Number(currentYear)
        ? `19${arr[2]}`
        : `20${arr[2]}`;
    dateTime = `${arr[2]}-${`0${arr[1]}`.substr(-2)}-${`0${arr[0]}`.substr(
      -2
    )} ${time}`;
    return arr[2] === null ? null : dateTime;
  } else if (format7.test(date) || format8.test(date) || format9.test(date)) {
    const newDate = date.replace(/\//g, "-").replace(/\./g, "-");
    const arr = newDate.split("-");
    dateTime = `${arr[0]}-${`0${arr[1]}`.substr(-2)}-${`0${arr[2]}`.substr(
      -2
    )} ${time}`;
    return dateTime;
  } else if (
    format10.test(date) ||
    format11.test(date) ||
    format12.test(date) ||
    format13.test(date) ||
    format14.test(date) ||
    format15.test(date)
  ) {
    const newDate = date
      .replace(/\//g, "-")
      .replace(/\./g, "-")
      .replace("T", " ")
      .replace("Z", "");
    dateTime = newDate;
    return dateTime;
  } else {
    return dateTime;
  }
}
// async function compareDistrict (rawData, compareData, province) {
//   if (province === '999') {
//     return '999'
//   } else {
//     const index = await compareData.map((e) => {
//       return e.name
//     }).indexOf(rawData)
//     return index === -1 || !compareData[index].id ? '999' : await checkDistrictId(compareData[index], province)
//   }
// }

// async function checkDistrictId (value, province) {
//   if (value.id === '3-139') {
//     if (province === '01') {
//       return '0103'
//     } else {
//       return '1701'
//     }
//   } else if (value.id === '43-82') {
//     if (province === '06') {
//       return '0610'
//     } else {
//       return '1009'
//     }
//   } else if (value.id === '44-134') {
//     if (province === '06') {
//       return '0611'
//     } else {
//       return '1606'
//     }
//   } else {
//     return value.code
//   }
// }

// async function compareColor (rawData) {
//   const arrColor = [
//     ['ຟ້າ', 'ຟາ', 'ນ້ຳເງີນ', 'ນ້ຳເງິນ', 'ນໍ້າເງີນ', 'ນໍ້າເງິນ', 'ທະເລ', 'ນ້ຳາເງິນ', 'ຝັງ', 'ພ້າ', 'ຟ້', 'ຟເ້', 'ຟເາ', 'ຟເໍ້າ', 'ຟຳ', 'ຟັາ'], // Blue
//     ['ນ້ຳຕານ', 'ນ້ຳນຕານ', 'ນໍ້າຕານ', 'ກາເຟ', '​ນໍ້​ຕານ', 'ນຳ້ຕານ', 'ດິນ', 'ດີນ', 'ນຳຕານ', 'ນຳ້າຕານ', 'ນໍ້າຕາ'], // Brown
//     ['ທອງ', 'ຄຳ', 'ຄໍາ', 'ທອ ງ', 'ທອນ', 'ທອຝງ'], // Gold
//     ['ເຖົ່າ', 'ເທົ້າ', 'ເທົາ', 'ເທົ່າ', 'ເົທົ່າ', 'ເທົ', 'ທົາ', 'ເທາ', 'ເທັົາ', 'ມົ່ນ', 'ມົ້ມ', 'ມົນ'], // Grey
//     ['ສົ້ມ', 'ສົົ້ມ', 'ສົ້0ມ', 'ສົ້', 'ສົົ້', 'ສົ້ນ', 'ສົົ້ນ'], // Orange
//     ['ບົວ', 'ສົມພູ', 'ຊົມພູ', 'ສົມພູ', 'ຊົມຜູ', 'ຊົມພຸ', 'ບວ', 'ບົດ', 'ບົ', 'ບົົວ'], // Pink
//     ['ມ່ວງ', 'ມ້ວງ', 'ມ໋ອງ', 'ມກ', 'ມວ້າງ', 'ມ່ວນ', 'ມວ້ງ', 'ມວງ', 'ມອນ', 'ມັງຄຸດ', 'ມຸງກຸດ', 'ມຸງຄຸດ', 'ຫມົນ'], // Purple
//     ['ເງິນ', 'ເງີນ', 'ເງິີນ', 'ເງີ', 'ງິນ', 'ງີນ', 'ເງິິນ', 'ເງີຍ', 'ເງີິນ', 'ເງີີນ', 'ເງືນ'], // Silver
//     ['ເຫຼືອງ', 'ເຫຼຶອງ', 'ເຫລືອງ', 'ເຫືລອງ', 'ເຫືຼອງ', 'ເຫືອງ', 'ເຫີລອງ', 'ເຫີອງ', 'ເຫືຼລອງ', 'ຫລືອງ', 'ຫຼືອງ', 'ເທລືອງ', 'ເຫລື່ອງ', 'ເຫລືອ*', 'ເຫີຼໍອງ', 'ເຫຶ້ຼອງ', 'ເຫື້ອງ', 'ເຫືລງ', 'ເຫືຼອງ', 'ເຫືຼືອງ', 'ເຫູ່ອງ', 'ເຫູືອງ', 'ເຫູຼືອງ', 'ເຫູືອ', 'ເຫຼອງ', 'ເຫຼີອງ', 'ເຫຼຶອງ', 'ເຫຼືອ', 'ເຫຼືອ', 'ເຫຼືຶອງ', 'ເຫຼືືອງ', 'ເຫຼຼືອງ'], // Yellow
//     ['ຂາວ', 'ງາຊ້າງ', 'ຂ!ວ', 'ຂສວ', 'ຂຍວ', 'ຂາາວ', 'ມຸກ', 'ຊາວ', 'ໄຂ່', 'ໃຂ່', 'ຂາສ'], // White
//     ['ແດງ', 'ເດງ​', 'ເເດງ', 'ແດວ', 'ແດ', 'ແດກງ', 'ເເດ', 'ແດດງ'], // Red
//     ['ດຳ', 'ດໍາ', 'ດໍ'], // Black
//     ['ຂຽວ', 'ຂ)ຽວ', 'ຂຽ໌', 'ຂຽ%', 'ຂຽ', 'ຂຽງ', 'ຂຽດ', 'ຂຽນ', 'ຈຽວ', 'ຊຽວ', 'ຂຽຽວ'], // Green
//     ['ຮຸ້ງ'], // Rainbow
//     ['ຄຣີມ', 'ຄຮີມ', 'ຄຣິມ', 'ຄຣຼີມ', 'ຄີມ', 'ຄຼິມ', 'ຄຼີມ', 'ຄີຼມ', 'ຄິຼມ', 'ຄິີມ', 'ຄິມ', 'ຄິຣມ', 'ຄີຣມ', 'ຄາມ'], // Cream
//     ['ປອນ', 'ປອຍ', 'ບອນ', 'ປອແນ', 'ປອຶນ', 'ປອ ນ', 'ຜອນ', 'ປອງ', 'ປອຍ', 'ປອດ', 'ປອ', 'ປອຣ', 'ປອຮ', 'ປອອນ', 'ປອານ', 'ປອາ'], //Bronze
//     ['ກຳ', 'ກໍາ'], // Navy
//     ['ຕັບຫມູ', 'ຕັບໜູ', 'ຕັຍໝູ', 'ຕັນໜູ', 'ຕັບ​ໝູ', 'ຕັບມູ', 'ຕັບຫູນ', 'ຕັບຫູມ'] // Crimson
//   ]
//   var count = 0
//   var countBlue = 0 // นับว่ามีสีที่เขียนว่า 'ນ້ຳເງີນ' มั้ยถ้ามีข้ามไม่นับสี 'ເງິນ'
//   const findColor = []
//   for (let i = 0; i < arrColor.length; i++) {
//     for (let j = 0; j < arrColor[i].length; j++) {
//       const index = await rawData.indexOf(arrColor[i][j])
//       if (i === 7 && countBlue > 0) {
//         break
//       } else if (index !== -1) {
//         if ((i === 0 && j === 2) || (i === 0 && j === 3) || (i === 0 && j === 4) || (i === 0 && j === 5)) {
//           countBlue++
//         }
//         const arrIndex = await findColor.map(value => {
//           return value.color
//         }).indexOf(arrColor[i][0])
//         if (arrIndex === -1) {
//           count++
//           findColor.push({
//             color: arrColor[i][0],
//             index: index
//           })
//         }
//         // break
//       }
//     }
//   }
//   return count > 2 || count === 0 ? 999 : await checkColorId(findColor, count)
// }

// async function checkColorId (arr, count) {
//   var color = 'ສີ'
//   await arr.sort((a, b) => (a.index > b.index) ? 1 : -1)
//   if (count > 2) {
//     return 999
//   } else if (count === 2) {
//     color = color + arr[0].color + arr[1].color
//   } else {
//     color = color + arr[0].color
//   }
//   return await Color.findAll({ where: { name: color } })
//     .then(result => {
//       return result[0].id
//     })
//     .catch(_ => {
//       return 999
//     })
// }

module.exports = {
  compareValue,
  compareProvinceAndDistrict,
  compareBrandAndModel,
  checkDate,
};
