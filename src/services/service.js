import axios from 'axios';
import qs from 'qs';

import { BASE_URL, WA_Python_Url, TGPythonURL, WAGO_URL, WAGOHookURL, WAGOBulkSendURL } from './endpoints';


export function login(username, password) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/auth/local`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      identifier: username,
      password: password
    }
  });
}

export function register(username, password, email) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/auth/local/register`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      username: username,
      email: email,
      password: password,
      confirmed: false
    }
  });
}

export function getUsersService() {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/users`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

///////////////// auto-reply services /////////////////////////////
// get all auto-reply
export function getAutoRepliesService(userid) {
  let url = `${BASE_URL}/autoreplies`;
  if (userid != -1) {
    url += '?user=' + userid;
  }
  return axios({
    method: 'GET',
    url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}
// create auto-reply
export function createAutoReplyService(data) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/autoreplies`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  });
}
// update auto-reply
export function updateAutoReplyService(id, reply) {
  return axios({
    method: 'PUT',
    url: `${BASE_URL}/autoreplies/${id}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: reply
  });
}
// delete auto-reply
export async function deleteAutoReplyService(id) {
  return await axios({
    method: 'DELETE',
    url: `${BASE_URL}/autoreplies/${id}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}
///////////////////////////////////////////////////////////////////


//////////////// response services ////////////////////////////////
// get all responses
export async function getResponsesService(pagination, reply_id) {
  let start = (pagination.currentPage * pagination.pageSize) - pagination.pageSize
  let limit = pagination.pageSize

  let url = BASE_URL + '/responsewapps?autoreply=' + reply_id + '&_start=' + start + '&_limit=' + limit + '&_sort=order:asc'

  return await axios({
    method: 'GET',
    url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}
// create response
export function createResponseService(response) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/responsewapps`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: response
  });
}
// update response
export function updateResponseService(id, response) {
  return axios({
    method: 'PUT',
    url: `${BASE_URL}/responsewapps/${id}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: response
  })
}
// delete response
export async function deleteResponseService(id) {
  return await axios({
    method: 'DELETE',
    url: `${BASE_URL}/responsewapps/${id}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}
// get response count
export function countResponsesService() {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/responsewapps/count`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}
///////////////////////////////////////////////////////////////////

///////////////// sender services /////////////////////////////////
// get all senders
export async function getSenderService(userid) {
  let url = `${BASE_URL}/senderdata`;
  if (userid != -1) {
    url += '?user=' + userid;
  }
  return await axios({
    method: 'GET',
    url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}
// create sender data
export function createSenderService(data) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/senderdata`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  });
}
// update sender data
export function updateSenderService(data) {
  return axios({
    method: 'PUT',
    url: `${BASE_URL}/senderdata/${data.id}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data
  })
}
// delete sender data
export function deleteSenderService(data) {
  return axios({
    method: 'DELETE',
    url: `${BASE_URL}/senderdata/${data.id}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}
////////////////////////////////////////////////////////////////////

export function setBulkData(data) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/bulkdata`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  })
}

export function getBulkData() {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/bulkdata`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}


//////////// Whatsapp Python API //////////////////////////////////
export async function getWAPythonQRCodeService(token) {
  return axios({
    method: 'POST',
    url: `${WA_Python_Url}/qr/`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      'token': token
    }
  });
}
// get wrapper token
export async function getWAPythonTokenService(username, password) {
  return await axios({
    method: 'POST',
    url: `${WA_Python_Url}/get_token/`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      'username': username,
      'password': password
    }
  });
}
////////////////////////////////////////////////////////////////////

///////////// Whatsapp Golang API //////////////////////////////////
export async function getWAGOQRCodeService(token) {
  return axios({
    method: 'POST',
    url: `${WAGO_URL}/api/profile/scanqr`,
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      sessionId: token
    })
  });
}

export async function registerWebhookWAGOService(token) {
  return axios({
    method: 'POST',
    url: `${WAGO_URL}/api/profile/hook/set`,
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    data: qs.stringify({
      'sessionId': token,
      'hookURL': WAGOHookURL
    })
  });
}

export async function sendWAGOBulkSendService(senderId, message, phones, times, delay, attachUrl, attachType) {
  return await axios({
    method: 'POST',
    url: `${WAGOBulkSendURL}`,
    timeout: 300000,
    data: {
      senderId: senderId,
      message: message,
      phones: phones,
      times: times,
      delay: delay,
      attachUrl : attachUrl,
      attachType: attachType
    }
  });
}

////////////////////////////////////////////////////////////////////

//////////// Telegram Python API ///////////////////////////////////
// request telegram code
export async function getTGPythonCodeService(token, phone) {
  return axios({
    method: 'POST',
    url: `${TGPythonURL}/request_code/`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      'token': token,
      'phone': phone
    }
  });
}
// submit telegram code
export async function submitTGPythonCodeService(token, phone, code, password) {
  return axios({
    method: 'POST',
    url: `${TGPythonURL}/submit_code/`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      'token': token,
      'phone': phone,
      'code': code,
      'password': password
    }
  });
}
// get telegram token
export async function getTGPythonTokenService(username, password) {
  return await axios({
    method: 'POST',
    url: `${TGPythonURL}/get_token/`,
    corssDomain: true,
    headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    data: {
      'username': username,
      'password': password
    }
  });
}
// attach_webhook
export async function attachWebhookTGPythonService(token, phone) {
  return axios({
    method: 'POST',
    url: `${TGPythonURL}/attach_webhook/`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      'token': token,
      'phone': phone
    }
  });
}
////////////////////////////////////////////////////////////////////

/////////////////////  get status //////////////////////////////////
export async function getConnectionStatusService(token, type) {
  // go-lang connection status
  if(type == 'WA.GO') {
    return await axios({
      method: 'GET',
      timeout: 5000,
      url: `${WAGO_URL}/api/profile/me?sessionId=${token}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  // Python WhatsApp and Telegram
  let url = "";
  if (type == 'WA.Python') {
    url = `${WA_Python_Url}/status/`;
  } else if (type == 'TG.Python') {
    url = `${TGPythonURL}/status/`;
  }
  return await axios({
    method: 'POST',
    url,
    timeout: 5000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      'token': token
    }
  });
}
////////////////////////////////////////////////////////////////////