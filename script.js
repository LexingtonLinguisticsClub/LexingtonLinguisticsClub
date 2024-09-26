// script.js

// Existing function for responsive navigation menu
function toggleMenu() {
    var x = document.getElementById("navbar");
    if (x.className === "") {
        x.className += " responsive";
    } else {
        x.className = "";
    }
}

// Variables for pagination and data storage
let currentPage = 1;
const questionsPerPage = 10;
let questionsData = [];

// Function to load questions from the JSON file
function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            displayQuestions();
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Function to display questions on the page
function displayQuestions(filteredData) {
    const container = document.getElementById('questions-container');
    if (!container) return; // Exit if container is not found
    container.innerHTML = ''; // Clear existing content

    const dataToDisplay = filteredData || questionsData.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    dataToDisplay.forEach(question => {
        // Create elements
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';

        const date = document.createElement('h3');
        date.textContent = `Date: ${question.date}`;

        const questionText = document.createElement('p');
        questionText.textContent = question.question;

        // Optionally display the answer
        if (question.answer) {
            const answerText = document.createElement('p');
            answerText.innerHTML = `<strong>Answer:</strong> ${question.answer}`;
            answerText.style.display = 'none'; // Hide by default

            // Add a button to toggle the answer
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Show Answer';
            toggleButton.onclick = () => {
                if (answerText.style.display === 'none') {
                    answerText.style.display = 'block';
                    toggleButton.textContent = 'Hide Answer';
                } else {
                    answerText.style.display = 'none';
                    toggleButton.textContent = 'Show Answer';
                }
            };

            // Append elements
            questionCard.appendChild(date);
            questionCard.appendChild(questionText);
            questionCard.appendChild(toggleButton);
            questionCard.appendChild(answerText);
        } else {
            // Append elements without answer
            questionCard.appendChild(date);
            questionCard.appendChild(questionText);
        }

        container.appendChild(questionCard);
    });

    // Display pagination controls if not searching
    if (!filteredData) {
        displayPaginationControls();
    }
}

// Function to display pagination controls
function displayPaginationControls() {
    const container = document.getElementById('questions-container');
    if (!container) return;
    const totalPages = Math.ceil(questionsData.length / questionsPerPage);

    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            displayQuestions();
        };
        paginationDiv.appendChild(prevButton);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            displayQuestions();
        };
        paginationDiv.appendChild(nextButton);
    }

    container.appendChild(paginationDiv);
}

// Function for searching questions
function searchQuestions() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredQuestions = questionsData.filter(question =>
        question.question.toLowerCase().includes(query)
    );
    displayQuestions(filteredQuestions);
}

// Load questions when the page loads, only if on the questions page
window.onload = function() {
    if (document.getElementById('questions-container')) {
        loadQuestions();
    }
};
