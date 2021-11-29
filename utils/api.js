'use strict';
const url = process.env.API_URL;
const fetch = require('node-fetch');

const login = async (username, password) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    return false;
  } else {
    return { token: json.token, user: json.user };
  }
};

const checkToken = async (token) => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(url + '/user/token', fetchOptions);
    if (!response.ok) {
      return false;
    } else {
      const json = await response.json();
      return json.user;
    }
  } catch (e) {
    console.log('checkToken', e.message);
  }
};

const getCats = async (token) => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(url + '/cat', fetchOptions);
    const cats = await response.json();
    return cats;
  } catch (e) {
    console.log('getCats', e.message);
    return [];
  }
};

const getCat = async (token, catId) => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(url + '/cat/' + catId, fetchOptions);
    const cat = await response.json();
    return cat;
  } catch (e) {
    console.log('getCat', e.message);
    return {};
  }
};

const getUsers = async (token) => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(url + '/user', fetchOptions);
    const users = await response.json();
    return users;
  } catch (e) {
    console.log('getUsers', e.message);
    return [];
  }
};

const addCat = async (file, token) => {
  console.log('addCat', file);
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: file,
  };
  try {
    const response = await fetch(url + '/cat', fetchOptions);
    const json = await response.json();
    console.log('addCat response', json);
    if (!json.message) {
      return false;
    } else {
      return json.message;
    }
  } catch (error) {
    console.log('addCat', error.message);
  }
};

const modifyCat = async (data, token) => {
  const id = data.catId;
  delete data.catId;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log('modifyCat', fetchOptions);
  try {
    const response = await fetch(url + '/cat/' + id, fetchOptions);
    const json = await response.json();
    console.log('addCat response', json);
    if (!json.message) {
      return false;
    } else {
      return json.message;
    }
  } catch (error) {
    console.log('modifyCat', error.message);
  }
};

const deleteCat = async (token, catId) => {
  try {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(url + '/cat/' + catId, fetchOptions);
    const cat = await response.json();
    return cat;
  } catch (e) {
    console.log('deleteCat', e.message);
    return {};
  }
};

module.exports = {
  checkToken,
  login,
  getCats,
  getCat,
  getUsers,
  addCat,
  modifyCat,
  deleteCat,
};
