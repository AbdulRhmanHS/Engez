import "./styles.css";
import createHomePage from "./home";
import createMenuPage from "./menu";
import createContactPage from "./contact";
import createAboutPage from "./about";

const headerBtns = document.querySelectorAll(".header-btn");
const home = document.querySelector(".home");
const menu = document.querySelector(".menu");
const contact = document.querySelector(".contact");
const about = document.querySelector(".about");
const content = document.getElementById("content");

// Make the border fixed to current selected button
headerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    headerBtns.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");
  });
});

function showTab(btn, tabCreator) {
  btn.addEventListener("click", () => {
    content.replaceChildren(); // clear old content
    const tab = tabCreator();  // create new DOM node
    content.appendChild(tab);  // insert it
  });
}

// Pass the functions, not their results
showTab(home, createHomePage);
showTab(menu, createMenuPage);
showTab(contact, createContactPage);
showTab(about, createAboutPage);

// At start, show the home page
document.addEventListener("DOMContentLoaded", function() {
  home.click();
});