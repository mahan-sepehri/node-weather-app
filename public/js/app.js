console.log("Client Side JS file is loaded");

const form = document.querySelector("form");
const input = document.querySelector("input");
const msg1 = document.querySelector("#message-1");
const msg2 = document.querySelector("#message-2");
const msg3 = document.querySelector("#message-3");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg1.classList.remove("error");

  msg1.textContent = "";
  msg2.textContent = "";
  msg3.textContent = "";

  const location = input.value;
  if (location.length === 0) {
    msg1.textContent = "you must enter a valid address";
    msg1.classList.add("error");
    return;
  }
  msg1.textContent = "Loading...";
  msg2.textContent = "";
  msg3.textContent = "";

  fetch(`http://localhost:3000/weather?address=${location}`).then((res) =>
    res.json().then((data) => {
      if (data.error) {
        msg1.classList.add("error");
        msg1.textContent = data.error;
      } else {
        msg1.textContent = data.location;
        msg2.textContent = data.forecast.description;
        msg3.textContent = data.forecast.current;
      }
    })
  );
  input.value = "";
});
