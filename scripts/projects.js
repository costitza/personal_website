let projects = [];
const container = document.querySelector(".projects-container");

// Check if current user is Admin
function isAdmin() {
    try {
        const session = JSON.parse(localStorage.getItem("userSession"));
        return session && session.role === 'admin';
    } catch (e) {
        return false;
    }
}

// Fetch Data
function loadProjects() {
    fetch('../data/projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data;
            generateProjectCards(); 
        })
        .catch(err => console.error("Error loading projects:", err));
}

// Render project cards
function generateProjectCards() {
    container.innerHTML = ""; 

    projects.forEach(project => {
        const isDraft = project.published === false;
        if (isDraft && !isAdmin()) return;

        const card = document.createElement("div");
        card.classList.add("project-box");

        // Show draft badge for admins
        let badgeHTML = "";
        if (isDraft) {
            card.style.border = "1px dashed #ff4d4d"; 
            badgeHTML = `<span style="background:#ff4d4d; color:white; padding:2px 6px; font-size:0.7rem; border-radius:4px; margin-left:8px; vertical-align:middle; text-transform:uppercase;">Draft</span>`;
        }

        card.innerHTML = `
            <h3>${project.title} ${badgeHTML}</h3>
            <h5>${project.category || ''}</h5>
            <p>${project.description}</p>
        `;

        card.addEventListener("click", () => {
            if (project.link && project.link !== "#") {
                window.location.href = project.link;
            }
        });

        container.appendChild(card);
    });
}

// Expose globally for auth.js
window.loadProjects = loadProjects; 

document.addEventListener("DOMContentLoaded", loadProjects);