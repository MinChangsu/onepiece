export const unescapeHTML = (val) => {
  return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
};

export const bobuToJibunStr = (bobn, bubn) => {
  let boNum = parseInt(bobn);
  let buNum = parseInt(bubn);
  let rtn = '';
  if (buNum === 0) {
    rtn = boNum + '번지';
  } else {
    rtn = boNum + '-' + buNum + '번지';
  }
  return rtn;
};
