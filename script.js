let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let session = JSON.parse(localStorage.getItem("session"));

/* ---------- AUTH ---------- */
function signup() {
  const u = username.value, e = email.value, p = password.value;
  if (!u || !e || !p) return alert("Fill all fields");

  users.push({
    id: "UID-" + Date.now(),
    username: u,
    email: e,
    password: p,
    friends: [],
    photo: ""
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created");
}

function login() {
  const e = email.value, p = password.value;
  const user = users.find(u => u.email === e && u.password === p);
  if (!user) return alert("Invalid login");

  localStorage.setItem("session", JSON.stringify(user));
  window.location.href = "app.html";
}

function logout() {
  localStorage.removeItem("session");
  window.location.href = "index.html";
}

/* ---------- POSTS ---------- */
function createPost() {
  const text = postText.value;
  if (!text) return;

  posts.unshift({
    id: Date.now(),
    userId: session.id,
    username: session.username,
    text,
    likes: [],
    comments: []
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  postText.value = "";
  renderFeed();
}

function likePost(id) {
  const post = posts.find(p => p.id === id);
  if (!post.likes.includes(session.id))
    post.likes.push(session.id);

  localStorage.setItem("posts", JSON.stringify(posts));
  renderFeed();
}

function addComment(id, text) {
  const post = posts.find(p => p.id === id);
  post.comments.push({ user: session.username, text });
  localStorage.setItem("posts", JSON.stringify(posts));
  renderFeed();
}

function renderFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = "";
  posts.forEach(p => {
    feed.innerHTML += `
      <div class="post">
        <b>${p.username}</b>
        <p>${p.text}</p>
        <button onclick="likePost(${p.id})">❤️ ${p.likes.length}</button>
        <input placeholder="Comment" onkeydown="if(event.key==='Enter') addComment(${p.id}, this.value)">
        ${p.comments.map(c=>`<p><b>${c.user}:</b> ${c.text}</p>`).join("")}
      </div>`;
  });
}

/* ---------- SEARCH + FRIENDS ---------- */
function searchUsers() {
  const q = searchInput.value.toLowerCase();
  const results = users.filter(u => u.username.toLowerCase().includes(q));
  feed.innerHTML = results.map(u =>
    `<div class="post">
      ${u.username}
      <button onclick="addFriend('${u.id}')">Add Friend</button>
    </div>`
  ).join("");
}

function addFriend(id) {
  if (!session.friends.includes(id)) {
    session.friends.push(id);
    localStorage.setItem("session", JSON.stringify(session));
    users = users.map(u => u.id === session.id ? session : u);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Friend added");
  }
}

/* ---------- PROFILE ---------- */
function uploadPhoto(e) {
  const reader = new FileReader();
  reader.onload = () => {
    session.photo = reader.result;
    localStorage.setItem("session", JSON.stringify(session));
    document.getElementById("profilePic").src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}

function loadProfile() {
  if (!session) return;
  profileName.innerText = session.username;
  profileEmail.innerText = session.email;
  profileId.innerText = session.id;
  profilePic.src = session.photo || "";
  friendsList.innerHTML = session.friends.map(fid => {
    const f = users.find(u => u.id === fid);
    return `<p>${f?.username || ""}</p>`;
  }).join("");
}

/* ---------- NAV ---------- */
function goProfile(){ window.location.href="profile.html"; }
function goFeed(){ window.location.href="app.html"; }

renderFeed();
loadProfile();