const showPasswordBtn = document.getElementById("show-Password-btn");
const passwordField = document.getElementById("password");
const submitBtn = document.querySelector("button[type='submit']");
showPasswordBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (passwordField.type == "text") {
        passwordField.type = "password";
        showPasswordBtn.innerHTML = `<i class="bi bi-eye"></i>`;
    }
    else {
        passwordField.type = "text";
        showPasswordBtn.innerHTML = `<i class="bi bi-eye-slash"></i>`;
    }
})