const http = require('http');
const query = require('querystring');
const handler = require('./responseHandler.js');

const urlStruct = {
  '/': handler.getIndex,
  '/index': handler.getIndex,
  '/success': handler.getSuccess,
  '/badRequest': handler.getBadRequest,
  '/unauthorized': handler.getUnauthorized,
  '/forbidden': handler.getForbidden,
  '/internal': handler.getInternal,
  '/notImplemented': handler.getNotImplemented,
  notFound: handler.getNotFound,
};

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  // parse accept header and query parameters
  const acceptedTypes = request.headers.accept.split(',');
  const params = query.parse(request.url.split('?')[1]);

  // determine the type to send
  const type = acceptedTypes[0];
  let acceptedType = 'json';
  if (acceptedTypes.includes('application/xml' || 'text/xml')) {
    acceptedType = 'xml';
  }

  // call handler based on the URL
  if (urlStruct[request.url]) {
    urlStruct[request.url](request, response, params, type, acceptedType);
  } else {
    urlStruct.notFound(request, response, params, type, acceptedType);
  }
};

http.createServer(onRequest).listen(port);
