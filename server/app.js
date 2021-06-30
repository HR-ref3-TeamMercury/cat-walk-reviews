const express = require('express');
const app = express();

const getReviewsController = require('../controllers/getReviews');
const getMetaReviewsController = require('../controllers/getMetaReviews');
const addReviewController = require('../controllers/addReview');
const updateReviewController = require('../controllers/updateReview');

app.get('/reviews', getReviewsController);
app.get('/reviews/meta', getMetaReviewsController);
app.post('/reviews', addReviewController);
app.put(`/reviews/:review_id/:type`, updateReviewController);


app.listen(4000, () => {
  console.log("Server is running port 4000")
});