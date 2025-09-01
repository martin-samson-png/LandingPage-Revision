const contactButton = document.getElementById("contactBtn");
const contactModal = document.getElementById("contact-modal");
const closeModalBtn = contactModal.querySelector(".closeButtonModal");
const modalWrapper = contactModal.querySelector(".modal-wrapper");

const form = document.getElementById("contactForm");
const sendBtn = form.querySelector(".sendButtonModal");

const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const messageEl = document.getElementById("message");

const errName = document.getElementById("name-error");
const errEmail = document.getElementById("email-error");
const errMessage = document.getElementById("message-error");

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// Open/close modal
function openModal() {
  contactModal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  contactModal.setAttribute("aria-hidden", "true");
  resetForm();
}

contactButton.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

//  Validation
function clearErrors() {
  errName.textContent = "";
  errEmail.textContent = "";
  errMessage.textContent = "";
  [nameEl, emailEl, messageEl].forEach((el) =>
    el.classList.remove("input-error")
  );
}

function validate() {
  clearErrors();
  let ok = true;

  if (!nameEl.value.trim()) {
    errName.textContent = "Ce champ est requis.";
    nameEl.classList.add("input-error");
    ok = false;
  }

  const emailVal = emailEl.value.trim();
  if (!emailVal) {
    errEmail.textContent = "Ce champ est requis.";
    emailEl.classList.add("input-error");
    ok = false;
  } else if (!emailRe.test(emailVal)) {
    errEmail.textContent = "Veuillez saisir un email valide.";
    emailEl.classList.add("input-error");
    ok = false;
  }

  if (!messageEl.value.trim()) {
    errMessage.textContent = "Ce champ est requis.";
    messageEl.classList.add("input-error");
    ok = false;
  }

  return ok;
}

function resetForm() {
  form.reset();
  clearErrors();
}

// Confirmation Modal
function showConfirmationModal() {
  const overlay = document.createElement("aside");
  overlay.classList.add("modal", "confirmation");
  overlay.setAttribute("aria-hidden", "false");

  const confirmationModal = document.createElement("div");
  confirmationModal.classList.add("modal-wrapper");

  const title = document.createElement("h2");
  title.textContent = "Merci !";

  const text = document.createElement("p");
  text.textContent = "Votre message a bien été envoyé.";

  const close = document.createElement("button");
  close.type = "button";
  close.classList.add("closeButtonModal");
  close.textContent = "Fermer";

  confirmationModal.appendChild(title);
  confirmationModal.appendChild(text);
  confirmationModal.appendChild(close);
  overlay.appendChild(confirmationModal);
  document.body.appendChild(overlay);

  const remove = () => overlay.remove();
  close.addEventListener("click", remove);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) remove();
  });
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") remove();
    },
    { once: true }
  );
}

// Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;

  closeModal();
  showConfirmationModal();
});
