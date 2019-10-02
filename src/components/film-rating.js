import {AbstractComponent} from './abstract-component.js';

const MAXIMUM_POINTS_AMOUNT = 9;
export class FilmRating extends AbstractComponent {
  constructor(poster, title, userRating) {
    super();
    this._poster = poster;
    this._title = title;
    this._userRating = userRating;
  }

  _getUserRating() {
    return [...Array(MAXIMUM_POINTS_AMOUNT)].map((element, i) => {
      const value = i + 1;
      return `
      <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${value}"
      id="rating-${value}"
      ${parseInt(this._userRating, 10) === value ? `checked` : ``}>
      <label class="film-details__user-rating-label" for="rating-${value}">${value}</label>`;
    }).join(` `);
  }

  getTemplate() {
    return `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
            ${this._getUserRating()}
            </div>
          </section>
        </div>
      </section>
    </div>
    `;
  }
}
