const ESC_KEYCODE = 27;
// Получение случайных значений
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Работа с массивами

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomElementFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomElementsFromArray = (array, numberOfElements) => {
  const arrayWithRandomElements = [];

  for (let i = 0; i < numberOfElements; i++) {
    arrayWithRandomElements[i] = getRandomElementFromArray(array);
  }
  return arrayWithRandomElements;
};

// Преобразования даты и времени

export const convertToFullDate = (date) => {
  return date.toLocaleDateString(`en-GB`, {
    day: `2-digit`,
    month: `long`,
    year: `numeric`,
  });
};

export const convertMinutesToMovieTimeFormat = (time) => {
  return `${Math.floor(time / 60)}h ${time % 60}m`;
};

export const getAmountOfDaysBeteweenToDates = (date1, date2) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Разное

export const createElementsFromTemplateAndData = (items, getTemplate) => {
  const templates = items.map((item) => getTemplate(item));

  return templates.join(``).trim();
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

// Рендер и анрендер для компонент
export const render = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const onEscButtonPress = (evt, action) => {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};
