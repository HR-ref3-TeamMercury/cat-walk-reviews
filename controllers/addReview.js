const helpers = require('./helpers.js');
const db = require('../models');

module.exports = async (req, res) => {
  let review = helpers.parseQuery({}, req._parsedUrl.query);
  let {product_id, rating, summary, body, recommend, name, email, photos, characterisitics} = review;
  let today = String(Date.now());

  let insertReviewQ = `INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${product_id}, ${rating}, ${today}, '${summary}', '${body}', '${recommend}','${review.reported || false}', '${name}', '${email}', ${review.response || null}, ${review.helpfulness || 0});`;

  await db.promise().query(insertReviewQ);

  let reviewId = await db.promise().query(`SELECT max(id) FROM reviews;`);
  reviewId = reviewId[0][0]['max(id)']
  let insertPhotoQ = `INSERT INTO reviews_photos (review_id, url) VALUES (${reviewId}, '${review.photos}')`
  await db.promise().query(insertPhotoQ);

  res.status(200).send('Adding a review was a success!')
}