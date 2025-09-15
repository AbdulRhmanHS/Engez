import falafelImg from "./img/falafel.jpg";
import chickenImg from "./img/grilled-chicken.jpg";
import kunafaImg from "./img/kunafa.jpg";
import shawarmaImg from "./img/shawarma.jpg";

export default function createMenuPage() {
  const menuPage = document.createElement("div");
  menuPage.classList.add("menu-page");

  // Dish factory function
  function createDish(imgSrc, altText, title, description, price) {
    const dish = document.createElement("article");
    dish.classList.add("dish");

    const dishImg = document.createElement("img");
    dishImg.src = imgSrc;
    dishImg.alt = altText;
    dishImg.classList.add("menu-img");

    const menuInfo = document.createElement("div");
    menuInfo.classList.add("menu-info");

    const dishTitle = document.createElement("h2");
    dishTitle.textContent = title;
    dishTitle.classList.add("dish-title");

    const dishDescription = document.createElement("p");
    dishDescription.textContent = description;
    dishDescription.classList.add("dish-description");

    const dishPrice = document.createElement("p");
    dishPrice.textContent = price;
    dishPrice.classList.add("dish-price");

    menuInfo.append(dishTitle, dishDescription, dishPrice);
    dish.append(dishImg, menuInfo);

    return dish;
  }

  // Add dishes
  menuPage.append(
    createDish(
      falafelImg,
      "Falafel Plate",
      "Falafel Plate",
      "Crispy falafel served with hummus, tahini, and fresh veggies.",
      "35 EGP"
    ),
    createDish(
      chickenImg,
      "Grilled Chicken",
      "Grilled Chicken",
      "Tender chicken with aromatic spices, served with rice and salad.",
      "150 EGP"
    ),
    createDish(
      kunafaImg,
      "Kunafa",
      "Kunafa",
      "Sweet cheese pastry soaked in light syrup, topped with pistachios.",
      "80 EGP"
    ),
    createDish(
      shawarmaImg,
      "Shawarma Wrap",
      "Shawarma Wrap",
      "Spiced meat, fresh veggies, and tahini sauce wrapped in warm pita.",
      "100 EGP"
    )
  );

  return menuPage;
}
