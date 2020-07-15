class Recipe {
  constructor(id, image, ingredients, instructions, name, tags) {
    this.id = id;
    this.image = image;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.name = name;
    if (tags === undefined || (Array.isArray(tags) && tags.length === 0)) {
      this.tags = ['other'];
    } else {
      this.tags = tags;
    };
    this.categoryToTagMap = {
      Appetizers: ['antipasti', 'starter', 'snack', 'appetizer', 'antipasto', 'hor d\'oeuvre'],
      Entrees: ['lunch', 'main course', 'main dish', 'dinner'],
      'Sauces & Dips': ['sauce', 'condiment', 'dip', 'spread'],
      'Side Dishes': ['side dish'],
      Breakfast: ['morning meal', 'brunch', 'breakfast'],
      Salads: ['salad'],
      Other: ['other']
    }
    this.favoritesStatus = 'inactive';
    this.recipesToCookStatus = 'inactive';
  }

  //when filtering recipes by category, need to call 2 methods below together (return value from mapCategoryToTag (tags array) gets passed into checkRecipeCategory)
  mapCategoryToTag(category) {
    return this.categoryToTagMap[category];
  }

  checkRecipeCategory(categoryTags) {
    return this.tags.some(tag => categoryTags.includes(tag));
  }

  /* !It does not appear this method is being used any longer! */
  // checkRecipeIngredients(ingredientSearchedId) {
  //   return this.ingredients.some(ingredient => ingredient.id === ingredientSearchedId);
  // }

  calculateIngredientsCost(ingredientsData) {
    return this.ingredients.reduce((totalIngredientsCost, ingredient) => {
      let matchingIngredient = ingredientsData.find(ingredientCost => ingredientCost.id === ingredient.id) || {estimatedCostInCents: 100};
      let ingredientCost = matchingIngredient.estimatedCostInCents
      return totalIngredientsCost + ingredientCost;
    }, 0);
  }

/* !It does not appear this method is being used any longer! */
  // retrieveRecipeInstructions() {
  //   return this.instructions;
  // }

  toggleFavoritesStatus() {
    if (this.favoritesStatus === 'inactive') {
      this.favoritesStatus = 'active';
    } else {
      this.favoritesStatus = 'inactive';
    };
  }

  toggleRecipesToCookStatus() {
    if (this.recipesToCookStatus === 'inactive') {
      this.recipesToCookStatus = 'active';
    } else {
      this.recipesToCookStatus = 'inactive';
    };
  }
}


if (typeof module !== 'undefined') {
  module.exports = Recipe;
}
