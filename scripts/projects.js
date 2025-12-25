

let projects = [];

// AJAX Request (Fetch JSON)
fetch('../data/projects.json')
    .then(response => response.json())
    .then(data => {
        projects = data;
    })
    .catch(err => console.error("Error loading projects:", err));

// Select container
const container = document.querySelector(".projects-container");

// Wait for projects to load before generating cards
setTimeout(() => {
    generateProjectCards();
}, 500);

function generateProjectCards() {


    // Generate cards
    projects.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("project-box");
        card.innerHTML = `
            <h3>${project.title}</h3>
            <h5>${project.category}</h5>
            <p>${project.description}</p>
        `;

        // Open detailed project page on click
        card.addEventListener("click", () => {
            window.location.href = project.link;
        });

        container.appendChild(card);
    });
}
