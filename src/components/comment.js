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

  getTemplate() {
    return `<li class="film-details__comment" data-comment-id="${this._id}">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${this._emoji}.png" width="55" height="55" alt="emoji">
  </span>
  <div>
    <p class="film-details__comment-text">${DOMPurify.sanitize(this._text)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${this._author}</span>
      <span class="film-details__comment-day">${moment(this._date).format(`YY/MM/DD hh:mm`)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;
  }
}
