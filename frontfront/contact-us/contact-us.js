// contact-us.js
document.addEventListener('DOMContentLoaded', () => {
  //const API = 'http://localhost:5000/api'; // Local backend
   const API = "https://fake-drug-verification.onrender.com/api"; // Production backend

  // ================= USER ROLE CHECK =================
  const token   = localStorage.getItem("token");
  const userId  = localStorage.getItem("userId");
  const userRole= localStorage.getItem("role");

  if (!token) {
    // redirect to login if no token
    window.location.href = "https://fake-drug-verification.onrender.com";
    return;
  }

  // ======== FEEDBACK FORM SUBMIT =========
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name     = document.getElementById('name').value.trim();
      const email    = document.getElementById('email').value.trim();
      const location = document.getElementById('location').value.trim();
      const message  = document.getElementById('message').value.trim();

      try {
        const res = await fetch(`${API}/feedbacks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, location, message })
        });

        const data = await res.json();

        if (res.ok) {
          alert('Message sent successfully!');
          feedbackForm.reset();
        } else {
          alert(data.message || 'Message failed');
        }
      } catch (err) {
        alert("Something went wrong. Please try again.");
      }
    });
  }

  // ======== LOGOUT BUTTON =========
  const logoutBtn = document.getElementById("logloglog");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      window.location.href = "index.html";
    });
  }

  // ======== LOAD USER PROFILE =========
  async function loadUserProfile() {
    try {
      const res = await fetch(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load profile");

      const welcomeText = document.querySelector(".welcome-back-john");
      if (welcomeText) {
        welcomeText.textContent = `Welcome back, ${data.username}! Here's your verification overview`;
      }

      const profilePic = document.getElementById("profilePic");
      if (profilePic) {
        profilePic.src = data.profileImage
          ? `${API}${data.profileImage}`
          : "images/images/Ellipse 1.svg";
      }
    } catch (err) {
      console.error("Profile error:", err.message);
    }
  }

  // ======== FETCH LATEST AWARENESS =========
  async function fetchAwareness() {
    try {
      const res = await fetch(`${API}/awareness?page=1&limit=4`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load awareness");

      const container = document.querySelector(".mobile-dashboard-notification");
      if (!container) return;

      container.innerHTML = "";

      if (!data.awareness || data.awareness.length === 0) {
        container.innerHTML = `<p>No awareness alerts found</p>`;
        return;
      }

      data.awareness.forEach((a) => {
        const item = document.createElement("div");
        item.classList.add("notification-default");
        item.innerHTML = `
          <img class="notification-default-child"
               src="${a.image ? `${API}${a.image}` : "images/images/profile-female.svg"}"
               alt="awareness" />
          <div class="mobile-dashboard-notification-frame-parent">
            <div class="miss-jennifer-parent">
              <div class="miss-jennifer">${a.title}</div>
              <div class="view-wrapper"><div class="view">View</div></div>
            </div>
            <div class="fake-product-everywhere">${a.description || "No description"}</div>
            <div class="m-ago">${new Date(a.createdAt).toLocaleDateString()}</div>
          </div>`;
        container.appendChild(item);
      });
    } catch (err) {
      console.error("Awareness error:", err.message);
    }
  }

  // Run initial fetches
  loadUserProfile();
  fetchAwareness();
});
