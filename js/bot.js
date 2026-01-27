const dropdown = document.querySelector("#dropdown");
dropdown.addEventListener("click", (event) => {
  dropdown.classList.toggle("clicked");
  dropdown.querySelectorAll(".option-text").forEach((option) => {
    option.classList.toggle("selected");
  });
});
