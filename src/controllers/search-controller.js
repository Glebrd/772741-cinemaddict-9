import {render} from '../util.js';
import {EmptySearch} from '../components/empty-search.js';
import {ResultOfSearch} from '../components/result-of-search.js';

export class SearchController {
  constructor(searchPhrase, cards) {
    this._cards = cards;
    this._searchPhrase = searchPhrase;
    this._resultOfSearch = new ResultOfSearch();
  }

  // Поиск
  searchFilm() {
    // Очищаем контейнер, куда попадут результаты поиска
    document.querySelector(`.films-list__container`).innerHTML = ``;
    // Если поиск уже провдоился, то убираем старые результаты
    if (document.querySelector(`.result`)) {
      document.querySelector(`.result`).remove();
    }
    // Рендерим контейнер поиска
    render(document.querySelector(`main`), this._resultOfSearch.getElement(), `afterbegin`);
    // Сам поиск
    let pattern = new RegExp(this._searchPhrase, `i`);
    let cardsAfterSearch = this._cards.filter((element) => pattern.exec(element.title) !== null);
    // Сообщение для пустого результата
    if (cardsAfterSearch.length === 0) {
      render(document.querySelector(`.films-list__container`), new EmptySearch().getElement());
    }
    // Отображаем количесвто найденных карточек
    const searchResultCount = document.querySelector(`.result__count`);
    searchResultCount.textContent = cardsAfterSearch.length;
    return cardsAfterSearch;
  }

  // Отмена поиска
  cancelSearch() {
    // document.querySelector(`.result`).remove();
    this._resultOfSearch.removeElement();
    document.querySelector(`.films-list__container`).innerHTML = ``;
  }
}
