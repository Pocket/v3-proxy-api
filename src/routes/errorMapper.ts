export enum ErrorCodes {
  INVALID_CONSUMER_KEY = 'INVALID_CONSUMER_KEY',
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
}
const errorHeaders = {
  INVALID_CONSUMER_KEY: {
    'X-Error-Code': 132,
    en: 'Missing API key. Get an API key at http://getpocket.com/api',
  },
  INVALID_ACCESS_TOKEN: {
    'X-Error-Code': 107,
    en: 'A valid access token is required to access the requested API endpoint.',
  },
};

export function getErrorHeaders(errorCode: ErrorCodes, language = 'en') {
  //todo: proxy should handle localization based on web repo request.
  return {
    'X-Error-Code': errorHeaders[errorCode]['X-Error-Code'],
    'X-Error': errorHeaders[errorCode][language],
  };
}
