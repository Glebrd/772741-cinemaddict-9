import {getSearchMarkup} from './components/search.js';
import {getUserRating} from './components/user-rating.js';
import {getSorting} from './components/sorting.js';
import {getMenu} from './components/menu.js';
import {getFilms} from './components/films.js';
import {getFilmDetails} from './components/film-details.js';
import {getCardsData} from "./data";

const NUMBER_OF_MAIN_FILMS = 5;
const NUMBER_OF_TOP_RATED_FILMS = 2;
const NUMBER_OF_MOST_COMMENTED_FILMS = 2;

// Сохраняем данные для карточек в переменную
const cards = getCardsData(NUMBER_OF_MAIN_FILMS);
console.log(cards);

const addBlock = (container, markup) => {
  container.insertAdjacentHTML(`beforeend`, markup);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);

// Форма поиска + Рейтинг пользователя
addBlock(header, getSearchMarkup() + getUserRating());
// Меню + Сортировка + Фильмы
addBlock(main, getMenu() + getSorting() + getFilms(cards, cards, cards));
// Попап
addBlock(body, getFilmDetails());

