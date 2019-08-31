import {createElement} from "../util";
export class UserRating {
  constructor(userRating) {
    this._userRating = userRating;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._userRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }
}
