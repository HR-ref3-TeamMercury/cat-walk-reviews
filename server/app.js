const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('../db-mysql');;
const helpers = require('./helpers.js');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/reviews', async (req, res) => {
  let params = helpers.parseQuery({page: 1, count: 5, product_id: 1}, req._parsedUrl.query);

  // let joinQuery = 'INNER JOIN reviews_photos ON reviews.id = reviews_photos.review_id';
  let selectQuery = `SELECT * FROM reviews WHERE product_id = ?`;

  let reviews = await db.promise().query(selectQuery, [params.product_id]);

  for (let review of reviews[0]) {
    let photos = await db.promise().query('SELECT url FROM reviews_photos WHERE review_id = ?', [review.id]);
    review.photos = photos[0].map(photo => photo.url);
  }

  res.send(reviews[0]);
});

app.get('/reviews/meta', async (req, res) => {
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
  console.log('reviews: ', reviews[0]);
  let characteristics = await db.promise().query(`SELECT * FROM characteristics WHERE product_id = ${params.product_id}`);

  for (let review of reviews[0]) {
    if (review.recommend === 'true') result.recommended['0']++;
    result.ratings[review.rating] += 1;
  }

  for (let char of characteristics[0]) {
    let char_reviews = await db.promise().query(`SELECT * FROM characteristic_reviews WHERE characteristic_id = ${char.id}`);
    let val = 0;
    console.log('Char_reviews: ', char_reviews);
    if (char_reviews[0].length === 0) break;

    for (let {value} of char_reviews[0]) {
      console.log('val: ', val);
      val += value
    }
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

    let responsePostInsert = await db.promise().query(insertReviewQ);

    let reviewId = await db.promise().query(`SELECT max(id) FROM reviews;`);
    reviewId = reviewId[0][0]['max(id)']
    let insertPhotoQ = `INSERT INTO reviews_photos (review_id, url) VALUES (${reviewId}, '${review.photos}')`
    let responsePostPhotoInsert = await db.promise().query(insertPhotoQ);


    res.status(200).send('Adding a review was a success!')
});




app.put('/reviews/:review_id/helpful', async (req, res) => {

});

app.put('/reviews/:review_id/report', async (req, res) => {

});






app.listen(4000, () => {
  console.log("Server is running port 4000")
});