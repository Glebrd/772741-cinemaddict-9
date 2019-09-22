import {Search} from '../components/search.js';
import {UserRating} from '../components/user-rating.js';
import {Sorting} from '../components/sorting.js';
import {Menu} from '../components/menu.js';
import {Films} from '../components/films.js';
import {FilmsAll} from '../components/films-all.js';
import {FilmsMostCommented} from '../components/films-most-commented.js';
import {FilmsTopRated} from '../components/films-top-rated.js';
import {EmptyFilms} from '../components/empty-films.js';
import {render, unrender} from '../util.js';
import {ShowMoreButton} from '../components/show-more-button.js';
import {MovieController} from './movie-controller.js';
import {SearchController} from './search-controller.js';
import {StatisticController} from './statistic-controller.js';
const NUMBER_OF_CARDS_PER_PAGE = 5;
const NUMBER_OF_TOP_RATED_FILMS = 2;
const NUMBER_OF_MOST_COMMENTED_FILMS = 2;
const MINIMAL_QUERY_LENGTH = 3;

export class PageController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._sortedCards = this._cards;
    this._query = null;
    this._cardsAfterSearch = null;
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
    this._statisticController = new StatisticController(container);
    // Для предотращение навешивания лишних обработчиков на кнопку
    this._showMoreButtonIsActive = false;
    this._searchIsActive = false;
    this._filterIsActive = false;
    this._currentFilter = null;
    // Для наблюдателя
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
  }

  // Отрисовка одной карточки
  _renderCard(data, container) {
    const movieController = new MovieController(data, container, this._onDataChange, this._onChangeView);
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }
  // Отрисовка блока карточек
  _renderCards(cards, component) {
    const container = component.getElement().querySelector(`.films-list__container`);
    cards.forEach((card) => this._renderCard(card, container));
  }

  // Для добавления карточек, по нажатию на кнопку showMoreButton
  _renderShowMoreButton() {
    // Обработчик клика на кнопку showmore
    const onShowMoreButtonClick = () => {
      this._renderCards(this._sortedCards.slice(this._currentNumberOfCardsOnPage, this._currentNumberOfCardsOnPage + NUMBER_OF_CARDS_PER_PAGE), this._filmsAll);
      this._currentNumberOfCardsOnPage += NUMBER_OF_CARDS_PER_PAGE;
      if (this._sortedCards.length <= this._currentNumberOfCardsOnPage) {
        this._showMoreButton.getElement().removeEventListener(`click`, onShowMoreButtonClick);
        this._showMoreButton.removeElement();
      }
    };
    // Рендер кнопки showmore
    if (this._sortedCards.length > this._currentNumberOfCardsOnPage) {
      render(this._filmsAll.getElement(), this._showMoreButton.getElement());
      if (!this._showMoreButtonIsActive) {
        this._showMoreButton.getElement().addEventListener(`click`, onShowMoreButtonClick);
        this._showMoreButtonIsActive = true;
      }
    }
  }

  // Обработчик клика по сортировке
  _onSortLinkClick(event) {
    event.preventDefault();
    if (event.target.tagName !== `A`) {
      return;
    }
    document.querySelector(`.films-list .films-list__container`).innerHTML = ``;
    this._sortedCards = Sorting.sortCards(this._cards, event.target.dataset.sortType);
    this._renderCards(this._sortedCards.slice(0, this._currentNumberOfCardsOnPage), this._filmsAll);
    let sortingButtons = this._sorting.getElement().querySelectorAll(`.sort__button--active`);
    sortingButtons.forEach((sortingButton) => {
      if (sortingButton !== event.target) {
        sortingButton.classList.remove(`sort__button--active`);
      }
    });
    event.target.classList.add(`sort__button--active`);
  }

  // Отрисовка всех карточек на странице
  _renderAllCards() {
    // Проверка, есть ли карточки фильмов
    if (this._cards === []) {
      let emptyFilms = new EmptyFilms();
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
      this._renderCards(this._sortedCards.slice(0, this._currentNumberOfCardsOnPage), this._filmsAll);
      this._renderCards(cardsSortedByRating.slice(0, NUMBER_OF_TOP_RATED_FILMS), this._filmsTopRated);
      this._renderCards(cardsSortedByAmountOfComments.slice(0, NUMBER_OF_MOST_COMMENTED_FILMS), this._filmsMostCommented);
    }
  }

  _onDataChange(newData, oldData) {
    const index = this._sortedCards.findIndex((card) => card === oldData);
    this._sortedCards[index] = newData;
    if (this._searchIsActive) {
      const renderedCards = document.querySelectorAll(`.film-card`);
      renderedCards.forEach((card) => unrender(card));
      const searchController = new SearchController(this._query, this._cards);
      this._cardsAfterSearch = searchController.searchFilm();
      this._renderCards(this._cardsAfterSearch, this._filmsAll);
    } else if (this._filterIsActive) {
      const renderedCards = this._filmsAll.getElement().querySelectorAll(`.film-card`);
      renderedCards.forEach((card) => unrender(card));
      this._sortedCards = Menu.filterCards(this._sortedCards, this._currentFilter);
      this._renderCards(this._sortedCards.slice(0, this._currentNumberOfCardsOnPage), this._filmsAll);
    } else {
      const renderedCards = document.querySelectorAll(`.film-card`);
      renderedCards.forEach((card) => unrender(card));
      this._renderAllCards(this._sortedCards);
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  // Обработка всех кнопок статистики и смена цвета
  _onStatisticButtonClick(event) {
    if (event.target.tagName !== `A`) {
      return;
    }
    this._filterIsActive = true;
    let numberOfCardsToShow = null;
    event.preventDefault();
    let navigationButtons = this._menu.getElement().querySelectorAll(`.main-navigation__item`);
    navigationButtons.forEach((navigationButton) => {
      if (navigationButton !== event.target) {
        navigationButton.classList.remove(`main-navigation__item--active`);
      }
      if (event.target.classList.contains(`main-navigation__item--additional`)) {
        this._sorting.getElement().classList.add(`visually-hidden`);
        this._statisticController.show(this._cards);
        this._films.getElement().classList.add(`visually-hidden`);
      } else {
        this._films.getElement().classList.remove(`visually-hidden`);
        this._sorting.getElement().classList.remove(`visually-hidden`);
        document.querySelector(`.films-list .films-list__container`).innerHTML = ``;
        this._showMoreButton.removeElement();
        this._showMoreButtonIsActive = false;
        this._renderShowMoreButton();
        this._currentFilter = event.target.getAttribute(`href`);
        this._sortedCards = Menu.filterCards(this._cards, this._currentFilter);
        if (this._currentNumberOfCardsOnPage >= this._sortedCards.length) {
          numberOfCardsToShow = this._sortedCards.length;
        } else {
          numberOfCardsToShow = this._currentNumberOfCardsOnPage;
        }
        this._renderCards(this._sortedCards.slice(0, numberOfCardsToShow), this._filmsAll);
        this._currentNumberOfCardsOnPage = numberOfCardsToShow;
      }
      if (event.target.getAttribute(`href`) === `#all`) {
        this._filterIsActive = false;
      }
      event.target.classList.add(`main-navigation__item--active`);
    });
  }

  _renderPage() {
    // Запускаем процесс рендеринга
    const header = document.querySelector(`.header`);
    render(header, this._search.getElement());
    render(header, this._userRating.getElement());
    render(this._container, this._menu.getElement());
    render(this._container, this._sorting.getElement());
    this._renderAllCards();
    // Добавляем обработчик события для сортировки
    this._sorting.getElement().addEventListener(`click`, (event) => this._onSortLinkClick(event));
    // Добавляем обработчик события для показа статистики
    this._menu.getElement().addEventListener(`click`, (event) => this._onStatisticButtonClick(event));
  }

  init() {
    this._renderPage();

    // Поиск
    const searchInput = document.querySelector(`.search__field`);
    const searchResetButton = document.querySelector(`.search__reset`);

    searchResetButton.addEventListener(`click`, (event) => {
      event.preventDefault();
      searchInput.value = ``;
      const searchController = new SearchController();
      searchController.cancelSearch();
      this._showMoreButtonIsActive = false;
      this._renderPage();
      this._searchIsActive = false;
    });

    searchInput.addEventListener(`input`, () => {
      this._query = searchInput.value;
      const searchController = new SearchController(this._query, this._cards);

      if (this._query.length >= MINIMAL_QUERY_LENGTH) {
        // Удаляем элементы, которых нет на странице поиска
        this._menu.removeElement();
        this._sorting.removeElement();
        this._filmsMostCommented.removeElement();
        this._filmsTopRated.removeElement();
        this._showMoreButton.removeElement();
        // Получаем массив после поиска
        this._cardsAfterSearch = searchController.searchFilm();
        this._totalCardsAmount = this._cardsAfterSearch.length;
        this._renderCards(this._cardsAfterSearch, this._filmsAll);
        this._searchIsActive = true;
      } else if (this._query.length === 0) {
        searchController.cancelSearch();
        this._searchIsActive = false;
        this._renderPage();
        this._searchIsActive = false;
      }
    });
  }

}
