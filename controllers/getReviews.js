const helpers = require('./helpers.js');
const db = require('../models');

module.exports = async (req, res) => {
  let params = helpers.parseQuery({page: 1, count: 5, product_id: 1}, req._parsedUrl.query);

  let selectQuery = `SELECT reviews.*, GROUP_CONCAT(reviews_photos.url) AS photos FROM reviews
     LEFT JOIN reviews_photos
        ON reviews.id = reviews_photos.review_id
     WHERE product_id = ?
     GROUP BY reviews.id`;

  let reviews = await db.promise().query(selectQuery, [params.product_id]);
  for (let review of reviews[0]) {
    review.photos = review.photos === null ? [] : review.photos.split(',');
  }

  res.send(reviews[0]);
}