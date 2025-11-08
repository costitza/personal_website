

document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll("[data-include]");

    includes.forEach(el => {
        let file = el.getAttribute("data-include");

        // Determine base path dynamically
        const currentPath = window.location.pathname;
        const depth = currentPath.split("/").length - 2; // how deep you are from root
        const prefix = "../".repeat(depth);

        // If file path doesn’t start with http or /
        if (!file.startsWith("/")) {
        file = prefix + file;
        }

        fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Could not load ${file}`);
            return response.text();
        })
        .then(data => {
            el.innerHTML = data;
        })
        .catch(error => console.error("Include error:", error));
    });
});
