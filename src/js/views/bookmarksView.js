import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView._generateMarkup(bookmark))
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarksView();
