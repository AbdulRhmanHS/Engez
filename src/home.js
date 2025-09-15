import img from "./img/main-img.jpg";

export default function createHomePage() {
  const mainPage = document.createElement("div");
  const mainText = document.createElement("article");
  const mainTitle = document.createElement("h1");
  const separator = document.createElement("div");
  const mainParagraph = document.createElement("p");
  const mainBtn = document.createElement("button");
  const mainImg = document.createElement("img");

  mainTitle.textContent = "SERVING YOU COMFORT FOOD MADE WITH LOVE SINCE 2025";
  mainParagraph.textContent = ` From sizzling grills to freshly baked bread, every dish is crafted with care
                                to bring warmth to your table. Whether you’re stopping by for a quick
                                bite or sharing a meal with friends and family, we believe good food
                                should feel like home. Our promise is simple: fresh ingredients, generous
                                portions, and flavors that make you smile every time.`;
  mainBtn.textContent = "ORDER NOW";
  mainImg.src = img;
  mainImg.alt = "Food";

  mainPage.classList.add("main-page");
  mainText.classList.add("main-text");
  mainTitle.classList.add("main-title");
  separator.classList.add("separator");
  mainParagraph.classList.add("main-paragraph");
  mainBtn.classList.add("main-btn");
  mainImg.classList.add("main-img");

  mainText.append(mainTitle, separator, mainParagraph, mainBtn);
  mainPage.append(mainText, mainImg);

  return mainPage;
};