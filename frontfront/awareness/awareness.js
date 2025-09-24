// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

const token = localStorage.getItem("token");

if (!token) window.location.href = "../index.html";

const recentPro = document.getElementById("recentPro");
const approvedPro = document.getElementById("approvedPro");
const fakePro = document.getElementById("fakePro");


// Helper to format expiry date
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}




// Helper to render product card
function createProductCard(verify, isApproved) {
  const div = document.createElement("div");
  div.classList.add("product-card");

  const image = document.createElement("img");
  image.src = verify.image
    ? `${APP}${verify.image}`
    : "images/placeholder.png";
  image.alt = verify.name;
  image.classList.add("product-image");

  // Create the text/info block
  const info = document.createElement("div");
  info.classList.add("product-info");

  const name = document.createElement("h4");
  name.textContent = verify.name;

  const authentic = document.createElement("span");
  authentic.textContent = verify.authentic ? "✅ Verified" : "❌ Fake";
  authentic.classList.add(
    "product-badge",
    isApproved ? "badge-approved" : "badge-fake"
  );

  const category = document.createElement("p");
  category.textContent = `Category: ${
    verify.category ? verify.category : verify.catgory || "N/A"
  }`;

  const expiry = document.createElement("p");
  expiry.textContent = formatDate(verify.expiry);

  // Append all text into info div
  info.appendChild(name);
  info.appendChild(authentic);
  info.appendChild(category);
  info.appendChild(expiry);

  // Append image first (left), then info (right)
  div.appendChild(image);
  div.appendChild(info);

  return div;
}


// Fetch recent products
async function fetchRecent() {
  const res = await fetch(`${API}/verify?limit=4`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok && Array.isArray(data.verifyAll)) {
    recentPro.innerHTML = "";
    data.verifyAll.forEach((product) => {
      const card = createProductCard(product, product.authentic);
      recentPro.appendChild(card);
    });
  } else {
    console.error("Invalid response:", data);
    alert(data.message || "Could not load recent products");
  }
}




// Fetch verified drugs
async function fetchVerified() {
  const res = await fetch(`${API}/verify?authentic=true&limit=4`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok && Array.isArray(data.verifyAll)) {
    approvedPro.innerHTML = "";
    data.verifyAll.forEach((verify) => {
      const card = createProductCard(verify, true);
      approvedPro.appendChild(card);
    });
  } else {
    console.error("Invalid response:", data);
    alert(data.message || "Nafdac Reg is invalid");
  }
}




// Fetch counterfeit drugs
async function fetchCounterfeit() {
  const res = await fetch(`${API}/verify?authentic=false&limit=4`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok && Array.isArray(data.verifyAll)) {
    fakePro.innerHTML = "";
    data.verifyAll.forEach((verify) => {
      const card = createProductCard(verify, false);
      fakePro.appendChild(card);
    });
  } else {
    console.error("Invalid response:", data);
    alert(data.message || "Nafdac Reg is invalid");
  }
}




//LOGOUT BUTTON
const logoutBtn = document.getElementById("logloglog");

// get logged-in user details
const userId = localStorage.getItem("userId");

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = ".index/index.html";
  });
}

//FOR profile image

async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("User Profile:", data);

    if (!res.ok) throw new Error(data.message || "Failed to load profile");

    // Show username in welcome text
    const welcomeText = document.querySelector(".welcome-back-john");
    if (welcomeText) {
      welcomeText.textContent = `Welcome back, ${data.username}! Here's your verification overview`;
    }

    // Update profile picture
    const profilePic = document.getElementById("profilePic");
    if (profilePic) {
      profilePic.src = data.profileImage
        ? `${API}${data.profileImage}`
        : "images/images/Ellipse 1.svg"; // fallback
    }
  } catch (err) {
    console.error("Profile error:", err.message);
  }
}

//List all awareness in drop

// ---------------------------
// Fetch and render awareness (latest 4)
// ---------------------------
async function fetchAwareness() {
  try {
    const res = await fetch(`${API}/awareness?page=1&limit=4`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Awareness Response:", data);

    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareness || [];

    const container = document.querySelector(".mobile-dashboard-notification");
    container.innerHTML = ""; // clear old

    if (awarenessList.length === 0) {
      container.innerHTML = `<p>No awareness alerts found</p>`;
      return;
    }

    awarenessList.forEach((a) => {
      const item = document.createElement("div");
      item.classList.add("notification-default");
      item.innerHTML = `
        <img class="notification-default-child"
          src="${
            a.image
              ? `http://localhost:5000${a.image}`
              : "images/images/profile-female.svg"
          }"
          alt="awareness"
        />
        <div class="mobile-dashboard-notification-frame-parent">
          <div class="miss-jennifer-parent">
            <div class="miss-jennifer">${a.title}</div>
            <div class="view-wrapper"><div class="view">View</div></div>
          </div>
          <div class="fake-product-everywhere">${
            a.description || "No description"
          }</div>
          <div class="m-ago">${new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error("Awareness error:", err.message);
  }
}


// Call them when page loads
loadUserProfile();
fetchAwareness();

fetchRecent();
fetchVerified();
fetchCounterfeit();
