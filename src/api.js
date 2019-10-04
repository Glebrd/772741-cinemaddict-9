import ModelFilm from './model-film';

const NetworkConfig = {
  AUTHORIZATION: `Basic ${Math.floor(Math.random() * 1000000000)}`,
  END_POINT: `https://htmlacademy-es-9.appspot.com/cinemaddict`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => {
  return response.json();
};

class API {
  constructor() {
    this._endPoint = NetworkConfig.END_POINT;
    this._authorization = NetworkConfig.AUTHORIZATION;
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelFilm.parseFilms);
  }

  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: `PUT`,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelFilm.parseFilm);
  }

  syncFilms({films}) {
    return this._load({
      url: `movies/sync`,
      method: `POST`,
      body: JSON.stringify(films),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  getComments({filmId}) {
    return this._load({url: `comments/${filmId}`})
      .then(toJSON);
  }

  createComment({comment, filmId}) {
    return this._load({
      url: `comments/${filmId}`,
      method: `POST`,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  deleteComment({commentId}) {
    return this._load({url: `comments/${commentId}`, method: `DELETE`});
  }

}

export default API;
