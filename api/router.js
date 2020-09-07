const path = require('path');
const nunjucks = require('nunjucks');
const { findFeedByEvent, getLineByEvent } = require('../lib/feed.js');

const INDEX_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'index.njk');

module.exports.handler = (event, context, callback) => {
  const Location = 'https://willarrive.in';
  let response = {
    statusCode: 302,
    headers: { Location }
  }

  const feed = findFeedByEvent(event);
  if (feed) {
    let body;
    const resource = event.requestContext.path;
    if (resource !== '/') {
      body = 'hello world';
    }
    body = nunjucks.render(INDEX_NJK_PATH, {
      routeId: getLineByEvent(event),
      backgroundColor: feed.lineColor,
      foregroundColor: feed.foregroundColor,
      base: Location,
    });
    response = {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body,
    }
  }

  callback(null, response);
}