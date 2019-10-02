import {AbstractComponent} from './abstract-component.js';
import moment from 'moment';
import DOMPurify from 'dompurify';

export class Comment extends AbstractComponent {
  constructor(comment) {
    super();
    this._id = comment.id;
    this._emoji = comment.emotion;
    this._text = comment.comment;
    this._author = comment.author;
    this._date = comment.date;
  }

  _convertDateToHumanFormat(date) {
    const inMinutes = moment().diff(date, `minutes`);
    switch (true) {
      case inMinutes <= 3:
        return `a minute ago`;
      case inMinutes <= 59:
        return `a few minutes ago`;
      case inMinutes <= 119:
        return `an hour ago`;
      case inMinutes <= 1439:
        return `a few hours ago`;
      case inMinutes >= 1440:
        return moment(date).fromNow();
    }
    return `now`;
  }

  getTemplate() {
    return `<li class="film-details__comment" data-comment-id="${this._id}">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${this._emoji}.png" width="55" height="55" alt="emoji">
  </span>
  <div>
    <p class="film-details__comment-text">${DOMPurify.sanitize(this._text)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${this._author}</span>
      <span class="film-details__comment-day">${this._convertDateToHumanFormat(this._date)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;
  }
}
