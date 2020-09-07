const prepareHeaders = require('../lib/headers.js');

module.exports.handler = async (event, context, callback) => {
  const headers = prepareHeaders(event);

  const response = {
    statusCode: 200,
    headers,
    body: 'Not found',
  }

  if (!findFeedByEvent(event)) {
    callback(null, response);
    return;
  }

  const line = getLineByEvent(event);

  const resource = event.requestContext.path;

  return JSON.stringify({ resource, line });
}