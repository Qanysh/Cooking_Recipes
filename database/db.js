const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Arsen:123@cluster0.u8m4zye.mongodb.net/asik-4?retryWrites=true&w=majority&appName=Cluster0');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true},
    admin: { type: Boolean, default: false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const recipeSchema = new Schema({
    title: { type: String, required: true },  // english title
    title_ru: { type: String, required: true },  // russian title
    text: { type: String, required: true },   // english text
    text_ru: { type: String, required: true },  // russian text
    time: { type: Number, required: true },  // preparation time in minutes
    images: [{ type: String, required: true }],  // array of image urls
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

const quizSchema = new mongoose.Schema({
    category: String,
    difficulty: String,

    questions: [{
        questionText: String,
        options: [String],
        correctAnswer: String
    }],

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
  
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { User, Recipe, Quiz };
