import {createElementsFromTemplateAndData} from "../util";

const getFilterMarkup = ({title, count}) =>
  `<a href="${title.toLowerCase()}" class="main-navigation__item">${title} <span class="main-navigation__item-count">${count}</span></a>`;

export const getMenu = (filters) => `<nav class="main-navigation">
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
${createElementsFromTemplateAndData(filters, getFilterMarkup)}
<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
</nav>`;
