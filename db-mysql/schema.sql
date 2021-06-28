DROP DATABASE IF EXISTS catwalk_sdc;
CREATE DATABASE catwalk_sdc;
USE catwalk_sdc;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS char_reviews;
DROP TABLE IF EXISTS chars;


CREATE TABLE reviews (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date VARCHAR(300) NOT NULL,
  summary VARCHAR(200) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend VARCHAR(15) NOT NULL,
  reported VARCHAR(15) NOT NULL,
  reviewer_name VARCHAR(40) NOT NULL,
  reviewer_email VARCHAR(80) NOT NULL,
  response VARCHAR(300) NULL,
  helpfulness INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE reviews_photos (
  id INTEGER NOT NULL AUTO_INCREMENT,
  review_id INTEGER NOT NULL,
  url VARCHAR(300) NOT NULL,
  PRIMARY KEY (id)
);






CREATE TABLE characteristics (
  id INTEGER NOT NULL AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  name VARCHAR(40) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE characteristic_reviews (
  id INT NOT NULL AUTO_INCREMENT,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (id)
);