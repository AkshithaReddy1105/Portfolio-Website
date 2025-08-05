const body = document.body;
const toggleInput = document.querySelector(".switch input");

// start in light mode
body.classList.add("light");

toggleInput.addEventListener("change", () => {
  if (toggleInput.checked) {
    body.classList.remove("light");
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
  }
});

// Initialize scroll animations

AOS.init({
  duration: 1000,
  once: true,   // animation runs only once
  offset: 100   // trigger earlier
});
