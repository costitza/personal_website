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

// Generate cards
projects.forEach(project => {
const card = document.createElement("div");
card.classList.add("project-box");
card.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.description}</p>
`;

// Open detailed project page on click
card.addEventListener("click", () => {
    window.location.href = project.link;
});

container.appendChild(card);
});
