import {AbstractComponent} from './abstract-component';

const sort = (cards, sortType) => {
  let result = null;
  switch (sortType) {
    case `rating-down`:
      result = cards.slice().sort((a, b) => b.rating - a.rating);
      break;
    case `comments-down`:
      result = cards.slice().sort((a, b) => b.comments.length - a.comments.length);
      break;
    case `date-down`:
      result = cards.slice().sort((a, b) => b.releaseDate - a.releaseDate);
      break;
    case `default`:
      result = cards;
      break;
  }
  return result;
};

export class Sorting extends AbstractComponent {
  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="date-down" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating-down" class="sort__button">Sort by rating</a></li>
    </ul>`;
  }
  static sort(cards, sortType) {
    return sort(cards, sortType);
  }
}


