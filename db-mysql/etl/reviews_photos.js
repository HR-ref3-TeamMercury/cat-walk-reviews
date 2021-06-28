const fs = require("fs");
const mysql = require("mysql2");
const path = require('path');
const fastcsv = require("fast-csv");
const mysqlConfig = require('../config.js');

const fileName = 'reviews_photos.csv';
const filePath = path.join(__dirname, fileName);

let stream = fs.createReadStream(filePath, { encoding: 'utf8' });

let csvData = [];
let csvStream = fastcsv
  .parse({maxRows: 5000001}).on("data", data => {
    csvData.push(data);
  }).on("end", () => {
    // remove the first line: header
    csvData.shift();
    // create a new connection to the database
    const connection = mysql.createConnection(mysqlConfig);

    // open the connection
    connection.connect(err => {

      if (err) console.error(err);
      else {
        let query =
          "INSERT INTO reviews_photos (id, review_id, url) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });

  });

stream.pipe(csvStream);