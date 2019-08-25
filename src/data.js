import {getRandomElementFromArray, getRandomElementsFromArray, getRandomDate, getRandomNumber} from "./util";

const MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY = 1;
const MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY = 3;

const MOVIE_TITLES = [
  `Psycho`,
  `Rosemary’s Baby`,
  `Don’t Look Now`,
  `The Wicker Man`,
  `The Shining`,
  `The Exorcist`,
  `Nosferatu`,
  `Vampyr`,
  `The Haunting`,
  `Texas Chainsaw Massacre`,
  `Bride of Frankenstein`,
  `Dracula`,
  `Carrie`,
  `Alien`,
  `Day the Earth Stood Still`,
];

const POSTERS = [
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg"`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
];

const MOVIE_DESCTIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const DIRECTORS = [
  `John Carpenter`,
  `Wes Craven`,
  `Alfred Hitchcock`,
  `George A. Romero`,
  `Stanley Kubrick`,
];

const WRITERS = [
  `Dan O'Bannon`,
  `Ronald Shusett`,
  `Joseph Stefano`,
  `Robert Bloch`,
  `Sam Raimi`,
];

const ACTORS = [
  `Max von Sydow`,
  `Bruce Campbell`,
  `Robert Englund`,
  `Sir Christopher Lee`,
  `Bela Lugosi`,
];

const COUNTRIES = [
  `United States of America`,
  `India`,
  `France`,
  `Japan`,
  `Italy`,
];

const GENRES = [
  `Drama`,
  `Mystery`,
  `Comedy`,
  `Musical`,
  `Cartoon`,
  `Western`,
];

const COMMENTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
];

const EMOJIS = [
  `./images/emoji/smile.png`,
  `./images/emoji/puke.png`,
  `./images/emoji/sleeping.png`,
  `./images/emoji/trophy.png`,
  `./images/emoji/angry.png`,
];


// Структура данных для комментария
const getCommentData = () => ({
  author: getRandomElementFromArray(DIRECTORS, getRandomNumber(MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY, MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY)),
  date: getRandomDate(new Date(2000, 2, 22), new Date()),
  text: getRandomElementFromArray(COMMENTS),
  emoji: getRandomElementFromArray(EMOJIS),
});

// Структура данных для всех комментариев

export const getCommentsData = () => {
  return new Array(getRandomNumber(MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY, MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY)).fill(``).map(getCommentData);
};


// Структура данных для карточки
const getCardData = () => ({
  title: getRandomElementFromArray(MOVIE_TITLES),
  rating: (Math.random() * 10).toFixed(1),
  originalTitle: getRandomElementFromArray(MOVIE_TITLES),
  poster: getRandomElementFromArray(POSTERS),
  director: getRandomElementsFromArray(DIRECTORS, getRandomNumber(MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY, MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY)),
  writers: getRandomElementsFromArray(WRITERS, getRandomNumber(MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY, MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY)),
  actors: getRandomElementsFromArray(ACTORS, getRandomNumber(MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY, MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY)),
  releaseDate: getRandomDate(new Date(1885, 2, 22), new Date()),
  duration: getRandomNumber(1, 300),
  country: getRandomElementFromArray(COUNTRIES),
  age: getRandomNumber(6, 18),
  genres: getRandomElementsFromArray(GENRES, getRandomNumber(MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY, MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY)),
  description: getRandomElementsFromArray(MOVIE_DESCTIPTIONS, getRandomNumber(MIN_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY, MAX_NUMBER_OF_MOCK_ELEMENTS_IN_ARRAY)),
  isToWatch: Boolean(Math.round(Math.random())),
  isWatched: Boolean(Math.round(Math.random())),
  isFavorite: Boolean(Math.round(Math.random())),
  comments: getCommentsData(),
});

// Структура данных для всех карточек

export const getCardsData = (count) => {
  return new Array(count).fill(``).map(getCardData);
};
