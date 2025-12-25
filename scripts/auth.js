document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CONFIGURARE ---
    const USERS_URL = '../data/users.json'; 
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    // --- 2. CREARE MODAL (Doar structură HTML și clase) ---
    const modalContainer = document.createElement("div");
    modalContainer.id = "loginModal";
    modalContainer.classList.add("auth-modal"); // Adaugă clasa CSS definită

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

    // --- 3. EVENT DELEGATION ---
    document.addEventListener("click", (e) => {
        // Verificăm dacă elementul clickuit are clasa noastră (sau ID-ul)
        if (e.target && e.target.id === "authBtn") {
            handleAuthClick();
        }
    });

    document.getElementById("cancelLogin").addEventListener("click", () => {
        modalContainer.style.display = "none"; // Singurul stil inline rămas (toggle)
        document.getElementById("loginMsg").innerText = ""; 
    });

    document.getElementById("confirmLogin").addEventListener("click", attemptLogin);

    // --- 4. LOGICĂ ---
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

    // --- 5. UI UPDATER ---
    function updateUI() {
        const btn = document.getElementById("authBtn");
        if (!btn) return;

        const session = JSON.parse(localStorage.getItem("userSession"));

        if (session) {
            btn.innerText = `Logout (${session.name})`;
            btn.classList.add("logged-in"); // Folosim clasă pentru stilul de logout
        } else {
            btn.innerText = "Admin Login";
            btn.classList.remove("logged-in");
        }
    }

    // Interval pentru a găsi butonul din Footer
    const checkFooterInterval = setInterval(() => {
        const btn = document.getElementById("authBtn");
        if (btn) {
            // Adăugăm clasa de bază butonului când este găsit
            btn.classList.add("login-trigger-btn");
            updateUI();
            clearInterval(checkFooterInterval); 
        }
    }, 500); 
});