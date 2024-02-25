const { User } = require('../database/db');
const { getMealByQuery, getRandomMeals } = require('../api/mealApi');
const { getCocktails } = require('../api/cocktailApi');
const { get } = require('mongoose');

async function searchMeal(req, res) {
    const user = await User.findById(req.session?.userId);

    const query = req.query.query;

    let meal = null;
    try {
        meal = await getMealByQuery(req.query.query);
    } catch (exception) {
        return res.render('search', { user, meal:null, error: `${exception}` });
    }

    return res.render('search', { user, meal });
}

async function getCocktailsList() {
    const cocktails = await getCocktails();
    cocktails.pop();

    return cocktails;
}

async function getMealsList() {
    const meals = await getRandomMeals(9);

    return meals;
}

module.exports = { searchMeal, getCocktailsList, getMealsList };
