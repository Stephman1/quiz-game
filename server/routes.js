const config = require('./config');
const OpenAI = require('openai');
const { zodResponseFormat } = require('openai/helpers/zod');
const { z } = require('zod');

// Route 1: GET /quiz_questions/:topic/:difficulty
const quiz_questions = async function(req, res) {

    // Get the topic and difficulty level for the quiz questions
    const topic = req.params.topic.trim();
    const difficulty = req.params.difficulty;

    api_key = config.openai_api_key;

    const openai = new OpenAI({ apiKey: api_key });

    const question = z.object({
        question: z.string(),
        answers: z.array(z.string()),
        correctAnswer: z.number(),
    });

    const quiz = z.object({
        questions: z.array(question),
    });

    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: "You are a quiz host." },
            { role: "user", content: `Can I have 10 quiz questions each with 4 multiple choice answers on the topic of ${topic} at a difficulty level of ${difficulty}.`},
        ],
        response_format: zodResponseFormat(quiz, "quiz_questions"),
    });

    const quiz_questions = completion.choices[0].message.parsed;

    res.json(quiz_questions);
}

module.exports = {
    quiz_questions,
}