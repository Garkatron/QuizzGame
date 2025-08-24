import express from "express";
import { Question, User } from "./models.js"


// ? Setup
const app = express();

app.use(express.static('public'));

app.set("port", 5050);
app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
});


app.post('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// * END-POINTS

// ? GET

/**
 * Return a json with questions
 */
app.get("/api/questions", async (req, res) => {
    const questions = await Question.find();
    res.json(questions);
})

/**
 * Return a question by name
 */
app.get("/api/questions/:name", async (req, res) => {
    const questions = await Question.find({ name: req.params.name });
    res.json(questions);
})



// ? POST

/**
 * Register a new user
 */
app.post("/api/auth/register", async (req, res) => {

});


/**
 * Check user to login
 */
app.post("/api/auth/login", async (req, res) => {

});


/**
 * Delete a user
 */
app.post("/api/auth/delete", async (req, res) => {

});