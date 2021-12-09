import View from "./View";
import icons from "url:../../img/icons.svg"; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  //Private methods
  #buttonNextMarkup(currPage) {
    return `
        <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }

  #buttonPreviousMarkup(currPage) {
    return `
        <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>
      `;
  }

  //Protected method (By convention) accessible by parent class
  _generateMarkup() {
    const currPage = this._data.page;
    //How do we know the number of pages? We need number of results
    //divided by the numner of results per page. For example if we
    //had 60 results and 10 results per page, then we had six pages
    const numPages = Math.ceil(this._data.results.length / this._data.resultPerPage);
    //if this is Page 1 and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this.#buttonNextMarkup(currPage);
    }

    //on the LAST page
    if (currPage === numPages && numPages > 1) {
      return this.#buttonPreviousMarkup(currPage);
    }
    //on OTHER page - the current page is less that the number of pages
    if (currPage < numPages) {
      //Return multiple function
      return [this.#buttonNextMarkup(currPage), this.#buttonPreviousMarkup(currPage)];
    }

    //if this is Page 1 and there are NO other pages
    //(don't render any buttons when there is no pages)
    return "";
  }

  //Public method - access to controller module or outside of class
  addHandlerClick(handler) {
    //Event delegation - need to know which button was actually clicked based on the event
    this._parentElement.addEventListener("click", function (event) {
      //closest() for children element, it searches up in the tree, look for parent element
      const btn = event.target.closest(".btn--inline");
      //IF there is no button exist the function (Type-Guard)
      if (!btn) return;
      //To access custom data-* attributes use the dataset property
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage); //call controlPagination and pass argument
    });
  }
}

export default new PaginationView();
