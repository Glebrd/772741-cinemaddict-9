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
    arrayWithRandomElements[i] = array[getRandomNumber(0, array.length - 1)];
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
