const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// handles all JSON/XML responses
const sendResponse = (response, statusCode, message, acceptedType) => {
  // create a JSON response object
  const responseJSON = { statusCode, message };

  // send the response based on the accepted type
  if (acceptedType === 'xml') { // create and send XML response
    let responseXML = '<response>';
    responseXML += `<statusCode>${statusCode}</statusCode>`;
    responseXML += `<message>${message}</message>`;
    responseXML += '</response>';
    response.writeHead(statusCode, { 'Content-Type': 'application/xml' });
    response.write(responseXML);
  } else { // send JSON response
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(responseJSON));
  }
  response.end();
};

// Functions to handle each type of response
const getSuccess = (request, response, params, type, acceptedType) => {
  sendResponse(response, 200, 'This is a successful response', acceptedType);
};

const getBadRequest = (request, response, params, type, acceptedType) => {
  if (params.valid === 'true') {
    sendResponse(response, 200, 'This request has the required parameters', acceptedType);
  } else {
    sendResponse(response, 400, 'Missing valid query parameter set to true', acceptedType);
  }
};

const getUnauthorized = (request, response, params, type, acceptedType) => {
  if (params.loggedIn === 'yes') {
    sendResponse(response, 200, 'You have successfully viewed the content', acceptedType);
  } else {
    sendResponse(response, 401, 'Unauthorized access', acceptedType);
  }
};

const getForbidden = (request, response, params, type, acceptedType) => {
  sendResponse(response, 403, 'You do not have access to this content', acceptedType);
};

const getInternal = (request, response, params, type, acceptedType) => {
  sendResponse(response, 500, 'Internal Server Error. Something went wrong.', acceptedType);
};

const getNotImplemented = (request, response, params, type, acceptedType) => {
  sendResponse(response, 501, 'A get request for this page has not been implemented yet. Check again later for updated content.', acceptedType);
};

const getNotFound = (request, response, params, type, acceptedType) => {
  sendResponse(response, 404, 'The page you are looking for was not found.', acceptedType);
};

module.exports = {
  getIndex,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
