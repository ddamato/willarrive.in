
const stations = require('mta-subway-stations');
const Mta = require('mta-gtfs');
const geolib = require('geolib');
const { WAI_MTA_API_KEY } = process.env;

const mta = new Mta({ key: WAI_MTA_API_KEY });

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

function findFeedByEvent({ requestContext }) {
  // domainPrefix.willarrive.in
  const { domainPrefix } = requestContext || {};
  if (!domainPrefix) {
    return null;
  }
  return feeds.find(({ lines }) => lines.includes(domainPrefix.toUpperCase()));
}

function findStationByCoords(coords) {
  const positions = stations.map((station) => {
    station.id = station['Station ID'];
    station.stop = station['GTFS Stop ID'];
    station.name = station['Stop Name'];
    station.latitude = Number(station['GTFS Latitude']);
    station.longitude = Number(station['GTFS Longitude']);
    return station;
  })
  return geolib.findNearest(coords, positions);
}

async function findScheduleByStation(station, feed) {
  const { schedule } = await mta.schedule(station.stop, feed.id);
  if (schedule) {
    return Object.keys(schedule[station.stop]).reduce((acc, direction) => {
      // direction: N, S
      acc[direction] = schedule[station.stop][direction].map(addMilliseconds);
      return acc;
    }, {});
  }
  return {};
}

function addMilliseconds(scheduledStop) {
  scheduledStop.arrivalTime = scheduledStop.arrivalTime*1000;
  scheduledStop.departureTime = scheduledStop.departureTime*1000;
  return scheduledStop;
}

module.exports = {
  findFeedByEvent,
  findStationByCoords,
  findScheduleByStation,
};
