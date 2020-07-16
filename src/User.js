class User {
  constructor(name, id, pantry) {
    this.name = name || 'Guest';
    this.id = id || 0;
    this.pantry = pantry || [];
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
}

if (typeof module !== 'undefined') {
  module.exports = User;
}
