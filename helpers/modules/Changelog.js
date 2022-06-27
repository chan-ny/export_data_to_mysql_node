// const axios = require('axios')

// async function getNewChangelog (noteId) {
//   return await axios.get(`http://vdvclao.org/thongpong/c/action/print-history/note_id=${encodeURIComponent(noteId)}`)
//     .then(result => {
//       const data = result.data
//       const firstIndex = data.indexOf('<body>')
//       const lastIndex = data.indexOf('</body>')
//       return data.substring(firstIndex + 6, lastIndex) // 6 is <body> length
//     })
//     .catch(err => {
//       return err.code
//     })
// }


// async function splitChangelog (changelog) {
//   const array = changelog.split('<BR><BR>')
//   const array2 = []
//   for (let i = 0; i < array.length; i++) {
//     const arr = await array[i].split('<BR>')
//     array2.push(arr)
//   }
//   await array2[0].splice(0, 1)
//   await array2[array2.length - 1].splice(-1)

//   var text = ''
//   for (let i = 0; i < array2.length; i++) {
//     for (let j = 0; j < array2[i].length; j++) {
//       text = text + `${array2[i][j]}\n`
//     }
//     text = text + '\n'
//   }

//   return text
// }

// async function splitLog (log) {
//   var text = ''
//   for (let i = 0; i < log.length; i++) {
//     text = text + `${log[i].veh_log_datetime}\n${log[i].veh_log_field_name}: ${!log[i].veh_log_data_from ? 'Null' : log[i].veh_log_data_from} to ${log[i].veh_log_data_to}\n\n`
//   }
//   return text
// }

// module.exports = {
//   getNewChangelog,
//   splitChangelog,
//   splitLog
// }