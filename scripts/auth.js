document.addEventListener("DOMContentLoaded", () => {
    const USERS_URL = '../data/users.json'; 
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    // Create modal for login
    const modalContainer = document.createElement("div");
    modalContainer.id = "loginModal";
    modalContainer.classList.add("auth-modal");

    modalContainer.innerHTML = `
        <h3>Authentication</h3>
        <input type="email" id="emailInput" class="auth-input" placeholder="Enter your email">
        <div class="auth-btn-group">
            <button id="confirmLogin" class="auth-btn auth-btn-confirm">Login</button>
            <button id="cancelLogin" class="auth-btn auth-btn-cancel">Cancel</button>
        </div>
        <p id="loginMsg" class="auth-msg"></p>
    `;

    document.body.appendChild(modalContainer);

    // Auth button click
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "authBtn") {
            handleAuthClick();
        }
    });

    document.getElementById("cancelLogin").addEventListener("click", () => {
        modalContainer.style.display = "none";
        document.getElementById("loginMsg").innerText = ""; 
    });

    document.getElementById("confirmLogin").addEventListener("click", attemptLogin);

    function handleAuthClick() {
        if (localStorage.getItem("userSession")) {
            logout();
        } else {
            modalContainer.style.display = "block";
        }
    }

    async function attemptLogin() {
        const emailVal = document.getElementById("emailInput").value;
        const msgBox = document.getElementById("loginMsg");

        if (!EMAIL_REGEX.test(emailVal)) {
            msgBox.innerText = "Invalid email format!";
            return;
        }

        try {
            const response = await fetch(USERS_URL);
            if (!response.ok) throw new Error("Could not load users.");
            
            const users = await response.json();
            const validUser = users.find(u => u.email === emailVal);

            if (validUser) {
                const sessionData = {
                    name: validUser.name,
                    role: validUser.role,
                    loginTime: new Date().toLocaleString()
                };
                localStorage.setItem("userSession", JSON.stringify(sessionData));
                
                modalContainer.style.display = "none";
                updateUI();
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
        localStorage.removeItem("userSession");
        updateUI();
        alert("You have been logged out.");
    }

    // Update login/logout button
    function updateUI() {
        const btn = document.getElementById("authBtn");
        if (!btn) return;

        const session = JSON.parse(localStorage.getItem("userSession"));

        if (session) {
            btn.innerText = `Logout (${session.name})`;
            btn.classList.add("logged-in");
        } else {
            btn.innerText = "Admin Login";
            btn.classList.remove("logged-in");
        }
    }

    // Wait for footer button to appear
    const checkFooterInterval = setInterval(() => {
        const btn = document.getElementById("authBtn");
        if (btn) {
            btn.classList.add("login-trigger-btn");
            updateUI();
            clearInterval(checkFooterInterval); 
        }
    }, 500); 
});