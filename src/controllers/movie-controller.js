import {Card} from '../components/card.js';
import {FilmDetails} from '../components/film-details.js';
import {render, unrender, AUTHORIZATION, END_POINT, onEscButtonPress} from '../util.js';
import {Emoji} from '../components/emoji.js';
import {Comment} from '../components/comment.js';
import {API} from '../api.js';
const body = document.querySelector(`body`);
export class MovieController {
  constructor(card, container, onDataChange, onChangeView, onCommentsChange) {
    this._card = card;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._onCommentsChange = onCommentsChange;
    this._container = container;
    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._currentDeleteButton = null;
    this.init();
  }

  onCommentError() {
    const ANIMATION_TIMEOUT = 6000;
    this._filmDetails.getElement().querySelector(`.film-details__comment-input`)
      .style.animation = `shake ${ANIMATION_TIMEOUT / 10000}s`;
    setTimeout(() => {
      this._filmDetails.getElement().querySelector(`.film-details__comment-input`).style.animation = ``;
    }, ANIMATION_TIMEOUT);
    this._filmDetails.getElement().querySelector(`.film-details__comment-input`).disabled = false;
  }

  onCommentDeleteError() {
    this._currentDeleteButton.disabled = false;
    this._currentDeleteButton.textContent = `Delete`;
  }

  init() {
    // Код, который создаст экземпляры объектов и запустит процесс рендеринга (для карточки и попапа)
    const card = new Card(this._card);
    let filmDetails = new FilmDetails(this._card);
    this._filmDetails = filmDetails;
    // Открытие попапа
    const openDetails = () => {
      this._onChangeView();
      render(body, filmDetails.getElement());
      document.addEventListener(`keydown`, onDetailsEscPress);
      filmDetails.getElement().querySelector(`.film-details__controls`).addEventListener(`click`, controlClickHandler);
      // Если фильм просомтрен, то вешаем обработчики на кнопки оценки и на сброс
      if (this._card.isWatched) {
        filmDetails.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((input) =>
          input.addEventListener(`change`, onChangeUserRating));
        filmDetails.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, onChangeUserRating);
      }
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
    const onDetailsEscPress = (event) => {
      if (event.target.tagName.toLowerCase() === `textarea`) {
        return;
      }
      onEscButtonPress(event, closeDetails);
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

    // Обработка кнопки delete
    const blockComment = () => {
      filmDetails.getElement().querySelector(`.film-details__comment-input`).disabled = true;
    };

    const blockDeleteButton = (button) => {
      button.disabled = true;
      button.textContent = `Deleting…`;
    };

    const onCommentDelete = (event) => {
      if (event.target.classList.contains(`film-details__comment-delete`)) {
        event.preventDefault();
        this._currentDeleteButton = event.target;
        blockDeleteButton(event.target);
        this._onCommentsChange({action: `delete`, commentId: event.currentTarget.dataset.commentId, onError: this.onCommentDeleteError.bind(this)});
      }
    };

    const onChangeUserRating = (event) => {
      this._onDataChange(Object.assign(this._card, {userRating: event.target.value || 0}));
    };

    // Обработчик клика по кнопкам карточки
    const controlClickHandler = (event) => {
      blockComment();
      const element = event.target;
      const cardNew = this._card;
      if (element.className.includes(`film-card__controls-item`)) {
        event.preventDefault();
        element.classList.toggle(`film-card__controls-item--active`);
      }
      switch (element.dataset.actionType) {
        case `add-to-watchlist`:
          cardNew.isToWatch = !cardNew.isToWatch;
          this._onDataChange(cardNew);
          break;
        case `mark-as-watched`:
          cardNew.isWatched = !cardNew.isWatched;
          this._onDataChange(cardNew);
          break;
        case `favorite`:
          cardNew.isFavorite = !(cardNew.isFavorite);
          this._onDataChange(cardNew);
          break;
      }
    };
    card.getElement().querySelector(`.film-card__controls`).addEventListener(`click`, controlClickHandler);

    // Добавление коментариев
    const commentaries = filmDetails.getElement().querySelector(`.film-details__comments-list`);
    this._api.getComments(this._card.id)
      .then((comments) => {
        comments.forEach((commentary) => render(commentaries, new Comment(commentary).getElement()));
        const pressEnterHandler = (event) => {
          const commentInput = filmDetails.getElement().querySelector(`.film-details__comment-input`);
          if ((event.ctrlKey || event.metaKey) && event.key === `Enter` && commentInput.value !== ``) {
            blockComment();
            this._onCommentsChange({
              action: `create`,
              comment: {
                comment: commentInput.value,
                date: new Date(),
                emotion: `sleeping`
              },
              filmId: this._card.id,
              onError: this.onCommentError.bind(this)
            });
          }
        };
        filmDetails.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, pressEnterHandler);
        // Добавим обработчик кнопки delete в коментах
        filmDetails.getElement().querySelectorAll(`.film-details__comment`).forEach((button) => {
          button.addEventListener(`click`, onCommentDelete);
        });
      });
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

