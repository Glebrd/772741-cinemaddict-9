
import {AbstractComponent} from './abstract-component';
import moment from 'moment';
import 'moment-duration-format';

const checkActiveButton = (isActive) => isActive ? `film-card__controls-item--active` : ``;
export class Card extends AbstractComponent {
  constructor({description, rating, poster, releaseDate, duration, genres, title, comments, isToWatch, isWatched, isFavorite}) {
    super();
    this._description = description;
    this._rating = rating;
    this._poster = poster;
    this._releaseDate = releaseDate;
    this._duration = duration;
    this._genres = genres;
    this._title = title;
    this._comments = comments;
    this._isWatched = isWatched;
    this._isToWatch = isToWatch;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${moment(this._releaseDate).format(`YYYY`)}</span>
      <span class="film-card__duration">${moment.duration(this._duration, `minutes`).format(`h[h] m[m]`)}</span>
      <span class="film-card__genre">${this._genres[0] || ``}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description}</p>
    <a class="film-card__comments">${this._comments.length} comments</a>
    <form class="film-card__controls">
      <button data-action-type="add-to-watchlist" class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${checkActiveButton(this._isToWatch)}">Add to watchlist</button>
      <button data-action-type="mark-as-watched" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${checkActiveButton(this._isWatched)}">Mark as watched</button>
      <button data-action-type="favorite" class="film-card__controls-item button film-card__controls-item--favorite ${checkActiveButton(this._isFavorite)}">Mark as favorite</button>
    </form>
    </article>`;
  }
}
