const fetch = require('node-fetch');

const STOPS_FOR_ROUTE_BASE = 'https://collector-otp-prod.camsys-apps.com/schedule/MTASBWY/stopsForRoute';
const NEARBY_STOPS_BASE = 'https://otp-mta-prod.camsys-apps.com/otp/routers/default/nearby';

function startsWith(input) {
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
  return await fetch(`${STOPS_FOR_ROUTE_BASE}?${params.toString()}`).then((res) => res.json());
}

async function getDetailsByStopIds(stopIds) {
  const stops = [].concat(stopIds).filter(Boolean).map(startsWith);
  const params = new URLSearchParams({
    apikey: process.env.WAI_NEARBY_STOPS_KEY,
    stops,
  });
  return await fetch(`${NEARBY_STOPS_BASE}?${params.toString()}`).then((res) => res.json());
}

async function mergeDetailsWithStops(details, stops) {
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

module.exports = async function(line) {
  const stops = await getAllStopsByLine(line);
  const stopIds = stops.map(({ stopId }) => stopId);
  const details = await getDetailsByStopIds(stopIds);
  return mergeDetailsWithStops(details, stops);
}