import AbstractComponent from './abstract-component.js';

class Emoji extends AbstractComponent {
  constructor(path) {
    super();
    this._path = path;
  }

  getTemplate() {
    return `<img src="${this._path}" width="55" height="55" alt="${this._path.split(`emoji/`).pop().split(`.`)[0]}">`;
  }
}

export default Emoji;
