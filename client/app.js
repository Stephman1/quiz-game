const apiUrl = "http://localhost:9000/quiz_questions/";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let topic = "";
let difficulty = "";

const quizForm = document.getElementById("quiz-form");
const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const scoreContainer = document.getElementById("score-container");
const nextQuestionBtn = document.getElementById("next-question");
const resultContainer = document.getElementById("result-container");
const resultMessage = document.getElementById("result-message");
const newTopicBtn = document.getElementById("new-topic");
const sameTopicBtn = document.getElementById("same-topic");
const scoreDisplay = document.getElementById("score");


quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    topic = document.getElementById("topic").value.trim();
    difficulty = document.getElementById("difficulty").value;

    const response = await fetch(`${apiUrl}${encodeURIComponent(topic)}/${difficulty}`);
    currentQuestions = await response.json();
    currentQuestionIndex = 0;
    score = 0;

    quizForm.parentElement.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    displayQuestion();
});

function displayQuestion() {
    const questionObj = currentQuestions.questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <p>${questionObj.question}</p>
        ${questionObj.answers
            .map((answer, index) => `<button class="answer" data-index="${index}">${answer}</button>`)
            .join("")}
    `;
    document.querySelectorAll(".answer").forEach((btn) =>
        btn.addEventListener("click", handleAnswerClick)
    );
}

function handleAnswerClick(e) {
    const selectedAnswer = parseInt(e.target.dataset.index);
    const correctAnswer = currentQuestions.questions[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    scoreDisplay.textContent = score;
    nextQuestionBtn.classList.remove("hidden");
    document.querySelectorAll(".answer").forEach((btn) => (btn.disabled = true));
}

nextQuestionBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.questions.length) {
        displayQuestion();
    } else {
        showResult();
    }
    nextQuestionBtn.classList.add("hidden");
});

function showResult() {
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    let message = `You scored ${score} out of 10. Well done! `;
    if (score > 8) {
        difficulty = difficulty === "hard" ? "hard" : "intermediate";
    } else if (score < 5) {
        difficulty = difficulty === "easy" ? "easy" : "intermediate";
    }
    resultMessage.textContent = message;
}

newTopicBtn.addEventListener("click", () => {
    resultContainer.classList.add("hidden");
    quizForm.parentElement.classList.remove("hidden");
});

sameTopicBtn.addEventListener("click", async () => {
    resultContainer.classList.add("hidden");
    const response = await fetch(`${apiUrl}${encodeURIComponent(topic)}/${difficulty}`);
    currentQuestions = await response.json();
    currentQuestionIndex = 0;
    score = 0;

    quizContainer.classList.remove("hidden");
    displayQuestion();
});
