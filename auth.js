function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("active");
}
var modal = document.getElementById("loginSignupModal");
var btn = document.querySelector(".user-btn");
var span = document.getElementsByClassName("close-button")[0];

btn.onclick = function() {
  modal.style.display = "block";
  openTab(null, 'login');
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("active");
  }
  tablinks = document.getElementsByClassName("tab-button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  document.getElementById(tabName).classList.add("active");
  if (evt) {
    evt.currentTarget.classList.add("active");
  } else {
    document.querySelector(`.tab-button[onclick*='${tabName}']`).classList.add("active");
  }
}
document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) {
    alert("Login successful!");
    modal.style.display = "none";
  } else {
    alert(data.message || "Login failed");
  }
});
document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const username = document.getElementById("new-username").value;
  const email = document.getElementById("new-email").value;
  const password = document.getElementById("new-password").value;
  const confirm = document.getElementById("confirm-password").value;
if (password !== confirm) {
    document.getElementById("message").innerText = "Passwords do not match!";
    return;
  }
const res = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
const data = await res.json();
  if (data.success) {
    alert("Signup successful! You can now log in.");
    openTab(null, "login");
  } else {
    document.getElementById("message").innerText = data.message || "Signup failed";
  }
});
