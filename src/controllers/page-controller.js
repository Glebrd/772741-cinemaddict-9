import Sorting from '../components/sorting.js';
import Search from '../components/search.js';
import Menu from '../components/menu.js';
import Films from '../components/films.js';
import UserRating from '../components/user-rating.js';
import FilmsAll from '../components/films-all.js';
import FilmsTopRated from '../components/films-top-rated.js';
import EmptyFilms from '../components/empty-films.js';
import FilmsMostCommented from '../components/films-most-commented.js';
import FooterStatistic from '../components/footer-statistic';
import {render, unrender} from '../util.js';
import ShowMoreButton from '../components/show-more-button.js';
import MovieController from './movie-controller.js';
import SearchController from './search-controller.js';
import StatisticController from './statistic-controller.js';
import API from '../api.js';
import Store from '../store';
import Provider from '../provider';

const MINIMAL_QUERY_LENGTH = 3;
const FILMS_STORE_KEY = `films-store-key`;

const PageConfig = {
  NUMBER_OF_CARDS_PER_PAGE: 5,
  NUMBER_OF_TOP_RATED_FILMS: 2,
  NUMBER_OF_MOST_COMMENTED_FILMS: 2,
};

class PageController {
  constructor(container) {
    this._store = new Store({key: FILMS_STORE_KEY, storage: window.localStorage});
    this._provider = new Provider({
      api: new API(),
      store: this._store,
    });
    this._container = container;
    this._cards = [];
    this._sortedCards = [];
    this._query = null;
    this._cardsAfterSearch = null;
    this._filtersCount = null;
    this._userRank = null;
    // Текущее количество карточек на странице
    this._currentNumberOfCardsOnPage = PageConfig.NUMBER_OF_CARDS_PER_PAGE;
    // Создаём экземпляры объектов (компонентов)
    this._search = new Search();
    this._userRating = null;
    this._menu = null;
    this._sorting = new Sorting();
    this._films = new Films();
    this._filmsAll = new FilmsAll();
    this._filmsMostCommented = new FilmsMostCommented();
    this._filmsTopRated = new FilmsTopRated();
    this._showMoreButton = new ShowMoreButton();
    this._statisticController = new StatisticController(container);
    this._footerStatistic = new FooterStatistic(this._sortedCards);
    // Для предотращение навешивания лишних обработчиков на кнопку
    this._showMoreButtonIsActive = false;
    this._searchIsActive = false;
    this._filterIsActive = false;
    this._currentFilter = null;
    // Для наблюдателя
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._subscriptions = [];
  }

