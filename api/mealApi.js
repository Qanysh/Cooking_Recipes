const axios = require('axios');

const URL = 'www.themealdb.com/api/json/v1/1';

async function getMealByQuery(query) {
    const response = await axios.get(`https://${URL}/search.php?s=${encodeURIComponent(query)}`);

    if (response.status !== 200) {
        throw new Error('Failed to fetch meals');
    }

    return {
        "name": response.data.meals[0].strMeal,
        "description": response.data.meals[0].strInstructions,
        "country": response.data.meals[0].strArea,
        "link": response.data.meals[0].strYoutube,
        "image": response.data.meals[0].strMealThumb
    };
}

async function getRandomMeal() {
    const response = await axios.get(`https://${URL}/random.php`);

    if (response.status !== 200) {
        throw new Error('Failed to fetch meals');
    }

    return {
        "name": response.data.meals[0].strMeal,
        "description": response.data.meals[0].strInstructions,
        "country": response.data.meals[0].strArea,
        "link": response.data.meals[0].strYoutube,
        "image": response.data.meals[0].strMealThumb
    };
}

async function getRandomMeals(amount) {
    let meals = [];
    for (let i = 0; i < amount; i++) {
        let meal = null;
        try {
            meal = await getRandomMeal();
        } catch (exception) {
            // pass
        }

        if (meal) meals.push(meal);
    }

    return meals;
}

module.exports = { getMealByQuery, getRandomMeals };
