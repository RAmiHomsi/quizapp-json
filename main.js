let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");


let currentIndex = 0;
let rightAnswers = 0;

function getQuestions(){
    let myRequest = new XMLHttpRequest();
myRequest.onreadystatechange = function (){

    if(this.readyState===4 && this.status===200){
let questionsObject = JSON.parse(this.responseText);
//console.log(questionsObject);
      let qCount = questionsObject.length;
          createBullets(qCount);

          addQuestionData(questionsObject[currentIndex], qCount);

          submitButton.addEventListener("click", function(){
            let theRightAnswer = questionsObject[currentIndex].right_answer;
            currentIndex++;

            checkAnswer(theRightAnswer, qCount);

            // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        addQuestionData(questionsObject[currentIndex], qCount);

        handleBullets()

        // Show Results
        showResults(qCount);

          });

    }

};


    myRequest.open("GET", "html_questions.json");
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;
  
    // Create Spans
    for (let i = 0; i < num; i++) {
      // Create Bullet
      let theBullet = document.createElement("span");
  
      // Check If Its First Span
      if (i === 0) {
        theBullet.classList.add("on");
      }
  
      // Append Bullets To Main Bullet Container
      bulletsSpanContainer.appendChild(theBullet);
    }
  }

function addQuestionData(obj ,count){
    if (currentIndex < count) {
    let questionTitle = document.createElement("h2");

     // Create Question Text
     let questionText = document.createTextNode(obj.title);

     // Append Text To H2
     questionTitle.appendChild(questionText);

     // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // alternative to Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.setAttribute("name" , "question"); //alt radioInput.name = "question";
      radioInput.setAttribute("type" , "radio");
      radioInput.setAttribute("id" , `answer_${i}`);
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);

}

}

}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
  
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
        theChoosenAnswer = answers[i].dataset.answer;
      }
    }
  
    if (rAnswer === theChoosenAnswer) {
      rightAnswers++;
    }
  }

  function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
      if (currentIndex === index) {
        span.className = "on";
      }
    });
  }

  function showResults(count) {
    let theResults;
    if (currentIndex === count) {
      quizArea.remove();
      answersArea.remove();
      submitButton.remove();
      bullets.remove();
  
      if (rightAnswers > count / 2 && rightAnswers < count) {
        theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
      } else if (rightAnswers === count) {
        theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
      } else {
        theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
      }
  
      resultsContainer.innerHTML = theResults;
      resultsContainer.style.padding = "10px";
      resultsContainer.style.backgroundColor = "white";
      resultsContainer.style.marginTop = "10px";
    }
  }