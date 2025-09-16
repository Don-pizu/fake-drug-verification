
// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend

const token = localStorage.getItem('token');
const rptContainer = document.getElementById('rpt-container');

const vfyContainer = document.getElementById('vfy-container');

if(!token)
	window.location.href = "../index/index.html";


// Preview uploaded image
const fileInput = document.getElementById('fileUpload');
const previewImg = document.createElement('img');
previewImg.id = 'preview-img';
previewImg.style.maxWidth = '150px';
previewImg.style.marginTop = '10px';
previewImg.style.display = 'none';
fileInput.parentNode.appendChild(previewImg);

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = 'block';
  } else {
    previewImg.src = '';
    previewImg.style.display = 'none';
  }
});


// Form submission
document.querySelector('.emails-input-parent').addEventListener('submit', async (e) => {
  e.preventDefault();

  const productName = document.getElementById('productName').value.trim();
  const location = document.getElementById('location').value.trim();
  const description = document.getElementById('description').value.trim();
  const nafdacReg = document.getElementById('nafdacReg').value.trim();
  const batchNo = document.getElementById('batchNo').value.trim();
  const file = document.getElementById('fileUpload').files[0];

  // Collect category 
  let category = "";
  document.querySelectorAll('.items input[type="checkbox"]').forEach(el => {
    if (el.checked) category = el.value; // use value, not innerText
  });

  if (!productName || !location || !category || !nafdacReg) {
    alert('Product name, location, category and Nafdac reg are required');
    return;
  }

  try {
    const formData = new FormData();   //user form data to accept file (image)
    formData.append('productName', productName);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('nafdacReg', nafdacReg);
    formData.append('batchNo', batchNo);
    if (file) formData.append('image', file);

    const res = await fetch(`${API}/report`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // keep token, but no Content-Type here
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      rptContainer.innerHTML = '';

      const overlay = document.createElement('div');
      overlay.classList.add('custom-overlay');

      const modal = document.createElement('div');
      modal.classList.add('custom-modal');
      modal.innerHTML = `
        <div class="custom-toast" id="custom-popup">
          <p class="custom-success">✅ Report Successfully</p>
          <p class="custom-msg">Thank you for helping us keep the community safe. Your report has been received and will be reviewed by our team. If neccessary, appropriate action will be
           taken promptly. Check your history for your report progress.</p>
          <button class="custom-done" id="custom-done-btn">Done</button>
        </div>
      `;

      rptContainer.appendChild(overlay);
      rptContainer.appendChild(modal);

      const removePopup = () => {
        overlay.remove();
        modal.remove();
      };

      document.getElementById('custom-done-btn').onclick = removePopup;
      overlay.onclick = removePopup;

      // Clear form
      e.target.reset();
      previewImg.src = '';
      previewImg.style.display = 'none';
 
    } else {
      alert(data.message || "Reporting a product failed");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});



//LOGOUT BUTTON
const logoutBtn = document.getElementById('logloglog')

// get logged-in user details
const userId = localStorage.getItem("userId");

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "../index/index.html";
  });
}


//FOR profile image

async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
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
        : "../images/admin-images/Ellipse 1.svg"; // fallback
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
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Awareness Response:", data);

    if (!res.ok) throw new Error(data.message || "Failed to load awareness");

    const awarenessList = data.awareNess || [];

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
          src="${a.image ? `http://localhost:5000${a.image}` : "../images/admin-images/profile-female.svg"}"
          alt="awareness"
        />
        <div class="mobile-dashboard-notification-frame-parent">
          <div class="miss-jennifer-parent">
            <div class="miss-jennifer">${a.title}</div>
            <div class="view-wrapper"><div class="view">View</div></div>
          </div>
          <div class="fake-product-everywhere">${a.description || "No description"}</div>
          <div class="m-ago">${new Date(a.createdAt).toLocaleDateString()}</div>
        </div>
      `;
      container.appendChild(item);
    });

  } catch (err) {
    console.error("Awareness error:", err.message);
  }
}







loadUserProfile();
fetchAwareness();
