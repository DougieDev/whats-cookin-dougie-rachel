class Recipe {
  constructor(id, image, ingredients, instructions, name, tags) {
    this.id = id || 0;
    this.image = image || 'https://cdn.pixabay.com/photo/2017/07/28/13/29/spices-2548653_960_720.jpg';
    this.ingredients = ingredients || [];
    this.instructions = instructions || [];
    this.name = name || '';
    if (tags === undefined || (Array.isArray(tags) && tags.length === 0)) {
      this.tags = ['other'];
    } else {
      this.tags = tags;
    }
    this.categoryToTagMap = {
      Appetizers: ['antipasti', 'starter', 'snack', 'appetizer', 'antipasto', 'hor d\'oeuvre'],
      Entrees: ['lunch', 'main course', 'main dish', 'dinner'],
      'Sauces & Dips': ['sauce', 'condiment', 'dip', 'spread'],
      'Side Dishes': ['side dish'],
      Breakfast: ['morning meal', 'brunch', 'breakfast'],
      Salads: ['salad'],
      Other: ['other']
    };
    this.favoritesStatus = 'inactive';
    this.recipesToCookStatus = 'inactive';
  }

  mapCategoryToTag(category) {
    return this.categoryToTagMap[category];
  }

  checkRecipeCategory(categoryTags) {
    return this.tags.some(tag => categoryTags.includes(tag));
  }

  calculateIngredientsCost(ingredientsData) {
    return this.ingredients.reduce((totalIngredientsCost, ingredient) => {
      let matchingIngredient = ingredientsData.find(ingredientCost => ingredientCost.id === ingredient.id) || {estimatedCostInCents: 100};
      let ingredientCost = matchingIngredient.estimatedCostInCents
      return totalIngredientsCost + ingredientCost;
    }, 0);
  }

  toggleFavoritesStatus() {
    if (this.favoritesStatus === 'inactive') {
      this.favoritesStatus = 'active';
    } else {
      this.favoritesStatus = 'inactive';
    }
  }

  toggleRecipesToCookStatus() {
    if (this.recipesToCookStatus === 'inactive') {
      this.recipesToCookStatus = 'active';
    } else {
      this.recipesToCookStatus = 'inactive';
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = Recipe;
}
