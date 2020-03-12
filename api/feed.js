const path = require('path');
const nunjucks = require('nunjucks');
const prepareHeaders = require('../lib/headers.js');
const certainties = require('../lib/certainty.js');
const { 
  getLineByEvent,
  findNearestStop,
  parseArrivals,
} = require('../lib/feed.js');
const {
  getScheduleByLine,
  getScheduleByStopId,
} = require('../lib/mta.js');

const FEED_NJK_PATH = path.resolve(__dirname, '..', 'templates', 'feed.njk');

module.exports.handler = async (event, context, callback) => {
  const headers = prepareHeaders(event);

  const response = {
    statusCode: 200,
    headers,
    body: 'Not found',
  }

  const { queryStringParameters } = event;
  const { latitude, longitude, station } = queryStringParameters || {};
  const line = getLineByEvent(event);

  if (latitude && longitude) {
    const content = await getArrivalsByCoords(line, latitude, longitude);
    response.body = nunjucks.render(FEED_NJK_PATH, content);
  } else if (station) {
    const content = await getArrivalsByStation(decodeURIComponent(station));
    response.body = nunjucks.render(FEED_NJK_PATH, content);
  }

  callback(null, response);
}

async function getArrivalsByCoords(line, latitude, longitude) {
  const stops = await getScheduleByLine(line);
  const stop = findNearestStop(stops, Number(latitude), Number(longitude));
  return {
    line: getLineFromRouteId(stop.routeId),
    certainty: getRandomCertainty(),
    stopName: stop.name,
    stopId: stop.id,
    arrivals: parseArrivals(stop),
  }
}

async function getArrivalsByStation(station) {
  const stops = await getScheduleByStopId(station);
  const stop = stops.shift();
  return {
    line: getLineFromRouteId(stop.routeId),
    certainty: getRandomCertainty(),
    stopName: stop.name,
    stopId: stop.id,
    arrivals: parseArrivals(stop),
  }
}

function getLineFromRouteId(routeId) {
  return routeId.replace('MTASBWY:', '');
}

function getRandomCertainty() {
  const randomIndex = Math.floor(Math.random() * certainties.length);
  return certainties[randomIndex];
}