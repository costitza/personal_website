document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CONFIGURATION ---
    const USERS_URL = '../data/users.json'; // Path to your JSON
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Requirement: Regex

    // --- 2. CREATE MODAL HTML (Requirement: Creating elements) ---
    // We create the modal structure in JS and inject it into the body
    const modalContainer = document.createElement("div");
    modalContainer.id = "loginModal";
    
    // Inline styles for simplicity (Requirement: Modifying style)
    Object.assign(modalContainer.style, {
        display: "none",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(56, 60, 71, 0.95)",
        padding: "2rem",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        zIndex: "1000",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)"
    });

    modalContainer.innerHTML = `
        <h3 style="color: rgb(41, 201, 215); margin-bottom: 1rem;">Authentication</h3>
        <input type="email" id="emailInput" placeholder="Enter your email" 
               style="padding: 10px; border-radius: 5px; border: none; width: 100%; margin-bottom: 10px;">
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="confirmLogin" style="padding: 8px 16px; background: rgb(41, 201, 215); border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Login</button>
            <button id="cancelLogin" style="padding: 8px 16px; background: #ff4d4d; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
        </div>
        <p id="loginMsg" style="color: red; font-size: 0.8rem; margin-top: 10px;"></p>
    `;

    document.body.appendChild(modalContainer);

    // --- 3. EVENT DELEGATION (Requirement: Mouse events & Handling dynamic elements) ---
    // Since the footer is loaded via AJAX (include_components.js), the button doesn't exist yet.
    // We listen on the 'document' and check if the clicked element is our button.
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "authBtn") {
            handleAuthClick();
        }
    });

    // Modal internal events
    document.getElementById("cancelLogin").addEventListener("click", () => {
        modalContainer.style.display = "none";
        document.getElementById("loginMsg").innerText = ""; // Clear errors
    });

    document.getElementById("confirmLogin").addEventListener("click", attemptLogin);

    // --- 4. LOGIC FUNCTIONS ---

    function handleAuthClick() {
        // Check if already logged in
        if (localStorage.getItem("userSession")) {
            // If logged in, this button acts as Logout
            logout();
        } else {
            // If logged out, open Modal
            modalContainer.style.display = "block";
        }
    }

    async function attemptLogin() {
        const emailVal = document.getElementById("emailInput").value;
        const msgBox = document.getElementById("loginMsg");

        // Requirement: Validation with Regex
        if (!EMAIL_REGEX.test(emailVal)) {
            msgBox.innerText = "Invalid email format!";
            return;
        }

        try {
            // Requirement: AJAX (Fetch)
            const response = await fetch(USERS_URL);
            if (!response.ok) throw new Error("Could not load users.");
            
            const users = await response.json();
            
            // Requirement: Array method (find)
            const validUser = users.find(u => u.email === emailVal);

            if (validUser) {
                // Requirement: LocalStorage & Date
                const sessionData = {
                    name: validUser.name,
                    role: validUser.role,
                    loginTime: new Date().toLocaleString()
                };
                localStorage.setItem("userSession", JSON.stringify(sessionData));
                
                modalContainer.style.display = "none";
                updateUI(); // Refresh button text
                alert(`Welcome back, ${validUser.name}!`);
            } else {
                msgBox.innerText = "User not found in database.";
            }

        } catch (error) {
            console.error("Login error:", error);
            msgBox.innerText = "System error. Try again.";
        }
    }

    function logout() {
        // Requirement: Deleting from Storage
        localStorage.removeItem("userSession");
        updateUI();
        alert("You have been logged out.");
    }

    // --- 5. UI UPDATER & INTERVAL (Requirement: setInterval) ---
    function updateUI() {
        const btn = document.getElementById("authBtn");
        if (!btn) return; // Button might not be loaded yet

        const session = JSON.parse(localStorage.getItem("userSession"));

        if (session) {
            btn.innerText = `Logout (${session.name})`;
            btn.style.background = "#ff4d4d"; // Change style to indicate logout
            btn.style.color = "white";
        } else {
            btn.innerText = "Admin Login";
            btn.style.background = ""; // Reset style
            btn.style.color = "";
        }
    }

    // Since include_components.js takes time to load the footer, we use setInterval
    // to keep trying to update the UI until the footer appears.
    const checkFooterInterval = setInterval(() => {
        const btn = document.getElementById("authBtn");
        if (btn) {
            updateUI();
            // We don't clear interval because if the user navigates or something changes, 
            // we might want to keep checking, or we can clear it if we are sure it's static.
            // For this assignment, leaving it running or clearing it once is fine.
            clearInterval(checkFooterInterval); 
        }
    }, 500); // Check every 500ms
});