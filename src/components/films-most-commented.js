import {AbstractComponent} from './abstract-component';
export class FilmsMostCommented extends AbstractComponent {
  getTemplate() {
    return `<section class="films-list--extra">
          <h2 class="films-list__title">Most commented</h2>
          <div class="films-list__container films-list__container--commented">
          </div>
        </section>`;
  }
}
