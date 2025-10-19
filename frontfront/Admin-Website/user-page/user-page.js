//user-page.js


//const API = 'http://localhost:5000/api'; // Local backend
const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

  // ================= USER ROLE CHECK =================
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (userRole !== "admin") {
    alert("You are not an admin");
    window.location.href = "https://fake-drug-verification.onrender.com";
  }


if (!token) window.location.href = "https://fake-drug-verification.onrender.com";

const totalUsers = document.getElementById("totalUsers");
const activeUsers = document.getElementById("activeUsers");
const newUsers = document.getElementById("newUsers");

const percentActiveUsers = document.getElementById("percent-activeUsers");
const percentNewUsers = document.getElementById("percent-newUsers");

const userList = document.getElementById("userList");
const adminList = document.getElementById("adminList");

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

    // total users
    totalUsers.textContent = data.userCount;
    

    // active users
    activeUsers.textContent = data.activeUsersThisWeek;
    percentActiveUsers.textContent = `${data.percentActive}% compared to last week`;

    // new users this month
    newUsers.textContent = data.newUsersThisMonth;
    percentNewUsers.textContent = `${data.percentNew}% compared to last month`;

  } catch (err) {
    console.error(err);
  }
}



// Load users and separate by role
async function loadUsers() {
  try {
    const res = await fetch(`${API}/auth/allusers`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    console.log("Users API:", data);

    const users = data.users;

    // Clear old lists
    userList.innerHTML = "";
    adminList.innerHTML = "";

    users.forEach(user => {
      const row = `
        <tr>
          <td>${user.username || "No username"}</td>
          <td>${user.role || "user"}</td>
          <td>
            <span style="color:${user.isVerified ? 'limegreen' : 'gray'}; font-size:18px;">●</span>
          </td>
          <td>
            <i class="fa fa-trash delete-btn" data-id="${user._id}" style="color:red; cursor:pointer;"></i>
          </td>
        </tr>
      `;

      if (user.role === "admin") {
        adminList.insertAdjacentHTML("beforeend", row);
      } else {
        userList.insertAdjacentHTML("beforeend", row);
      }
    });

    // limit to 10 users, 5 admins
    const userRows = userList.querySelectorAll("tr");
    const adminRows = adminList.querySelectorAll("tr");

    userRows.forEach((row, i) => { if (i >= 10) row.remove(); });
    adminRows.forEach((row, i) => { if (i >= 5) row.remove(); });

    // Attach delete handlers
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this user?")) {
          await deleteUser(id);
          loadUsers(); // refresh after delete
        }
      });
    });

  } catch (err) {
    console.error(err);
  }
}

// Delete user
async function deleteUser(userId) {
  try {
    const res = await fetch(`${API}/auth/delete/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    alert(data.message || "User deleted");
  } catch (err) {
    console.error(err);
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



document.addEventListener("DOMContentLoaded", () => {
  loadAwarenessStats();
  loadUsers();
});
