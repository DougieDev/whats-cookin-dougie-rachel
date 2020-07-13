const recipeCardsSection = document.querySelector('.recipe-cards')
const pageBody = document.querySelector('body');
const homeSection = document.querySelector('.home-view');
const singleRecipeSection = document.querySelector('.single-recipe-view');
const listSection = document.querySelector('.list-view');
const welcomeHeading = document.querySelector('.welcome-heading');
const searchBar = document.querySelector('.search-bar');
let recipes, user, ingredients; 

window.onload = setUpHomePage; 

pageBody.addEventListener('click', clickAnalyzer);

function clickAnalyzer(event) {
  if (event.target.classList.contains('heart')) {
    toggleRecipeToUserFavorites(event);
    toggleRecipeIconDisplay(event, 'heart');  
  } else if (event.target.classList.contains('cookbook')) {
    toggleRecipeToRecipesToCook(event)
    toggleRecipeIconDisplay(event, 'cookbook');
  } else if (event.target.closest('.recipe-card')) {
    displaySingleRecipe(event);
  } else if (event.target.closest('header')) {
    event.preventDefault();
    determineHeaderClick(event); 
  };
}

//refactor below function when it's complete to group the functions it calls
function determineHeaderClick(event) {
  if (event.target.classList.contains('category')) {
    getRecipesInCategory(event);
  };
  if (event.target.classList.contains('app-title')) {
    changeView(homeSection, singleRecipeSection, listSection);
    displayRecipes(recipes);
    changeSearchBarText('Search recipes');
  };
  if (event.target.id === 'favorite-recipes') {
    changeView(homeSection, singleRecipeSection, listSection);
    displayOtherH2('Favorite Recipes');
    displayRecipes(user.favoriteRecipes);
    changeSearchBarText('Search saved recipes');
  };
  if (event.target.id === 'recipes-to-cook') {
    changeView(homeSection, singleRecipeSection, listSection);
    displayOtherH2('Recipes to Cook');
    displayRecipes(user.recipesToCook);
    changeSearchBarText('Search saved recipes');
  };
  if (event.target.id === 'pantry-menu') {
    changeView(listSection, homeSection, singleRecipeSection);
    displayListH2('Pantry Items');
    let pantryIngredientsList = createPantryWithIngredientNames();
    displayListItems(pantryIngredientsList); 
  }
  if (event.target.id === 'grocery-list-menu') {
    changeView(listSection, homeSection, singleRecipeSection);
    displayListH2('Grocery List');
    createGroceryList();
  };
  if (event.target.classList.contains('search-button') && searchBar.placeholder === 'Search saved recipes') {
    // let recipesToDisplay = getSavedRecipesFromSearch();
    let savedRecipes = user.getSavedRecipes();
    let recipesToDisplay = getRecipesFromSearch(savedRecipes);
    displayOtherH2('Saved Recipes Search Results');
    displayRecipes(recipesToDisplay);
  };
  if (event.target.classList.contains('search-button') && searchBar.placeholder === 'Search recipes') {
    // let recipesToDisplay = getAllRecipesFromSearch(); 
    let recipesToDisplay = getRecipesFromSearch(recipes);
    displayOtherH2('Search Results');
    displayRecipes(recipesToDisplay);
  };
}

function changeSearchBarText(text) {
  searchBar.placeholder = text; 
}

function createGroceryList() {
  //need empty array (which will become array of objects as grocery list)
  //Take user.recipesToCook array
  //for each recipe in it, iterate through its ingredients list
  //for each recipe ingredient, user.pantry.checkIngredientStockInPantry(recipeIngredient) to get back missing amount of that ingredient
  //add amount + ingredient.unit + ingredient name into an object & add to the empty array
  //after iteration is done return that array of objects as the grocery list
  //then create function to display Grocery List
}

function setUpHomePage() {
  recipes = instantiateRecipes(recipeData);
  ingredients = instantiateIngredients(ingredientsData);
  displayRecipes(recipes);
  createRandomUser(); 
  displayWelcomeH2(); 
}

function instantiateRecipes(recipeData) {
  return recipeData.map(recipe => new Recipe(recipe.id, recipe.image, recipe.ingredients, recipe.instructions, recipe.name, recipe.tags)); 
}

function instantiateIngredients(ingredientsData) {
  return ingredientsData.map(ingredient => new Ingredient(ingredient)); 
}

function displayRecipes(recipesList) {
  recipeCardsSection.innerHTML = '';
  recipesList.forEach((recipeInList) => {
    let index = recipes.findIndex(recipe => recipe.name === recipeInList.name);
    recipeCardsSection.insertAdjacentHTML('beforeend', `
      <article class="recipe-card" id="card${index}">
        <div class="recipe-img" style="background-image: url(${recipeInList.image})">
          <div class="heart-icon">
            <img src="assets/heart-${recipeInList.favoritesStatus}.png" class="heart ${recipeInList.favoritesStatus}">
          </div>
          <div class="cook-icon">
            <img src="assets/cookbook-${recipeInList.recipesToCookStatus}.png" class="cookbook ${recipeInList.recipesToCookStatus}">
          </div>
        </div>
        <div class="recipe-name">
          <h5 class="recipe-title">${recipeInList.name}</h5>
        </div>
      </article>
    `)
  });
}

