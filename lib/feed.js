const feeds = require('../feeds.js');

function findFeed({ requestContext }) {
  // domainPrefix.willarrive.in
  const { domainPrefix } = requestContext || {};
  if (!domainPrefix) {
    return null;
  }
  return feeds.find(({ lines }) => lines.includes(domainPrefix.toUpperCase()));
}

module.exports = {
  findFeed,
};
