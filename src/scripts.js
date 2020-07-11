const recipeCardsSection = document.querySelector('.recipe-cards')
const pageBody = document.querySelector('body');
const homeSection = document.querySelector('.home-view');
const singleRecipeSection = document.querySelector('.single-recipe-view');
let recipes, user; 

window.onload = setUpHomePage; 
//instantiate random User on page load as well, and display their name in H2

pageBody.addEventListener('click', clickAnalyzer);

function clickAnalyzer(event) {
  if (event.target.classList.contains('heart')) {
    toggleRecipeToUserFavorites(event);
    indicateRecipeInFavorites(event, 'heart');  
  } else if (event.target.classList.contains('cookbook')) {
    toggleRecipeToRecipesToCook(event)
    indicateRecipeInFavorites(event, 'recipe');
  } else if (event.target.closest('.recipe-card')) {
    displaySingleRecipe(event);
  } else if (event.target.closest('header')) {
    event.preventDefault();
    console.log('clicking header!')
    //call other function & pass in event to analyze what was clicked in menu (search bar button, one of the filters, or one of the dropdowns under My Recipe Box)
  };
}

function toggleRecipeToUserFavorites(event) {
  let recipe = determineRecipeToDisplay(event); 
  user.toggleFavoriteRecipe(recipe); 
}

function toggleRecipeToRecipesToCook(event) {
  let recipe = determineRecipeToDisplay(event);
  user.toggleRecipeToCook(recipe);
}

function indicateRecipeInFavorites(event, icon) {
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

function setUpHomePage() {
  recipes = instantiateRecipes(recipeData);
  displayRecipes(recipes);
  createRandomUser(); 
  displayUserName(); 
}

function instantiateRecipes(recipeData) {
  return recipeData.map(recipe => new Recipe(recipe.id, recipe.image, recipe.ingredients, recipe.instructions, recipe.name, recipe.tags)); 
}

function displayRecipes(recipes) {
  recipes.forEach((recipe, index) => {
    recipeCardsSection.insertAdjacentHTML('beforeend', `
      <article class="recipe-card" id="card${index}">
        <div class="recipe-img" style="background-image: url(${recipe.image})">
          <div class="heart-icon">
            <img src="assets/heart-inactive.png" class="heart inactive">
          </div>
          <div class="cook-icon">
            <img src="assets/recipe-inactive.png" class="cookbook inactive">
          </div>
        </div>
        <div class="recipe-name">
          <h5>${recipe.name}</h5>
        </div>
      </article>
    `)
  })
}

function createRandomUser() {
  let randomIndex = Math.floor(Math.random() * usersData.length);
  user = new User(usersData[randomIndex]);
}

function displayUserName() {
  let welcomeHeading = document.querySelector('.welcome-heading');
  welcomeHeading.innerText = `Welcome, ${user.name}! Browse Our Recipes Below.`;
}

function displaySingleRecipe(event) {
  changeToSingleRecipeView();
  const recipe = determineRecipeToDisplay(event);
  displayRecipeDetails(recipe);
}

function changeToSingleRecipeView() {
  homeSection.classList.add('hidden');
  singleRecipeSection.classList.remove('hidden');
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



//function below needed to convert ingredient search term to an id so can then use recipe class to check if recipe ingredients have that id ;maybe move to recipe class 
// const convertSearchTermToId = searchTerm => {
//   ingredientsData.forEach(ingredient => {
//     if (ingredient.name === searchTerm) {
//       return ingredient.id;
//     } 
//   });
// }
