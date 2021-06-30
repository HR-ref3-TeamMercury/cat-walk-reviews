const helpers = require('./helpers.js');
const db = require('../models');

module.exports = async (req, res) => {
  const {review_id, type} = req.params;
  let review = await db.promise().query('SELECT reported, helpfulness FROM reviews WHERE id = ?', [review_id]);
  let {reported, helpfulness} = review[0][0];

  if (type === 'report') {
      reported = reported === 'true' ? 'false' : 'true';
      db.promise().query(`UPDATE reviews SET reported = '${reported}' WHERE id = ?`, [review_id]);
  } else if (type === 'helpful') {
      helpfulness += 1;
      db.promise().query(`UPDATE reviews SET helpfulness = ${helpfulness} WHERE id = ?`, [review_id]);
  }

  res.status(200).send('Updating a review was a success!');
}