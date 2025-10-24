// profile.js

window.addEventListener("error", (e) => {
  console.error("Global error caught:", e.message, "at", e.filename, ":", e.lineno);
});

 //const API = 'http://localhost:5000/api'; // Local backend
  const API = "https://fake-drug-verification.onrender.com/api"; // Production backend
  const APP = "https://fake-drug-verification.onrender.com"; // FOR IMAGES

  // ================= USER ROLE CHECK =================
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) 
    window.location.href = "../index.html";

  if (userRole !== "admin") {
    alert("You are not an admin");
    window.location.href = "https://fake-drug-verification.onrender.com";
  }

// Elements
const profileForm = document.getElementById("profileForm");
const avatarInput = document.getElementById("avatarInput");
const avatarBtn = document.querySelector(".form-image");
const avatarPreview = document.getElementById("profile-avatar");

// Open file picker when button clicked
avatarPreview.addEventListener("click", () => avatarInput.click());


// Show preview when file selected
avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

// Load user profile on page load
async function loadUserProfile() {
  try {
    console.log("Fetching profile...");
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Profile response status:", res.status);

    if (!res.ok) throw new Error("Failed to fetch profile");

    const user = await res.json();

    // Fill form fields
    document.getElementById("fullname").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phoneNumber || "";
    document.getElementById("location").value = user.location || "";

    // Set avatar
    if (user.profileImage) {
      // Ensure full URL
      avatarPreview.src = user.profileImage.startsWith("http")
        ? user.profileImage
        : `${APP}${user.profileImage}`;
    }

  } catch (err) {
    console.error("Error loading profile:", err);
    alert("Could not load profile data");
  }
}

// Update profile
document
  .querySelector(".profile-form-inner")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "username",
      document.getElementById("fullname").value.trim()
    );
    formData.append("email", document.getElementById("email").value.trim());
    formData.append(
      "phoneNumber",
      document.getElementById("phone").value.trim()
    );
    formData.append(
      "location",
      document.getElementById("location").value.trim()
    );

    if (avatarInput.files[0]) {
       console.log("Avatar selected:", avatarInput.files[0].name);
      formData.append("image", avatarInput.files[0]); 
    } else {
  console.log("No avatar selected");
}


    console.log("Submitting profile update...");

    try {
      const res = await fetch(`${API}/auth/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // JWT
        },
        body: formData, // multipart/form-data
      });

       console.log("Update response status:", res.status);

      const data = await res.json();

      console.log("Update response data:", data);


      if (res.ok) {
        alert("User updated successfully");

        // Refresh fields with updated data
        document.getElementById("fullname").value = data.user.username;
        document.getElementById("email").value = data.user.email;
        document.getElementById("phone").value = data.user.phoneNumber;
        document.getElementById("location").value = data.user.location;

        if (data.user.profileImage) {
          avatarPreview.src = data.user.profileImage;
        }
      } else {
        alert(data.message || "User update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
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

async function loadUserProfile2() {
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
loadUserProfile2();
fetchAwareness();



// Run on page load
window.addEventListener("DOMContentLoaded", loadUserProfile);


