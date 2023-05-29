let questions = [];
let quizTitle = "";
let description = "";
let visibility;

function SubmitStartform() {
  quizTitle = document.getElementById("title").value;
  description = document.getElementById("description").value;
  const public = document.getElementById("public").checked;

  if (public === true) {
    visibility = true;
  } else {
    visibility = false;
  }

  ChangeQuestionform();
  const quizCreatorForm = document.getElementById("startform-quizcreator");
  const questionCreatorForm = document.getElementById(
    "questionform-quizcreator"
  );
  quizCreatorForm.style.display = "none";
  questionCreatorForm.style.display = "flex";
}

function ChangeQuestionform() {
  const questionType = document.getElementById("question-type").value;

  if (questionType === "truefalse") {
    ShowFormTF();
  }

  if (questionType === "write") {
    ShowFormW();
  }

  if (questionType === "multiplechoice") {
    ShowFormMC();
  }
}

function ShowFormW() {
  const answerElement = document.getElementById("answer");
  const wrongAnswers = document.getElementsByClassName("wronganswers");
  const truefalse = document.getElementById("questionform-truefalse");
  const wrongAnswersLabel = document.getElementById("wronganswers-label");

  answerElement.style.display = "initial";
  truefalse.style.display = "none";
  wrongAnswersLabel.style.display = "none";
  for (let i = 0; i < wrongAnswers.length; i++) {
    wrongAnswers[i].style.display = "none";
    wrongAnswers[i].removeAttribute("required");
  }
  answerElement.setAttribute("required", "");
  truefalse.removeAttribute("required");
}

function ShowFormMC() {
  const answerElement = document.getElementById("answer");
  const wrongAnswers = document.getElementsByClassName("wronganswers");
  const truefalse = document.getElementById("questionform-truefalse");
  const wrongAnswersLabel = document.getElementById("wronganswers-label");

  answerElement.style.display = "initial";
  truefalse.style.display = "none";
  wrongAnswersLabel.style.display = "initial";
  for (let i = 0; i < wrongAnswers.length; i++) {
    wrongAnswers[i].style.display = "initial";
    wrongAnswers[i].setAttribute("required", "");
  }
  answerElement.setAttribute("required", "");
  truefalse.removeAttribute("required");
}

function ShowFormTF() {
  const answerElement = document.getElementById("answer");
  const wrongAnswers = document.getElementsByClassName("wronganswers");
  const truefalse = document.getElementById("questionform-truefalse");
  const wrongAnswersLabel = document.getElementById("wronganswers-label");

  answerElement.style.display = "none";
  truefalse.style.display = "initial";
  wrongAnswersLabel.style.display = "none";
  for (let i = 0; i < wrongAnswers.length; i++) {
    wrongAnswers[i].style.display = "none";
    wrongAnswers[i].removeAttribute("required");
  }
  truefalse.setAttribute("required", "");
  answerElement.removeAttribute("required");
}

function AddQuestion() {
  const questionType = document.getElementById("question-type").value;
  const question = document.getElementById("question");
  let answer;
  let newQuestion;

  if (questionType === "truefalse") {
    AddTrueFalse(question.value, answer, questionType);
  }

  if (questionType === "write") {
    AddWrite(question.value, answer, questionType);
  }

  if (questionType === "multiplechoice") {
    AddMultipleChoice(question.value, answer, questionType);
  }
  question.value = "";
}

function AddTrueFalse(question, answer, questionType) {
  const trueElement = document.getElementById("questionform-true").checked;

  if (trueElement === true) {
    answer = true;
  } else {
    answer = false;
  }

  newQuestion = new Question(question, answer, "", questionType);
  questions.push(newQuestion);
}

function AddWrite(question, answer, questionType) {
  answer = document.getElementById("answer");
  newQuestion = new Question(question, answer.value, "", questionType);
  questions.push(newQuestion);
  answer.value = "";
}

function AddMultipleChoice(question, answer, questionType) {
  answer = document.getElementById("answer");
  const wrongAnswerElements = document.getElementsByClassName("wronganswers");
  let wrongAnswers = [];
  for (let i = 0; i < wrongAnswerElements.length; i++) {
    wrongAnswers.push(wrongAnswerElements[i].value);
    wrongAnswerElements[i].value = "";
  }
  newQuestion = new Question(
    question,
    answer.value,
    wrongAnswers,
    questionType
  );
  questions.push(newQuestion);
  answer.value = "";
}

async function CreateQuiz() {
  if (questions.length < 4) {
    alert(
      "You need at least 5 questions to create your quiz. You already have " +
        questions.length +
        " questions."
    );
  } else {
    let userId = guidGenerator();
    fetch("http://localhost:3000/api/post", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title: quizTitle,
        userId: userId,
        description: description,
        question: questions,
        visibility: visibility,
      }),
    })
      .then(() => {
        AddQuizIdToOwner(userId);
      })
      .then(alert("Das Quiz wurde erflogreich erstellt"))
      //https://stackoverflow.com/questions/1226714/how-to-get-the-browser-to-navigate-to-url-in-javascript
      .then(window.location.replace("/"));
  }
}

async function AddQuizIdToOwner(id) {
  await fetch("http://localhost:3000/api/addQuizToOwner", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      owner: id,
    }),
  });
}
//https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

class Question {
  constructor(question, answer, wrongAnswers, type) {
    this.question = question;
    this.answer = answer;
    this.wrongAnswers = wrongAnswers;
    this.type = type;
  }
}
