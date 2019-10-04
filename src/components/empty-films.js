import AbstractComponent from './abstract-component';
class EmptyFilms extends AbstractComponent {

  getTemplate() {
    return `<section class="films">
<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="no-result">There are no movies in our database.</div>
</section>
</main>`;
  }
}

export default EmptyFilms;
