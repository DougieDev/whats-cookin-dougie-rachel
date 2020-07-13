class Pantry {
  constructor(ingredients) {
    this.ingredients = ingredients || [];
  }

  checkForRecipeIngredients(recipe) {
    return recipe.ingredients.every(recipeIngredient => {
      if (this.checkIngredientStockInPantry(recipeIngredient) > 0) {
        return false;
      } else {
        return true;
      };
    });
  }

  checkIngredientStockInPantry(recipeIngredient) {
    let matchingIngredient = this.ingredients.find(pantryIngredient => pantryIngredient.ingredient === recipeIngredient.id);
    if (matchingIngredient === undefined) {
      return recipeIngredient.quantity.amount;
    } else {
      let missingAmount = recipeIngredient.quantity.amount - matchingIngredient.amount;
      if (missingAmount < 0) {
        missingAmount = 0;
      };
      return missingAmount;
    };
  }

  listMissingIngredients(recipe) {
    return recipe.ingredients.reduce((missingIngredients, ingredient) => {
      let missingIngredientAmount = this.checkIngredientStockInPantry(ingredient);
      missingIngredients.push({ingredientId: ingredient.id, missingAmount: missingIngredientAmount});
      return missingIngredients;
    }, [])
  }
}

if (typeof module !== 'undefined') {
  module.exports = Pantry;
}
