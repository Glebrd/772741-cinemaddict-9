import {getSearchMarkup} from './components/search.js';
import {getUserRating} from './components/user-rating.js';
import {getSorting} from './components/sorting.js';
import {getMenu} from './components/menu.js';
import {getFilms} from './components/films.js';
import {getFilmDetails} from './components/film-details.js';

const NUMBER_OF_MAIN_FILMS = 5;
const NUMBER_OF_TOP_RATED_FILMS = 2;
const NUMBER_OF_MOST_COMMENTED_FILMS = 2;

const addBlock = (container, markup) => {
  container.insertAdjacentHTML(`beforeend`, markup);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const body = document.querySelector(`body`);

// Форма поиска + Рейтинг пользователя
addBlock(header, getSearchMarkup() + getUserRating());
// Меню + Сортировка + Фильмы
addBlock(main, getMenu() + getSorting() + getFilms(NUMBER_OF_MAIN_FILMS, NUMBER_OF_TOP_RATED_FILMS, NUMBER_OF_MOST_COMMENTED_FILMS));
// Попап
addBlock(body, getFilmDetails());

