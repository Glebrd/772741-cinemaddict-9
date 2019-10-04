import AbstractComponent from './abstract-component';
class Films extends AbstractComponent {
  getTemplate() {
    return `<section class="films"></section>`;
  }
}

export default Films;
