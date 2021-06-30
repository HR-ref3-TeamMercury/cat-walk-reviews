const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('../db-mysql');;
const helpers = require('./helpers.js');

app.use(bodyParser.urlencoded({extended: true}));

// SELECT * FROM B right join On e

// SELECT * FROM reviews
// SELECT employees.first_name, employees.last_name, salaries.salary FROM employees LEFT JOIN salaries ON employees.emp_no = salaries.emp_no WHERE employees.emp_no = 10001;

// GROUP BY employees.emp_no;
// array_agg()
// employees.*


app.get('/reviews', async (req, res) => {
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
});

app.get('/reviews/meta', async (req, res) => {``
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
});

app.post('/reviews', async (req, res) => {
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
});

app.put(`/reviews/:review_id/:type`, async (req, res) => {
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
});






app.listen(4000, () => {
  console.log("Server is running port 4000")
});