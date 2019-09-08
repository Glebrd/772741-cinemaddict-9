import {createElementsFromTemplateAndData, convertToFullDate, convertMinutesToMovieTimeFormat} from '../util.js';
import {AbstractComponent} from './abstract-component';

const checkActiveButton = (isActive) => isActive ? `checked` : ``;

const getGenreMarkup = (genre) =>
  `<span class="film-details__genre">${genre}</span>`;

const getRateMarkup = (poster, title) => (`
<div class="form-details__middle-container">
  <section class="film-details__user-rating-wrap">
    <div class="film-details__user-rating-controls">
      <button class="film-details__watched-reset" type="button">Undo</button>
    </div>

    <div class="film-details__user-score">
      <div class="film-details__user-rating-poster">
        <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
      </div>

      <section class="film-details__user-rating-inner">
        <h3 class="film-details__user-rating-title">${title}</h3>

        <p class="film-details__user-rating-feelings">How you feel it?</p>

        <div class="film-details__user-rating-score">
          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
          <label class="film-details__user-rating-label" for="rating-1">1</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
          <label class="film-details__user-rating-label" for="rating-2">2</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
          <label class="film-details__user-rating-label" for="rating-3">3</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
          <label class="film-details__user-rating-label" for="rating-4">4</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
          <label class="film-details__user-rating-label" for="rating-5">5</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
          <label class="film-details__user-rating-label" for="rating-6">6</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
          <label class="film-details__user-rating-label" for="rating-7">7</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
          <label class="film-details__user-rating-label" for="rating-8">8</label>

          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
          <label class="film-details__user-rating-label" for="rating-9">9</label>
        </div>
      </section>
    </div>
  </section>
</div>
`.trim()
);

export class FilmDetails extends AbstractComponent {
  constructor({title, comments, genres, poster, age, originalTitle, rating, director, writers, actors, releaseDate, duration, country, description, isToWatch, isWatched, isFavorite}) {
    super();
    this._title = title;
    this._comments = comments;
    this._genres = genres;
    this._poster = poster;
    this._age = age;
    this._originalTitle = originalTitle;
    this._rating = rating;
    this._director = director;
    this._writers = writers;
    this._actors = actors;
    this._releaseDate = releaseDate;
    this._duration = duration;
    this._country = country;
    this._description = description;
    this._isWatched = isWatched;
    this._isToWatch = isToWatch;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._poster}" alt="">

            <p class="film-details__age">${this._age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${convertToFullDate(this._releaseDate)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${convertMinutesToMovieTimeFormat(this._duration)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                ${createElementsFromTemplateAndData(this._genres, getGenreMarkup)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
            ${this._description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${checkActiveButton(this._isToWatch)}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist" data-action-type="add-to-watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${checkActiveButton(this._isWatched)}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched" data-action-type="mark-as-watched" >Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${checkActiveButton(this._isFavorite)}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite" data-action-type="favorite">Add to favorites</label>
        </section>
      </div>
      ${this._isWatched ? getRateMarkup(this._poster, this._title) : ``}
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
          </ul>

          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
              <label class="film-details__emoji-label" for="emoji-gpuke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
  }
}
