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
const loadingMessage = document.getElementById("loading-message");


quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    topic = document.getElementById("topic").value.trim();
    difficulty = document.getElementById("difficulty").value;

    try {
        showLoading();
        const response = await fetch(`${apiUrl}${encodeURIComponent(topic)}/${difficulty}`);
        if (!response.ok) {
            throw new Error("Failed to fetch quiz questions.");
        }
        currentQuestions = await response.json();
        hideLoading();

        currentQuestionIndex = 0;
        score = 0;
        scoreDisplay.textContent = score;

        quizForm.parentElement.classList.add("hidden");
        quizContainer.classList.remove("hidden");

        displayQuestion();
    } catch (error) {
        hideLoading();
        alert("Error: " + error.message);
    }
});

function displayQuestion() {
    const questionObj = currentQuestions.questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <p>${escapeHTML(questionObj.question)}</p>
        ${questionObj.answers
            .map((answer, index) => `<button class="answer" data-index="${index}">${escapeHTML(answer)}</button>`)
            .join("")}
        <div id="feedback" class="hidden"></div>
    `;
    document.querySelectorAll(".answer").forEach((btn) =>
        btn.addEventListener("click", handleAnswerClick)
    );
}

function handleAnswerClick(e) {
    const selectedAnswer = parseInt(e.target.dataset.index);
    const questionObj = currentQuestions.questions[currentQuestionIndex];
    const correctAnswerIndex = currentQuestions.questions[currentQuestionIndex].correctAnswer;
    const feedback = document.getElementById("feedback");

    // Disable buttons
    document.querySelectorAll(".answer").forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctAnswerIndex) {
            btn.style.backgroundColor = "#00563E"; // Correct answer
            btn.style.color = "white";
        }
    });

    // Update score and feedback message
    if (selectedAnswer === correctAnswerIndex) {
        score++;
        feedback.textContent = "Yes, you got it right!";
    } else {
        feedback.textContent = `Not quite! The correct answer is "${escapeHTML(questionObj.answers[correctAnswerIndex])}".`;
    }

    feedback.classList.remove("hidden");
    scoreDisplay.textContent = score;
    nextQuestionBtn.classList.remove("hidden");
}

nextQuestionBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.questions.length) {
        displayQuestion();
    } else {
        showResult();
    }
    nextQuestionBtn.classList.add("hidden"); // Hide the button for the next question
});

function showResult() {
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    let message = `You scored ${score} out of 10. Well done! `;
    
    if (score > 8) {
        // Increase difficulty
        if (difficulty === "easy") {
            difficulty = "intermediate";
        } else if (difficulty === "intermediate") {
            difficulty = "hard";
        }
    } else if (score < 5) {
        // Decrease difficulty
        if (difficulty === "hard") {
            difficulty = "intermediate";
        } else if (difficulty === "intermediate") {
            difficulty = "easy";
        }
    }

    resultMessage.textContent = message;
}

newTopicBtn.addEventListener("click", () => {
    document.getElementById("topic").value = '';
    resultContainer.classList.add("hidden");
    quizForm.parentElement.classList.remove("hidden");
});

sameTopicBtn.addEventListener("click", async () => {
    resultContainer.classList.add("hidden");
    showLoading();
    const response = await fetch(`${apiUrl}${encodeURIComponent(topic)}/${difficulty}`);
    currentQuestions = await response.json();
    hideLoading();

    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;

    quizContainer.classList.remove("hidden");
    displayQuestion();
});

function showLoading() {
    loadingMessage.classList.remove("hidden");
}

function hideLoading() {
    loadingMessage.classList.add("hidden");
}

function escapeHTML(html) {
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
}
