import moment from 'moment';

class ModelFilm {
  constructor(data) {
    this.id = data[`id`] || null;
    this.title = data[`film_info`][`title`] || ``;
    this.poster = data[`film_info`][`poster`] || ``;
    this.originalTitle = data[`film_info`][`alternative_title`] || ``;
    this.description = data[`film_info`][`description`] || ``;
    this.duration = data[`film_info`][`runtime`] || null;
    this.rating = data[`film_info`][`total_rating`] || 0;
    this.releaseDate = data[`film_info`][`release`][`date`] || null;
    this.country = data[`film_info`][`release`][`release_country`] || ``;
    this.genres = data[`film_info`][`genre`] || [];
    this.age = data[`film_info`][`age_rating`] || 0;
    this.actors = data[`film_info`][`actors`] || [];
    this.director = data[`film_info`][`director`] || ``;
    this.writers = data[`film_info`][`writers`] || [];
    this.comments = data[`comments`];
    this.isToWatch = Boolean(data[`user_details`][`watchlist`]) || false;
    this.isWatched = Boolean(data[`user_details`][`already_watched`]) || false;
    this.isFavorite = Boolean(data[`user_details`][`favorite`]) || false;
    this.userRating = data[`user_details`][`personal_rating`] || ``;
    this.watchedDate = moment(data[`user_details`][`watching_date`]).format() || null;
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

  toRAW() {
    return {
      'film_info': {
        'alternative_title': this.originalTitle,
        'poster': this.poster,
        'title': this.title,
        'description': this.description,
        'runtime': this.duration,
        'total_rating': parseInt(this.rating, 10),
        'release': {
          'date': new Date(this.releaseDate),
          'release_country': this.country,
        },
        'genre': this.genres,
        'age_rating': this.age,
        'actors': this.actors,
        'director': this.director,
        'writers': this.writers,
      },
      'user_details': {
        'already_watched': this.isWatched,
        'favorite': this.isFavorite,
        'watchlist': this.isToWatch,
        'personal_rating': parseInt(this.userRating, 10) || 0,
        'watching_date': new Date(this.watchedDate) || null,
      },
      'comments': this.comments,
    };
  }
}

export default ModelFilm;
