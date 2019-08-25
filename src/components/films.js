import {createElementsFromTemplateAndData} from '../util.js';
import {getCardMarkup} from './card.js';
import {getShowMoreButton} from './show-more-button.js';
export const getFilms = (mainFilms, topRatedFilms, mostCommentedFilms) => `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      ${createElementsFromTemplateAndData(mainFilms, getCardMarkup)}
      </div>
      ${getShowMoreButton()}
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      ${createElementsFromTemplateAndData(topRatedFilms, getCardMarkup)}
      </div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      ${createElementsFromTemplateAndData(mostCommentedFilms, getCardMarkup)}
      </div>
    </section>
  </section>`;
