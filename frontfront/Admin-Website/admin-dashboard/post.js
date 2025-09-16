//post.js

// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Local backend
const API = "https://blog-api-4zax.onrender.com/api"; // Production backend

// get logged-in user details
const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("role");

if (userRole !== "admin") {
  alert("You are not an admin");
  window.location.href = ".index/index.html";
}

// ================= IMAGE PREVIEW =================
const fileInput = document.getElementById("file-upload");
const previewImg = document.getElementById("previewImg");
const previewText = document.getElementById("previewText");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      previewText.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
    previewText.style.display = "block";
  }
});

// ================= PUBLISH POST =================
document.querySelector(".publish").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("postName").value.trim();
  const nafdacReg = document.getElementById("postNafdac").value.trim();
  const expiry = document.getElementById("postExpiry").value;
  const category = document.querySelector(".category-select select").value;
  const authentic = document.querySelectorAll(".category-select select")[1]
    .value;
  const file = document.getElementById("file-upload").files[0];

  if (!name || !nafdacReg || !expiry) {
    alert("Name, Nafdac Reg and Expiry date are required");
    return;
  }

  try {
    // Use FormData because we are uploading image + text fields
    const formData = new FormData();
    formData.append("name", name);
    formData.append("nafdacReg", nafdacReg);
    formData.append("expiry", expiry);
    formData.append("category", category.toLowerCase());
    formData.append("authentic", authentic.toLowerCase());
    if (file) formData.append("image", file);

    const token = localStorage.getItem("token"); // If using auth

    const res = await fetch(`${API}/verify`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      showSuccessPopup();
    } else {
      alert(data.message || "Failed to create post");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
});

// ================= SUCCESS POPUP =================
function showSuccessPopup() {
  const popup = document.createElement("div");
  popup.innerHTML = `
    <div style="
      background:#fff;
      border-radius:15px;
      width:350px;
      padding:25px;
      text-align:center;
      box-shadow:0 4px 15px rgba(0,0,0,0.1);
      position:fixed;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      z-index:9999;
    ">
      <div style="font-size:50px; color:#06c167;">✔️</div>
      <h2>🎉 Successful</h2>
      <p><b>Thanks !!!</b><br>Your post has been updated successfully.</p>
      <button id="doneBtn" style="
        background:#06c167;
        color:#fff;
        border:none;
        padding:12px 25px;
        border-radius:10px;
        font-size:16px;
        cursor:pointer;
        margin-top:15px;
      ">Done</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Close on button click
  document.getElementById("doneBtn").addEventListener("click", () => {
    popup.remove();
    window.location.reload(); // optional: refresh form
  });
}
