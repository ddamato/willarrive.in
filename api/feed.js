const prepareHeaders = require('../lib/headers.js');
const { 
  getLineByEvent,
  findStationByCoords,
  findScheduleByStation
} = require('../lib/feed.js');

module.exports.handler = async (event, context, callback) => {
  const headers = prepareHeaders(event);

  const { queryStringParameters } = event;
  const { latitude, longitude } = queryStringParameters || {};

  let schedule = {};
  if (latitude && longitude) {
    const line = getLineByEvent(event);
    const station = findStationByCoords({ 
      latitude: Number(latitude),
      longitude: Number(longitude)
    });
    schedule = await findScheduleByStation(station, line);
  }

  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(schedule),
  };
  callback(null, response);
}