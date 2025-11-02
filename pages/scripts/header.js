const lastnameEl = document.getElementById("lastname");
const firstnameEl = document.getElementById("firstname");

const lastname = "Ababei";
const firstname = "Raul";

function typeText(element, text, delay = 100, callback) {
element.textContent = "";
let i = 0;
const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i === text.length) {
    clearInterval(interval);
    if (callback) callback();
    }
}, delay);
}

function runAnimation() {
// Clear previous text
lastnameEl.textContent = "";
firstnameEl.textContent = "";

// Type both names one after the other
typeText(lastnameEl, lastname, 150, () => {
    setTimeout(() => {
    typeText(firstnameEl, firstname, 150);
    }, 400);
});
}

// Run on page load and repeat every 5 seconds
window.addEventListener("load", () => {
runAnimation();
setInterval(runAnimation, 5000);
});
