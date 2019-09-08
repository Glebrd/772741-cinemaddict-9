import {AbstractComponent} from './abstract-component.js';
import {getAmountOfDaysBeteweenToDates} from '../util.js';
export class Comment extends AbstractComponent {
  constructor(comment) {
    super();
    this._emoji = comment.emoji;
    this._text = comment.text;
    this._author = comment.author;
    this._date = comment.date;
  }

  getTemplate() {
    return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="${this._emoji}" width="55" height="55" alt="emoji">
  </span>
  <div>
    <p class="film-details__comment-text">${this._text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${this._author}</span>
      <span class="film-details__comment-day">${getAmountOfDaysBeteweenToDates(this._date, new Date())} days ago</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;
  }
}
