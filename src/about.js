function createAboutPage() {
  const aboutPage = document.createElement("div");
  aboutPage.classList.add("about-page");

  // OUR STORY
  const mainAboutBox = document.createElement("div");
  mainAboutBox.classList.add("main-about-box");
  const storyTitle = document.createElement("h2");
  storyTitle.classList.add("about-title");
  storyTitle.textContent = "OUR STORY";
  const storyParagraph = document.createElement("p");
  storyParagraph.classList.add("about-paragraph");
  storyParagraph.textContent =
    "It all started with a family recipe and a passion for bringing people together. From a small kitchen to a cozy restaurant, our goal has always been the same: to serve food that warms the heart and comforts the soul.";
  mainAboutBox.appendChild(storyTitle);
  mainAboutBox.appendChild(storyParagraph);

  // OUR VALUES
  const valuesBox = document.createElement("div");
  valuesBox.classList.add("sub-about-box", "r");
  const valuesTitle = document.createElement("h2");
  valuesTitle.classList.add("about-title");
  valuesTitle.textContent = "OUR VALUES";
  const valuesList = document.createElement("ul");
  valuesList.classList.add("about-list");

  const values = [
    "Fresh, locally sourced ingredients",
    "Generous portions at fair prices",
    "A welcoming space for family & friends",
    "Respect for tradition, with a modern twist",
  ];
  values.forEach((value) => {
    const li = document.createElement("li");
    li.textContent = value;
    valuesList.appendChild(li);
  });

  valuesBox.appendChild(valuesTitle);
  valuesBox.appendChild(valuesList);

  // MEET THE CHEF
  const chefBox = document.createElement("div");
  chefBox.classList.add("sub-about-box", "l");
  const chefTitle = document.createElement("h2");
  chefTitle.classList.add("about-title");
  chefTitle.textContent = "MEET THE CHEF";
  const chefParagraph = document.createElement("p");
  chefParagraph.classList.add("about-paragraph");
  chefParagraph.textContent =
    "Behind every dish is Chef Omar, whose love for cooking began at a young age. With years of experience in Mediterranean cuisine, his mission is simple: to share the flavors of home with everyone who walks through our doors.";
  chefBox.appendChild(chefTitle);
  chefBox.appendChild(chefParagraph);

  // Append all to aboutPage
  aboutPage.appendChild(mainAboutBox);
  aboutPage.appendChild(valuesBox);
  aboutPage.appendChild(chefBox);

  return aboutPage;
}

export default createAboutPage;
