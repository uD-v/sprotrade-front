const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("courseId");
let accessToken = sessionStorage.getItem("accessToken");
let refreshToken = sessionStorage.getItem("refreshToken");

const url = "https://90b7a73d7102.ngrok-free.app";

async function getData() {
  let course = await fetch(`${url}/api/courses/${courseId}/open/`, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());

  // if (course.detail === "Token has expired") {
  //   const refresh = await fetch(`${url}/api/token/refresh/`, {
  //     method: "POST",
  //     headers: {
  //       "ngrok-skip-browser-warning": "true",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ refresh: refreshToken }),
  //   }).then((res) => res.json());

  //   sessionStorage.setItem("accessToken", refresh.access_token);
  //   sessionStorage.setItem("refreshToken", refresh.refresh_token);
  //   accessToken = sessionStorage.getItem("accessToken");
  //   refreshToken = sessionStorage.getItem("refreshToken");

  //   course = await fetch(`${url}/api/courses/${courseId}/open/`, {
  //     method: "GET",
  //     headers: {
  //       "ngrok-skip-browser-warning": "true",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   }).then((res) => res.json());
  // }

  const courseTitle = document.querySelector(".course-name");
  courseTitle.innerHTML = course.title;

  const courseTime = document.querySelector(".label-text");
  let text;
  if (course.duration === 1) {
    text = "1 година";
  } else if (course.duration >= 2 && course.duration <= 4) {
    text = `${course.duration} години`;
  } else {
    text = `${course.duration} годин`;
  }
  courseTime.innerHTML = text;

  let lessonsCompleted = 0;
  course.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      if (lesson.is_completed) lessonsCompleted++;
    });
  });

  let exercisesCompleted = 0;
  course.modules.forEach((module) => {
    if (module.exercise.is_completed) exercisesCompleted++;
  });
  console.log(exercisesCompleted);

  const lessonsCompletedEl = document.querySelector("#lessonsCompleted");
  lessonsCompletedEl.innerHTML = `Уроки ${lessonsCompleted}/${course.lessons_quantity}`;

  const exercisesCompletedEl = document.querySelector("#exercisesCompleted");
  exercisesCompletedEl.innerHTML = `Уроки ${exercisesCompleted}/${course.exercises_quantity}`;

  const courseDescription = document.querySelector(".course-description");
  courseDescription.innerHTML = course.description;

  const main = document.querySelector(".main");
  course.modules.forEach((module) => {
    const moduleEl = document.createElement("div");
    moduleEl.classList.add("module");

    const moduleHeaderEl = document.createElement("header");
    moduleHeaderEl.classList.add("module-header");
    moduleEl.appendChild(moduleHeaderEl);

    const moduleHeaderContainerEl = document.createElement("div");
    moduleHeaderContainerEl.classList.add("module-header-container");
    moduleHeaderEl.appendChild(moduleHeaderContainerEl);

    const moduleNameContainerEl = document.createElement("div");
    moduleNameContainerEl.classList.add("module-name-container");
    moduleHeaderContainerEl.appendChild(moduleNameContainerEl);

    const moduleNameEl = document.createElement("p");
    moduleNameEl.classList.add("module-name");
    moduleNameEl.innerHTML = module.title;
    moduleNameContainerEl.appendChild(moduleNameEl);

    const moduleLabelEl = document.createElement("span");
    moduleLabelEl.classList.add("module-label");
    moduleLabelEl.innerHTML = `${module.duration} хв.`;
    moduleNameContainerEl.appendChild(moduleLabelEl);

    const moduleInfoEl = document.createElement("p");
    moduleInfoEl.classList.add("module-info");
    moduleInfoEl.innerHTML = `${module.lessons_quantity} уроки | ${module.exercise ? 1 : 0} тест`;
    moduleHeaderContainerEl.appendChild(moduleInfoEl);

    fetch("../img/arrow-down.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
        const svgElement = svgDoc.documentElement;
        svgElement.classList.add("module-arrow");
        moduleHeaderEl.appendChild(svgElement);
      })
      .catch((err) => console.error("Error loading SVG:", err));

    moduleEl.addEventListener("click", function (event) {
      moduleEl.classList.toggle("open");
    });

    main.appendChild(moduleEl);
  });

  console.log(course);
}

getData();
