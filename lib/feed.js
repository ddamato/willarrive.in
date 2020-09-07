const geolib = require('geolib');

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
  return line && feeds.find(({ lines }) => lines.includes(line.toUpperCase()));
}

function getLineByEvent({ requestContext }) {
  // domainPrefix.willarrive.in
  const { domainPrefix } = requestContext || {};
  if (!domainPrefix) {
    return null;
  }
  return domainPrefix.toLowerCase();
}

function findNearestStop(stops, latitude, longitude) {
  return geolib.findNearest({ latitude, longitude }, stops);
}

function parseArrivals(stop) {
  const { line, groups } = stop;
  const arrivals = groups
    .filter(({ route }) => route.shortName === line.toUpperCase())
    .reduce((acc, { headsign, times }) => {
      if (times.length) {
        acc[headsign] = times.map(({ arrivalFmt }) => arrivalFmt).shift();
      }
      return acc;
    }, {});

  if (Object.keys(arrivals).length) {
    return arrivals;
  }

  return { 'N/A': 'N/A' };
}

module.exports = {
  findFeedByEvent,
  getLineByEvent,
  findNearestStop,
  parseArrivals,
};
