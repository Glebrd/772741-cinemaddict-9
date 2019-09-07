import { Card } from '../components/card.js';
import { FilmDetails } from '../components/film-details.js';
import { render, unrender, onEscButtonPress, createElement } from '../util.js';
const body = document.querySelector(`body`);
export class MovieController {
  constructor(card, container, onDataChange, onChangeView) {
    this._card = card;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    // this._popUpRender = this.popUpRender.bind(this);
    // this._setDefaultVeiew = this.setDefaultView.bind(this);
    this._container = container;
    this.init();
  }
  init() {
    // Код, который создаст экземпляры объектов и запустит процесс рендеринга (для карточки и попапа)
    const card = new Card(this._card);
    const filmDetails = new FilmDetails(this._card);
    // Открытие попапа
    const openDetails = () => {
      this._onChangeView();
      render(body, filmDetails.getElement());
      document.addEventListener(`keydown`, onDetailsEscPress);
      filmDetails.getElement().querySelector(`.film-details__controls`).addEventListener(`click`, controlClickHandler);
      filmDetails.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, pressEnterHandler);
    };
    // Закрытие попапа
    const closeDetails = () => {
      unrender(filmDetails.getElement());
      document.removeEventListener(`keydown`, onDetailsEscPress);
    };
    // Клик на постер
    const onPosterClick = (evt) => {
      evt.preventDefault();
      openDetails();
    };
    card.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, onPosterClick);
    // Клик на тайтл
    const onTitleClick = (evt) => {
      evt.preventDefault();
      openDetails();
    };
    card.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, onTitleClick);
    // Клик на коменты
    const onCommentsClick = (evt) => {
      evt.preventDefault();
      openDetails();
    };
    card.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, onCommentsClick);
    // Клик на кнопку закрыть
    const onCloseButtonClick = (evt) => {
      evt.preventDefault();
      closeDetails();
    };
    filmDetails.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, onCloseButtonClick);
    // Нажатие на Esc
    const onDetailsEscPress = (evt) => {
      if (evt.target.tagName.toLowerCase() === `textarea`) {
        return;
      }
      onEscButtonPress(evt, closeDetails);
    };
    // Отрисовка карточки фильма
    render(this._container, card.getElement());

    // Обработчик клика по кнопкам карточки
    const controlClickHandler = (event) => {
      const element = event.target;
      const cardNew = Object.assign({}, this._card);
      if (element.className.includes(`film-card__controls-item`)) {
        console.log(element.dataset.actionType);
        event.preventDefault();
        element.classList.toggle(`film-card__controls-item--active`);
      }
      switch (element.dataset.actionType) {
        case `add-to-watchlist`:
          cardNew.isToWatch = !cardNew.isToWatch;
          this._onDataChange(cardNew, this._card);
          break;
        case `mark-as-watched`:
          cardNew.isWatched = !cardNew.isWatched;
          this._onDataChange(cardNew, this._card);
          break;
        case `favorite`:
          cardNew.isFavorite = !(cardNew.isFavorite);
          this._onDataChange(cardNew, this._card);
          break;
      }
    };

    card.getElement().querySelector(`.film-card__controls`).addEventListener(`click`, controlClickHandler);

    // Добавление комента
    const pressEnterHandler = (e) => {
      if ((e.key === `Enter` && e.metaKey) || (e.key === `Enter` && e.ctrlKey)) {
        const commentsList = filmDetails.getElement().querySelector(`.film-details__comments-list`);
        const commentInput = filmDetails.getElement().querySelector(`.film-details__comment-input`);

        const commentData = {
          author: `GD`,
          text: commentInput.value,
          date: new Date(Date.now()),
          emoji: filmDetails.getElement().querySelector(`.film-details__add-emoji-label img`).src,
        };

        const commentElement = createElement(`
          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
                <img src="${commentData.emoji}" width="55" height="55" alt="emoji" >
            </span>
            <div>
              <p class="film-details__comment-text">${commentData.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${commentData.author}</span>
                <span class="film-details__comment-day">${commentData.date}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`.trim());

        const newCommentsData = Object.assign({}, this._card);
        newCommentsData.comments.push(commentData);
        // newCommentsData.count++;
        commentsList.appendChild(commentElement);
        commentInput.value = ``;
        this._onDataChange(newCommentsData, this._card);
      }
    };
  }

  setDefaultView() {
    const popup = document.querySelector(`.film-details`);
    console.log(popup);
    if (document.body.contains(popup)) {
      console.log(popup);
      unrender(popup);
    }
  }
}

