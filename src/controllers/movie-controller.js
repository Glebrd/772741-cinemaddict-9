import { Card } from '../components/card.js';
import { FilmDetails } from '../components/film-details.js';
import { render, unrender, onEscButtonPress, getID } from '../util.js';
import { Emoji } from '../components/emoji.js';
import { Comment } from '../components/comment.js';
import { API } from '../api.js';
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const body = document.querySelector(`body`);
export class MovieController {
  constructor(card, container, onDataChange, onChangeView) {
    this._card = card;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._container = container;
    this._api = new API({ endPoint: END_POINT, authorization: AUTHORIZATION });
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
    // Обработчик клика по кнопкам карточки
    const controlClickHandler = (event) => {
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
    // const commentaries = filmDetails.getElement().querySelector(`.film-details__comments-list`);
    // console.log(this._card.comments);
    // this._card.comments.map((commentary) => render(commentaries, new Comment(commentary).getElement()));


    const commentaries = filmDetails.getElement().querySelector(`.film-details__comments-list`);
    this._api.getComments(this._card.id)
      .then((comments) => {
        // console.log(comments);
        comments.forEach((commentary) => render(commentaries, new Comment(commentary).getElement()));
        const pressEnterHandler = (event) => {
          const commentInput = filmDetails.getElement().querySelector(`.film-details__comment-input`);
          if ((event.ctrlKey || event.metaKey) && event.key === `Enter` && commentInput.value !== ``) {
            const commentsList = filmDetails.getElement().querySelector(`.film-details__comments-list`);
            const commentData = {
              id: getID(),
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
        filmDetails.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, pressEnterHandler);
        // Добавим обработчик кнопки delete в коментах
        filmDetails.getElement().querySelectorAll(`.film-details__comment`).forEach((element) => {
          console.log(filmDetails.getElement().querySelectorAll(`.film-details__comment`));
          element.addEventListener(`click`, (event) => {
            if (event.target.classList.contains(`film-details__comment-delete`)) {
              event.preventDefault();
              const newCommentsData = this._card;
              const clickedCommentId = event.currentTarget.dataset.commentId;
              console.log(clickedCommentId);
              const clickedComment = newCommentsData.comments.find((comment) => comment.id === parseInt(clickedCommentId, 10));
              newCommentsData.comments = newCommentsData.comments.filter((item) => item !== clickedComment);
              this._onDataChange(newCommentsData);
            }
          });
        });
      });
    // Проверяем, был ли попап открыт до создания данного экземпляра объекта.  Если да, то обновляем.
    if (document.querySelector(`.film-details__title`)) {
      console.log('111');
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

