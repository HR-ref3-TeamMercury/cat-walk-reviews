let parseQuery = (paramObj, parsedQuery) => {
  if (parsedQuery !== undefined) {
    let pairs = parsedQuery.split('&').map(pair => pair.split('='));
    pairs.forEach(([key, val]) =>{
      if (val.includes('%')) {
        let str = val.split('%20').join(' ');
        str = str.slice(3, str.length - 3);
        paramObj[key] = str;
      } else {
        paramObj[key] = +val;
      }

    })
  }

  return paramObj;
}

module.exports = {
  parseQuery,
}