  // Отрисовка одной карточки
  _renderCard(data, container) {
    const movieController = new MovieController(data, container, this._onDataChange, this._onChangeView, this._onCommentsChange);
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
      this._renderCards(this._sortedCards.slice(this._currentNumberOfCardsOnPage, this._currentNumberOfCardsOnPage + PageConfig.NUMBER_OF_CARDS_PER_PAGE), this._filmsAll);
      this._currentNumberOfCardsOnPage += PageConfig.NUMBER_OF_CARDS_PER_PAGE;
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
      render(document.querySelector(`.footer`), new FooterStatistic(this._sortedCards).getElement());
      this._renderShowMoreButton();
      // Обновляем меню
      if (document.querySelector(`.main-navigation`)) {
        this._menu.removeElement();
      }
      this._filtersCount = Menu.getFiltersCount(this._sortedCards);
      this._menu = new Menu(this._filtersCount);
      render(this._container, this._menu.getElement(), `afterbegin`);
      // Массово рендерим карточки фильмов
      // Сортируем данные карточек
      const cardsSortedByRating = Sorting.sortCards(this._cards, `rating-down`);
      const cardsSortedByAmountOfComments = Sorting.sortCards(this._cards, `comments-down`);
      // Берём данные карточек и отправляем их в функцию рендера.
      this._renderCards(this._sortedCards.slice(0, this._currentNumberOfCardsOnPage), this._filmsAll);
      this._renderCards(cardsSortedByRating.slice(0, PageConfig.NUMBER_OF_TOP_RATED_FILMS), this._filmsTopRated);
      this._renderCards(cardsSortedByAmountOfComments.slice(0, PageConfig.NUMBER_OF_MOST_COMMENTED_FILMS), this._filmsMostCommented);
      // Добавляем обработчик события для сортировки
      this._sorting.getElement().addEventListener(`click`, (event) => this._onSortLinkClick(event));
      // Добавляем обработчик события для показа статистики
      this._menu.getElement().addEventListener(`click`, (event) => this._onStatisticButtonClick(event));

    }
  }

  _refreshPage() {
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
      this._renderAllCards();
    }
  }

  _onDataChange(newData, onError = null) {
    this._provider.updateFilm({
      id: newData.id,
      data: newData.toRAW()
    })
      .then(() => this._provider.getFilms())
      .then((films) => {
        this._sortedCards = films;
      })
      .catch(() => {
        if (onError !== null) {
          onError();
        }
      })
      .then(() => {
        this._refreshPage(onError);
      });
  }
  _onCommentsChange({action, comment = null, filmId = null, commentId = null, onError = null}) {
    switch (action) {
      case `create`:
        this._provider.createComment({
          comment,
          filmId,
        })
          .then(() => this._provider.getFilms())
          .then((films) => {
            this._sortedCards = films;
          })
          .catch(() => {
            if (onError !== null) {
              onError();
            }
          })
          .then(() => {
            this._refreshPage(onError);
          });
        break;
      case `delete`:
        this._provider.deleteComment({
          commentId
        })
          .then(() => this._provider.getFilms())
          .then((films) => {
            this._sortedCards = films;
          })
          .catch(() => {
            if (onError !== null) {
              onError();
            }
          })
          .then(() => {
            this._refreshPage();
          });
        break;
    }
    return this._provider.getComments({filmId});
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
      // Открываем статистику
      if (event.target.classList.contains(`main-navigation__item--additional`)) {
        this._sorting.getElement().classList.add(`visually-hidden`);
        this._statisticController.show(this._cards);
        this._films.getElement().classList.add(`visually-hidden`);
      } else {
        // Обработка кликов по фильтрам
        this._films.getElement().classList.remove(`visually-hidden`);
        this._sorting.getElement().classList.remove(`visually-hidden`);
        document.querySelector(`.films-list .films-list__container`).innerHTML = ``;
        // Сбрасываем кнопку showMore
        this._showMoreButton.removeElement();
        this._showMoreButtonIsActive = false;
        this._renderShowMoreButton();
        // Фильтруем
        this._currentFilter = event.target.getAttribute(`href`);
        this._sortedCards = Menu.filterCards(this._cards, this._currentFilter);
        // Если в текущем фильтре карточек больше (с округлением до кратного 5), чем в новом, то показываем все карточки нового фильтра
        if (Math.ceil(this._currentNumberOfCardsOnPage / 5) * 5 >= this._sortedCards.length) {
          numberOfCardsToShow = this._sortedCards.length;
          // Если в текущем фильтре карточек меньше, чем в новом, то выводим ближайшее кратное 5.
        } else {
          numberOfCardsToShow = Math.ceil(this._currentNumberOfCardsOnPage / 5) * 5;
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
    // Запускаем процесс рендеринга.
    const header = document.querySelector(`.header`);
    render(header, this._search.getElement());
    render(header, this._userRating.getElement());
    render(this._container, this._sorting.getElement());
    this._renderAllCards();
  }


  _onOfflineState() {
    document.title = `${document.title}[OFFLINE]`;
  }

  _onOnlineState() {
    document.title = document.title.split(`[OFFLINE]`)[0];
    if (!this.provider) {
      return;
    } else {
      this._provider = new Provider({
        api: new API(),
        store: this._store,
      });
    }
    this._provider.syncFilms();
  }

  init() {
    this._provider.getFilms()
      .then((films) => {
        this._cards = films;
        this._sortedCards = films;
      }).then(() => {
        this._filtersCount = Menu.getFiltersCount(this._sortedCards);
        this._userRank = UserRating.getUserRank(this._filtersCount[this._filtersCount.findIndex((element) => element.title === `History`)].count);
        this._userRating = new UserRating(this._userRank);
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
      });
    window.addEventListener(`offline`, this._onOfflineState);
    window.addEventListener(`online`, this._onOnlineState);
  }
}

export default PageController;
