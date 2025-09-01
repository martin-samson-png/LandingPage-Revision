const faqs = [
    { question: "Comment suivre ma commande ?", answer: "Vous pouvez suivre votre commande depuis votre espace client dans la rubrique 'Mes commandes'." },
    { question: "Quels sont les délais de livraison ?", answer: "La livraison prend en moyenne 2 à 5 jours ouvrés selon votre localisation." },
    { question: "Puis-je retourner un article ?", answer: "Oui, vous disposez de 14 jours pour retourner un article à vos frais." },
    { question: "Quels moyens de paiement acceptez-vous ?", answer: "Nous acceptons les cartes bancaires et PayPal." },
    { question: "Comment contacter le service client ?", answer: "Vous pouvez nous contacter via le formulaire de contact ou par téléphone au 00 00 00 00 00." }
]

const faqList = document.getElementById("faq-list");
const searchInput = document.getElementById("faq-search");
const template = document.getElementById("faq-template");

function renderFAQ(list) {
  faqList.innerHTML = "";
  list.forEach(item => {
    const clone = template.content.cloneNode(true);
    const questionEl = clone.querySelector(".faq-text");
    const answerEl = clone.querySelector(".faq-answer");
    const iconEl = clone.querySelector(".faq-icon");
    const questionGlobal = clone.querySelector(".faq-question");

    questionEl.textContent = item.question;
    answerEl.textContent = item.answer;

    questionGlobal.addEventListener("click", () => {
      const isOpen = answerEl.classList.contains("open");
      document.querySelectorAll(".faq-answer").forEach(ans => ans.classList.remove("open"));
      document.querySelectorAll(".faq-icon").forEach(icon => icon.classList.remove("open"));
      if (!isOpen) {
        answerEl.classList.add("open");
        iconEl.classList.add("open");
      }
    });

    faqList.appendChild(clone);
  });
}

searchInput.addEventListener("input", s => {
  const search = s.target.value.toLowerCase();
  const filtered = faqs.filter(faq => faq.question.toLowerCase().includes(search));
  renderFAQ(filtered);
});

renderFAQ(faqs);