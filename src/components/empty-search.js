import AbstractComponent from './abstract-component.js';

class EmptySearch extends AbstractComponent {
  getTemplate() {
    return `<div class="no-result">There is no movies for your request.</div>`;
  }
}

export default EmptySearch;
