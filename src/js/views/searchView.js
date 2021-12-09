class SearchView {
  _parentEl = document.querySelector(".search"); //contain the entire form

  getQuery() {
    //return the form text input value
    const query = this._parentEl.querySelector(".search__field").value;
    this._clearInput(); //clear the text input
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    //Listen for form submition click
    this._parentEl.addEventListener("submit", function (event) {
      //when we submit a form, we need to prevent the default action
      //because otherwise the page is going to reload
      event.preventDefault();
      handler(); //calling controSearchResult() function
    });
  }
}

export default new SearchView();
