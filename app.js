const API = "http://localhost:5000/api";

/* ---------- AUTH ---------- */
async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  if (!res.ok) return alert("Login failed");

  const data = await res.json();
  localStorage.token = data.token;
  localStorage.user = JSON.stringify(data.user);
  location.href = "feed.html";
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

/* ---------- POSTS ---------- */
async function createPost() {
  const text = postText.value.trim();
  if (!text) return;

  await fetch(`${API}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.token
    },
    body: JSON.stringify({
      text,
      username: JSON.parse(localStorage.user).username
    })
  });

  postText.value = "";
  loadFeed();
}

async function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const res = await fetch(`${API}/posts`);
  const posts = await res.json();

  feed.innerHTML = posts.map(p => `
    <div class="post">
      <b>${p.username}</b>
      <p>${p.text}</p>
    </div>
  `).join("");
}

/* ---------- PROFILE ---------- */
function loadProfile() {
  const user = JSON.parse(localStorage.user || "{}");
  if (!user.username) return;

  document.getElementById("username").innerText = user.username;
  document.getElementById("bio").innerText = user.bio || "No bio yet";
}

function goProfile() {
  location.href = "profile.html";
}

function goFeed() {
  location.href = "feed.html";
}

/* ---------- INIT ---------- */
loadFeed();
loadProfile();