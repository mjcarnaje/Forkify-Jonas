import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {};
window.state = state;

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
		recipeView.clearRecipe();
		renderLoader(elements.recipeContainer);

		//Highlight selected search item
		if (state.search) {
			searchView.highlightSelected(id);
		}

		//Create new recipe object
		state.recipe = new Recipe(id);

		try {
			//Get recipe data and parse Ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			//Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServing();
			//Render Recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
		} catch (err) {
			alert('Error, Something Went Wrong');
		}
	}
};

['hashchange', 'load'].forEach((event) =>
	window.addEventListener(event, controlRecipe)
);

const controlList = () => {
	if (!state.List) state.list = new List();

	state.recipe.ingredients.forEach((el) => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
};
elements.shoppinglistContainer.addEventListener('click', (e) => {
	const id = e.target.closest('.shopping__item').dataset.itemid;
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		state.list.deleteItem(id);
		listView.deleteItem(id);
	} else if (e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value);
		state.list.updateCount(id, val);
	}
});

elements.recipeContainer.addEventListener('click', (e) => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		} else alert('Something went wrong!');
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		controlList();
	}
});
