import {AbstractComponent} from './abstract-component.js';

export class ResultOfSearch extends AbstractComponent {
  getTemplate() {
    return `<div class="result">
      <p class="result__text">Result <span class="result__count"></span></p>
    </div>`;
  }
}
