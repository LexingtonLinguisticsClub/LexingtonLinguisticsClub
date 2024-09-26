function toggleMenu() {
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

let currentPage = 1;
const itemsPerPage = 10;
let totalPages = 0;
let questionsData = [];

function init() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            totalPages = Math.ceil(questionsData.length / itemsPerPage);
            displayQuestions(currentPage);
            setupPagination();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
        });
}

function displayQuestions(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = questionsData.slice(startIndex, endIndex);

    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    currentItems.forEach((item, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-item');

        const questionText = document.createElement('p');
        questionText.classList.add('question-text');
        questionText.innerHTML = `<strong>Date:</strong> ${item.date} - <strong>Question:</strong> ${item.question}`;

        const answerText = document.createElement('p');
        answerText.classList.add('answer-text');
        answerText.innerHTML = `<strong>Answer:</strong> ${item.answer}`;

        questionText.addEventListener('click', () => {
            if (answerText.style.display === 'none' || answerText.style.display === '') {
                answerText.style.display = 'block';
            } else {
                answerText.style.display = 'none';
            }
        });

        questionDiv.appendChild(questionText);
        questionDiv.appendChild(answerText);

        container.appendChild(questionDiv);
    });
}

function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const maxVisiblePages = 5;

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        updatePagination();
    });
    paginationContainer.appendChild(prevButton);

    let pageNumbers = [];

    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pageNumbers = [1, 2, 3, '...', totalPages];
        } else if (currentPage >= totalPages - 2) {
            pageNumbers = [1, '...', totalPages - 2, totalPages - 1, totalPages];
        } else {
            pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    pageNumbers.forEach(page => {
        if (page === '...') {
            const dots = document.createElement('span');
            dots.innerText = '...';
            paginationContainer.appendChild(dots);
        } else {
            const pageButton = document.createElement('button');
            pageButton.innerText = page;
            if (page === currentPage) pageButton.classList.add('active');
            pageButton.addEventListener('click', () => {
                currentPage = page;
                updatePagination();
            });
            paginationContainer.appendChild(pageButton);
        }
    });

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        updatePagination();
    });
    paginationContainer.appendChild(nextButton);
}

function updatePagination() {
    displayQuestions(currentPage);
    setupPagination();
    window.scrollTo(0, 0);
}

window.onload = init;
