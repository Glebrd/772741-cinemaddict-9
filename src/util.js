const ESC_KEYCODE = 27;

export const getAmountOfDaysBeteweenToDates = (date) => {
  return date.toLocaleDateString(`en-US`, {
    year: `2-digit`,
    day: `2-digit`,
    month: `2-digit`,
  });
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

export const onEscButtonPress = (event, action) => {
  if (event.keyCode === ESC_KEYCODE) {
    action();
  }
};

export const createArrayFromObject = (object) => Object.keys(object).map((id) => object[id]);
