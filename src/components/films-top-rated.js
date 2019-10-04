import AbstractComponent from './abstract-component';
class FilmsTopRated extends AbstractComponent {
  getTemplate() {
    return `<section class="films-list--extra">
          <h2 class="films-list__title">Top rated</h2>
          <div class="films-list__container films-list__container--top">
          </div>
        </section>`;
  }
}

export default FilmsTopRated;
