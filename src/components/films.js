import {AbstractComponent} from './abstract-component';
export class Films extends AbstractComponent {
  getTemplate() {
    return `<section class="films">
        <section class="films-list">
          <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
          <div class="films-list__container films-list__container--all">
          </div>
        </section>
        <section class="films-list--extra">
          <h2 class="films-list__title">Top rated</h2>
          <div class="films-list__container films-list__container--top">
          </div>
        </section>
        <section class="films-list--extra">
          <h2 class="films-list__title">Most commented</h2>
          <div class="films-list__container films-list__container--commented">
          </div>
        </section>
      </section>`;
  }

  static sort(data, sortType) {
    let result = null;
    switch (sortType) {
      case `rating-down`:
        result = data.slice().sort((a, b) => b.rating - a.rating);
        break;
      case `comments-down`:
        result = data.slice().sort((a, b) => b.comments.length - a.comments.length);
        break;
      case `date-down`:
        result = data.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case `default`:
        result = data;
        break;
    }
    return result;
  }
}
