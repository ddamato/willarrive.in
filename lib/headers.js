const BASE_DOMAIN = 'willarrive.in';

module.exports = function({ requestContext }) {
  let allowOrigin = `https://${BASE_DOMAIN}`;
  if (requestContext) {
    const { domainPrefix, domainName } = requestContext;
    if (`${domainPrefix}.${BASE_DOMAIN}` === domainName) {
      // also check for feed before allowing
      allowOrigin = `https://${domainName}`;
    }
  }

  return { 'Access-Control-Allow-Origin': allowOrigin };
}