let projects = [];
const container = document.querySelector(".projects-container");

// 1. HELPER: Check if current user is Admin
// Reads the session created by your auth.js script
function isAdmin() {
    try {
        const session = JSON.parse(localStorage.getItem("userSession"));
        return session && session.role === 'admin';
    } catch (e) {
        return false;
    }
}

// 2. MAIN FUNCTION: Fetch Data
function loadProjects() {
    fetch('../data/projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data;
            // FIX: Call render immediately when data arrives (No more setTimeout)
            generateProjectCards(); 
        })
        .catch(err => console.error("Error loading projects:", err));
}

// 3. RENDER FUNCTION
function generateProjectCards() {
    // Clear container first (Crucial for refreshing when logging in/out)
    container.innerHTML = ""; 

    projects.forEach(project => {
        // --- LOGIC: DRAFT MODE ---
        // If project is NOT published (draft) AND user is NOT admin, hide it.
        const isDraft = project.published === false;
        
        if (isDraft && !isAdmin()) {
            return; // Skip this iteration (don't show the card)
        }

        // Create Card
        const card = document.createElement("div");
        card.classList.add("project-box");

        // --- UI: VISUAL CUES FOR ADMIN ---
        let badgeHTML = "";
        if (isDraft) {
            // Give drafts a distinct look so you know they are hidden from public
            card.style.border = "1px dashed #ff4d4d"; 
            badgeHTML = `<span style="background:#ff4d4d; color:white; padding:2px 6px; font-size:0.7rem; border-radius:4px; margin-left:8px; vertical-align:middle; text-transform:uppercase;">Draft</span>`;
        }

        card.innerHTML = `
            <h3>${project.title} ${badgeHTML}</h3>
            <h5>${project.category || ''}</h5>
            <p>${project.description}</p>
        `;

        // Click Event
        card.addEventListener("click", () => {
            // Prevent clicking if link is empty or hash
            if (project.link && project.link !== "#") {
                window.location.href = project.link;
            }
        });

        container.appendChild(card);
    });
}

// 4. EXPOSE GLOBALLY
// This allows auth.js to call window.loadProjects() to refresh the view on Login/Logout
window.loadProjects = loadProjects; 
// window.renderProjects = generateProjectCards; // Call this if you just want to re-render without fetching

// Initialize on page load
document.addEventListener("DOMContentLoaded", loadProjects);