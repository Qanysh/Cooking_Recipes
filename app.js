const express = require('express');
const session = require('express-session');

const { User, Recipe, Quiz } = require('./database/db');
const { loginPost } = require('./controllers/loginController');
const { registerPost } = require('./controllers/registerController');
const { 
    adminControllerGetUsers,
    adminControllerGetRecipes,
    adminControllerUpdateUsers,
    adminControllerDeleteUsers,
    adminControllerAddRecipe,
    adminControllerUpdateRecipe,
    adminControllerGetRecipe,
    adminControllerDeleteRecipe
} = require('./controllers/adminController');
const { searchMeal, getCocktailsList, getMealsList } = require('./controllers/recipeController');

const app = express();
const port = 3000;

app.use(session({ secret: 'Arsen', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { ensureAuthenticated, ensureNotAuthenticated, ensureIsAdmin } = require('./middleware/AuthMiddleware');

app.get('/', async (req, res) => {
    const userId = req.session?.userId;

    const user = await User.findById(userId);
    const recipes = await Recipe.find();

    if (userId) {
        return res.render('index', { user: await User.findById(userId), recipes });
    }


    res.render('index', { user, recipes });
});

// Authentication routes
app.get('/login', ensureNotAuthenticated, (req, res) => {
    res.render('login', { user: null, error: null});
});

app.post('/login', ensureNotAuthenticated, async (req, res) => {
    return loginPost(req, res);
});

app.get('/signup', ensureNotAuthenticated, (req, res) => {
    res.render('signup', { user: null, error: null, success: null });
});

app.post('/signup', ensureNotAuthenticated, async (req, res) => {
    return registerPost(req, res);
});

app.get('/logout', ensureAuthenticated, (req, res) => {
    req.session.destroy();
    res.render('login', { user: null, error: "You have been logged out!" });
});

// Admin routes
app.get("/admin", ensureIsAdmin, async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('admin/admin', { user });
});

app.get("/admin/users", ensureIsAdmin, async (req, res) => {
    return adminControllerGetUsers(req, res);
});

app.post("/admin/users/edit", ensureIsAdmin, async (req, res) => {
    return adminControllerUpdateUsers(req, res);
});

app.get("/admin/users/delete/:userid", ensureIsAdmin, async (req, res) => {
    return adminControllerDeleteUsers(req, res);
});

app.get("/admin/recipes", ensureIsAdmin, async (req, res) => {
    return adminControllerGetRecipes(req, res);
});

app.post("/admin/recipes/add", ensureIsAdmin, async (req, res) => {
    return adminControllerAddRecipe(req, res);
});

app.get("/admin/recipes/get/:recipeId", ensureIsAdmin, async (req, res) => {
    return adminControllerGetRecipe(req, res);
});

app.post('/admin/recipes/update', ensureIsAdmin, async (req, res) => {
    return adminControllerUpdateRecipe(req, res);
});

app.get('/admin/recipes/delete/:recipeId', ensureIsAdmin, async (req, res) => {
    return adminControllerDeleteRecipe(req, res);
});

// Recipes routes
app.get('/search', (req, res) => {
    return searchMeal(req, res);
});

// Bonus routes
app.get('/bonus', ensureAuthenticated, async (req, res) => {
    const user = await User.findById(req.session?.userId);
    const quiz = await Quiz.findOne();

    res.render('bonus', { user, quiz });
});

app.post('/submit-quiz', async (req, res) => {
    const user = await User.findById(req.session?.userId);

    const submittedAnswers = req.body.answers; 
    console.log(req.body);
    const timeRemaining = req.body.timeRemaining;
    let score = 0;

    const quiz = await Quiz.findOne();

    quiz.questions.forEach((question, index) => {
        const correctAnswerIndex = question.options.indexOf(question.correctAnswer);
        if (parseInt(submittedAnswers[index]) === correctAnswerIndex) {
            score++;
        }
    });

    const totalQuestions = quiz.questions.length;
    const percentageScore = (score / totalQuestions) * 100;

    res.render('message', { message: `Your score is ${score} out of ${totalQuestions} (${percentageScore.toFixed(2)}%). Time left: ${timeRemaining}`, user});
});

app.get("/recipes", async (req, res) => {
    const user = await User.findById(req.session?.userId);

    let meals = await getMealsList();
    let cocktails = await getCocktailsList();

    console.log(meals, cocktails);

    res.render('recipes', { user, meals, cocktails });
});

// App comsuming routes
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at :${port}`);
});

