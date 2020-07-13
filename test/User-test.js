const chai = require('chai');
const expect = chai.expect;

const User = require('../src/User');
const Recipe = require('../src/Recipe');
const Pantry = require('../src/Pantry');

describe('User', function() {
  let pantry1, user1, pantry2, user2, recipe1, recipe2;
  beforeEach(function() {
    pantry1Info = [
      {ingredient: 11477, amount: 4},
      {ingredient: 11297, amount: 4},
      {ingredient: 1082047, amount: 10}
    ];
    pantry1 = new Pantry(pantry1Info)
    user1 = new User('Rachel', 1, pantry1);
    pantry2Info = [
      {ingredient: 6150, amount: 3},
      {ingredient: 1032009, amount: 7},
      {ingredient: 1082047, amount: 8},
      {ingredient: 47829, amount: 2}
    ];
    pantry2 = new Pantry(pantry2Info);
    user2 = new User('Dougie', 2, pantry2);
    ingredients1 = [
      {
        id: 20,
        quantity: {
          amount: 1.5,
          unit: 'c'
        }
      },
      {
        id: 18,
        quantity: {
          amount: 0.5,
          unit: 'tsp'
        }
      },
      {
        id: 11,
        quantity: {
          amount: 1,
          unit: 'large'
        }
      },
    ],
    instructions1 = [
      {instruction: 'Mix dry ingredients', number: 1},
      {instruction: 'Add wet ingredients.', number: 2},
      {instruction: 'Mix together & bake.', number: 3}
    ]
    ingredients2 = [
      {
        id: 3,
        quantity: {
          amount: 0.5,
          unit: 'cup'
        }
      },
      {
        id: 4,
        quantity: {
          amount: 1,
          unit: 'large'
        }
      },
    ];
    instructions2 = [
      {instruction: 'Boil water and cook pasta.', number: 1},
      {instruction: 'Add tomato sauce.', number: 2},
      {instruction: 'Top with basil and eat.', number: 3}
    ];
    recipe1 = new Recipe(5,
      'https://spoonacular.com/recipeImages/595736-556x370.jpg',
      ingredients1,
      instructions1,
      'Boring Cookies',
      ['dessert', 'antipasti']);
    recipe2 = new Recipe(9,
      'https://spoonacular.com/recipeImages/678353-556x370.jpg',
      ingredients2,
      instructions2,
      'Pasta with Tomato Sauce',
      ['lunch', 'dinner']);
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should be an instance of User', function() {
    expect(user1).to.be.an.instanceof(User);
  });

  it('should have a name', function() {
    expect(user1.name).to.equal('Rachel');
  });

  it('should be able to have a different name', function() {
    expect(user2.name).to.equal('Dougie');
  });

  it('should have a user ID', function() {
    expect(user1.id).to.equal(1);
  });

  it('should be able to have a different user ID', function() {
    expect(user2.id).to.equal(2);
  })

  it('should have items in its pantry', function() {
    expect(user1.pantry.ingredients.length).to.equal(3);
  });

  it('should have different items in a different users pantry', function() {
    expect(user2.pantry.ingredients.length).to.equal(4);
  });

  it('should start with no favorite recipes', function() {
    expect(user1.favoriteRecipes).to.deep.equal([]);
  });

  it('should start with no recipes to cook', function() {
    expect(user1.recipesToCook).to.deep.equal([]);
  });

  it('should start with an empty grocery list', function() {
    expect(user1.groceryList).to.deep.equal([]);
  });

  it('should be able to add recipes to a favorites list', function() {
    user1.toggleFavoriteRecipe(recipe1);

    expect(user1.favoriteRecipes.length).to.equal(1);
  });

  it('if a recipe already exists within favorites array, the recipe should be removed', function() {
    user1.toggleFavoriteRecipe(recipe1);
    user1.toggleFavoriteRecipe(recipe1);
    user1.toggleFavoriteRecipe(recipe2);

    expect(user1.favoriteRecipes.length).to.equal(1);
  });

  it('should be able to remove a pre-existing recipe from the favorites list', function() {
    user1.toggleFavoriteRecipe(recipe1);
    user1.toggleFavoriteRecipe(recipe1);
    user1.toggleFavoriteRecipe(recipe2);

    expect(user1.favoriteRecipes[0].id).to.equal(9);
  });

  it('should be able to decide to cook a recipe that week', function() {
    user1.toggleRecipeToCook(recipe1);

    expect(user1.recipesToCook.length).to.deep.equal(1);
  });

  it('should be able to remove a pre-existing recipe from recipe to cook list', function() {
    user1.toggleRecipeToCook(recipe1);
    user1.toggleRecipeToCook(recipe2);
    user1.toggleRecipeToCook(recipe1);

    expect(user1.recipesToCook[0].id).to.equal(9);
  });

  it('should be able to save recipes', function() {
    expect(user1.getSavedRecipes()).to.deep.equal([]);

    user1.toggleFavoriteRecipe(recipe1);
    user1.toggleFavoriteRecipe(recipe2);
    user1.getSavedRecipes(recipe1);

    expect(user1.getSavedRecipes()).to.deep.equal([recipe1, recipe2]);
  });

  it('should be able to return a combined list of all saved recipes', function() {

    user1.toggleFavoriteRecipe(recipe1);
    user1.toggleRecipeToCook(recipe2);

    let savedRecipes = user1.getSavedRecipes();

    expect(savedRecipes).to.deep.equal([recipe1, recipe2]);
  });

  it('should be able to filter recipes by category tag', function() {
    user1.toggleFavoriteRecipe(recipe1);
    user1.toggleRecipeToCook(recipe2);
    user1.filterRecipeByTag("dessert");

    let filteredRecipes = user1.filterRecipeByTag("dessert");

    expect(filteredRecipes).to.deep.equal([recipe1]);
  })
});
