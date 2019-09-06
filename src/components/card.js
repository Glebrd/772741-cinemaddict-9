import {convertMinutesToMovieTimeFormat} from "../util";
import {AbstractComponent} from './abstract-component';

export class Card extends AbstractComponent {
  constructor({description, rating, poster, releaseDate, duration, genres, title, comments}) {
    super();
    this._description = description;
    this._rating = rating;
    this._poster = poster;
    this._releaseDate = releaseDate;
    this._duration = duration;
    this._genres = genres;
    this._title = title;
    this._comments = comments;
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${this._releaseDate.getFullYear()}</span>
      <span class="film-card__duration">${convertMinutesToMovieTimeFormat(this._duration)}</span>
      <span class="film-card__genre">${this._genres[0]}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description}</p>
    <a class="film-card__comments">${this._comments.length} comments</a>
    <form class="film-card__controls">
      <button data-action-type="add-to-watchlist" class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button data-action-type="mark-as-watched" class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button data-action-type="favorite" class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
    </article>`;
  }
}
