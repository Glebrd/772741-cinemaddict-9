import {createElementsFromTemplateAndData, createElement} from "../util";
export class Menu {
  constructor(filters) {
    this._filters = filters;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    const getFilterMarkup = ({title, count}) => {
      return `<a href="${title.toLowerCase()}" class="main-navigation__item">${title} <span class="main-navigation__item-count">${count}</span></a>`;
    };

    return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${createElementsFromTemplateAndData(this._filters, getFilterMarkup)}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`;
  }

  // Расчёт для фильтров
  static getFiltersCount(cards) {

    let isToWatch = 0;
    let isWatched = 0;
    let isFavorite = 0;

    cards.forEach((card) => {
      isToWatch += card.isToWatch;
      isWatched += card.isWatched;
      isFavorite += card.isFavorite;
    });

    return [
      {title: `Watchlist`, count: isToWatch},
      {title: `History`, count: isWatched},
      {title: `Favorites`, count: isFavorite},
    ];
  }
}
