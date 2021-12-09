//For any static assets (images) we need to write url, our https://localhost:1234/
//is the dist folder and in there the file we need is icon.e707850...
import icons from "url:../../img/icons.svg";

//Parent Class
export default class View {
  _data;

  //public methods
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {Object} View Instance
   * @author Elham
   */
  render(data) {
    //if there is no data or if there is a data but that data is an array & it is empty
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    //this data contain state objects
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    //Append before its first child of the element of the parent element.
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  //Update text and attributes only, not the entire view
  update(data) {
    //if there is no data or if there is a data but that data is an array & it is empty
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    //this data contain state objects
    this._data = data;
    //Create new markup but not render it. And then compare that new HTML to the current
    //HTML and only change text and attributes, that actually have changed from the old
    //version to the new version
    const newMarkup = this._generateMarkup(); //this is string type
    //Convert this markup string to DOM node object and then compare with actual DOM on
    //the page. Like a virtual DOM, DOM that is not really living on the page but lives
    //in the memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const currElements = Array.from(this._parentElement.querySelectorAll("*"));
    newElements.forEach((newEl, index) => {
      const currEl = currElements[index];

      //if new element not equal to the current element (Updates changed TEXT)
      if (!newEl.isEqualNode(currEl) && newEl.firstChild?.nodeValue.trim() != "") {
        //then we want to change the text content of the current element to the
        //text content of the new element. The current element is the acutal
        //element on the page and update it's value with the virtual elements (memory)
        currEl.textContent = newEl.textContent;
      }

      //(Updates changed Attributes) if newEl is not same as currEl (modified)
      if (!newEl.isEqualNode(currEl)) {
        //Then tranform Node it into Array and loop each attribute of newEl
        Array.from(newEl.attributes).forEach((attr) => {
          //Replace all atrributes in current element with new element's attribute
          currEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
          <svg>
              <use href="${icons}#icon-loader"></use>
          </svg>
      </div>
    `;
    //Add this html to the DOM as a child of the parent element
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  //if no message is passed in, then use the default value
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  //if no message is passed in, then use the default value
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