function createRandomUser() {
  let randomIndex = Math.floor(Math.random() * usersData.length);
  user = new User(usersData[randomIndex].name, usersData[randomIndex].id, usersData[randomIndex].pantry);
}

function displayWelcomeH2(category = 'Recipes') {
  welcomeHeading.innerText = `Welcome, ${user.name}! Browse Our ${category} Below.`;
}

function getRecipesInCategory(event) {
  let category = event.target.innerText;
  let recipesInCategory = recipes.filter(recipe => {
    let categoryTags = recipe.mapCategoryToTag(category);
    return recipe.checkRecipeCategory(categoryTags);
  });
  displayWelcomeH2(category);
  displayRecipes(recipesInCategory);
}

function toggleRecipeToUserFavorites(event) {
  let recipe = determineRecipeToDisplay(event);
  user.toggleFavoriteRecipe(recipe);
  recipe.toggleFavoritesStatus();
}

function toggleRecipeToRecipesToCook(event) {
  let recipe = determineRecipeToDisplay(event);
  user.toggleRecipeToCook(recipe);
  recipe.toggleRecipesToCookStatus();
}

function toggleRecipeIconDisplay(event, icon) {
  if (event.target.classList.contains('inactive')) {
    event.target.src = `assets/${icon}-active.png`;
    event.target.classList.remove('inactive');
    event.target.classList.add('active');
  } else {
    event.target.src = `assets/${icon}-inactive.png`;
    event.target.classList.remove('active');
    event.target.classList.add('inactive');
  };
}

function displayOtherH2(pageTitle) {
  welcomeHeading.innerText = `${user.name}'s ${pageTitle}`;
}

function displayListH2(pageTitle) {
  let listHeading = document.querySelector('.list-heading');
  listHeading.innerText = `${user.name}'s ${pageTitle}`;
}

function displaySingleRecipe(event) {
  changeView(singleRecipeSection, homeSection, listSection);
  const recipe = determineRecipeToDisplay(event);
  displayRecipeDetails(recipe);
}

function changeView(activeView, viewToHide1, viewToHide2) {
  activeView.classList.remove('hidden');
  viewToHide1.classList.add('hidden');
  viewToHide2.classList.add('hidden');
}

function determineRecipeToDisplay(event) {
  let recipeCardId = event.target.closest('.recipe-card').id;
  let recipeCardIndex = recipeCardId.slice(4);
  let recipeToDisplay = recipes[recipeCardIndex];
  return recipeToDisplay;
}

function displayRecipeDetails(recipe) {
  let recipeIngredientsList = createIngredientsList(recipe);
  let recipeInstructions = createInstructionsList(recipe); 
  const recipeBox = document.querySelector('.recipe-details');
  recipeBox.insertAdjacentHTML('afterBegin', `
    <h2 class="recipe-name">${recipe.name}</h2>
    <section class="recipe-name-ingredients">
      <div class="ingredients-box">
        <h3>Ingredients</h3>
        <ul>${recipeIngredientsList}</ul>
      </div>
      <div class="image-box">
        <img src=${recipe.image}>
      </div>
    </section>
    <section class="recipe-instructions">
      <h3>Instructions</h3>
      <ol>${recipeInstructions}</ol>
    </section>
  `);
}

function createIngredientsList(recipe) {
  return recipe.ingredients.reduce((ingredientsList, ingredient) => {
    ingredientsList += `<li>${ingredient.quantity.amount} ${ingredient.quantity.unit} ${getIngredientName(ingredient.id)}</li>`;
    return ingredientsList;
  }, '');
}

function createInstructionsList(recipe) {
  return recipe.instructions.reduce((instructionsList, instruction) => {
    instructionsList += `<li>${instruction.instruction}</li>`;
    return instructionsList;
  }, '');
}

function getIngredientName(ingredientId) {
  const ingredient = ingredientsData.find(ingredient => ingredient.id === ingredientId);
  return ingredient.name; 
}

function getRecipesFromSearch(recipesToSearch) {
  let userQuery = searchBar.value.toLowerCase();
  return recipesToSearch.filter(recipe => {
    if (recipe.name.toLowerCase().includes(userQuery) || recipe.ingredients.find(ingredient => getIngredientName(ingredient.id).includes(userQuery))) {
      return recipe;
    };
  });
}

function createPantryWithIngredientNames() {
  return pantryWithIngredientsName = user.pantry.ingredients.map(ingredient => {
    return ({name: getIngredientName(ingredient.ingredient), amount: ingredient.amount}); 
  });
}

function displayListItems(list) {
  let itemsList = document.querySelector('.list-items');
  // itemsList.innerHTML = '';
  let bulletPoints = list.reduce((listDisplayBullets, listItem) => {
    listDisplayBullets += `<li>${listItem.amount} ${listItem.name}</li>`;
    return listDisplayBullets; 
  }, '');
  itemsList.innerHTML = bulletPoints;
}