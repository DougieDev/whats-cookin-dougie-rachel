const chai = require('chai');
const expect = chai.expect;

const Recipe = require('../src/Recipe');

describe('Recipe', function() {
  let id, image, ingredient1, ingredient2, ingredients, instruction1, instruction2, instructions, name, tags, recipe;
  before(function() {
    id = 1
    image = 'https://en.wikipedia.org/wiki/Smiley#/media/File:SNice.svg';
    ingredient1 = {
      id: 5,
      quantity: {
        amount: 1,
        unit: 'cup'
      }
    };
    ingredient2 = {
      id: 8,
      quantity: {
        amount: 10,
        unit: 'gallon'
      }
    };
    ingredients = [ingredient1, ingredient2];
    instruction1 = {instruction: 'Buy store-bought cookies.', number: 1};
    instruction2 = {instruction: 'Say you made them from scratch.', number: 2};
    instructions = [instruction1, instruction2];
    name = 'Funfetti Cookies';
    tags = ['dessert', 'breakfast'];
    recipe = new Recipe(id, image, ingredients, instructions, name, tags);
  });
  it('should be a function', function() {
    expect(Recipe).to.be.a('function');
  });

  it('should be an instance of Recipe', function() {
    expect(recipe).to.be.an.instanceof(Recipe);
  });

  it('should have an id', function() {
    expect(recipe.id).to.equal(id);
  });

//Add sad path test for if non-number is passed in as id
//should function return 'Please enter a valid id'?
//same for all other properties

  it('should have an image', function() {
    expect(recipe.image).to.equal(image);
  });

  it('should have ingredients', function() {
    expect(recipe.ingredients).to.deep.equal(ingredients);
  });

  it('should have instructions', function() {
    expect(recipe.instructions).to.deep.equal(instructions)
  });

  it('should have a name', function() {
    expect(recipe.name).to.equal(name);
  });

  it('should have category tags', function() {
    expect(recipe.tags).to.deep.equal(tags);
  });

  it('should contain a key that maps categories to their corresponding tags', function() {
    const categoryToTagMap = {
      Appetizers: ['antipasti', 'starter', 'snack', 'appetizer', 'antipasto', 'hor d\'oeuvre'],
      Entrees: ['lunch', 'main course', 'main dish', 'dinner'],
      'Sauces & Dips': ['sauce', 'condiment', 'dip', 'spread'],
      'Side Dishes': ['side dish'],
      Breakfast: ['morning meal', 'brunch', 'breakfast'],
      Salads: ['salad'],
      Other: ['other']
    }
    expect(recipe.categoryToTagMap.Appetizers).to.deep.equal(['antipasti', 'starter', 'snack', 'appetizer', 'antipasto', 'hor d\'oeuvre'])
  });

  it('should default to a tag of other if no tag is passed in', function() {
    const recipe2 = new Recipe(id, image, ingredients, instructions, name);

    expect(recipe2.tags).to.deep.equal(['other']);
  });

  it('should default to a tag of other if an empty tag array is passed in', function () {
    const tags2 = [];
    const recipe2 = new Recipe(id, image, ingredients, instructions, name, tags2);

    expect(recipe2.tags).to.deep.equal(['other']);
  });

  it('should start with a favorites status of inactive', function() {

    expect(recipe.favoritesStatus).to.equal('inactive');
  });

  it('should start with a recipes to cook status of inactive', function () {

    expect(recipe.recipesToCookStatus).to.equal('inactive');
  });

  it('should be able to map tags to their corresponding category', function() {
    const category = 'Entrees';
    const categoryToTags = recipe.mapCategoryToTag(category);

    expect(categoryToTags).to.deep.equal(['lunch', 'main course', 'main dish', 'dinner']);
  });

  it('should be able to check if it belongs to a given category', function () {
    const category = 'Breakfast';
    const categoryToTags = recipe.mapCategoryToTag(category);
    const isRecipeInCategory = recipe.checkRecipeCategory(categoryToTags);

    expect(isRecipeInCategory).to.equal(true);
  });

  it('should be able to check if it does not belong to a given category', function() {
    const category = 'Entrees';
    const categoryToTags = recipe.mapCategoryToTag(category);
    const isRecipeInCategory = recipe.checkRecipeCategory(categoryToTags);

    expect(isRecipeInCategory).to.equal(false);
  });

  it('should be able to calculate the total cost of its ingredients', function() {
    const ingredientsData = [
      {
        id: 5,
        name: 'flour',
        estimatedCostInCents: 100
      },
      {
        id: 8,
        name: 'sugar',
        estimatedCostInCents: 50
      }
    ];

    const ingredientsCost = recipe.calculateIngredientsCost(ingredientsData);

    expect(ingredientsCost).to.equal(150);
  });

  it('should be able to use a default ingredient cost to calculate the total cost of its ingredients if an ingredient can\'t be looked up', function() {
    const ingredientsData = [
      {
        id: 5,
        name: 'flour',
        estimatedCostInCents: 100
      },
    ];

    const ingredientsCost = recipe.calculateIngredientsCost(ingredientsData);

    expect(ingredientsCost).to.equal(200);
  });

  it('should be able to change its favorites status from inactive to active', function() {
    recipe.toggleFavoritesStatus();

    expect(recipe.favoritesStatus).to.equal('active');
  });

  it('should be able to change its favorites status from active to inactive', function() {
    const recipe2 = new Recipe(id, image, ingredients, instructions, name, tags);
    recipe2.toggleFavoritesStatus();
    recipe2.toggleFavoritesStatus();

    expect(recipe2.favoritesStatus).to.equal('inactive');
  });

  it('should be able to change its recipes to cook status from inactive to active', function () {
    recipe.toggleRecipesToCookStatus();

    expect(recipe.recipesToCookStatus).to.equal('active');
  });

  it('should be able to change its recipes to cook status from active to inactive', function () {
    const recipe2 = new Recipe(id, image, ingredients, instructions, name, tags);
    recipe2.toggleRecipesToCookStatus();
    recipe2.toggleRecipesToCookStatus();

    expect(recipe2.recipesToCookStatus).to.equal('inactive');
  });
});
