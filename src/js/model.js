import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config";
import { AJAX } from "./helpers";

/**Application Data
 * Big State Object - where controller will grab it's data
 */
export const state = {
  recipe: {},
  search: {
    query: "", //text input value
    results: [], //contain array of objects
    page: 1, //Current Page by default
    resultPerPage: RES_PER_PAGE, //10 results per page
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  //Get the recipe from the data using destructing object
  const { recipe } = data.data;
  //Better format like removing underscore from key attrbutes
  //Recipe data go into the state object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * This function will only change the state object recipe
 */

//Get Forkify receipe from API (REST API Application)
export const loadRecipe = async function (id) {
  try {
    //await for the promise & store the resolved value into the data
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    //if there is alreay a recipe with the same ID in the bookmark state
    if (state.bookmarks.some((bookmark) => bookmark.id == id)) {
      state.recipe.bookmarked = true; //create new property
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    throw error;
  }
};

//The controller module will tell this function what it should search for
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    //Get query results from rest api based on user search query
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //Store the search results data into the big state
    state.search.results = data.recipes.map((recipe) => {
      //Return a new object
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Return only part of the search results
export const getSearchResultsPage = function (page = state.search.page) {
  //We need to know on which page we currently are in. by default page is 1
  state.search.page = page;
  //page minus 1 & then multiply it by the amount of results
  //that we want on the page, for now we want 10 results on the page.
  const start = (page - 1) * state.search.resultPerPage;
  //the slice method does not include the last element when index 10
  const end = page * state.search.resultPerPage;
  //Example for the first page we would like to return from
  //result 1 to result 10
  return state.search.results.slice(start, end);
};

/**
 * Pagination Implementation Explanation
 * So let's say that we requested page 1, start = (1 - 1) * 10 //is zero
 * end = (page 1)1 * 10// 10. When page is 2 => start = (2 - 1) * 10//ten
 * end = 2 * 10 //20
 */

//Reach into the state (recipe.ingredients) and then change the quantity
//in each ingredient
export const updateServings = function (newServings) {
  //(change current state's recipe.ingredients quantity)
  state.recipe.ingredients.forEach((ing) => {
    //NewQty = oldQty * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  //Update the state, otherwise we will be using the same value over again
  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  state.bookmarks.push(recipe);
  //Mark current recipe as boomarked
  if (recipe.id == state.recipe.id) {
    //create new property for the state object
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookMark = function (id) {
  //if the condition is true, then it will return that index
  const index = state.bookmarks.findIndex((el) => el.id === id);
  //index, where the element is located, that we want to delete
  state.bookmarks.splice(index, 1); //delete only 1 item
  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const init = function () {
  //Get from the Browser's application
  const storage = localStorage.getItem("bookmarks");
  //if exist, then convert it to object
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

//Send the new recipe data to the Forkify API
export const uploadRecipe = async function (newRecipe) {
  try {
    //Task 1 - take the raw input data (convert object to an array) and transform
    const ingredients = Object.entries(newRecipe)
      .filter(
        //this should filter out only the data that met the condition
        //(entry start with ingredient and it's value should not be empty)
        (entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
      )
      .map((ing) => {
        //replace all spaces with empty string & split strings into an array
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(`Wrong ingredient Format!. Please use the correct format`);
        const [quantity, unit, description] = ingArr;
        //If quantity have value then convert string to number otheriwise it is null
        return { quantity: quantity ? Number(quantity) : null, unit, description };
      });

    //Create recipe object to upload
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      ingredients,
    };

    //Create Ajax Request (Will send recipe back to us from the server)
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (error) {
    throw error;
  }
};
