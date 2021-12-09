import * as model from "./model";
import { MODAL_CLOSE_TIMER } from "./config";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import bookmarksView from "./views/bookmarksView";
import paginationView from "./views/paginationView";
import addRecipeView from "./views/addRecipeView";

//Polyfill provide modern functionality on older browsers that do not natively support it
/**
 *  Includes polyfills for ECMAScript up to 2021: promises, symbols, collections,
 *  iterators, typed arrays, many other features
 */
import "core-js/stable";
//runtime support for compiled/transpiled async functions.
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime/runtime";

//Get Forkify receipe from API (REST API Application)
/**
 * Handlers are a way to run JavaScript code in case of user actions.
 */
const controlRecipe = async () => {
  try {
    //location is the entire url and return only hash and remove/slice #
    //When user click on search result, which display hashcode on URL
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //Step 0) Updates results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //Step 3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //Step 1) Loading Recipe data - it is a async function and it will return a promise, we
    //have to await that promise before we move to next step
    await model.loadRecipe(id);
    //Step 2) Rendering recipe (display to the webpage)
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error);
  }
};

//User searched results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1 - Get search query from form text input
    const query = searchView.getQuery();
    if (!query) return;
    //2 - based on query load search results from the rest API
    await model.loadSearchResults(query);
    //3 - render the results to the user
    //By default, it is page '1' and display 10 results only
    resultsView.render(model.getSearchResultsPage());
    //4 - render initial pagination buttons to the user
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

//User clicking Page buttons
const controlPagination = function (goToPage) {
  //1) Render new results based on the page number
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

//This function will be executed when the user clicks on the servering buttons
const controlServings = function (newServings) {
  //Update the recipe servings (in state) (Model module)
  model.updateServings(newServings);
  //Update the recipe view (Override the complete recipe view (render again))
  //recipeView.render(model.state.recipe);
  //Update only text and attributes in the DOM without re-render the entire view
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  //If not bookmark yet, then you can bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  //If already bookmarked, then you can un-bookmark
  else model.deleteBookMark(model.state.recipe.id);
  //Update it's attribute in recipe view
  recipeView.update(model.state.recipe);
  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  //display the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

//Send the new recipe data to the API
const controlAddRecipe = async function (newRecipe) {
  //if error occurs in uploadRecipe function
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Success Message
    addRecipeView.renderMessage();
    //Render bookrmark view
    bookmarksView.render(model.state.bookmarks);
    //Change/Update ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIMER * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  //step 1 it calls addHandlerRender() and pass in controlRecipe as arg
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  //Handle user submit button (form data)
  searchView.addHandlerSearch(controlSearchResults);
  //Hanlde user click button
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init(); //program start
