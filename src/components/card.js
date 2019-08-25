import {convertMinutesToMovieTimeFormat} from "../util";
export const getCards = (items, getTemplate) => {
  const templates = items.map((item) => getTemplate(item));

  return templates.join(``).trim();
};

export const getCardMarkup = ({description, rating, poster, releaseDate, duration, genres}) => `<article class="film-card">
<h3 class="film-card__title">The Dance of Life</h3>
<p class="film-card__rating">${rating}</p>
<p class="film-card__info">
  <span class="film-card__year">${releaseDate.getFullYear()}</span>
  <span class="film-card__duration">${convertMinutesToMovieTimeFormat(duration)}</span>
  <span class="film-card__genre">${genres[0]}</span>
</p>
<img src="${poster}" alt="" class="film-card__poster">
<p class="film-card__description">${description}</p>
<a class="film-card__comments">5 comments</a>
<form class="film-card__controls">
  <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
  <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
  <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
</form>
</article>`;
