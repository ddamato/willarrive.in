module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ event }),
  };
  callback(null, response);
}