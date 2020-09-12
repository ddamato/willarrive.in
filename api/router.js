const path = require('path');
const nunjucks = require('nunjucks');
const { findFeedByEvent, getLineByEvent } = require('../lib/feed.js');
const getResource = require('../lib/resource.js');

const INDEX_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'index.njk');

module.exports.handler = (event, context, callback) => {
  const Location = 'https://willarrive.in';
  let response = {
    statusCode: 302,
    headers: { Location }
  }

  const feed = findFeedByEvent(event);
  if (feed) {
    const data =  {
      routeId: getLineByEvent(event),
      backgroundColor: feed.lineColor,
      foregroundColor: feed.foregroundColor,
      base: Location,
    };

    const { queryStringParameters } = event;
    if (queryStringParameters) {
      response = getResource(queryStringParameters, data);
    } else {
      response = {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: nunjucks.render(INDEX_NJK_PATH, data),
      }
    }
  }

  callback(null, response);
}