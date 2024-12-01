const config = require('./config');
const OpenAI = require('openai');
const { zodResponseFormat } = require('openai/helpers/zod');
const { z } = require('zod');

// Route 1: GET /quiz_questions/:topic/:difficulty
const quiz_questions = async function(req, res) {

    // Get the topic and difficulty level for the quiz questions
    const topic = req.params.topic.trim();
    const difficulty = req.params.difficulty;

    res.json({});

}

module.exports = {
    quiz_questions,
}