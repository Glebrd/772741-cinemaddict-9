import {ModelFilm} from './model-film';

export class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    // если сеть есть, сохраняем карточки в сторадж
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          window.localStorage.clear();
          films.map((film) => this._store.setItem({key: film.id, item: film.toRAW()}));
          return films;
        });
    } else {
      const rawFilms = Object.entries(this._store.getAll());
      const films = ModelFilm.parseFilms(rawFilms);
      return Promise.resolve(films);
    }
  }

  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._api.updateFilm({id, data})
        .then((film) => {
          this._store.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      this._store.setItem({key: data.id, item: data});
      return Promise.resolve(ModelFilm.parseFilm(data));
    }
  }

  getComments({filmId}) {
    if (this._isOnline()) {
      return this._api.getComments({filmId})
        .then((comments) => {
          const rawFilms = Object.entries(this._store.getAll());
          const filmDataWithComments = Object.assign({}, rawFilms[filmId], {comments});
          this._store.setItem({key: filmId, item: filmDataWithComments});
          return comments;
        });
    } else {
      return Promise.resolve(null);
    }
  }

  createComment({comment, filmId}) {
    if (this._isOnline()) {
      return this._api.createComment({comment, filmId})
        .then((response) => {
          const {movie, comments} = response;
          const rawFilms = Object.entries(this._store.getAll());
          const filmDataWithComments = Object.assign({}, rawFilms[movie.id], {comments});

          this._store.setItem({key: filmId, item: filmDataWithComments});
          return comments;
        });
    } else {
      return Promise.resolve(null);
    }
  }

  deleteComment({commentId, filmId}) {
    if (this._isOnline()) {
      return this._api.deleteComment({commentId})
        .then(() => {
          const rawFilms = Object.entries(this._store.getAll());
          const index = rawFilms[filmId].comments.findIndex((comment) => comment.id === commentId);
          const commentsWithoutDeleted = rawFilms[filmId].comments.splice(rawFilms[filmId].comments[index], 1);
          const filmDataWithComments = Object.assign({}, rawFilms[filmId], {comments: commentsWithoutDeleted});

          this._store.setItem({key: filmId, item: filmDataWithComments});
        });
    } else {
      return Promise.resolve(null);
    }
  }

  syncFilms() {
    return this._api.syncFilms({films: Object.entries(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

