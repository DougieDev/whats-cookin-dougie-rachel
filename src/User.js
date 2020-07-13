//Note: the below line breaks scripts.js
//If you comment it out, scripts.js works, but test no longer works
//Look into this more (other groups have same problem)
const Pantry = require('../src/Pantry');

class User {
  constructor(name, id, pantry) {
    this.name = name;
    this.id = id;
    this.pantry = new Pantry(pantry);
    this.favoriteRecipes = [];
    this.recipesToCook = [];
    this.groceryList = [];
  }

  toggleFavoriteRecipe(recipe) {
    if (this.favoriteRecipes.includes(recipe)) {
      let index = this.favoriteRecipes.indexOf(recipe)
      this.favoriteRecipes.splice(index, 1);
    } else {
      this.favoriteRecipes.push(recipe);
    }
  }

  toggleRecipeToCook(recipe) {
    if (this.recipesToCook.includes(recipe)) {
      let index = this.recipesToCook.indexOf(recipe);
      this.recipesToCook.splice(index, 1);
    } else {
      this.recipesToCook.push(recipe);
    }
  }

  getSavedRecipes() {
    return this.favoriteRecipes.concat(this.recipesToCook);
  }

  filterRecipeByTag(tag) {
    let savedRecipes = this.getSavedRecipes()
    return savedRecipes.filter(recipe => {
      return recipe.tags.includes(tag)
    })
  }
}
if (typeof module !== 'undefined') {
  module.exports = User;
}
