const fs = require("fs");
const mysql = require("mysql2");
const path = require('path');
const fastcsv = require("fast-csv");
const mysqlConfig = require('../config.js');

const fileName = '/characteristic_reviews.csv';
const filePath = path.join(__dirname, fileName);



let stream = fs.createReadStream(filePath, { encoding: 'utf8' });

let csvData = [];
// maxRows: {5000001}
let csvStream = fastcsv
  .parse({maxRows: 2000000}).on("data", data => {
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
          "INSERT INTO characteristic_reviews (id, characteristic_id, review_id, value) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });

  });

stream.pipe(csvStream);