const path = require('path');
const nunjucks = require('nunjucks');
const { findFeedByEvent, getLineByEvent } = require('../lib/feed.js');

const TIMETABLE_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'timetable.njk');

module.exports.handler = (event, context, callback) => {
  const Location = 'https://willarrive.in';
  let response = {
    statusCode: 302,
    headers: { Location }
  }

  const feed = findFeedByEvent(event);
  if (feed) {
    const body = nunjucks.render(TIMETABLE_NJK_PATH, {
      routeId: getLineByEvent(event),
      backgroundColor: feed.lineColor,
      foregroundColor: feed.foregroundColor,
    });
    response = {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body,
    }
  }

  callback(null, response);
}