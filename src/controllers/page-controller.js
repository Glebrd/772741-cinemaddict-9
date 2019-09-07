import { Search } from '../components/search.js';
import { UserRating } from '../components/user-rating.js';
import { Sorting } from '../components/sorting.js';
import { Menu } from '../components/menu.js';
import { Films } from '../components/films.js';
import { FilmsAll } from '../components/films-all.js';
import { FilmsMostCommented } from '../components/films-most-commented.js';
import { FilmsTopRated } from '../components/films-top-rated.js';
import { EmptyFilms } from '../components/empty-films.js';
import { render, unrender, onEscButtonPress } from '../util.js';
import { ShowMoreButton } from '../components/show-more-button.js';
import { MovieController } from './movie-controller.js';
const NUMBER_OF_CARDS_PER_PAGE = 5;
const NUMBER_OF_TOP_RATED_FILMS = 2;
const NUMBER_OF_MOST_COMMENTED_FILMS = 2;

export class PageController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._sortedCards = this._cards;
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
    this._filmsAll = new FilmsAll();
    this._filmsMostCommented = new FilmsMostCommented();
    this._filmsTopRated = new FilmsTopRated();
    this._showMoreButton = new ShowMoreButton();
    // Для предотращение навешивания лишних обработчиков на кнопку
    this._showMoreButtonIsActive = false;
    // Для наблюдателя
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];

  }

  // Для добавления карточек, по нажатию на кнопку showMoreButton
  _renderShowMoreButton() {
    // Обработчик клика на кнопку showmore
    const onShowMoreButtonClick = () => {
      this._cards.slice(this._currentNumberOfCardsOnPage, this._currentNumberOfCardsOnPage + NUMBER_OF_CARDS_PER_PAGE).forEach((card) => this._renderCard(card, this._filmsAll.getElement().querySelector(`.films-list__container`)));
      this._currentNumberOfCardsOnPage += NUMBER_OF_CARDS_PER_PAGE;
      if (this._cards.length <= this._currentNumberOfCardsOnPage) {
        this._showMoreButton.getElement().removeEventListener(`click`, onShowMoreButtonClick);
        this._showMoreButton.removeElement();
      }
    };
    // Рендер кнопки showmore
    if (this._cards.length > this._currentNumberOfCardsOnPage) {
      render(this._filmsAll.getElement(), this._showMoreButton.getElement());
      if (!this._showMoreButtonIsActive) {
        this._showMoreButton.getElement().addEventListener(`click`, onShowMoreButtonClick);
        this._showMoreButtonIsActive = true;
      }
    }
  }

  // Обработчик клика по сортировке
  _onSortLinkClick(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    document.querySelector(`.films-list .films-list__container`).innerHTML = ``;
    this._sortedCards = Sorting.sortCards(this._cards, evt.target.dataset.sortType);
    this._sortedCards.slice(0, this._currentNumberOfCardsOnPage).forEach((card) => this._renderCard(card, this._filmsAll.getElement().querySelector(`.films-list__container`)));
    // this.__renderShowMoreButton(this._sortedCards);
    let sortingButtons = this._sorting.getElement().querySelectorAll(`.sort__button--active`);
    sortingButtons.forEach((sortingButton) => {
      if (sortingButton !== evt.target) {
        sortingButton.classList.remove(`sort__button--active`);
      }
    });
    evt.target.classList.add(`sort__button--active`);
  }

  // Отрисовка одной карточки
  _renderCard(data, container) {
    const movieController = new MovieController(data, container, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  // Отрисовка всех карточек
  _renderAllCards() {
    // Проверка, есть ли карточки фильмов
    if (this._cards === []) {
      let emptyFilms = new EmptyFilms(`no-cards`);
      render(this._container, emptyFilms.getElement());
    } else {
      render(this._container, this._films.getElement());
      render(this._films.getElement(), this._filmsAll.getElement());
      render(this._films.getElement(), this._filmsMostCommented.getElement());
      render(this._films.getElement(), this._filmsTopRated.getElement());
      this._renderShowMoreButton();
      // Массово рендерим карточки фильмов
      // Сортируем данные карточек
      const cardsSortedByRating = Sorting.sortCards(this._cards, `rating-down`);
      const cardsSortedByAmountOfComments = Sorting.sortCards(this._cards, `comments-down`);
      // Берём данные карточек и отправляем их в функцию рендера.
      this._sortedCards.slice(0, this._currentNumberOfCardsOnPage).forEach((card) => this._renderCard(card, this._filmsAll.getElement().querySelector(`.films-list__container`)));
      cardsSortedByRating.slice(0, NUMBER_OF_TOP_RATED_FILMS).forEach((card) => this._renderCard(card, this._filmsTopRated.getElement().querySelector(`.films-list__container`)));
      cardsSortedByAmountOfComments.slice(0, NUMBER_OF_MOST_COMMENTED_FILMS).forEach((card) => this._renderCard(card, this._filmsMostCommented.getElement().querySelector(`.films-list__container`)));
      // Добавляем обработчик события для сортировки
      this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    }
  }

  _onDataChange(newData, oldData) {
    this._sortedCards[this._sortedCards.findIndex((card) => card === oldData)] = newData;
    const renderedCards = document.querySelectorAll(`.film-card`);
    renderedCards.forEach((card) => unrender(card));
    this._renderAllCards(this._sortedCards);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  init() {
    // Запускаем процесс рендеринга
    const header = document.querySelector(`.header`);
    render(header, this._search.getElement());
    render(header, this._userRating.getElement());
    render(this._container, this._menu.getElement());
    render(this._container, this._sorting.getElement());
    this._renderAllCards();
  }
}
