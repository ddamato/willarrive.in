const path = require('path');
const nunjucks = require('nunjucks');

const TIMETABLE_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'timetable.njk');

module.exports.handler = async (event, context) => {
  return JSON.stringify({ event, context });

  // return nunjucks.render(TIMETABLE_NJK_PATH, { });
}