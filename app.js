// mealPlanner.js

let mealPlan = {};
let groceryList = new Set();

function addMeal(day, meal) {
  if (!mealPlan[day]) mealPlan[day] = [];
  mealPlan[day].push(meal);
  updateMealDOM(day);
  updateGroceryList(meal);
  saveData();
}

function updateMealDOM(day) {
  const dayMeals = mealPlan[day] || [];
  document.getElementById(`meals-${day}`).innerHTML = dayMeals.map(m => `<li>${m}</li>`).join("");
}

function updateGroceryList(meal) {
  // Dummy ingredient mapping (extendable)
  const mealIngredients = {
    "Spaghetti": ["Pasta", "Tomato Sauce"],
    "Salad": ["Lettuce", "Tomato", "Cucumber", "Ranch"],
    "Tacos": ["Tortillas", "Beef", "Cheese", "Sour Cream"],
    "Pancakes": ["Flour", "Eggs", "Milk"]
  };

  const ingredients = mealIngredients[meal] || [];
  ingredients.forEach(item => groceryList.add(item));
  renderGroceryList();
}

function renderGroceryList() {
  const list = Array.from(groceryList);
  document.getElementById("grocery-list").innerHTML = list.map(i => `<li>${i}</li>`).join("");
}

function saveData() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "save_meal_data.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("data=" + encodeURIComponent(JSON.stringify({ mealPlan, groceryList: Array.from(groceryList) })));
}

function loadData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "load_meal_data.txt", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      mealPlan = data.mealPlan || {};
      groceryList = new Set(data.groceryList || []);
      Object.keys(mealPlan).forEach(updateMealDOM);
      renderGroceryList();
    }
  };
  xhr.send();
}
