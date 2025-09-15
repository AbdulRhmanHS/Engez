export default function createContactPage() {
  const contactPage = document.createElement("div");
  contactPage.classList.add("contact-page");

  // Left side: contact info
  const contactInfo = document.createElement("div");
  contactInfo.classList.add("contact-info");

  const contactTitle = document.createElement("h2");
  contactTitle.textContent = "CONTACT US";

  const contactDesc = document.createElement("p");
  contactDesc.textContent =
    "We’d love to hear from you! Reach us by phone, email, or visit us at our restaurant.";

  const contactAddress = document.createElement("p");
  contactAddress.innerHTML = "<strong>Address:</strong> 123 Main St, City, Country";

  const contactPhone = document.createElement("p");
  contactPhone.innerHTML = "<strong>Phone:</strong> +1 (123) 456-7890";

  const contactHoursTitle = document.createElement("p");
  contactHoursTitle.innerHTML = "<strong>Hours:</strong>";

  const hoursList = document.createElement("ul");
  const hours1 = document.createElement("li");
  hours1.textContent = "Sat–Thu: 11:00 AM – 11:00 PM";
  const hours2 = document.createElement("li");
  hours2.textContent = "Fri: 1:00 PM – 12:00 AM";
  hoursList.append(hours1, hours2);

  contactInfo.append(
    contactTitle,
    contactDesc,
    contactAddress,
    contactPhone,
    contactHoursTitle,
    hoursList
  );

  // Right side: form
  const form = document.createElement("form");
  form.classList.add("contact-form");
  form.setAttribute("action", "#");

  // Name group
  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group");

  const firstNameGroup = document.createElement("div");
  firstNameGroup.classList.add("name-group");
  const firstLabel = document.createElement("label");
  firstLabel.setAttribute("for", "first-name");
  firstLabel.textContent = "First Name";
  const firstInput = document.createElement("input");
  firstInput.type = "text";
  firstInput.id = "first-name";
  firstInput.name = "first-name";
  firstInput.required = true;
  firstNameGroup.append(firstLabel, firstInput);

  const lastNameGroup = document.createElement("div");
  lastNameGroup.classList.add("name-group");
  const lastLabel = document.createElement("label");
  lastLabel.setAttribute("for", "last-name");
  lastLabel.textContent = "Last Name";
  const lastInput = document.createElement("input");
  lastInput.type = "text";
  lastInput.id = "last-name";
  lastInput.name = "last-name";
  lastInput.required = true;
  lastNameGroup.append(lastLabel, lastInput);

  formGroup.append(firstNameGroup, lastNameGroup);

  // Email group
  const emailGroup = document.createElement("div");
  emailGroup.classList.add("name-group");
  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "email");
  emailLabel.textContent = "Email *";
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.required = true;
  emailGroup.append(emailLabel, emailInput);

  // Message group
  const messageGroup = document.createElement("div");
  messageGroup.classList.add("name-group");
  const messageLabel = document.createElement("label");
  messageLabel.setAttribute("for", "message");
  messageLabel.textContent = "Message";
  const messageTextarea = document.createElement("textarea");
  messageTextarea.id = "message";
  messageTextarea.name = "message";
  messageTextarea.required = true;
  messageGroup.append(messageLabel, messageTextarea);

  // Button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Send";

  form.append(formGroup, emailGroup, messageGroup, submitBtn);

  // Append to page
  contactPage.append(contactInfo, form);

  return contactPage;
}
