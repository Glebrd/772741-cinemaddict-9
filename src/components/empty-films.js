import {AbstractComponent} from './abstract-component';
export class EmptyFilms extends AbstractComponent {
  constructor(messageType) {
    super();
    this._message = this._getMessage(messageType);
  }
  _getMessage(messageType) {
    let result = null;
    switch (messageType) {
      case `no-cards`:
        result = `There are no movies in our database.`;
        break;
      case `empty-search`:
        result = `There is no movies for your request.`;
        break;
    }
    return result;
  }
  getTemplate() {
    return `<section class="films">
<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="no-result">
    ${this._message}
  </div>
</section>
</main>`;
  }
}
