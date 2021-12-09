import View from "./View";
import icons from "url:../../img/icons.svg"; // Parcel 2

class AddRecipeView extends View {
  //Protected Property - only children classes can access properties & methods
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded";
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    //Only going to be used inside this class
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    //Remove the hidden classes
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  //call this function as soon as the page loads
  _addHandlerShowWindow() {
    //bind the correct this keyword
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    //click the upload button
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault(); //To prevent the default action of an event
      //'this' points to parentElement, which is the upload form.
      //Contains all the fields with all the in there
      const dataArr = [...new FormData(this)]; //spread objects into an array
      //Convert array of entries[key-value pair] to an object
      const data = Object.fromEntries(dataArr);
      //Pass this data to the controller
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
