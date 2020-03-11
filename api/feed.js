const path = require('path');
const nunjucks = require('nunjucks');
const prepareHeaders = require('../lib/headers.js');
const certainty = require('../lib/certainty.js');
const { 
  getLineByEvent,
  findNearestStop,
  parseArrivals,
} = require('../lib/feed.js');
const mta = require('../lib/mta.js');

const FEED_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'feed.njk');

module.exports.handler = async (event, context, callback) => {
  const headers = prepareHeaders(event);

  const response = {
    statusCode: 200,
    headers,
    body: 'Not found',
  }

  const { queryStringParameters } = event;
  const { latitude, longitude } = queryStringParameters || {};

  if (latitude && longitude) {
    const randomIndex = Math.floor(Math.random() * certainty.length);
    const line = getLineByEvent(event);
    const stops = await mta(line);
    const stop = findNearestStop(stops, Number(latitude), Number(longitude));
    const arrivals = parseArrivals(stop);
    response.body = nunjucks.render(FEED_NJK_PATH, {
      line,
      certainty: certainty[randomIndex],
      stopName: stop.name,
      arrivals,
    });
  }
  callback(null, response);
}