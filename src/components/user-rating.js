import AbstractComponent from './abstract-component';
class UserRating extends AbstractComponent {
  constructor(userRating) {
    super();
    this._userRating = userRating;
  }
  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._userRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }
  // Звание пользователя
  static getUserRank(watched) {
    let userRank = ``;
    if (watched >= 21) {
      userRank = `movie buff`;
    } else if (watched >= 11) {
      userRank = `fan`;
    } else {
      userRank = `novice`;
    }
    return userRank;
  }

}

export default UserRating;
