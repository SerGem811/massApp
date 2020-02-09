import axios from 'axios';

import {BASE_URL, WrapperURL, TelegramURL} from './endpoints';


export function login(username, password) {
  return axios({
    method: 'POST',
    url: `${BASE_URL}/auth/local`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data : {
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


///////////////// auto-reply services /////////////////////////////
// get all auto-reply
export function getAutoRepliesService(userid) {
  let url = `${BASE_URL}/autoreplies`;
  if(userid != -1) {
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
export function getResponsesService (pagination, reply_id) {
  let start = (pagination.currentPage * pagination.pageSize) - pagination.pageSize
  let limit = pagination.pageSize

  let url =  BASE_URL + '/responsewapps?autoreply=' + reply_id + '&_start=' + start + '&_limit=' + limit + '&_sort=order:asc'

  return axios({
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
  if(userid != -1) {
    url += '?user=' + userid;
  }
  return await axios ({
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


//////////// Whatsapp Wrapper API //////////////////////////////////
export async function getQRCodeService(token) {
  return axios({
    method: 'POST',
    url: `${WrapperURL}/qr/`,
    timeout: 60000,
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
export async function getWrapperTokenService(username, password) {
  return await axios({
    method: 'POST',
    url: `${WrapperURL}/get_token/`,
    timeout: 60000,
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


//////////// Telegram API //////////////////////////////////////////
// request telegram code
export async function getTelegramCodeService(token, phone) {
  return axios({
    method: 'POST',
    url: `${TelegramURL}/request_code/`,
    timeout: 6000,
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
export async function submitTelegramCodeService(token, phone, code, password) {
  return axios({
    method: 'POST',
    url: `${TelegramURL}/submit_code/`,
    timeout: 6000,
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
export async function getTelegramTokenService(username, password) {
  return await axios({
    method: 'POST',
    url: `${TelegramURL}/get_token/`,
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

/////////////////////  get status //////////////////////////////////
export async function getConnectionStatusService(token, type) {
  let url = "";
  if(type == 'WrapperAPI') {
    url = `${WrapperURL}/status/`;
  } else if(type == 'TelegramAPI') {
    url = `${TelegramURL}/status/`;
  } 
  return await axios({
    method: 'POST',
    url,
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