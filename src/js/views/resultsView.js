import View from "./View";
import icons from "url:../../img/icons.svg"; // Parcel 2

class ResultsView extends View {
  //Protected Property - only children classes can access properties & methods
  _parentElement = document.querySelector(".results");
  _errorMessage = "There was no results for that query";
  _message = "";

  _generateMarkup() {
    //this data contain model.state.search.results from the big state in model module
    return this._data.map((result) => this._generateMarkupPreview(result)).join("");
  }

  _generateMarkupPreview(result) {
    //extract hash code without the hash symbol in the first element;
    const id = window.location.hash.slice(1);

    return `
        <li class="preview">
        <a class="preview__link ${
          result.id === id ? "preview__link--active" : ""
        }" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultsView();
