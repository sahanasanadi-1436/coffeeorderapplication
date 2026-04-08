
const form = document.getElementById("signUp");

const usernameEL = document.getElementById("username");
const emailEL = document.getElementById("email");
const passwordEL = document.getElementById("password");
const confirmPasswordEL = document.getElementById("confirm-password");


// ===== HELPER FUNCTIONS =====
const isRequired = value => value.trim() !== "";
const isBetween = (length, min, max) => length >= min && length <= max;

const isEmailValid = email => {
  const re = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(email);
};

const isPasswordSecure = password => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return re.test(password);
};


// ===== UI ERROR / SUCCESS =====
const showError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove("success");
  formField.classList.add("error");

  const error = formField.querySelector("small");
  error.textContent = message;
};

const showSuccess = input => {
  const formField = input.parentElement;
  formField.classList.remove("error");
  formField.classList.add("success");

  const error = formField.querySelector("small");
  error.textContent = "";
};


// ===== VALIDATION FUNCTIONS =====
const checkUsername = () => {
  let valid = false;
  const username = usernameEL.value.trim();

  if (!isRequired(username)) {
    showError(usernameEL, "Username cannot be empty");
  } else if (!isBetween(username.length, 3, 25)) {
    showError(usernameEL, "Username must be 3–25 characters");
  } else {
    showSuccess(usernameEL);
    valid = true;
  }
  return valid;
};

const checkEmail = () => {
  let valid = false;
  const email = emailEL.value.trim();

  if (!isRequired(email)) {
    showError(emailEL, "Email cannot be empty");
  } else if (!isEmailValid(email)) {
    showError(emailEL, "Email is not valid");
  } else {
    showSuccess(emailEL);
    valid = true;
  }
  return valid;
};

const checkPassword = () => {
  let valid = false;
  const password = passwordEL.value.trim();

  if (!isRequired(password)) {
    showError(passwordEL, "Password cannot be empty");
  } else if (!isPasswordSecure(password)) {
    showError(passwordEL, "Min 8 chars, 1 uppercase, 1 number, 1 special char");
  } else {
    showSuccess(passwordEL);
    valid = true;
  }
  return valid;
};

const checkConfirmPassword = () => {
  let valid = false;
  const confirm = confirmPasswordEL.value.trim();
  const password = passwordEL.value.trim();

  if (!isRequired(confirm)) {
    showError(confirmPasswordEL, "Confirm password required");
  } else if (confirm !== password) {
    showError(confirmPasswordEL, "Passwords do not match");
  } else {
    showSuccess(confirmPasswordEL);
    valid = true;
  }
  return valid;
};


// ===== SUBMIT FORM =====

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isFormValid =
      checkUsername() &&
      checkEmail() &&
      checkPassword() &&
      checkConfirmPassword();

    if (isFormValid) {
      let user = {
        name: usernameEL.value.trim(),
        email: emailEL.value.trim(),
        password: passwordEL.value.trim()
      };

      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(data => {
  alert("Signup successful ✅");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(data);
  localStorage.setItem("users", JSON.stringify(users));

  form.reset();
})
        .catch(err => console.log(err));
    }
  });
}


// ===== LIVE VALIDATION =====
if(form){
form.addEventListener("input", function (e) {
  switch (e.target.id) {
    case "username":
      checkUsername();
      break;
    case "email":
      checkEmail();
      break;
    case "password":
      checkPassword();
      break;
    case "confirm-password":
      checkConfirmPassword();
      break;
  }
});
}


// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // 🔍 Get users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔍 Check if user exists
    let foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (foundUser) {
      alert("Login successful ✅");

      // store logged in user
      localStorage.setItem("user", JSON.stringify(foundUser));

      // redirect to menu page
      window.location.href = "menu.html";
    } else {
      alert("❌ User not found! Please signup first.");
    }
  });
}
// ===== USER NAVBAR =====
function logout() {
  localStorage.removeItem("user");
  alert("Logged out 👋");
  window.location.reload();
}
//shows loggedin user
let userSection = document.getElementById("userSection");
let user = JSON.parse(localStorage.getItem("user"));

if (userSection) {
  userSection.innerHTML = user
    ? `<span class="text-white me-2">Welcome ${user.name}</span>
       <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>`
    : `<a class="btn btn-warning" href="auth.html">Login</a>`;
}
