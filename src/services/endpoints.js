const BASE_URL = 'http://172.107.180.59:1337';
const UPLOAD_URL = 'http://172.107.180.59:1337/upload';
const WA_Python_Url = 'http://172.107.180.59:8001';
const TGPythonURL = 'http://172.107.180.59:8000';
const WAGO_URL = 'http://172.107.180.59:4000';
const WAGOHookURL = 'http://172.107.180.59:1337/hookWAGoApi';
const WAGOBulkSendURL = 'http://172.107.180.59:1337/WAGO/BulkSendApi';

const STATUS_CONNECT = 0;
const STATUS_DISCONNECT = 1;
const STATUS_ERROR = 2;
const STATUS_NOT_CONFIG = 3;

const LINE_LIMIT = 3;

export {
  BASE_URL,
  WA_Python_Url,
  TGPythonURL,
  WAGO_URL,
  WAGOHookURL,
  WAGOBulkSendURL,
  UPLOAD_URL,
  STATUS_CONNECT,
  STATUS_DISCONNECT,
  STATUS_ERROR,
  STATUS_NOT_CONFIG,
  LINE_LIMIT
}