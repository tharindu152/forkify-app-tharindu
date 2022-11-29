import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';
import 'core-js/stable';
import { async } from 'regenerator-runtime';
import { CLOSE_MODAL } from './config.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //Render spinner
    recipeView.renderSpinner();

    //resultsView to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //loading recipe
    await model.loadRecipe(id);

    //Rendering the recipe
    recipeView.render(model.state.recipe);

    //Update bookmark view whenever new recipe is selected
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //get search query form view
    const query = searchView.getQuery();

    if (!query) {
      throw new Error('Please enter a valid query');
      return;
    }

    //Load search results to state
    await model.loadSearchResults(query);

    //get recipes from model
    //Render search results
    resultsView.render(model.getSearchResultPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err.message);
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //set bookmarked to true
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(window.location.hash.slice(1));

  //Update the recipie view based on bookmarked? true:false
  recipeView.update(model.state.recipe);

  //bookmark view is always rendered. CSS classes makes this view visible only when hovered
  bookmarksView.render(model.state.bookmarks);
};

//Load the bookmarked recipes from local storage to the state. Then render it once when the window is loaded
//Then update the bookmarks view thereafter
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Render spinner
    addRecipeView.renderSpinner();

    //upload new recipe
    await model.uploadRecipie(newRecipe);

    //render new recipe
    recipeView.render(model.state.recipe);

    //Close add recipe modal in 1.5 sec
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);

    //Render success message
    addRecipeView.renderMessage();

    //render new bookmarks with new recipe
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Reload page
    setTimeout(function () {
      location.reload();
    }, 100);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
