const fs = require('fs');
const path = require('path');
const mime = require('mime');
const nunjucks = require('nunjucks');

module.exports = function(queryStringParameters, data) {
  const { file } = queryStringParameters;
  const resource = file && path.resolve(__dirname, '..', 'templates', file);
  const response = {
    statusCode: 404,
    body: JSON.stringify({ queryStringParameters }),
  }

  if (resource && fs.existsSync(resource)) {
    response.statusCode = 200;
    response.headers = { 'Content-Type': mime.getType(file) };
    response.body = nunjucks.render(resource, data);
  }

  return response;
}