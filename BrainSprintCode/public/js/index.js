LoadPublicQuizzes();
try {
  LoadPrivatQuizzes();
} catch {}

async function LoadPublicQuizzes() {
  const allQuizzes = await GetAll();
  const list = document.getElementById("public-list");

  await allQuizzes.forEach((element) => {
    ShowQuiz(list, element);
  });

  const buttonList = document.getElementsByClassName("index-button-list");
  for (i = 0; i < buttonList.length; i++) {
    buttonList[i].firstChild.style.display = "none";
  }
}

async function GetAll() {
  return fetch("http://localhost:3000/api/getAll", {
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

async function GetUser() {
  fetch("http://localhost:3000/user", {
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

async function ShowQuiz(list, element) {
  //Create objects
  const newQuiz = document.createElement("li");
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const plays = document.createElement("p");
  const button = document.createElement("button");
  const buttonList = document.createElement("ul");
  const deleteButton = document.createElement("button");
  const addButton = document.createElement("button");

  //Give class
  newQuiz.className = "quiz-element";
  title.className = "quiz-title";
  description.className = "quiz-description";
  plays.className = "quiz-playtimes";
  button.className = "play-btn";
  deleteButton.className = "quiz-btn";
  addButton.className = "quiz-btn";
  buttonList.className = "index-button-list";

  //Define the objects
  newQuiz.id = element._id;
  title.textContent = element.title;
  description.textContent = element.description;
  plays.textContent = "Playtimes: " + element.views;
  button.textContent = "Play";
  button.addEventListener("click", async function () {
    const quizId = this.parentElement.id;
    await AddToCurrentlyPlaying(quizId);
    window.location.replace("/play");
  });
  deleteButton.innerHTML =
    "<image class='quiz-btn-image' src='./image/delete.png' alt='delete'></image>";
  addButton.innerHTML =
    "<image class='quiz-btn-image' src='./image/add.png' alt='add'></image>";

  deleteButton.addEventListener("click", function () {
    DeleteQuiz(this.parentElement.parentElement.id);
  });
  addButton.addEventListener("click", async function () {
    ShowId(this.parentElement.parentElement.id);
  });

  //Append everything
  newQuiz.append(title);
  newQuiz.append(description);
  newQuiz.append(plays);
  newQuiz.append(button);
  buttonList.append(deleteButton);
  buttonList.append(addButton);
  newQuiz.append(buttonList);
  list.append(newQuiz);
}

async function LoadPrivatQuizzes() {
  const allQuizzes = await GetPrivatQuizzes();
  const list = document.getElementById("private-list");

  allQuizzes.forEach((element) => {
    ShowQuiz(list, element[0]);
  });
}

async function GetPrivatQuizzes() {
  const newQuizzes = await fetch("http://localhost:3000/api/getPrivatQuizzes", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
  return newQuizzes;
}

async function AddQuiz() {
  const id = prompt(
    "Write the received Id of the Quiz in the box and press Ok"
  );
  if (id) {
    await fetch("http://localhost:3000/api/addQuiz/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        added: id,
      }),
    });
    window.location.reload();
  }
}

async function DeleteQuiz(id) {
  const quiz = await fetch("http://localhost:3000/api/getOne/" + id, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
  const isOwner = await IsOwner(quiz.userId.toString());
  if (isOwner) {
    await fetch("http://localhost:3000/api/delete/" + quiz._id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });
    RemoveQuizFromOwner(quiz.userId);
  } else {
    await RemoveAddedQuiz(quiz.userId);
  }

  window.location.reload();
}

async function ShowId(id) {
  const quiz = await fetch("http://localhost:3000/api/getOne/" + id, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
  alert(
    "This is the Id of the quiz: " +
      quiz.userId +
      " You can either share it or add it to your quizzes"
  );
}

async function IsOwner(id) {
  return await fetch("http://localhost:3000/api/isOwner/" + id, {
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

async function RemoveAddedQuiz(id) {
  await fetch("http://localhost:3000/api/removeQuizFromAdded", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      added: id,
    }),
  });
}

async function RemoveQuizFromOwner(id) {
  await fetch("http://localhost:3000/api/removeQuizFromOwner", {
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

async function AddToCurrentlyPlaying(id) {
  await fetch("http://localhost:3000/api/addCurrentlyPlaying", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      currentlyPlaying: id,
    }),
  });
}
