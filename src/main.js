import {getCardsData} from "./data.js";
import {PageController} from './controllers/page-controller.js';

const NUMBER_OF_CARDS = 16;
const main = document.querySelector(`.main`);

// Сохраняем данные для карточек в переменную
const cards = getCardsData(NUMBER_OF_CARDS);

const pageController = new PageController(main, cards);
pageController.init();
