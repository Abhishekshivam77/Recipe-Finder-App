//fetching data from the api on click of search BTN...>
document.getElementById('search-button').addEventListener('click', function() {
    //query for searching any particular items related to it
    const query = document.getElementById('search-input').value;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.meals);
            // console.log(data)
        });
});


//function to display results on DOM when clicked on search >>
function displayResults(meals) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!meals) {
        resultsDiv.innerHTML = '<p>No recipes found</p>';
        return;
    }

    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('recipe');
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button onclick="showDetails(${meal.idMeal})">View Details</button>
            <button onclick="addToFavorites(${meal.idMeal})">Add to Favorites</button>
        `;
        resultsDiv.appendChild(mealDiv);
    });
}


//func to show details of any receipe if it is clicked
function showDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient !== "") {
                    ingredients.push(`${measure} ${ingredient}`);
                }
            }
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('recipe');
            detailsDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Ingredients:</strong> ${ingredients.join(', ')}</p>
                <p><strong>Instructions:</strong></p>
                <p>${meal.strInstructions}</p>
            `;
            document.getElementById('results').innerHTML = '';
            document.getElementById('results').appendChild(detailsDiv);
        });
}


//func to add any item to local storage for favourites
function addToFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        // console.log(favorites)
    }
    displayFavorites();
}


//getting fav items from local storage and showing it to DOM
function displayFavorites() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // console.log(favorites)

    favorites.forEach(id => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                const mealDiv = document.createElement('div');
                mealDiv.classList.add('recipe');
                mealDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button onclick="removeFromFavorites(${id})">Remove from Favorites</button>
                `;
                favoritesDiv.appendChild(mealDiv);
            });
    });
}


//removing fav items from local storage
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favId => favId !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    // console.log(favorites)
}


document.addEventListener('DOMContentLoaded', displayFavorites);
