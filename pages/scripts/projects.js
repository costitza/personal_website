// scripts/projects.js

// Option 1: Hardcode projects in JS
const projects = [
{
    title: "Portfolio Website",
    description: "A responsive personal portfolio built with HTML, CSS, and JS.",
    link: "projects/portfolio.html"
},
{
    title: "Weather App",
    description: "A simple weather app using OpenWeatherMap API.",
    link: "projects/weather.html"
},
{
    title: "Task Manager",
    description: "Full-stack app for managing daily tasks.",
    link: "projects/task.html"
}
];

// Select container
const container = document.querySelector(".projects-container");
// Select where to view
const projectView = document.getElementById("project-view");

// Generate cards
function createProjectCards() {
    container.innerHTML = ""; // Clear any existing cards

    projects.forEach((project) => {
        const card = document.createElement("div");
        card.classList.add("project-box");
        card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        `;

        // Click to load project details dynamically
        card.addEventListener("click", () => loadProjectPage(project.page));

        container.appendChild(card);
    });
}


async function loadProjectPage(pagePath) {
    try{
        const response = await fetch(pagePath);
        const html = await response.text();


        // fade out project grid, fade in project view
        container.style.display = "none";
        projectView.innerHTML = `
            <div class="project-detail">
                <button id="back-btn">← Back to projects</button>
                ${html}
            </div>
            `;
        document.getElementById("back-btn").addEventListener("click", () => {
        projectView.innerHTML = "";
        container.style.display = "grid";
        });
    }
    catch (err) {
        console.error("Error loading project:", err);
        projectView.innerHTML = `<p>Failed to load project details.</p>`;
    }
}

createProjectCards();
