// post.js

document.addEventListener("DOMContentLoaded", () => {
 
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

  // ================= IMAGE PREVIEW =================
  const fileInput = document.getElementById("file-upload");
  const previewImg = document.getElementById("previewImg");
  const previewText = document.getElementById("previewText");

  console.log("fileInput:", fileInput);
  console.log("previewImg:", previewImg);
  console.log("previewText:", previewText);

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewImg.style.display = "block";
          previewText.style.display = "none";

          // Apply specific size (customize as needed)
        previewImg.style.width = "280px";  
        previewImg.style.height = "150px";  
        previewImg.style.objectFit = "cover"; 
        previewImg.style.borderRadius = "10px"; 
        previewImg.style.border = "2px solid #ccc"; 

        };
        reader.readAsDataURL(file);
      } else {
        previewImg.src = "";
        previewImg.style.display = "none";
        previewText.style.display = "block";
      }
    });
  }

  // ================= PUBLISH POST =================
  const popupForm = document.querySelector(".popup");
  console.log("popupForm:", popupForm);

  if (popupForm) {
    popupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("postName")?.value.trim();
      const nafdacReg = document.getElementById("postNafdac")?.value.trim();
      const expiry = document.getElementById("postExpiry")?.value;

      // ✅ Use IDs directly instead of querySelectorAll
      const category = document.getElementById("categoryR")?.value || "";
      const authentic = document.getElementById("authenticT")?.value || "";

      const file = document.getElementById("file-upload")
        ? document.getElementById("file-upload").files[0]
        : null;

      console.log("name:", name);
      console.log("nafdacReg:", nafdacReg);
      console.log("expiry:", expiry);
      console.log("category:", category);
      console.log("authentic:", authentic);
      console.log("file:", file);

      if (!name || !nafdacReg || !expiry) {
        alert("Name, Nafdac Reg and Expiry date are required");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("nafdacReg", nafdacReg);
        formData.append("expiry", expiry);
        formData.append("category", category.toLowerCase());
        formData.append("authentic", authentic.toLowerCase());
        if (file) formData.append("image", file);

        const res = await fetch(`${API}/verify`, {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: formData,
        });

        const data = await res.json();
        console.log("API response:", data);

        if (res.ok) {
          showSuccessPopup();
        } else {
          alert(data.message || "Failed to create post");
        }
      } catch (err) {
        console.error("Error while creating post:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  }

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

    document.getElementById("doneBtn").addEventListener("click", () => {
      popup.remove();
      window.location.reload();
    });
  }
});
