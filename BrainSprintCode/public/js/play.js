PlayQuiz();

async function PlayQuiz() {
  const quiz = await GetQuiz();
  console.log(quiz);
  const title = document.getElementById("play-quiztitle");
  title.textContent = quiz.title;

  for (let i = 0; i < quiz.question.length; i++) {
    GenerateQuestion(quiz.question[i], i);
  }
}

async function GetQuiz() {
  const quizId = await fetch("http://localhost:3000/api/getCurrentlyPlaying/", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });

  return fetch("http://localhost:3000/api/getOne/" + quizId, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
}

function GenerateQuestion(question, questionCount) {
  const questionList = document.getElementById("play-questions");
  const questionElement = document.createElement("li");
  questionElement.className = "play-questionelement";
  const questionTitle = document.createElement("p");
  const answers = document.createElement("div");

  if (question.type === "truefalse") {
    const trueField = document.createElement("div");
    const trueBox = document.createElement("input");
    const trueBoxText = document.createElement("p");
    const falseField = document.createElement("div");
    const falseBox = document.createElement("input");
    const falseBoxText = document.createElement("p");

    trueBox.setAttribute("type", "radio");
    trueBox.setAttribute("value", true);
    trueBox.setAttribute("name", "truefalse" + questionCount);
    trueBox.className = "truefalsebox";
    trueBoxText.textContent = "True";
    falseBox.setAttribute("type", "radio");
    falseBox.setAttribute("value", false);
    falseBox.setAttribute("name", "truefalse" + questionCount);
    falseBox.className = "truefalsebox";
    falseBoxText.textContent = "False";
    trueField.className = "play-field";
    falseField.className = "play-field";
    answers.className = "play-answer";

    trueField.append(trueBox);
    trueField.append(trueBoxText);
    answers.append(trueField);
    falseField.append(falseBox);
    falseField.append(falseBoxText);
    answers.append(falseField);
  }

  if (question.type === "write") {
    const writeField = document.createElement("textarea");
    writeField.maxLength = 150;
    writeField.className = "play-textarea";

    answers.append(writeField);
    answers.className = "play-answer";
  }

  if (question.type === "multiplechoice") {
    const answer1 = document.createElement("p");
    const answer2 = document.createElement("p");
    const answer3 = document.createElement("p");
    const answer4 = document.createElement("p");
    const answerRow1 = document.createElement("div");
    const answerRow2 = document.createElement("div");

    answer1.textContent = question.answer;
    answer2.textContent = question.wrongAnswers[0];
    answer3.textContent = question.wrongAnswers[1];
    answer4.textContent = question.wrongAnswers[2];
    answerRow1.className = "play-multiplechoice-answerrow";
    answerRow2.className = "play-multiplechoice-answerrow";

    let randomArray = [answer1, answer2, answer3, answer4];
    randomArray.forEach((element) => {
      const radioButton = document.createElement("input");
      radioButton.setAttribute("type", "radio");
      radioButton.setAttribute("name", "multiplechoice" + questionCount);
      radioButton.setAttribute("value", element.textContent);
      radioButton.className = "multiplechoice-radio";

      //How to set an element as first child: https://stackoverflow.com/questions/2007357/how-to-set-dom-element-as-first-child
      element.insertBefore(radioButton, element.firstChild);
    });
    shuffleArray(randomArray);
    let i = 0;
    randomArray.forEach((element) => {
      if (i < 2) {
        answerRow1.append(element);
      } else {
        answerRow2.append(element);
      }
      element.className = "play-multiplechoice-answer";
      i++;
    });

    answers.append(answerRow1);
    answers.append(answerRow2);
  }

  questionTitle.textContent = question.question;

  questionElement.append(questionTitle);
  questionElement.append(answers);
  questionList.append(questionElement);
}

async function CorrectQuiz() {
  let correct = 0;
  let wrong = 0;
  const quizList = document.getElementsByClassName("play-questionelement");
  const quiz = await GetQuiz();
  let i = 0;

  quiz.question.forEach((element) => {
    if (element.type === "write") {
      const givenAnswer = quizList[i].getElementsByClassName("play-textarea");
      const userAnswer = givenAnswer[0].value;
      if (userAnswer.toLowerCase() === element.answer.toLowerCase()) {
        correct++;
      } else {
        wrong++;
      }
    }

    if (element.type === "truefalse") {
      const givenAnswer = quizList[i].getElementsByClassName("truefalsebox");
      let userAnswer;
      for (let x = 0; x < givenAnswer.length; x++) {
        if (givenAnswer[x].checked) {
          userAnswer = givenAnswer[x].value;
        }
      }
      if (userAnswer === element.answer.toString()) {
        correct++;
      } else {
        wrong++;
      }
    }

    if (element.type === "multiplechoice") {
      const givenAnswer = quizList[i].getElementsByClassName(
        "multiplechoice-radio"
      );
      let userAnswer;
      for (let x = 0; x < givenAnswer.length; x++) {
        if (givenAnswer[x].checked) {
          userAnswer = givenAnswer[x].value;
        }
      }
      if (userAnswer === element.answer.toString()) {
        correct++;
      } else {
        wrong++;
      }
    }

    i++;
  });
  AddPlaytime();
  console.log(correct + " | " + wrong);
  ShowCorrection(correct, wrong);
}

async function ShowCorrection(correct, wrong) {
  const correctionWindow = document.getElementById("play-correctionwindow");
  correctionWindow.style.display = "flex";
  let questionCount = 0;

  questionCount = correct + wrong;
  let wrongBarWidth = (100 / questionCount) * wrong;
  const wrongBar = document.getElementById("play-correction-wrongs");
  wrongBar.style.width = wrongBarWidth + "%";

  let correctBarWidth = (100 / questionCount) * correct;
  const correctBar = document.getElementById("play-correction-trues");
  correctBar.style.width = correctBarWidth + "%";

  const text = document.getElementById("play-correction-text");
  text.textContent = "You got " + correct + " correct and " + wrong + " wrong!";
}

function GoHome() {
  window.location.replace("/");
}

async function AddPlaytime() {
  const quiz = await GetQuiz();
  const newViews = quiz.views + 1;
  await fetch("http://localhost:3000/api/update/" + quiz._id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      views: newViews,
    }),
  });
}

//How to make sort an array random: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
