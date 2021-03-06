const recipeCardsSection = document.querySelector('.recipe-cards')
const mainSection = document.querySelector('main');
const h1Logo = document.querySelector('.h1-logo');
const navFilterDropdown = document.querySelector('.nav-filter');
const navRecipeBoxDropdown = document.querySelector('.nav-recipe-box');
const searchBar = document.querySelector('.search-bar');
const homeSection = document.querySelector('.home-view');
const singleRecipeSection = document.querySelector('.single-recipe-view');
const listSection = document.querySelector('.list-view');
let itemsList = document.querySelector('.list-items');
const welcomeHeading = document.querySelector('.welcome-heading');

let recipes, user, ingredients, pantry;

window.onload = setUpHomePage;

mainSection.addEventListener('click', mainClickAnalyzer);
h1Logo.addEventListener('click', goBackToHome);
navFilterDropdown.addEventListener('click', analyzeStateForCategory);
navRecipeBoxDropdown.addEventListener('click', checkNavItem);
searchBar.addEventListener('keyup', executeSearch);

function setUpHomePage() {
  recipes = instantiateRecipes(recipeData);
  ingredients = instantiateIngredients(ingredientsData);
  user = createRandomUser();
  pantry = instantiatePantry(user);
  displayRecipes(recipes);
  displayWelcomeH2();
}

function instantiateRecipes(recipeData) {
  return recipeData.map(recipe => new Recipe(recipe.id, recipe.image, recipe.ingredients, recipe.instructions, recipe.name, recipe.tags));
}

function instantiateIngredients(ingredientsData) {
  return ingredientsData.map(ingredient => new Ingredient(ingredient));
}

function createRandomUser() {
  let randomIndex = Math.floor(Math.random() * usersData.length);
  return new User(usersData[randomIndex].name, usersData[randomIndex].id, usersData[randomIndex].pantry);
}

function instantiatePantry(user) {
  return new Pantry(user.pantry);
}

function displayRecipes(recipesList) {
  recipeCardsSection.innerHTML = '';
  recipesList.forEach((recipeInList) => {
    let index = recipes.findIndex(recipe => recipe.name === recipeInList.name);
    recipeCardsSection.insertAdjacentHTML('beforeend', `
      <article class="recipe-card" id="card${index}">
        <div class="recipe-img" style="background-image: url(${recipeInList.image})" title="${recipeInList.name}">
          <div class="heart-icon">
            <img src="assets/heart-${recipeInList.favoritesStatus}.png" alt="like button" class="heart ${recipeInList.favoritesStatus}">
          </div>
          <div class="cook-icon">
            <img src="assets/cookbook-${recipeInList.recipesToCookStatus}.png" alt="add to recipes cookbook button" class="cookbook ${recipeInList.recipesToCookStatus}">
          </div>
        </div>
        <div class="recipe-name">
          <h5 class="recipe-title">${recipeInList.name}</h5>
        </div>
      </article>
    `)
  });
}

function displayWelcomeH2(category = 'Recipes') {
  welcomeHeading.innerText = `Welcome, ${user.name}! Browse Our ${category} Below.`;
}

function mainClickAnalyzer(event) {
  if (event.target.classList.contains('heart')) {
    showRecipeInFavorites(event, 'heart');
  } else if (event.target.classList.contains('cookbook')) {
    showRecipeInToCook(event, 'cookbook');
  } else if (event.target.closest('.recipe-card')) {
    displaySingleRecipe(event);
  }
}

function goBackToHome() {
  displayAppropriateRecipesInView(homeSection, singleRecipeSection, listSection, recipes, 'Search recipes');
  displayWelcomeH2();
}

function analyzeStateForCategory(event) {
  event.preventDefault();
  if (searchBar.placeholder === 'Search recipes') {
    getRecipesInCategory(event, recipes);
  } else if (searchBar.placeholder === 'Search saved recipes') {
    let savedRecipes = user.getSavedRecipes();
    getRecipesInCategory(event, savedRecipes);
  }
}

