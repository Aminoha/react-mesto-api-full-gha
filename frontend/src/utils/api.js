class Api {
  constructor(path, headers) {
    this._path = path;
    this._headers = headers;
  }

  _getJson(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  setToken(token) {
    this._headers.Authorization = `Bearer ${token}`;
  }

  getCardList() {
    return fetch(`${this._path}/cards`, {
      headers: this._headers,
    }).then(this._getJson);
  }

  getUserInfo() {
    return fetch(`${this._path}/users/me`, {
      headers: this._headers,
    }).then(this._getJson);
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._path}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: `${name}`,
        about: `${about}`,
      }),
    }).then(this._getJson);
  }

  setUserAvatar(data) {
    return fetch(`${this._path}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._getJson);
  }

  addCard({ name, link }) {
    return fetch(`${this._path}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: `${name}`,
        link: `${link}`,
      }),
    }).then(this._getJson);
  }

  deleteCard(cardId) {
    return fetch(`${this._path}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this._getJson);
  }

  putLike(cardId) {
    return fetch(`${this._path}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._headers,
    }).then(this._getJson);
  }

  deleteLike(cardId) {
    return fetch(`${this._path}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this._getJson);
  }
}

const api = new Api({
  url: 'https://api.aminoha.mesto.nomoreparties.sbs',
  headers: {
    'Content-Type': 'application/json',
    Authorization: '',
  },
});

export default api;
