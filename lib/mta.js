const fetch = require('node-fetch');

const STOPS_FOR_ROUTE_BASE = 'https://collector-otp-prod.camsys-apps.com/schedule/MTASBWY/stopsForRoute';
const NEARBY_STOPS_BASE = 'https://otp-mta-prod.camsys-apps.com/otp/routers/default/nearby';

function startsWith(input) {
  if (input.toUpperCase() === 'S') {
    input = 'GS';
  }

  if (!input.startsWith('MTASBWY')) {
    input = `MTASBWY:${input}`;
  }
  return input.toUpperCase();
}

async function getAllStopsByLine(line) {
  const params = new URLSearchParams({
    apikey: process.env.WAI_ROUTE_STOPS_KEY,
    routeId: startsWith(line),
  });
  try {
    return await fetch(`${STOPS_FOR_ROUTE_BASE}?${params.toString()}`).then((res) => res.json());
  } catch (err) {
    throw new Error(err);
  }
}

async function getDetailsByStopIds(stopIds) {
  const stops = [].concat(stopIds).filter(Boolean).map(startsWith);
  const params = new URLSearchParams({
    apikey: process.env.WAI_NEARBY_STOPS_KEY,
    stops,
  });
  try {
    return await fetch(`${NEARBY_STOPS_BASE}?${params.toString()}`).then((res) => res.json());
  } catch (err) {
    throw new Error(err);
  }
}

async function transformDetails(details, stops) {
  return details.map(({ stop, groups }) => {
    const relatedStop = Array.isArray(stops) 
      ? stops.find(({ stopId }) => stopId === stop.id)
      : {};
    const config = {
      latitude: stop.lat,
      longitude: stop.lon,
      groups,
    };
    return Object.assign(stop, relatedStop, config);
  });
}

async function getScheduleByStopId(stopId) {
  const details = await getDetailsByStopIds(stopId);
  return transformDetails(details);
}

async function getScheduleByLine(line) {
  const stops = await getAllStopsByLine(line);
  const stopIds = stops.map(({ stopId }) => stopId);
  const details = await getDetailsByStopIds(stopIds);
  return transformDetails(details, stops);
}

module.exports = {
  getScheduleByStopId,
  getScheduleByLine,
}