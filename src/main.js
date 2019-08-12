import {getSearchMarkup} from './components/search.js';
import {getUserRating} from './components/user-rating.js';
import {getSorting} from './components/sorting.js';
import {getMenu} from './components/menu.js';

const NUMBER_OF_CARDS = 3;

const addBlock = (container, markup) => {
  container.insertAdjacentHTML(`beforeend`, markup);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

// Форма поиска + Рейтинг пользователя
addBlock(header, getSearchMarkup() + getUserRating());
addBlock(main, getMenu() + getSorting());