function checkNavItem(event) {
  event.preventDefault();
  if (event.target.id === 'favorite-recipes') {
    displayAppropriateRecipesInView(homeSection, singleRecipeSection, listSection, user.favoriteRecipes, 'Search saved recipes');
    displayOtherH2('Favorite Recipes');
  }
  if (event.target.id === 'recipes-to-cook') {
    displayAppropriateRecipesInView(homeSection, singleRecipeSection, listSection, user.recipesToCook, 'Search saved recipes');
    displayOtherH2('Recipes to Cook');
  }
  if (event.target.id === 'pantry-menu') {
    displayListView(listSection, homeSection, singleRecipeSection, 'Pantry Items');
    createAndDisplayPantry();
  }
  if (event.target.id === 'grocery-list-menu') {
    displayListView(listSection, homeSection, singleRecipeSection, 'Grocery List');
    createAndDisplayGroceryList();
    createAndDisplayGroceryCost();
  }
}

function executeSearch(event) {
  if (searchBar.placeholder === 'Search recipes') {
    displaySearchResults(recipes, `${searchBar.value} Search Results`)
  } else {
    let savedRecipes = user.getSavedRecipes();
    displaySearchResults(savedRecipes, `Saved Recipes ${searchBar.value} Search Results`)
  }
  if (event.key === 'Enter') {
    searchBar.value = '';
  }
}

function showRecipeInFavorites(event, icon) {
  toggleRecipeToUserFavorites(event);
  toggleRecipeIconDisplay(event, icon);
}

function showRecipeInToCook(event, icon) {
  toggleRecipeToRecipesToCook(event);
  toggleRecipeIconDisplay(event, icon);
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
  }
}

function determineRecipeToDisplay(event) {
  let recipeCardId = event.target.closest('.recipe-card').id;
  let recipeCardIndex = recipeCardId.slice(4);
  let recipeToDisplay = recipes[recipeCardIndex];
  return recipeToDisplay;
}

function displaySingleRecipe(event) {
  changeView(singleRecipeSection, homeSection, listSection);
  const recipe = determineRecipeToDisplay(event);
  displayRecipeDetails(recipe);
}

function displaySearchResults(recipesToSearch, heading) {
  let recipesToDisplay = getRecipesFromSearch(recipesToSearch);
  displayOtherH2(heading);
  displayRecipes(recipesToDisplay);
}

function getRecipesFromSearch(recipesToSearch) {
  let userQuery = searchBar.value.toLowerCase();
  return recipesToSearch.filter(recipe => {
    if (recipe.name.toLowerCase().includes(userQuery) || recipe.ingredients.find(ingredient => getIngredientName(ingredient.id).includes(userQuery))) {
      return recipe;
    }
  });
}

function getRecipesInCategory(event, recipes) {
  let category = event.target.innerText;
  let recipesInCategory = recipes.filter(recipe => {
    let categoryTags = recipe.mapCategoryToTag(category);
    return recipe.checkRecipeCategory(categoryTags);
  });
  displayWelcomeH2(category);
  displayRecipes(recipesInCategory);
}

function displayAppropriateRecipesInView(activeView, viewToHide1, viewToHide2, recipes, text) {
  changeView(homeSection, singleRecipeSection, listSection);
  displayRecipes(recipes);
  changeSearchBarText(text);
}

function changeView(activeView, viewToHide1, viewToHide2) {
  activeView.classList.remove('hidden');
  viewToHide1.classList.add('hidden');
  viewToHide2.classList.add('hidden');
}

function changeSearchBarText(text) {
  searchBar.placeholder = text;
}

function displayOtherH2(pageTitle) {
  welcomeHeading.innerText = `${user.name}'s ${pageTitle}`;
}

function displayListView(activeView, viewToHide1, viewToHide2, title) {
  changeView(activeView, viewToHide1, viewToHide2);
  displayListH2(title);
}

function displayListH2(pageTitle) {
  let listHeading = document.querySelector('.list-heading');
  listHeading.innerText = `${user.name}'s ${pageTitle}`;
}

