class Ingredient {
  constructor(ingredientsData) {
    if (ingredientsData === undefined) {
      this.id = 0;
      this.name = '';
      this.estimatedCostInCents = 0; 
    } else {
      this.id = ingredientsData.id;
      this.name = ingredientsData.name;
      this.estimatedCostInCents = ingredientsData.estimatedCostInCents;
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = Ingredient;
}
