import {getCards} from './card.js';
import {getCardMarkup} from './card.js';
import {getShowMoreButton} from './show-more-button.js';
export const getFilms = (mainFilms, topRatedFilms, mostCommentedFilms) => `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      ${getCards(mainFilms, getCardMarkup)}
      </div>
      ${getShowMoreButton()}
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      ${getCards(topRatedFilms, getCardMarkup)}
      </div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      ${getCards(mostCommentedFilms, getCardMarkup)}
      </div>
    </section>
  </section>`;
