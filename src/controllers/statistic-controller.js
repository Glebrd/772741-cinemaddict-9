import { Statistic } from '../components/statistic';
import { unrender, render } from '../util';
import { Menu } from '../components/menu';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

export class StatisticController {
  constructor(container) {
    this._container = container;
    this._statistic = null;
    this._activeFilter = `all-time`;
    this._watchedList = [];
    this._filteredList = [];
    this._allGenres = [];
    this._topGenre = null;
    this._watchedQuantity = null;
    this._watchedDuration = null;
    this._chart = null;

    this._onFilterClick = this._onFilterClick.bind(this);
  }


  show(cards) {
    this._onFirstStatisticOpen(cards);
    this._initStatistic(cards);
    this._render();
  }

  hide() {
    this._unrender();
  }

  // При первом открытии статистики,отбираем всё просмотренные карточки
  _onFirstStatisticOpen(cards) {
    this._watchedList = Menu.filterCards(cards, `history`);
    this._filteredList = this._watchedList;
  }

  // Обработка кликов на фильтры статистики (после изначального открытия)
  _initStatistic(cards) {
    this._filteredList = cards;
    this._watchedQuantity = this._filteredList.length;
    this._watchedDuration = this._filteredList.reduce((accumulator, film) => accumulator + film.duration, 0);
    // Объединяем массивы жанров из карточек в один массив.
    this._allGenres = this._filteredList.reduce((accum, film) => accum.concat(film.genres), []);
    // Проверяем, что жанры есть
    if (this._allGenres.length) {
      // Преобразуем массив в объект формата НазваниеЖанра: Количество.
      this._allGenres = this._allGenres.reduce((accum, current) => {
        accum[current] = (accum[current] || 0) + 1; return accum;
      }, {});
    }
    // сортируем в порядке убывания значения ключа
    // Берём массив ключей объекта, сортируем его
    const sortedArrayOfKeys = Object.keys(this._allGenres).sort((a, b) => this._allGenres[b] - this._allGenres[a]);
    // Преобразуем массив обратно в объект
    this._allGenres = sortedArrayOfKeys.reduce((object, key) => Object.assign(object, { [key]: this._allGenres[key] }), {});
    // Определяем топ жанр
    this._topGenre = Statistic.getMostFrequentGenre(this._allGenres);
  }

  _render() {
    this._unrender();

    this._statistic = new Statistic({
      rank: this._watchedList.length,
      watchedQuantity: this._watchedQuantity,
      watchedDuration: this._watchedDuration,
      topGenre: this._topGenre,
      activeFilter: this._activeFilter,
    });

    render(this._container, this._statistic.getElement());
    this.renderChart();
    // Навешиваем обработички на фильтры
    this._statistic.getElement().querySelectorAll(`.statistic__filters-input`)
      .forEach((input) => input.addEventListener(`click`, this._onFilterClick));
  }

  _unrender() {
    if (this._statistic) {
      unrender(this._statistic.getElement());
      this._statistic.removeElement();
    }
  }
  // Обработка клика по фильтрам статистики
  _onFilterClick(event) {
    const getFilteredFilms = () => {
      switch (event.target.value) {
        case `today`:
          return this._watchedList.filter((film) => moment().isSame(moment(film.watchingDate), `day`));
        case `week`:
          return this._watchedList.filter((film) => moment(film.watchingDate) > moment().subtract(1, `w`));
        case `month`:
          return this._watchedList.filter((film) => moment(film.watchingDate) > moment().subtract(1, `months`));
        case `year`:
          return this._watchedList.filter((film) => moment(film.watchingDate) > moment().subtract(1, `y`));
      }
      return this._watchedList;
    };

    // Устанавливаем активный фильтр
    this._activeFilter = event.target.value;
    // Отрисовываем обновленную статистику
    this._initStatistic(getFilteredFilms());
    this._render();
  }

  renderChart() {
    const canvas = this._statistic.getElement().querySelector(`.statistic__chart`);
    this._chart = new Chart(canvas, this._getChart());
  }

  // Настройки Чарта
  _getChart() {
    console.log(this._allGenres);
    const labels = Object.keys(this._allGenres);
    const data = Object.values(this._allGenres);

    const StatisticBar = {
      data: {
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
      },
      options: {
        datalabel: {
          fontSize: 25,
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        },
        animationEasing: `easeInOutQuad`,
        yAxes: {
          barThickness: 20,
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 25,
          },
        }
      }
    };

    const barData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: StatisticBar.data.backgroundColor,
          hoverBackgroundColor: StatisticBar.data.hoverBackgroundColor,
          anchor: StatisticBar.data.anchor,
        },
      ],
    };
    const barOptions = {
      plugins: {
        datalabels: {
          font: { size: StatisticBar.options.datalabel.fontSize },
          color: StatisticBar.options.datalabel.color,
          anchor: StatisticBar.options.datalabel.anchor,
          align: StatisticBar.options.datalabel.align,
          offset: StatisticBar.options.datalabel.offset,
        },
      },
      animation: {
        easing: StatisticBar.options.animationEasing
      },
      scales: {
        yAxes: [{
          barThickness: StatisticBar.options.yAxes.barThickness,
          ticks: {
            fontColor: StatisticBar.options.yAxes.ticks.fontColor,
            padding: StatisticBar.options.yAxes.ticks.padding,
            fontSize: StatisticBar.options.yAxes.ticks.fontSize,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
        }],
      },
      legend: { display: false },
      tooltips: { enabled: false },
    };

    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: barData,
      options: barOptions,
    };
  }
}

