const { findFeed } = require('./feed.js');
const BASE_DOMAIN = 'willarrive.in';

module.exports = function({ requestContext }) {
  let allowOrigin = `https://${BASE_DOMAIN}`;
  if (requestContext) {
    const { domainPrefix, domainName } = requestContext;
    const feed = findFeed({ requestContext });
    if (`${domainPrefix}.${BASE_DOMAIN}` === domainName && feed) {
      allowOrigin = `https://${domainName}`;
    }
  }

  return { 'Access-Control-Allow-Origin': allowOrigin };
}