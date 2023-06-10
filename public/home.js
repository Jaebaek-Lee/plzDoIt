const logInButton = document.querySelector("#logInButton");
const logInForm = document.querySelector("#logIn");
const backDrop = document.querySelector(".backDrop");
const signUpButtonChange = document.querySelector("#signUpButtonChange");
const signUpForm = document.querySelector("#signUp");
const logInButtonChange = document.querySelector("#logInButtonChange");
const logInSubmit = document.querySelector(".logInSubmit");
const signUpSubmit = document.querySelector(".signUpSubmit");
const id = document.querySelectorAll(".id");
const pw = document.querySelectorAll(".pw");
const inputName = document.querySelectorAll(".name");

logInButton.addEventListener("click", onStart);
backDrop.addEventListener("click", Cancel);
signUpButtonChange.addEventListener("click", () => {
  logInForm.style.display = "none";
  signUpForm.style.display = "block";
  for (let i = 0; i < 2; ++i) {
    id[i].value = null;
    pw[i].value = null;
    inputName[0].value = null;
  }
  logInSubmit.disabled = true;
  signUpSubmit.disabled = true;
  logInSubmit.style.cursor = "default";
  signUpSubmit.style.cursor = "default";
  logInSubmit.style.background = signUpSubmit.style.background = "";
});
logInButtonChange.addEventListener("click", () => {
  signUpForm.style.display = "none";
  logInForm.style.display = "block";
  for (let i = 0; i < 2; ++i) {
    id[i].value = null;
    pw[i].value = null;
    inputName[0].value = null;
  }
  logInSubmit.disabled = true;
  signUpSubmit.disabled = true;
  logInSubmit.style.cursor = "default";
  signUpSubmit.style.cursor = "default";
  logInSubmit.style.background = signUpSubmit.style.background = "";
});
// logInSubmit.addEventListener("click", onlogIn);
// signUpSubmit.addEventListener("click", onSignUp);

function onStart() {
  logInForm.style.display = "block";
  backDrop.style.display = "block";
}
function Cancel() {
  backDrop.style.display = "none";
  logInForm.style.display = "none";
  signUpForm.style.display = "none";
  for (let i = 0; i < 2; ++i) {
    id[i].value = null;
    pw[i].value = null;
    inputName[0].value = null;
  }
  logInSubmit.style.background = signUpSubmit.style.background = "";
  logInSubmit.disabled = signUpSubmit.disabled = true;
}
// function onlogIn(e) {
//   e.preventDefault();
//   Cancel();
//   logInButton.style.display = "none";
//   clock.style.display = "block";
//   addTask.style.display = "flex";
//   taskList.style.display = "flex";
//   resetButton.style.display = "block";
// }
// function onSignUp(e) {
//   e.preventDefault();
//   Cancel();
// }
for (let i = 0; i < 2; ++i) {
  id[i].addEventListener("input", onSubmitCheck);
  pw[i].addEventListener("input", onSubmitCheck);
  inputName[0].addEventListener("input", onSubmitCheck);
}
function onSubmitCheck() {
  const signUpForm = document.querySelector("#signUp");
  if (signUpForm.style.display === "block") {
    console.log(1);
    for (let i = 0; i < 2; ++i) {
      if (id[i].value.length >= 3 && pw[i].value.length >= 3) {
        if (inputName[0].value.length >= 3) {
          console.log(1);
          logInSubmit.style.background =
            "linear-gradient(90deg,rgba(52, 197, 144, 0.8) 0%,rgba(54, 182, 186, 0.8) 53.65%,rgba(56, 166, 228, 0.8) 100%";
          signUpSubmit.style.background =
            "linear-gradient(90deg,rgba(52, 197, 144, 0.8) 0%,rgba(54, 182, 186, 0.8) 53.65%,rgba(56, 166, 228, 0.8) 100%";
          logInSubmit.disabled = false;
          signUpSubmit.disabled = false;
          logInSubmit.style.cursor = "pointer";
          signUpSubmit.style.cursor = "pointer";
        } else {
          if (i === 0) {
            logInSubmit.style.background = "";
            logInSubmit.disabled = true;
            logInSubmit.style.cursor = "default";
          } else {
            signUpSubmit.style.background = "";
            signUpSubmit.disabled = true;
            signUpSubmit.style.cursor = "default";
          }
        }
      } else {
        if (i === 0) {
          logInSubmit.style.background = "";
          logInSubmit.disabled = true;
          logInSubmit.style.cursor = "default";
        } else {
          signUpSubmit.style.background = "";
          signUpSubmit.disabled = true;
          signUpSubmit.style.cursor = "default";
        }
      }
    }
  } else {
    for (let i = 0; i < 2; ++i) {
      if (id[i].value.length >= 3 && pw[i].value.length >= 3) {
        console.log(1);
        logInSubmit.style.background =
          "linear-gradient(90deg,rgba(52, 197, 144, 0.8) 0%,rgba(54, 182, 186, 0.8) 53.65%,rgba(56, 166, 228, 0.8) 100%";
        signUpSubmit.style.background =
          "linear-gradient(90deg,rgba(52, 197, 144, 0.8) 0%,rgba(54, 182, 186, 0.8) 53.65%,rgba(56, 166, 228, 0.8) 100%";
        logInSubmit.disabled = false;
        signUpSubmit.disabled = false;
        logInSubmit.style.cursor = "pointer";
        signUpSubmit.style.cursor = "pointer";
      } else {
        if (i === 0) {
          logInSubmit.style.background = "";
          logInSubmit.disabled = true;
          logInSubmit.style.cursor = "default";
        } else {
          signUpSubmit.style.background = "";
          signUpSubmit.disabled = true;
          signUpSubmit.style.cursor = "default";
        }
      }
    }
  }
}