function createAndDisplayPantry() {
  let pantryIngredientsList = createPantryWithIngredientNames();
  displayListItems(pantryIngredientsList);
}

function createPantryWithIngredientNames() {
  return pantry.ingredients.map(ingredient => {
    return ({ name: getIngredientName(ingredient.ingredient), amount: ingredient.amount });
  });
}

function getIngredientName(ingredientId) {
  const ingredient = ingredientsData.find(ingredient => ingredient.id === ingredientId);
  return ingredient.name;
}

function displayListItems(list) {
  let bulletPoints = list.reduce((listDisplayBullets, listItem) => {
    listDisplayBullets += `<li>${listItem.amount} ${listItem.name}</li>`;
    return listDisplayBullets;
  }, '');
  itemsList.innerHTML = bulletPoints;
}

function createAndDisplayGroceryList() {
  let groceryList = createGroceryList(user.recipesToCook);
  displayListItems(groceryList);
}

function createAndDisplayGroceryCost() {
  let cost = getGroceryListCost(user.recipesToCook);
  displayGroceryListCost(cost);
}

function createGroceryList(recipes) {
  let ingredientsList = createInitialIngredientsList(recipes);
  let namedIngredientsList = createNamedIngredientsList(ingredientsList);
  return combineGroceryListDuplicates(namedIngredientsList); 
}

function createInitialIngredientsList(recipes) {
  return recipes.reduce((totalMissingIngredientsList, recipe) => {
    let missingIngredients = pantry.listMissingIngredients(recipe);
    totalMissingIngredientsList = totalMissingIngredientsList.concat(missingIngredients);
    return totalMissingIngredientsList;
  }, []); 
}

function createNamedIngredientsList(ingredientsList) {
  return ingredientsList.map(ingredient => {
    return ({ name: getIngredientName(ingredient.ingredientId), amount: ingredient.missingAmount });
  });
}

function combineGroceryListDuplicates(ingredientsList) {
  return ingredientsList.reduce((uniqueIngredients, neededIngredient) => {
    let indexOfDuplicate = uniqueIngredients.findIndex(ingredient => ingredient.name === neededIngredient.name);
    if (indexOfDuplicate !== -1) {
      let totalAmount = uniqueIngredients[indexOfDuplicate].amount + neededIngredient.amount;
      uniqueIngredients[indexOfDuplicate].amount = totalAmount;
    } else {
      uniqueIngredients.push(neededIngredient);
    }
    return uniqueIngredients;
  }, []);
}

function getGroceryListCost(recipes) {
  let costInCents = recipes.reduce((totalCost, recipe) => {
    let recipeCost = recipe.calculateIngredientsCost(ingredients);
    return totalCost + recipeCost; 
  }, 0);
  let costInDollars = (costInCents / 100).toFixed(2);
  return costInDollars;
}

function displayRecipeDetails(recipe) {
  let recipeIngredientsList = createIngredientsList(recipe);
  let recipeInstructions = createInstructionsList(recipe);
  const recipeBox = document.querySelector('.recipe-details');
  recipeBox.innerHTML = ''
  recipeBox.insertAdjacentHTML('afterBegin', `
    <h2 class="recipe-name">${recipe.name}</h2>
    <section class="recipe-name-ingredients">
      <div class="ingredients-box">
        <h3>Ingredients</h3>
        <ul>${recipeIngredientsList}</ul>
      </div>
      <div class="image-box">
        <img src=${recipe.image} alt="${recipe.name}">
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
    ingredientsList += `<li>${Math.round(ingredient.quantity.amount * 100) / 100} ${ingredient.quantity.unit} ${getIngredientName(ingredient.id)}</li>`;
    return ingredientsList;
  }, '');
}

function createInstructionsList(recipe) {
  return recipe.instructions.reduce((instructionsList, instruction) => {
    instructionsList += `<li>${instruction.instruction}</li>`;
    return instructionsList;
  }, '');
}

function displayGroceryListCost(cost) {
  itemsList.innerHTML += `
    <div class="grocery-cost">
      <p class="cost-text">Total Estimated Cost: $${cost}</p>
    </div>
    `
}
