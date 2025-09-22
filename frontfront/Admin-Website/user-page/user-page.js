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



document.addEventListener("DOMContentLoaded", () => {
  loadAwarenessStats();
  loadUsers();
});
