import {AbstractComponent} from './abstract-component';


const sortCardsByRating = (cards) => {
  return cards.slice().sort((a, b) => b.rating - a.rating);
};

const sortCardsByComments = (cards) => {
  return cards.slice().sort((a, b) => b.comments.length - a.comments.length);
};

const sortCardsByDate = (cards) => {
  console.log(cards.slice().sort((a, b) => b.releaseDate - a.releaseDate));
  return cards.slice().sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
};

export class Sorting extends AbstractComponent {
  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" data-sort-type="default" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="date-down" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="rating-down" class="sort__button">Sort by rating</a></li>
    </ul>`;
  }
  static sortCards(cards, sortType) {
    switch (sortType) {
      case `rating-down`:
        return sortCardsByRating(cards);
      case `comments-down`:
        return sortCardsByComments(cards);
      case `date-down`:
        return sortCardsByDate(cards);
      case `default`:
        return cards;
    }
    return null;
  }
}


