//awareness-page.js


// const API = 'http://localhost:5000/api'; // Local backend
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


if (!token) window.location.href = "../index.html";

const totalAwarenessEl = document.getElementById("totalAwareness");
const percentAwarenessEl = document.getElementById("percentAwareness");
const recentPostEl = document.getElementById("recentPost");
const percentRecentEl = document.getElementById("percentRecent");

async function loadAwarenessStats() {
  try {
    const res = await fetch(`${API}/awareness/sta`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch stats");

    const data = await res.json();
    console.log("API Response:", data);

    totalAwarenessEl.textContent = data.total;
    percentAwarenessEl.textContent = `${data.percentRecent}% recent posts`;

    recentPostEl.textContent = data.recent;
    percentRecentEl.textContent = `(${data.percentRecent}% of total)`;
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
      const html = `
        <div class="frame-group">
          <div class="post-wrapper">
            <div class="post">“${post.title}”</div>
          </div>
          <div class="type-wrapper">
            <div class="type">${post.type}</div>
          </div>
          <div class="status-wrapper">
            <div class="type">${post.status}</div>
          </div>
          <div class="created-on-wrapper">
            <div class="type">${new Date(post.createdAt).toDateString()}</div>
          </div>
          <div class="author-wrapper">
            <div class="type">${post.user?.name || 'Unknown'}</div>
          </div>
          <div class="action-wrapper">
            <div class="type">
              <i class="fa-solid fa-arrow-up" style="color: green;"></i>
              <i class="fa-solid fa-trash" style="color: red; cursor: pointer;" onclick="deleteAwarenessPost('${post._id}')"></i>
            </div>
          </div>
        </div>
      `;

      postListEl.insertAdjacentHTML("beforeend", html);
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

    if (!res.ok) throw new Error("Delete failed");

    alert("Post deleted successfully");
    renderAwarenessPosts(); // Refresh list
  } catch (err) {
    console.error(err);
    alert("Error deleting post");
  }
}








document.addEventListener("DOMContentLoaded", () => {
  loadAwarenessStats();
  renderAwarenessPosts();
});
