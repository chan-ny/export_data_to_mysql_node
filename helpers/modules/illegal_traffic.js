module.exports = {
  fineDate(value) {
    if (value.finedate_t !== null) {
      let finedate = value.finedate_t.match(/\d{1,2}([\/.-])\d{1,2}\1\d{2,4}/g);
      let data = "";
      if (finedate !== null) {
        //finedate
        let maxfinedate = finedate.length;
        if (maxfinedate >= 2) {
          data = finedate[maxfinedate - 1];
        } else {
          data = finedate[0];
        }
      } else {
        data = value.finedate_t;
      }
      return data;
    }
  },

  ReleasDate(value) {
    if (value.releasedate_t !== null) {
      let releasdate = value.releasedate_t.match(
        /\d{1,2}\D\d{1,2}\D(\d{2,4})/g
      );
      //releasdate
      let maxarray = releasdate.length;
      let data = "";
      if (maxarray >= 2) {
        data = releasdate[maxarray - 1];
      } else {
        data = releasdate[0];
      }
      return data;
    }
  },

  fineLog(value) {
    if (value.finelog_t !== null) {
      return value.finelog_t;
    }
  },
};
