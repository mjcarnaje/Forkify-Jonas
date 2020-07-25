import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {
	// Search Object
	// Current Recipe Object
	// Shopping List Object
	// Liked Recipe
};

const controlSearch = async () => {
	// 1) Get query from view
	const query = searchView.getInput();

	if (query) {
		// 2) New search object and add to state
		state.search = new Search(query);

		// 3) Prepare UI for the results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.resultContainer);

		try {
			// 4) Search for Recipes
			await state.search.getResults();

			// 5) Render results on IU
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch (err) {
			alert('Something wrong');
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
});

elements.resultPages.addEventListener('click', (e) => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');

	if (id) {
		//Prepare the UI for changes
		//Create new recipe object
		state.recipe = new Recipe(id);

		try {
			//Get recipe data and parse Ingredients
			await state.recipe.getRecipe();
			//Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServing();
			state.recipe.parseIngredients();
			//Render Recipe
			console.log(state.recipe);
		} catch (err) {
			alert('Error, Something Went Wrong');
		}
	}
};

['hashchange', 'load'].forEach((event) =>
	window.addEventListener(event, controlRecipe)
);
