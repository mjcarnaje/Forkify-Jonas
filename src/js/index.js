import Search from './models/Search';

const state = {
	// Search Object
	// Current Recipe Object
	// Shopping List Object
	// Liked Recipe
};

const controlSearch = async () => {
	// 1) Get query from view
	const query = 'pizza'; // TODO

	if (query) {
		// 2) New search object and add to state
		state.search = new Search(query);

		// 3) Prepare UI for the results

		// 4) Search for Recipes
		await state.search.getResults();

		// 5) Render results on IU
		console.log(state.search.result);
	}
};

document.querySelector('.search').addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
});
