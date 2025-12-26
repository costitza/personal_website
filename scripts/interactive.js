document.addEventListener("DOMContentLoaded", () => {
    const drone = document.getElementById("interactive-drone");
    if (!drone) return;

    drone.style.cursor = "pointer";
    drone.style.transition = "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
    drone.title = "Click me to fly!";

    drone.addEventListener("click", (e) => {
        e.stopPropagation();

        // Random flight path and style
        const randomX = Math.floor(Math.random() * 600) - 300;
        const randomY = Math.floor(Math.random() * 200) - 100;
        const randomRotate = (Math.random() * 40) - 20;
        const randomScale = 0.8 + Math.random() * 0.4;

        drone.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`;
        drone.style.filter = "drop-shadow(0px 20px 20px rgba(0,0,0,0.5))";

        // Land after a while
        setTimeout(() => {
            resetDrone();
        }, 1500);
    });

    // Press Escape to land
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            resetDrone();
        }
    });

    function resetDrone() {
        drone.style.transform = "translate(0, 0) rotate(0) scale(1)";
        drone.style.filter = "none";
    }
});