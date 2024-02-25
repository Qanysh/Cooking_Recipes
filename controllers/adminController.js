const { User, Recipe } = require('../database/db');

async function adminControllerGetUsers(req, res) {
    const admin = await User.findById(req.session?.userId);
    const users = await User.find();
    res.render('admin/users', { user: admin, allUsers: users, error: null });
}

async function adminControllerUpdateUsers(req, res) {
    const user = await User.findById(req.body.userId);
    const username = req.body.us_username;

    await User.updateOne({ _id: user._id }, { username, updated_at: new Date()});

    return res.redirect("/admin/users");
}

async function adminControllerDeleteUsers(req, res) {
    const userId = req.params.userid;

    await User.deleteOne({ _id: userId });

    return res.redirect("/admin/users");
}

async function adminControllerGetRecipes(req, res) {
    const admin = await User.findById(req.session?.userId);
    const recipes = await Recipe.find();
    res.render('admin/recipes', { user: admin, allRecipes: recipes, error: null });
}

async function adminControllerGetRecipe(req, res) {
    const recipe = await Recipe.findById(req.query.recipeId);
    return res.json(recipe);
}

async function adminControllerAddRecipe(req, res) {
    const admin = await User.findOne({ _id: req.session?.userId });
    
    const { title, title_ru, text, text_ru, time, images } = req.body;

    await Recipe.create({ title, title_ru, text, text_ru, time, images });

    return res.redirect("/admin/recipes");
}

async function adminControllerUpdateRecipe(req, res) {
    const admin = await User.findOne({ _id: req.session?.userId });

    const { title, title_ru, text, text_ru, time, images } = req.body;

    await Recipe.updateOne({ _id: req.body.recipeId }, { title, title_ru, text, text_ru, time, images });

    return res.redirect("/admin/recipes");
}

async function adminControllerDeleteRecipe(req, res) {
    const recipeId = req.params.recipeId;

    await Recipe.deleteOne({ _id: recipeId });

    return res.redirect("/admin/recipes");
}

module.exports = { adminControllerGetUsers, adminControllerUpdateUsers, adminControllerDeleteUsers, adminControllerGetRecipes, adminControllerAddRecipe, adminControllerUpdateRecipe, adminControllerGetRecipe, adminControllerDeleteRecipe };
