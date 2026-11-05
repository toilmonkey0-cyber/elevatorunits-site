/* The readiness form stays in the browser. The action is a placeholder. */
function initReadiness() {
  const form = document.querySelector("#readiness-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent =
      "Nothing was sent. This form is not connected. The action is a placeholder, and no third-party form service received these answers.";
  });
}

initReadiness();
