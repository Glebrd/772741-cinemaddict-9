import {Search} from './components/search.js';
import {UserRating} from './components/user-rating.js';
import {Sorting} from './components/sorting.js';
import {Menu} from './components/menu.js';
import {Films} from './components/films.js';
import {FilmDetails} from './components/film-details.js';
import {getCardsData, getFiltersData, getUserRankData} from "./data.js";
import {render, unrender, onEscButtonPress} from './util.js';
import {Card} from './components/card.js';
import {ShowMoreButton} from './components/show-more-button.js';

const NUMBER_OF_CARDS = 16;
const NUMBER_OF_CARDS_PER_PAGE = 5;
const NUMBER_OF_TOP_RATED_FILMS = 2;
const NUMBER_OF_MOST_COMMENTED_FILMS = 2;

const sortByRating = (data) => {
  return data.slice().sort((a, b) => b.rating - a.rating);
};

const sortByAmountOfComments = (data) => {
  return data.slice().sort((a, b) => b.comments.length - a.comments.length);
};

// Сохраняем данные для карточек в переменную
const cards = getCardsData(NUMBER_OF_CARDS);
const cardsSortedByRating = sortByRating(cards).slice(0, NUMBER_OF_TOP_RATED_FILMS);
const cardsSortedByAmountOfComments = sortByAmountOfComments(cards).slice(0, NUMBER_OF_MOST_COMMENTED_FILMS);
const filtersData = getFiltersData(cards);

// Для полседующей вставки компонентов
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

// Создаём экземпляры объектов (компонентов)
const search = new Search();
const userRating = new UserRating(getUserRankData(filtersData[filtersData.findIndex((element) => element.title === `History`)].count));
const menu = new Menu(filtersData);
const sorting = new Sorting();
const films = new Films();
const showMoreButton = new ShowMoreButton();


// Запускаем процесс рендеринга
render(header, search.getElement());
render(header, userRating.getElement());
render(main, menu.getElement());
render(main, sorting.getElement());
render(main, films.getElement());

// Код, который создаст экземпляры объектов и запустит процесс рендеринга (для карточки и попапа)

const renderCard = (data, container) => {
  const card = new Card(data);
  const filmDetails = new FilmDetails(data); // Сделать функцию
  // Открытие попапа
  const openDetails = () => {
    render(main, filmDetails.getElement());
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
};

// Массово рендерим карточки фильмов
// Берём данные карточек и отправляем их в функцию рендера.
const board = document.querySelector(`.films-list`);
const containerAllMovies = document.querySelector(`.films-list .films-list__container`);
const containerTopRated = main.querySelector(`.films-list__container--top`);
const containerMostCommented = main.querySelector(`.films-list__container--commented`);
cards.slice(0, NUMBER_OF_CARDS_PER_PAGE).forEach((card) => renderCard(card, containerAllMovies));
cardsSortedByRating.forEach((card) => renderCard(card, containerTopRated));
cardsSortedByAmountOfComments.forEach((card) => renderCard(card, containerMostCommented));

//* Для добавления карточек, по нажатию на кнопку
// Текущее количество карточек на странице
let currentNumberOfCardsOnPage = NUMBER_OF_CARDS_PER_PAGE;

// Добавление дополнтельных карточек на страницу (по нажатию на кнопку LoadMoreButton)
const renderShowMoreButton = () => {
  // Обработчик клика на кнопку showmore
  const onShowMoreButtonClick = () => {
    cards.slice(currentNumberOfCardsOnPage, currentNumberOfCardsOnPage + NUMBER_OF_CARDS_PER_PAGE).forEach((card) => renderCard(card, containerAllMovies));
    currentNumberOfCardsOnPage += NUMBER_OF_CARDS_PER_PAGE;
    if (cards.length <= currentNumberOfCardsOnPage) {
      showMoreButton.getElement().removeEventListener(`click`, onShowMoreButtonClick);
      showMoreButton.removeElement();
    }
  };
  // Рендер кнопки showmore
  if (cards.length > NUMBER_OF_CARDS_PER_PAGE) {
    render(board, showMoreButton.getElement());
    showMoreButton.getElement().addEventListener(`click`, onShowMoreButtonClick);
  }
};
renderShowMoreButton();
