

// Option 1: Hardcode projects in JS
const projects = [
    {
        title: "Quest",
        description: "inovative robotics project made from scratch, trying to combine a drone with a rover",
        link: "quest.html"
    },
    {
        title: "Udraw",
        description: "drawing application written in C# using Windows Forms and SQL database to store drawings",
        link: "udraw.html"
    },
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
