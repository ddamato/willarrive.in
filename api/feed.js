const prepareHeaders = require('../lib/headers.js');
const { findFeed, findStationByCoords, findDeparturesByStation } = require('../lib/feed.js');

module.exports.handler = async (event, context, callback) => {
  const headers = prepareHeaders(event);

  const { queryStringParameters } = event;
  const { latitude, longitude } = queryStringParameters || {};

  if (latitude && longitude) {
    const station = findStationByCoords({ latitude, longitude });
    if (station) {
      const departures = await findDeparturesByStation(station, event);
    } 
  }

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify({ event }),
  };
  callback(null, response);
}