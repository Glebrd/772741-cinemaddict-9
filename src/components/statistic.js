import AbstractComponent from './abstract-component.js';
import UserRating from '../components/user-rating.js';
import moment from 'moment';

const FILTERS = [
  {title: `All time`, value: `all-time`},
  {title: `Today`, value: `today`},
  {title: `Week`, value: `week`},
  {title: `Month`, value: `month`},
  {title: `Year`, value: `year`},
];
// Поиск самого чатого жанра
const getMostFrequent = (genresCount) => {
  return Object.keys(genresCount).find((key) => genresCount[key] === Math.max(...Object.values(genresCount)));
};

class Statistic extends AbstractComponent {
  constructor({rank, watchedQuantity, watchedDuration, topGenre, activeFilter}) {
    super();
    this._rank = rank;
    this._watchedQuantity = watchedQuantity;
    this._watchedDuration = watchedDuration;
    this._topGenre = topGenre;
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return `<section class="statistic">
      <p class="statistic__rank">Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">
        ${UserRating.getUserRank(this._rank)}
        </span>
      </p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${FILTERS.map((filter) => `
          <input
            type="radio"
            class="statistic__filters-input visually-hidden"
            name="statistic-filter"
            id="statistic-${filter.value}"
            value="${filter.value}"
            ${this._activeFilter === filter.value ? `checked` : ``}>
          <label for="statistic-${filter.value}" class="statistic__filters-label">${filter.title}</label>`).join(``)}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${this._watchedQuantity || 0}
            <span class="statistic__item-description">movies</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${moment.duration(this._watchedDuration, `minutes`).hours() || 0}
            <span class="statistic__item-description">h</span>${moment.duration(this._watchedDuration, `minutes`).minutes() || 0}
            <span class="statistic__item-description">m</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${this._topGenre || `-`}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
     </section>
   `;
  }

  static getMostFrequentGenre(genres) {
    return getMostFrequent(genres);
  }
}

export default Statistic;
