class User {
  constructor(usersData) {
    this.name = usersData.name
    this.id = usersData.id
    this.pantry = usersData.pantry
    this.favoriteRecipes = []
    this.recipesToCook = []
    this.groceryList = []
  }

  toggleFavoriteRecipe(recipe) {
    if (this.favoriteRecipes.includes(recipe)) {
      let index = this.favoriteRecipes.indexOf(recipe)
      this.favoriteRecipes.splice(index, 1);
    } else {
      this.favoriteRecipes.push(recipe)
    }
  }

  toggleRecipeToCook(recipe) {
    if (this.recipesToCook.includes(recipe)) {
      let index = this.recipesToCook.indexOf(recipe)
      this.recipesToCook.splice(index, 1);
    } else {
      this.recipesToCook.push(recipe)
    }
  }

  getSavedRecipes() {
    return this.favoriteRecipes.concat(this.recipesToCook)
  }

  searchByRecipeOrIngr(userQuery) {
    userQuery = userQuery.toLowerCase()
    let savedRecipes = this.getSavedRecipes()
    let filteredIngredients = savedRecipes.filter(recipe => {
      if (recipe.name.toLowerCase().includes(userQuery) || recipe.ingredients.find(ingredient => {
        return ingredient.name.includes(userQuery)
      })) {
        return recipe
      }
    })
    return filteredIngredients
  }
}

if (typeof module !== 'undefined') {
  module.exports = User;
}
