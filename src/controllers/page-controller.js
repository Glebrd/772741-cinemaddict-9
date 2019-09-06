import { Search } from '../components/search.js';
import { UserRating } from '../components/user-rating.js';
import { Sorting } from '../components/sorting.js';
import { Menu } from '../components/menu.js';
import { Films } from '../components/films.js';
import { EmptyFilms } from '../components/empty-films.js';
import { render, unrender, onEscButtonPress } from '../util.js';
import { ShowMoreButton } from '../components/show-more-button.js';
import { MovieController } from './movie-controller.js';
const NUMBER_OF_CARDS_PER_PAGE = 5;
const NUMBER_OF_TOP_RATED_FILMS = 2;
const NUMBER_OF_MOST_COMMENTED_FILMS = 2;
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

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
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
    this._sortedCards = this._cards;
    this._showMoreButtonIsActive = false;
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
    if (this._cards.length > this._currentNumberOfCardsOnPage) {
      render(document.querySelector(`.films-list`), this._showMoreButton.getElement());
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
    this._sortedCards = Sorting.sort(this._cards, evt.target.dataset.sortType);
    this._sortedCards.slice(0, this._currentNumberOfCardsOnPage).forEach((card) => this._renderCard(card, document.querySelector(`.films-list .films-list__container`)));
    // this.__renderShowMoreButton(this._sortedCards);
    let sortingButtons = this._sorting.getElement().querySelectorAll(`.sort__button--active`);
    sortingButtons.forEach((sortingButton) => {
      if (sortingButton !== evt.target) {
        sortingButton.classList.remove(`sort__button--active`);
      }
    });
    evt.target.classList.add(`sort__button--active`);
  }

  _renderCard(data, container) {
    const movieController = new MovieController(data, container, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _renderAllCards() {
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
      this._sortedCards.slice(0, this._currentNumberOfCardsOnPage).forEach((card) => this._renderCard(card, containerAllMovies));
      console.log(this._currentNumberOfCardsOnPage);
      cardsSortedByRating.slice(0, NUMBER_OF_TOP_RATED_FILMS).forEach((card) => this._renderCard(card, containerTopRated));
      cardsSortedByAmountOfComments.slice(0, NUMBER_OF_MOST_COMMENTED_FILMS).forEach((card) => this._renderCard(card, containerMostCommented));
      // Добавляем обработчик события для сортировки
      this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    }
  }

  _onDataChange(newData, oldData) {
    console.log(oldData.isFavorite);
    console.log(newData.isFavorite);
    this._sortedCards[this._sortedCards.findIndex((card) => card === oldData)] = newData;
    const renderedCards = document.querySelectorAll(`.film-card`);
    renderedCards.forEach((card) => unrender(card));
    this._renderAllCards(this._sortedCards);
  }

  _onChangeView() {
    console.log(this._subscriptions);
    this._subscriptions.forEach((subscription) => subscription());
  }

  init() {
    // Запускаем процесс рендеринга
    render(header, this._search.getElement());
    render(header, this._userRating.getElement());
    render(main, this._menu.getElement());
    render(main, this._sorting.getElement());
    this._renderAllCards();
  }
}
