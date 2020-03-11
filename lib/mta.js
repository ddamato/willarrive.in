const fetch = require('node-fetch');

const STOPS_FOR_ROUTE_BASE = 'https://collector-otp-prod.camsys-apps.com/schedule/MTASBWY/stopsForRoute';
const NEARBY_STOPS_BASE = 'https://otp-mta-prod.camsys-apps.com/otp/routers/default/nearby';

function startsWith(input) {
  if (!input.startsWith('MTASBWY')) {
    input = `MTASBWY:${input}`;
  }
  return input.toUpperCase();
}

async function allStops(line) {
  const params = new URLSearchParams({
    apikey: process.env.WAI_ROUTE_STOPS_KEY,
    routeId: startsWith(line),
  });
  return await fetch(`${STOPS_FOR_ROUTE_BASE}?${params.toString()}`).then((res) => res.json());
}

async function nearbyStops(stops) {
  stops = [].concat(stops).filter(Boolean).map(startsWith);
  const params = new URLSearchParams({
    apikey: process.env.WAI_NEARBY_STOPS_KEY,
    stops,
  });
  return await fetch(`${NEARBY_STOPS_BASE}?${params.toString()}`).then((res) => res.json());
}

module.exports = async function(line) {
  const stops = await allStops(line);
  const stopIds = stops.map(({ stopId }) => stopId);
  const nearby = await nearbyStops(stopIds);
  return nearby.map(({ stop, groups }) => {
    const relatedStop = stops.find(({ stopId }) => stopId === stop.id);
    const config = {
      latitude: stop.lat,
      longitude: stop.lon,
      groups,
    };
    return Object.assign(stop, relatedStop, config);
  });
}