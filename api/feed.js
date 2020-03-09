const headers = require('../lib/headers.js');

module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: headers(event),
    body: JSON.stringify({ event }),
  };
  callback(null, response);
}