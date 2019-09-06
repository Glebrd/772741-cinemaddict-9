import {Search} from '../components/search.js';
import {UserRating} from '../components/user-rating.js';
import {Sorting} from '../components/sorting.js';
import {Menu} from '../components/menu.js';
import {Films} from '../components/films.js';
import {EmptyFilms} from '../components/empty-films.js';
import {FilmDetails} from '../components/film-details.js';
import {render, unrender, onEscButtonPress} from '../util.js';
import {Card} from '../components/card.js';
import {ShowMoreButton} from '../components/show-more-button.js';
const NUMBER_OF_CARDS_PER_PAGE = 5;
const NUMBER_OF_TOP_RATED_FILMS = 2;
const NUMBER_OF_MOST_COMMENTED_FILMS = 2;


export class PageController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._filtersCount = Menu.getFiltersCount(cards);
    this._userRank = UserRating.getUserRank(this._filtersCount[this._filtersCount.findIndex((element) => element.title === `History`)].count);
    // Текущее количество карточек на странице
    this._currentNumberOfCardsOnPage = NUMBER_OF_CARDS_PER_PAGE;
    // Создаём экземпляры объектов (компонентов)
    this._search = new Search();
    this._userRating = new UserRating(this._userRank);
    this._menu = new Menu(this._filtersCount);
    this._sorting = new Sorting();
    this._films = new Films();
    this._showMoreButton = new ShowMoreButton();
  }

  // Код, который создаст экземпляры объектов и запустит процесс рендеринга (для карточки и попапа)

  _renderCard(data, container) {
    const card = new Card(data);
    const filmDetails = new FilmDetails(data);
    // Открытие попапа
    const openDetails = () => {
      render(container, filmDetails.getElement());
      document.addEventListener(`keydown`, onDetailsEscPress);
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
    render(container, card.getElement());
  }

  //* Для добавления карточек, по нажатию на кнопку showMoreButton
  // Добавление дополнтельных карточек на страницу (по нажатию на кнопку showMoreButton)
  _renderShowMoreButton() {
    // Обработчик клика на кнопку showmore
    const onShowMoreButtonClick = () => {
      this._cards.slice(this._currentNumberOfCardsOnPage, this._currentNumberOfCardsOnPage + NUMBER_OF_CARDS_PER_PAGE).forEach((card) => this._renderCard(card, document.querySelector(`.films-list .films-list__container`)));
      this._currentNumberOfCardsOnPage += NUMBER_OF_CARDS_PER_PAGE;
      if (this._cards.length <= this._currentNumberOfCardsOnPage) {
        this._showMoreButton.getElement().removeEventListener(`click`, onShowMoreButtonClick);
        this._showMoreButton.removeElement();
      }
    };
    // Рендер кнопки showmore
    if (this._cards.length > NUMBER_OF_CARDS_PER_PAGE) {
      render(document.querySelector(`.films-list`), this._showMoreButton.getElement());
      this._showMoreButton.getElement().addEventListener(`click`, onShowMoreButtonClick);
    }
  }

  init() {
    // Запускаем процесс рендеринга
    // Для полседующей вставки компонентов
    const header = document.querySelector(`.header`);
    const main = document.querySelector(`.main`);
    render(header, this._search.getElement());
    render(header, this._userRating.getElement());
    render(main, this._menu.getElement());
    render(main, this._sorting.getElement());
    // Проверка, есть ли карточки фильмов
    if (this._cards === []) {
      let emptyFilms = new EmptyFilms(`no-cards`);
      render(main, emptyFilms.getElement());
    } else {
      render(main, this._films.getElement());
      this._renderShowMoreButton();
      // Массово рендерим карточки фильмов
      // Берём данные карточек и отправляем их в функцию рендера.
      const cardsSortedByRating = Sorting.sort(this._cards, `rating-down`);
      const cardsSortedByAmountOfComments = Sorting.sort(this._cards, `comments-down`);
      const containerAllMovies = document.querySelector(`.films-list .films-list__container`);
      const containerTopRated = document.querySelector(`.films-list__container--top`);
      const containerMostCommented = document.querySelector(`.films-list__container--commented`);
      this._cards.slice(0, NUMBER_OF_CARDS_PER_PAGE).forEach((card) => this._renderCard(card, containerAllMovies));
      cardsSortedByRating.slice(0, NUMBER_OF_TOP_RATED_FILMS).forEach((card) => this._renderCard(card, containerTopRated));
      cardsSortedByAmountOfComments.slice(0, NUMBER_OF_MOST_COMMENTED_FILMS).forEach((card) => this._renderCard(card, containerMostCommented));
      // Обработчик клика по сортировке
      const onSortLinkClick = (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== `A`) {
          return;
        }
        containerAllMovies.innerHTML = ``;
        Sorting.sort(this._cards, evt.target.dataset.sortType).slice(0, NUMBER_OF_CARDS_PER_PAGE).forEach((card) => this._renderCard(card, containerAllMovies));
        let sortingButtons = this._sorting.getElement().querySelectorAll(`.sort__button--active`);
        sortingButtons.forEach((sortingButton) => {
          if (sortingButton !== evt.target) {
            sortingButton.classList.remove(`sort__button--active`);
          }
        });

        evt.target.classList.add(`sort__button--active`);
      };
      // Добавляем обработчик события для сортировки
      this._sorting.getElement().addEventListener(`click`, (evt) => onSortLinkClick(evt));
    }
  }
}
