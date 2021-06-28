const fs = require("fs");
const mysql = require("mysql2");
const path = require('path');
const fastcsv = require("fast-csv");
const mysqlConfig = require('../config.js');

const fileName = 'characteristics.csv';
const filePath = path.join(__dirname, fileName);



let stream = fs.createReadStream(filePath, { encoding: 'utf8' });

let csvData = [];
// console.log("STREAM: ", stream);
let csvStream = fastcsv
  .parse({maxRows: 5000000}).on("data", data => {
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
          "INSERT INTO characteristics (id, product_id, name) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });

  });

stream.pipe(csvStream);