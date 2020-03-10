const path = require('path');
const nunjucks = require('nunjucks');
const { findFeedByEvent } = require('../lib/feed.js');

const TIMETABLE_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'timetable.njk');

module.exports.handler = (event, context, callback) => {
  const Location = 'https://willarrive.in';
  let response = {
    statusCode: 302,
    headers: { Location }
  }

  const feed = findFeedByEvent(event);
  if (feed) {
    response = {
      statusCode: 200,
      body: JSON.stringify({ feed }),
    }
  }

  // return nunjucks.render(TIMETABLE_NJK_PATH, { });

  callback(null, response);
}