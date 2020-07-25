import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	async getRecipe() {
		try {
			const res = await axios(
				`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
			);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (error) {
			alert('Something went wrong :(');
		}
	}

	calcTime() {
		const numberIng = this.ingredients.length;
		const periods = Math.ceil(numberIng / 3);

		this.time = periods * 15;
	}
	calcServing() {
		this.servings = 4;
	}
	parseIngredients() {
		const unitLong = [
			'tablespoons',
			'tablespoon',
			'ounces',
			'ounce',
			'teaspoons',
			'teaspoon',
			'cups',
			'pounds',
		];
		const unitShort = [
			'tbsp',
			'tbsp',
			'oz',
			'oz',
			'tsp',
			'tsp',
			'cup',
			'pound',
		];

		const newIngredients = this.ingredients.map((el) => {
			let ingredient = el.toLowerCase();
			unitLong.forEach((unit, index) => {
				ingredient = ingredient.replace(unit, unitShort[index]);
			});

			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			const wordByWord = ingredient.split(' ');
			const unitIndex = wordByWord.findIndex((unitShortWord) =>
				unitShort.includes(unitShortWord)
			);
			return unitIndex;
		});

		this.ingredients = newIngredients;
	}
}
