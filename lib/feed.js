
const stations = require('mta-subway-stations');
const { createClient } = require('mta-realtime-subway-departures');
const geolib = require('geolib');
const { WAI_MTA_API_KEY } = process.env;

const client = createClient(WAI_MTA_API_KEY);

const boroughs = {
  Bx: 'Bronx',
  Bk: 'Brooklyn',
  M: 'Manhattan',
  Q: 'Queens',
  SI: 'Staten Island'
}

const feeds = [{
  id: 1,
  lines: ['1', '2', '3'],
  lineColor: '#ee352e',
  foregroundColor: '#ffffff',
}, {
  id: 1,
  lines: ['4', '5', '6'],
  lineColor: '#00933c',
  foregroundColor: '#ffffff',
}, {
  id: 1,
  lines: ['S'],
  lineColor: '#808183',
  foregroundColor: '#ffffff',
}, {
  id: 26,
  lines: ['A', 'C', 'E'],
  lineColor: '#2850ad',
  foregroundColor: '#ffffff',
}, {
  id: 16,
  lines: ['N', 'Q', 'R', 'W'],
  lineColor: '#fccc0a',
  foregroundColor: '#000000',
}, {
  id: 21,
  lines: ['B', 'D', 'F', 'M'],
  lineColor: '#ff6319',
  foregroundColor: '#ffffff',
}, {
  id: 2,
  lines: ['L'],
  lineColor: '#a7a9ac',
  foregroundColor: '#ffffff',
}, {
  id: 31,
  lines: ['G'],
  lineColor: '#6cbe45',
  foregroundColor: '#ffffff',
}, {
  id: 36,
  lines: ['J', 'Z'],
  lineColor: '#996633',
  foregroundColor: '#ffffff',
}, {
  id: 51,
  lines: ['7'],
  lineColor: '#b933ad',
  foregroundColor: '#ffffff',
}];

function findFeedByEvent(event) {
  const line = getLineByEvent(event);
  return feeds.find(({ lines }) => lines.includes(line.toUpperCase()));
}

function getLineByEvent({ requestContext }) {
  // domainPrefix.willarrive.in
  const { domainPrefix } = requestContext || {};
  if (!domainPrefix) {
    return null;
  }
  return domainPrefix.toLowerCase();
}

function findStationByCoords(coords) {
  const positions = stations.map((station) => {
    station.id = station['Station ID'];
    station.stop = station['GTFS Stop ID'];
    station.name = station['Stop Name'];
    station.complex = station['Complex ID'],
    station.latitude = Number(station['GTFS Latitude']);
    station.longitude = Number(station['GTFS Longitude']);
    return station;
  })
  return geolib.findNearest(coords, positions);
}

async function findScheduleByStation(station, line) {
  try {
    const departures = await client.departures(station.complex);
    return processDepartures(departures, line);
  } catch (err) {
    return { message: 'Schedules are unavailable at this time' };
  }
}

function processDepartures({ name, lines }, line) {
  const lineDepartures = filterDepartureByLine(lines, line);
  const schedule = lineDepartures.map((departure) => {
    const destination = stations.find((station) => station['Station ID'] === departure.destinationStationId);
    const direction = getTransitDirection(station.id, departure.destinationStationId);
    return { 
      time: departure.time*1000,
      bound: direction,
      destination: destination['Stop Name'],
    };
  });
  return { name, schedule };
}

function filterDepartureByLine(lines, line) {
  const schedule = [];
  [].concat(lines).filter(Boolean).forEach(({ departures }) => {
    Object.keys(departures).forEach((direction) => {
      const filterLine = departures[direction].filter(({ routeId, destinationStationId }) => {
        return destinationStationId && routeId.startsWith(line.toUpperCase())
      });
      schedule.push(...filterLine);
    });
  });
  return schedule;
}

function getTransitDirection(currentStationId, destinationStationId) {
  const currentStation = stations.find((station) => station['Station ID'] === currentStationId);
  const destinationStation = stations.find((station) => station['Station ID'] === destinationStationId);
  if (currentStation['Borough'] === destinationStation['Borough']) {
    return destinationStation['Stop Name'];
  }
  return boroughs[destinationStation['Borough']];
}

module.exports = {
  findFeedByEvent,
  findStationByCoords,
  findScheduleByStation,
  getLineByEvent,
};
