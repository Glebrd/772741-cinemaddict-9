import {getCards} from './card.js';
import {getShowMoreButton} from './show-more-button.js';
export const getFilms = (numberOfMainFilms, numberOfTopRatedFilms, NumberOfMostCommentedFilms) => `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      ${getCards(numberOfMainFilms)}
      </div>
      ${getShowMoreButton()}
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      ${getCards(numberOfTopRatedFilms)}
      </div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      ${getCards(NumberOfMostCommentedFilms)}
      </div>
    </section>
  </section>`;
