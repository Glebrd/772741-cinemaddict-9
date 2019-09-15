import {createElementsFromTemplateAndData} from "../util";
import {AbstractComponent} from './abstract-component';

const filterCardsByWatchlist = (cards) => {
  return cards.filter((card) => card.isToWatch === true);
};

const filterCardsByHistory = (cards) => {
  return cards.filter((card) => card.isWatched === true);
};

const filterCardsByFavorites = (cards) => {
  return cards.filter((card) => card.isFavorite === true);
};

export class Menu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
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

  static filterCards(cards, filterType) {
    switch (filterType) {
      case `#all`:
        return cards;
      case `watchlist`:
        return filterCardsByWatchlist(cards);
      case `history`:
        return filterCardsByHistory(cards);
      case `favorites`:
        return filterCardsByFavorites(cards);
    }
    return null;
  }
}
