import View from "./View";
//For any static assets (images) we need to write url, our https://localhost:1234/
//is the dist folder and in there the file we need is icon.e707850...
import icons from "url:../../img/icons.svg";
import { Fraction } from "fractional";

class RecipeView extends View {
  //protected property - not accessbile from outside of class
  _parentElement = document.querySelector(".recipe");
  _errorMessage = `We could not find that recipe. Please try again`;
  _message = ``;

  //Rendering the recipe right at the beginning. This is a publisher
  //method, need to get access to the subscriber, in this case it is
  //the handler function (parameter)
  addHandlerRender(handler) {
    //Listen for events in the web browser (window)
    ["hashchange", "load"].forEach((event) => {
      window.addEventListener(event, handler);
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (event) {
      //closest() is useful for event delegation
      //event.target – is the “target” element that initiated the event
      const btn = event.target.closest(".btn--update-servings");
      //if we are clicking outside of the button, then this closest
      //will return null instead
      if (!btn) return; //exit the fucntion (TypeGuard)
      const updateTo = Number(btn.dataset.updateTo); //automatically converted to camelCase
      //Do not update to zero or anything below
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookMark(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const btn = event.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
        <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
            <h1 class="recipe__title">
            <span>${this._data.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">
                    ${this._data.cookingTime}
                </span>
                <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">
                    ${this._data.servings}
                </span>
                <span class="recipe__info-text">servings</span>
                <div class="recipe__info-buttons">
                    <button class="btn--tiny btn--update-servings" 
                        data-update-to="${this._data.servings - 1}">
                        <svg>
                            <use href="${icons}#icon-minus-circle"></use>
                        </svg>
                    </button>
                    <button class="btn--tiny btn--update-servings"
                        data-update-to="${this._data.servings + 1}">
                        <svg>
                            <use href="${icons}#icon-plus-circle"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round btn--bookmark">
                <svg class="">
                    <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
                </svg>
            </button>
        </div>
        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
                ${this._data.ingredients
                  //this private method will return the markup
                  .map((ing) => this._generateMarkupIngredient(ing))
                  //Make it a big strings
                  .join("")}
            </ul>
        </div>
        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${this._data.publisher}</span>. 
                Please check out directions at their website.
            </p>
            <a class="btn--small recipe__btn"
            href="${this._data.sourceURL}"
            target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </a>
        </div>
    `;
  } //end of generateMarkup

  _generateMarkupIngredient(ing) {
    return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ing.quantity ? new Fraction(ing.quantity).toString() : ""
              //If quantity does not exist, set value to empty string
            }</div>
            <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
            </div>         
        </li>
    `;
  }
} //end of clsss

export default new RecipeView(); //export object
