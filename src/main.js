import {PageController} from './controllers/page-controller.js';

const main = document.querySelector(`.main`);
const pageController = new PageController(main);
pageController.init();
