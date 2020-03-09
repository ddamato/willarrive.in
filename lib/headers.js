const BASE_DOMAIN = 'willarrive.in';

module.exports = function({ requestContext }) {
  const allowOrigin = `https://${BASE_DOMAIN}`;
  if (requestContext) {
    const { domainPrefix, domainName } = requestContext;
    if (`${domainPrefix}.${BASE_DOMAIN}` === domainName) {
      allowOrigin = `https://${domainName}`;
    }
  }

  return { 'Access-Control-Allow-Origin': allowOrigin };
}