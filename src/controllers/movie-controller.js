import {Card} from '../components/card.js';
import {FilmDetails} from '../components/film-details.js';
import {render, unrender, onEscButtonPress} from '../util.js';
import {Emoji} from '../components/emoji.js';
import {Comment} from '../components/comment.js';
const body = document.querySelector(`body`);
export class MovieController {
  constructor(card, container, onDataChange, onChangeView) {
    this._card = card;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._container = container;
    this.init();
  }
  init() {
    // Код, который создаст экземпляры объектов и запустит процесс рендеринга (для карточки и попапа)
    const card = new Card(this._card);
    let filmDetails = new FilmDetails(this._card);
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
    const onPosterClick = (evtent) => {
      evtent.preventDefault();
      openDetails();
    };
    card.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, onPosterClick);
    // Клик на тайтл
    const onTitleClick = (evtent) => {
      evtent.preventDefault();
      openDetails();
    };
    card.getElement().querySelector(`.film-card__title`)
      .addEventListener(`click`, onTitleClick);
    // Клик на коменты
    const onCommentsClick = (evtent) => {
      evtent.preventDefault();
      openDetails();
    };
    card.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, onCommentsClick);
    // Клик на кнопку закрыть
    const onCloseButtonClick = (evtent) => {
      evtent.preventDefault();
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
    // Обработчик клика по эмоджи
    filmDetails.getElement().querySelectorAll(`.film-details__emoji-label`).forEach((element) => {
      element.addEventListener(`click`, () => {
        const img = element.querySelector(`img`);
        filmDetails.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
        filmDetails.getElement().querySelector(`.film-details__add-emoji-label`).appendChild(new Emoji(img.src).getElement());
      });
    });
    // Обработчик клика по кнопкам карточки
    const controlClickHandler = (event) => {
      const element = event.target;
      const cardNew = Object.assign({}, this._card);
      if (element.className.includes(`film-card__controls-item`)) {
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

    // Добавление коментариев
    const commentaries = filmDetails.getElement().querySelector(`.film-details__comments-list`);
    this._card.comments.map((commentary) => render(commentaries, new Comment(commentary).getElement()));

    const pressEnterHandler = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === `Enter`) {
        const commentsList = filmDetails.getElement().querySelector(`.film-details__comments-list`);
        const commentInput = filmDetails.getElement().querySelector(`.film-details__comment-input`);

        const commentData = {
          author: `GD`,
          text: commentInput.value,
          date: new Date(Date.now()),
          emoji: filmDetails.getElement().querySelector(`.film-details__add-emoji-label img`).src,
        };

        const newCommentsData = Object.assign({}, this._card);
        newCommentsData.comments.push(commentData);
        commentsList.appendChild(new Comment(commentData).getElement());
        commentInput.value = ``;
        this._onDataChange(newCommentsData, this._card);
      }
    };
    // Проверяем, был ли попап открыт до создания данного экземпляра объекта.  Если да, то обновляем.
    if (document.querySelector(`.film-details__title`)) {
      if (document.querySelector(`.film-details__title`).innerHTML === this._card.title) {
        openDetails();
      }
    }
  }

  setDefaultView() {
    const popup = document.querySelector(`.film-details`);
    if (document.body.contains(popup)) {
      unrender(popup);
    }
  }
}

