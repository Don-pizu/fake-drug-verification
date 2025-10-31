// testimonies.js


const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");

// TOKEN CHECK & AUTO LOGOUT
function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
}

if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    // If expired already
    if (expiryTime <= 0) {
      alert("Your session has expired. Please log in again.");
      clearUserSession();
      window.location.href = "../signin/signin.html";
    } else {
      // Auto logout when it expires
      setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        clearUserSession();
        window.location.href = "../signin/signin.html";
      }, expiryTime);
    }
  } catch (err) {
    console.error("Invalid token:", err);
    alert("Invalid session. Please log in again.");
    clearUserSession();
    window.location.href = "../signin/signin.html";
  }
} else {
  // redirect to login if no token
  const offline = document.querySelectorAll('.offline');
  offline.forEach(element => element.style.display = 'none'); // remove space from layout

  const offline2 = document.querySelectorAll('.offline2');
  offline2.forEach(element => element.style.visibility = 'hidden'); // keep layout
}


//=========LOGOUT=======/
// ---------- LOGOUT: attach to all .logloglog anchors ----------
const logoutBtns = document.querySelectorAll(".logloglog");
if (logoutBtns && logoutBtns.length > 0) {
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      clearUserSession();
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
loadUserProfile();
fetchAwareness();
