import AbstractComponent from './abstract-component';
class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export default ShowMoreButton;
