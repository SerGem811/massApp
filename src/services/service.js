import axios from 'axios';

import {BASE_URL} from './endpoints';


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

export function getAllResponses (pagination, senderdata) {
  let start = (pagination.currentPage * pagination.pageSize) - pagination.pageSize
  let limit = pagination.pageSize

  let url =  BASE_URL + '/responsewapps?senderdata=' + senderdata + '&_start=' + start + '&_limit=' + limit + '&_sort=order:asc'

  return axios({
    method: 'GET',
    url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

export function addResponseService(response) {
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

export function createConfigDataService(data) {
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

export function getConfigDataService(data) {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/senderdata?Type=${data}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

export function updateConfigDataService(data) {
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

export function deleteConfigDataService(data) {
  return axios({
    method: 'DELETE',
    url: `${BASE_URL}/senderdata/${data.id}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export async function getAllSenderdata() {
  return axios ({
    method: 'GET',
    url: `${BASE_URL}/senderdata`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

export async function getSenderdata(userid) {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/senderdata?user=` + userid,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

// export async function getContacts(senderId) {
//   // get all contracts

// }

// export async function getAllMessages(senderId) {

// }