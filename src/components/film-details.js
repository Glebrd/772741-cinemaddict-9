import AbstractComponent from './abstract-component.js';
import FilmRating from './film-rating.js';
import moment from 'moment';
import 'moment-duration-format';

const checkActiveButton = (isActive) => isActive ? `checked` : ``;

class FilmDetails extends AbstractComponent {
  constructor({title, comments, genres, poster, age, originalTitle, rating, director, writers, actors, releaseDate, duration, country, description, isToWatch, isWatched, isFavorite, userRating}, isOnline) {
    super();
    this._title = title;
    this._comments = comments;
    this._genres = genres;
    this._poster = poster;
    this._age = age;
    this._originalTitle = originalTitle;
    this._rating = rating;
    this._userRating = userRating;
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
    this._isOnline = isOnline;
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
                <td class="film-details__cell">${this._actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${moment.duration(this._duration, `minutes`).format(`h[h] m[m]`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                ${this._genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``)}
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
      ${this._isWatched ? new FilmRating(this._poster, this._title, this._userRating).getTemplate() : ``}
      ${this._isOnline ? `<div class="form-details__bottom-container">
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
      </div>` : ``}
    </form>
  </section>`;
  }
}

export default FilmDetails;
