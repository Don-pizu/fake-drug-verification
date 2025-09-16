//verify-product.js

// Set the backend API URL
//const API = 'http://localhost:5000/api'; // Uncomment this for local testing

const API = 'https://fake-drug-verification.onrender.com/api'; // Production backend

const token = localStorage.getItem('token');

const vfyContainer = document.getElementById('vfy-container');

if(!token)
	window.location.href = "../index/index.html";

document.querySelector('.verification-form').addEventListener('submit', async (e) => {
	e.preventDefault();

	const nafdacReg = document.getElementById('nafdac-number').value.trim();

	if (!nafdacReg) {
		alert('Nafdac number is required');
		return;
	}

	try {
		const res = await fetch(`${API}/verify/${nafdacReg}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await res.json();

		if (res.ok) {
	      // Clear previous modal
	      vfyContainer.innerHTML = "";

	      // Create overlay
	      const overlay = document.createElement("div");
	      overlay.classList.add("vfy-overlay");

	      // Create modal
	      const modal = document.createElement("div");
	      modal.classList.add("vfy-modal", "vfy-active");

	      modal.innerHTML = `
	        <div class="vfy-header">
	          <span>Verification Result</span>
	          <button id="vfy-close">&times;</button>
	        </div>
	        <div class="vfy-body">
	          <img src="${data.image ? `http://localhost:5000${data.image}` : "../assets/images/default.png"}" alt="${data.name}">
	          <h2 class="vfy-name">${data.name}</h2>
	          <span class="vfy-badge ${data.authentic ? "vfy-authentic" : "vfy-counterfeit"}">
	            ${data.authentic ? "✔ Authentic" : "⚠ Counterfeit"}
	          </span>
	          <p class="vfy-line">Category: ${data.category || "N/A"}</p>
	          <p class="vfy-line"><strong>Reg. No:</strong> ${data.nafdacReg}</p>
	          <p class="vfy-line"><strong>Expired:</strong> ${data.expiry || "N/A"}</p>
	          <button class="vfy-done" id="vfy-done">Done</button>
	          <div class="vfy-safety">
	            <strong>⚠ Safety Reminder</strong>
	            Always verify a product before using it on your body.
	            Fake or unapproved items can cause serious harm. Use only trusted sources.
	          </div>
	        </div>
	      `;

	      vfyContainer.appendChild(overlay);
	      vfyContainer.appendChild(modal);

	      // Close handlers
	      document.getElementById("vfy-close").addEventListener("click", () => {
	        overlay.remove();
	        modal.remove();
	      });
	      document.getElementById("vfy-done").addEventListener("click", () => {
	        overlay.remove();
	        modal.remove();
	      });
	      overlay.addEventListener("click", () => {
	        overlay.remove();
	        modal.remove();
	      });

			
		} else {
			alert(data.message || 'Nafdac Reg is invalid')
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
