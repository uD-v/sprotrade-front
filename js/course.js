const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("courseId");
let accessToken = sessionStorage.getItem("accessToken");
let refreshToken = sessionStorage.getItem("refreshToken");

const url = "http://localhost:8000";

async function getData() {
  try {
    const response = await fetch(`${url}/api/courses/${courseId}/open/`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const course = await response.json();

    // Оновлюємо заголовок та опис курсу
    const courseTitle = document.querySelector(".course-name");
    courseTitle.innerHTML = course.title || "Назва відсутня";

    const courseDescription = document.querySelector(".course-description");
    courseDescription.innerHTML = course.description || "Опис відсутній";

    // Форматуємо тривалість курсу
    const courseTime = document.querySelector(".label-text");
    let text = "0 годин";
    if (course.duration === 1) text = "1 година";
    else if (course.duration >= 2 && course.duration <= 4) text = `${course.duration} години`;
    else if (course.duration > 4) text = `${course.duration} годин`;
    courseTime.innerHTML = text;

    // Рахуємо прогрес (уроки та тести)
    let lessonsCompleted = 0;
    let exercisesCompleted = 0;

    if (course.modules) {
      course.modules.forEach((module) => {
        // Рахуємо завершені уроки
        if (module.lessons) {
          module.lessons.forEach((lesson) => {
            if (lesson.is_completed) lessonsCompleted++;
          });
        }
        // Рахуємо завершені тести (безпечна перевірка на null)
        if (module.exercise && module.exercise.is_completed) {
          exercisesCompleted++;
        }
      });
    }

    document.querySelector("#lessonsCompleted").innerHTML = `Уроки ${lessonsCompleted}/${course.lessons_quantity || 0}`;
    document.querySelector("#exercisesCompleted").innerHTML = `Тести ${exercisesCompleted}/${course.exercises_quantity || 0}`;

    // Очищуємо контейнер перед рендерингом модулів
    const main = document.querySelector(".main");
    // Видаляємо старі модулі, але залишаємо заголовок "Програма курсу"
    main.innerHTML = '<h2 class="program-text">Програма курсу</h2>';

    // Рендеринг модулів та уроків
    if (course.modules) {
      course.modules.forEach((module) => {
        const moduleEl = document.createElement("div");
        moduleEl.classList.add("module");

        // Створюємо структуру модуля
        moduleEl.innerHTML = `
          <header class="module-header">
            <div class="module-header-container">
              <div class="module-name-container">
                <p class="module-name">${module.title}</p>
                <span class="module-label">${module.duration || 0} хв.</span>
              </div>
              <p class="module-info">${module.lessons_quantity || 0} уроки | ${module.exercise ? 1 : 0} тест</p>
            </div>
            <svg class="module-arrow">
              <use href="../img/arrow-down.svg"></use>
            </svg>
          </header>
          <div class="module-main"></div>
        `;

        const moduleMainEl = moduleEl.querySelector(".module-main");

        // Додаємо уроки в модуль
        if (module.lessons) {
          module.lessons.forEach((lesson) => {
            const lessonEl = document.createElement("div");
            lessonEl.classList.add("lesson");
            
            lessonEl.onclick = (e) => {
              e.stopPropagation(); 
              window.location.href = `lesson.html?courseId=${courseId}&lessonId=${lesson.id}`;
            };

            lessonEl.innerHTML = `
              <svg class="lesson-icon">
                <use href="../img/play.svg"></use>
              </svg>
              <p class="lesson-name">${lesson.title}</p>
              <div class="checkbox ${lesson.is_completed ? 'checked' : ''}"></div>
            `;
            moduleMainEl.appendChild(lessonEl);
          });
        }

        // Додаємо тест модуля, якщо він є
        if (module.exercise) {
          const exerciseEl = document.createElement("div");
          exerciseEl.classList.add("lesson");
          
          exerciseEl.onclick = (e) => {
            e.stopPropagation();
            window.location.href = `test.html?courseId=${courseId}&exerciseId=${module.exercise.id}`;
          };

          exerciseEl.innerHTML = `
            <svg class="lesson-icon">
              <use href="../img/test.svg"></use>
            </svg>
            <p class="lesson-name">Тест: ${module.title}</p>
            <div class="checkbox ${module.exercise.is_completed ? 'checked' : ''}"></div>
          `;
          moduleMainEl.appendChild(exerciseEl);
        }

        // Логіка відкриття модуля при кліку на заголовок
        moduleEl.querySelector(".module-header").addEventListener("click", () => {
          moduleEl.classList.toggle("open");
        });

        main.appendChild(moduleEl);
      });
    }

    console.log("Дані завантажено:", course);
  } catch (error) {
    console.error("Критична помилка:", error);
  }
}

getData();
