const prepareHeaders = require('../lib/headers.js');

module.exports.handler = (event, context, callback) => {
  const headers = prepareHeaders(event);
  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify({ event }),
  };
  callback(null, response);
}