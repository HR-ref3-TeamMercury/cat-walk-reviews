const helpers = require('./helpers.js');
const db = require('../models');

module.exports = async (req, res) => {
let params = helpers.parseQuery({product_id: 1}, req._parsedUrl.query);
let result = {
  product_id: params.product_id,
  ratings: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  },
  recommended: {0: 0},
  characterisitics: {}
}

let reviews = await db.promise().query(`SELECT * FROM reviews WHERE product_id = ${params.product_id}`);
let characteristics = await db.promise().query(`SELECT * FROM characteristics WHERE product_id = ${params.product_id}`);

for (let {recommend, rating} of reviews[0]) {
  if (recommend === 'true') result.recommended['0']++;
  result.ratings[rating] += 1;
}

for (let char of characteristics[0]) {
  let char_reviews = await db.promise().query(`SELECT * FROM characteristic_reviews WHERE characteristic_id = ${char.id}`);
  let val = 0;
  if (char_reviews[0].length === 0) break;

  for (let {value} of char_reviews[0]) val += value;
  val /= char_reviews[0].length;

  result.characterisitics[char.name] = {
    id: char.id,
    value: String(val),
  }
}

res.send(result);
};