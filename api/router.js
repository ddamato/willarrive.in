const path = require('path');
const nunjucks = require('nunjucks');

const TIMETABLE_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'timetable.njk');

module.exports.handler = (event, context, callback) => {
  // domainPrefix.willarrive.in
  const { domainPrefix } = event.requestContext || {};

  const response = {
    statusCode: 200,
    body: JSON.stringify({ domainPrefix })
  };

  // return nunjucks.render(TIMETABLE_NJK_PATH, { });

  callback(null, response);
}