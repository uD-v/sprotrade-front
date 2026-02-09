let currentCourse;
const mainDiv = document.querySelector(".main");
const url = "https://5888-91-196-55-62.ngrok-free.app";

async function initializeApp() {
  try {
    const getToken = await fetch(`${url}/api/token/`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telegram_id: 20 }),
    });

    const tokens = await getToken.json();
    let accessToken = tokens.access_token;
    let refreshToken = tokens.refresh_token;

    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    const authResponse = await fetch(`${url}/api/validate/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    const userData = await authResponse.json();

    if (userData?.current_activity?.course?.order) {
      currentCourse = userData.current_activity.course.order;
    }

    const coursesResponse = await fetch(`${url}/api/courses/all/`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const coursesData = await coursesResponse.json();

    if (coursesData.courses) {
      renderCourses(coursesData.courses);
    }
  } catch (error) {
    console.error("Initialization failed:", error);
    mainDiv.innerHTML = "<p>Помилка завантаження даних.</p>";
  }
}

function renderCourses(courses) {
  mainDiv.innerHTML = "";

  courses.forEach((course) => {
    const card = document.createElement("div");
    card.classList.add("course-card");

    console.log(currentCourse);

    if (course.order > currentCourse) {
      card.classList.add("locked");
    } else {
      card.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = `/pages/course.html?courseId=${course.id}`;
      });
    }

    const labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container");
    card.appendChild(labelContainer);

    const label = document.createElement("span");
    label.classList.add("label");
    labelContainer.appendChild(label);
    label.innerHTML = `<img class="label-icon" src="img/time.svg" alt="Time"/>`;

    const labelText = document.createElement("span");
    labelText.classList.add("label-text");
    label.appendChild(labelText);

    let text;
    if (course.duration === 1) {
      text = "1 година";
    } else if (course.duration >= 2 && course.duration <= 4) {
      text = `${course.duration} години`;
    } else {
      text = `${course.duration} годин`;
    }
    labelText.innerHTML = text;

    const finishedLessonsParagraph = document.createElement("p");
    finishedLessonsParagraph.classList.add("course-text");
    card.appendChild(finishedLessonsParagraph);
    finishedLessonsParagraph.innerHTML = `Пройдено: 0/${course.lessons_quantity}`;

    const courseName = document.createElement("p");
    courseName.classList.add("course-name");
    card.appendChild(courseName);
    courseName.innerHTML = course.title;

    card.insertAdjacentHTML(
      "beforeend",
      `<img src="img/lines.webp" alt="Lines" class="card-img" />
      <div class="card-arrow">
        <img class="arrow-icon" src="img/arrow-right.svg" alt="Arrow">
      </div>`,
    );

    mainDiv.appendChild(card);
  });
}

initializeApp();
