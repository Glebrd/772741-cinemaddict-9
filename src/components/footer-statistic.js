import {AbstractComponent} from './abstract-component';

export class FooterStatistic extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }
  getTemplate() {
    return `<section class="footer__statistics">
    <p>${this._cards.length} movies inside</p>
  </section>`;
  }
}
