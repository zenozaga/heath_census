export default function ContactPage(app) {
  const contactForm = document.getElementById("contact-form");

  const dialog = document.getElementById("contact-dialog");
  const dialogText = dialog.querySelector(".dialog-message");
  const dialogButton = dialog.querySelector("#close-dialog");

  contactForm.addEventListener("submit", onContactFormSubmit);
  dialogButton.addEventListener("click", () => showDialog(false));

  /////////////////////
  /// Functions
  /////////////////////

  function showDialog(isOpen, data = {}) {
    if (!isOpen) {
      dialog.classList.remove("open");
      return;
    }

    const { name, email, message } = data;

    dialogText.innerHTML = `
    <br />
    Our travel experts will contact you soon at <strong>${email}</strong>  
    to help plan your next adventure
  `;
    dialog.classList.add("open");
  }

  function onContactFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.name) return alert("Please enter your name");
    if (!data.email) return alert("Please enter your email");
    if (!data.message) return alert("Please enter your message");

    this.reset();
    showDialog(true, data);
  }
}
