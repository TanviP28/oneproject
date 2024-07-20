(function() {
    document.body.style.backgroundImage = "url('../img1/Images/quizBg.jpg')";

    function buildQuiz() {
        const output = [];
        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answers = [];
            for (let letter in currentQuestion.answers) {
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter} :
                        ${currentQuestion.answers[letter]}
                    </label>`
                );
            }
            output.push(
                `<div class="slide">
                    <div class="question"> ${currentQuestion.question} </div>
                    <div class="answers"> ${answers.join("")} </div>
                </div>`
            );
        });
        quizContainer.innerHTML = output.join('');
    }

    function showResults() {
        const answerContainers = quizContainer.querySelectorAll('.answers');
        let answerCounts = { a: 0, b: 0, c: 0, d: 0 };
        const answerData = [];

        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;
            if (userAnswer) {
                answerData.push(`${questionNumber + 1}-${userAnswer}`);
                answerCounts[userAnswer]++;
            }
        });

        const answerString = answerData.join(', ');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'connect.jsp', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`answers=${encodeURIComponent(answerString)}&counts=${JSON.stringify(answerCounts)}`);

        setTimeout(function() {
            location.replace(`cart11.jsp?counts=${encodeURIComponent(JSON.stringify(answerCounts))}`);
        }, 1000);
    }

    function showSlide(n) {
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;
        if (currentSlide === slides.length - 1) {
            submitButton.style.display = 'inline-block';
        } else {
            submitButton.style.display = 'none';
        }
    }

    function handleAnswerSelected() {
        setTimeout(() => {
            if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
            } else {
                showResults();
            }
        }, 1000); // 1-second delay
    }

    const quizContainer = document.getElementById('quiz');
    const submitButton = document.getElementById('submit');
    const myQuestions = [
        {
            question: "Which group brings out fashion magazine 'Vogue India'? ",
            answers: {
                a: "Conde Naste",
                b: "India Today",
                c: "The Times Group",
                d: "The Images"
            }
        },
        {
            question: "Who is the brand ambassador of jewellery brand Mirari?",
            answers: {
                a: "Bipasha Basu",
                b: "Kalyani Chawla",
                c: "Anoushka Shankar",
                d: "Kareena Kapoor"
            }
        },
        {
            question: "Which city is known as the world of fashion?",
            answers: {
                a: "Mumbai",
                b: "London",
                c: "Paris",
                d: "Los Angeles"
            }
        },
        {
            question: "Who started fashion magazine?",
            answers: {
                a: "Irving Penn",
                b: "Samuel Beeton",
                c: "Annie Leibovitz",
                d: "Kate Betts"
            }
        },
        {
            question: "What is the name of hereditary dress of Indian Women?",
            answers: {
                a: "Saree",
                b: "Kurta",
                c: "Lehenga",
                d: "Dupatta"
            }
        },
        {
            question: "What is the name of the loose covering for the shoulder?",
            answers: {
                a: "Stole",
                b: "Shawl",
                c: "Scarf",
                d: "Dupatta"
            }
        },
        {
            question: "On which part of the body, ‘Rouge’ is applied?",
            answers: {
                a: "Lips",
                b: "Eyelids",
                c: "Cheeks",
                d: "Eyebrows"
            }
        }
    ];

    buildQuiz();
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    showSlide(currentSlide);

    // Add event listeners to the radio buttons to move to the next question automatically
    document.addEventListener('change', (event) => {
        if (event.target.matches('.answers input[type="radio"]')) {
            handleAnswerSelected();
        }
    });

    // Add a resize event listener to adjust the quiz container width
    window.addEventListener('resize', function() {
        const width = window.innerWidth - 40; // 40px margin on each side
        quizContainer.style.width = `${width}px`;
    });
})();
