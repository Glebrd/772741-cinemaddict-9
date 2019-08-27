import {getSearchMarkup} from './components/search.js';
import {getUserRating} from './components/user-rating.js';
import {getSorting} from './components/sorting.js';
import {getMenu} from './components/menu.js';
import {getFilms} from './components/films.js';
import {getFilmDetails} from './components/film-details.js';
import {getCardsData, getFiltersData, getUserRankData} from "./data";
import {createElementsFromTemplateAndData} from './util.js';
import {getCardMarkup} from './components/card.js';

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

const addBlock = (container, markup) => {
  container.insertAdjacentHTML(`beforeend`, markup);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);

// Форма поиска + Рейтинг пользователя
addBlock(header, getSearchMarkup() + getUserRating(getUserRankData(filtersData[filtersData.findIndex((element) => element.title === `History`)].count)));
// Меню + Сортировка + Фильмы
addBlock(main, getMenu(filtersData) + getSorting() + getFilms(cards.slice(0, NUMBER_OF_CARDS_PER_PAGE), cardsSortedByRating, cardsSortedByAmountOfComments));
// Попап
addBlock(body, getFilmDetails(cards[0]));

// Для доболвения карточек, по нажатию на кнопку
const loadMoreButton = document.querySelector(`.films-list__show-more`);
const board = document.querySelector(`.films-list__container`);

// Текучщее количество карточек на странице
let currentNumberOfCardsOnPage = NUMBER_OF_CARDS_PER_PAGE;

// Добавление дополнтельных карточек на страницу (по нажатию на кнопку LoadMoreButton)
const onLoadMoreButtonClick = () => {
  addBlock(board, createElementsFromTemplateAndData(cards.slice(currentNumberOfCardsOnPage, currentNumberOfCardsOnPage + NUMBER_OF_CARDS_PER_PAGE), getCardMarkup));
  currentNumberOfCardsOnPage += NUMBER_OF_CARDS_PER_PAGE;

  if (currentNumberOfCardsOnPage >= NUMBER_OF_CARDS) {
    loadMoreButton.classList.add(`visually-hidden`);
    loadMoreButton.removeEventListener(`click`, onLoadMoreButtonClick);
  }
};

loadMoreButton.addEventListener(`click`, onLoadMoreButtonClick);
