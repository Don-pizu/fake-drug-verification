//community-gist.js

//const API = 'http://localhost:5000/api'; // Uncomment this for local testing
//const APP = 'http://localhost:5000';

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

const token = localStorage.getItem("token");

if (!token) window.location.href = "../index.html";

// SOCKET.IO connection
const socket = io(APP, {
  withCredentials: true
});
 

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const typingIndicator = document.getElementById("typingIndicator");
const fileInput = document.getElementById("fileInput");

const username = localStorage.getItem("username") || "Anonymous";

// Join chat room
socket.emit("joinChat", { username, chat: "general" });

// Handle message send
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const msg = messageInput.value;
  const file = fileInput.files[0];

  if (!msg && !file) return;


   let fileUrl = null;

  // 🔹 Upload file first if exists
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      fileUrl = data.url || null;
    } catch (err) {
      console.error("File upload failed:", err);
    }
  }

  /*
  const formData = new FormData();
  formData.append("user", username);
  if (msg) formData.append("text", msg);
  if (file) formData.append("file", file);
  

  // After upload success
  fileUrl = data.url ? `${APP}${data.url}` : null;

  // Show preview immediately on UI
  addMessage({ user: username, text: msg, file: file ? URL.createObjectURL(file) : null }, true);

  */

  // Send to server (via socket or REST upload first)
  socket.emit("chat message", {
    user: username,
    text: msg,
    file: fileUrl,
    chat: "general"
  });

  
  // Reset inputs
  messageInput.value = "";
  fileInput.value = "";
});


// Listen for messages
socket.on("chat message", (msg) => addMessage(msg, msg.user === username));



// Render messages
function addMessage(msg, isSelf) {
  const div = document.createElement("div");

  // Always show user
  let content = `<strong>${msg.user}:</strong> `;

  div.classList.add("message", isSelf ? "self" : "other");
  div.innerHTML = `<strong>${msg.user}:</strong> ${msg.text || ""}`;

  if (msg.file) {
   if (/\.(jpg|jpeg|png|gif)$/i.test(msg.file)) {
      div.innerHTML += `<br><img src="${msg.file}" alt="image" style="max-width:200px;border-radius:8px;">`;
    } else if (/\.(mp4|webm|mov)$/i.test(msg.file)) {
      div.innerHTML += `<br><video src="${msg.file}" controls style="max-width:250px;border-radius:8px;"></video>`;
    } else {
      div.innerHTML += `<br><a href="${msg.file}" target="_blank">Download File</a>`;
    }
  }

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Typing indicator
let typingTimeout;
messageInput.addEventListener("input", () => {
  socket.emit("typing", username);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop typing", username);
  }, 5000); // 5s after last keypress
});

socket.on("typing", (user) => {
  typingIndicator.innerText = `${user} is typing...`;
});

socket.on("stop typing", () => {
  typingIndicator.innerText = "";
});


// --- Load Old Messages ---
async function loadMessages() {
  try {
    const res = await fetch(`${API}/chat/messages/general`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    data.forEach((m) => addMessage(m, m.user === username));
  } catch (err) {
    console.error("Failed to load messages", err);
  }
}


window.addEventListener("DOMContentLoaded", async () => {
  await loadMessages();
  socket.emit("joinChat", { username, chat: "general" });
});



//=========LOGOUT=======/
// ---------- LOGOUT: attach to all .logloglog anchors ----------
const logoutBtns = document.querySelectorAll(".logloglog");
if (logoutBtns && logoutBtns.length > 0) {
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      // redirect to your app's frontend home (use relative path)
      window.location.href = "../index.html";
    });
  });
} else {
  // no logout anchors still shouldn't break other JS
  console.warn("No logout anchors (.logloglog) found");
}



//======profile Picture=====//

async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to load profile");

    // Show username in welcome text
    const welcomeText = document.querySelector(".welcome-back-john");
    if (welcomeText) {
      welcomeText.textContent = `Welcome back, ${data.username}! Here's your verification overview`;
    }

    // Update profile picture
    const profilePic = document.getElementById("profilePic");

    if (data.profileImage) {
      // Build a correct absolute URL (handles leading/trailing slashes safely)
      profilePic.src = data.profileImage;

      profilePic.onerror = () => {
        console.warn("Failed to load profile image from server, using fallback.");
        profilePic.src = "../images/Ellipse 1.svg";
      };
    } else {
      console.warn("No profileImage returned from API, using fallback.");
      profilePic.src = "../images/Ellipse 1.svg";
    }
  } catch (err) {
    console.error("Profile error:", err.message);
  }
}




// ---------- AWARENESS DROPDOWN (use existing bell/dropdown) ----------
const dropbell = document.getElementById("dropbell");
const awarenessDropdown = document.createElement("div");
awarenessDropdown.classList.add("notification", "hidden");
document.getElementById("dropdown").appendChild(awarenessDropdown);

// toggle on bell click
dropbell.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent closing immediately
  awarenessDropdown.classList.toggle("hidden");
});

// hide only when clicking completely outside (not inside dropdown)
document.addEventListener("click", (e) => {
  if (
    !document.getElementById("dropdown").contains(e.target) &&
    !awarenessDropdown.contains(e.target)
  ) {
    awarenessDropdown.classList.add("hidden");
  }
});


// prevent dropdown from closing when scrolling or clicking inside
awarenessDropdown.addEventListener("click", (e) => {
  e.stopPropagation();
});
awarenessDropdown.addEventListener("scroll", (e) => {
  e.stopPropagation();
});


async function fetchAwareness() {
  try {
    const res = await fetch(`${API}/awareness?page=1&limit=4`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareNess || [];
    awarenessDropdown.innerHTML = "";

    if (awarenessList.length === 0) {
      awarenessDropdown.innerHTML = `<p>No awareness alerts found</p>`;
      return;
    }

    awarenessList.forEach((a) => {
      const item = document.createElement("div");
      item.classList.add("item");

      // safe image url builder
      const imgSrc = "../images/user.svg";

      item.innerHTML = `
        <img src="${imgSrc}" alt="awareness" />
        <div class="info">
          
          <h5>${a.title}</h5>
          <p>${a.description || "No description"}</p>
          <span>${new Date(a.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' } )}</span>
        </div>
         <a href="https://fake-drug-verification.onrender.com/">View</a>
      `;
      awarenessDropdown.appendChild(item);
    });
  } catch (err) {
    console.error("Awareness error:", err.message);
  }
}



// ---------- initialize ----------
loadUserProfile();
fetchAwareness();
addMessage();

