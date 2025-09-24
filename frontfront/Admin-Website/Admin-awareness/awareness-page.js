//awareness-page.js


const API = 'http://localhost:5000/api'; // Local backend
//const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
//const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

  // ================= USER ROLE CHECK =================
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (userRole !== "admin") {
    alert("You are not an admin");
    window.location.href = "https://fake-drug-verification.onrender.com";
  }


if (!token) window.location.href = "https://fake-drug-verification.onrender.com";

const totalAwarenessEl = document.getElementById("totalAwareness");
const percentAwarenessEl = document.getElementById("percentAwareness");
const recentPostEl = document.getElementById("recentPost");
const percentRecentEl = document.getElementById("percentRecent");
const engagementEl = document.getElementById("engagement");
const percentEngagementEl = document.getElementById("percentEngagement");

async function loadAwarenessStats() {
  try {
    const res = await fetch(`${API}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch stats");

    const data = await res.json();
    console.log("API Response:", data);

    // Awareness
    totalAwarenessEl.textContent = data.awarenessCount;
    percentAwarenessEl.textContent = `${data.percentAwareness}% of posts are recent`;

    // Recent
    recentPostEl.textContent = data.recentAwareness;
    percentRecentEl.textContent = `${data.percentRecent}% of total`;

    // Engagement
    engagementEl.textContent = data.totalEngagement;
    percentEngagementEl.textContent = `${data.percentEngagement}% engagement`;

  } catch (err) {
    console.error(err);
  }
}


async function renderAwarenessPosts() {
  try {
    const response = await fetch(`${API}/awareness`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch posts");

    const data = await response.json();
    const posts = data.awareNess;

    const postListEl = document.getElementById("postList");
    postListEl.innerHTML = ""; // Clear old content

    posts.forEach(post => {
      const wrapper = document.createElement("div");
      wrapper.className = "frame-group";
      wrapper.innerHTML = `
        <div class="post-wrapper">
          <div class="post">“${post.title}”</div>
        </div>
        <div class="type-wrapper"><div class="type">${post.type || "awareness"}</div></div>
        <div class="status-wrapper"><div class="type">Active</div></div>
        <div class="created-on-wrapper"><div class="type">${new Date(post.createdAt).toDateString()}</div></div>
        <div class="author-wrapper"><div class="type">${post.user?.username || post.user?.name || "Unknown"}</div></div>
        <div class="action-wrapper">
          <div class="type">
            <i class="fa-solid fa-arrow-up" style="color: green;"></i>
            <i class="fa-solid fa-trash" style="color: red; cursor: pointer;"></i>
          </div>
        </div>
      `;

      // attach delete handler
      const trashIcon = wrapper.querySelector(".fa-trash");
      trashIcon.addEventListener("click", () => deleteAwarenessPost(post._id));

      postListEl.appendChild(wrapper);
    });


  } catch (error) {
    console.error("Error loading awareness posts:", error);
    document.getElementById("postList").innerHTML = "<p style='color:red;'>Failed to load posts.</p>";
  }
}

// Delete function (optional)
async function deleteAwarenessPost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${API}/awareness/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();

    if (!res.ok) throw new Error("Delete failed");

    alert("Post deleted successfully");
    renderAwarenessPosts(); // Refresh list
  } catch (err) {
    console.error(err);
    alert("Error deleting post");
  }
}








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
    console.log("User Profile:", data);

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
      const imgUrl = new URL(data.profileImage, APP).href;
      console.log("Final profile image URL:", imgUrl);
      profilePic.src = imgUrl;

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
awarenessDropdown.classList.add("mobile-dashboard-notification", "hidden");
document.getElementById("dropdown").appendChild(awarenessDropdown);

// toggle on bell click
dropbell.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent closing immediately
  awarenessDropdown.classList.toggle("hidden");
});

// hide when clicking outside
document.addEventListener("click", (e) => {
  if (!document.getElementById("dropdown").contains(e.target)) {
    awarenessDropdown.classList.add("hidden");
  }
});

async function fetchAwareness() {
  try {
    const res = await fetch(`${API}/awareness?page=1&limit=4`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("Awareness Response:", data);
    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareNess || [];
    awarenessDropdown.innerHTML = "";

    if (awarenessList.length === 0) {
      awarenessDropdown.innerHTML = `<p>No awareness alerts found</p>`;
      return;
    }

    awarenessList.forEach((a) => {
      const item = document.createElement("div");
      item.classList.add("notification-default");

      // safe image url builder
      const imgSrc = a.image ? new URL(a.image, APP).href : "../images/profile-female.svg";

      item.innerHTML = `
        <img class="notification-default-child" src="${imgSrc}" alt="awareness" />
        <div class="mobile-dashboard-notification-frame-parent">
          <div class="miss-jennifer-parent">
            <div class="miss-jennifer">${a.title}</div>
            <div class="view-wrapper"><div class="view">View</div></div>
          </div>
          <div class="fake-product-everywhere">${a.description || "No description"}</div>
          <div class="m-ago">${new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
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


document.addEventListener("DOMContentLoaded", () => {
  loadAwarenessStats();
  renderAwarenessPosts();
});
