import users from "./faker-seed.js";

//Ajout dynamique des commentaire existant
const reviewTemplate = document.getElementById("reviewTemplate");
const reviewList = document.getElementById("reviewList");

users.forEach((review) => {
  const reviewClone = reviewTemplate.content.cloneNode(true);
  const li = reviewClone.querySelector(".review-list-template");
  const avatar = li.querySelector(".avatar-author");
  if (review.avatar) {
    avatar.src = review.avatar;
    avatar.alt = `${review.username} - avatar`;
  }
  li.querySelector(".review-author").textContent = review.username;
  li.querySelector(".review-rate").textContent = review.rate + "★";

  li.querySelector(".review-date").textContent = new Date(review.createdAt)
    .toISOString()
    .split("T")[0];

  li.querySelector(".review-comment").textContent = review.comment;

  reviewList.appendChild(li);
});

//Ajout d'un nouvelle avis
const addReview = document.getElementById("addReview");
const reviewUsername = document.getElementById("reviewUsername");
const reviewNote = document.getElementById("reviewNote");
const reviewComment = document.getElementById("reviewComment");

addReview.addEventListener("click", (e) => {
  e.preventDefault();

  if (reviewUsername.value.trim() === "" || reviewNote.value === "") {
    document
      .querySelectorAll(".hidden-review")
      .forEach((c) => c.classList.replace("hidden-review", "alert-review"));
    return;
  }

  const newReview = {
    id: users.length + 1,
    username: reviewUsername.value.trim(),
    rate: reviewNote.value,
    comment: reviewComment.value.trim(),
    createdAt: new Date(Date.now()),
  };

  users.unshift(newReview);

  reviewList.innerHTML = "";
  users.forEach((review) => {
    const reviewClone = reviewTemplate.content.cloneNode(true);
    const li = reviewClone.querySelector(".review-list-template");
    const avatar = li.querySelector(".avatar-author");
    if (review.avatar) {
      avatar.src = review.avatar;
      avatar.alt = `${review.username} - avatar`;
    }
    li.querySelector(".review-author").textContent = review.username;
    li.querySelector(".review-rate").textContent = review.rate + "★";

    li.querySelector(".review-date").textContent = new Date(review.createdAt)
      .toISOString()
      .split("T")[0];

    li.querySelector(".review-comment").textContent = review.comment;

    reviewList.appendChild(li);
  });
});
//Trier par notes

const filterValue = document.getElementById("filterRate");

filterValue.addEventListener("change", (e) => {
  e.preventDefault();
  const selected = filterValue.value;
  const value =
    selected === "" ? users : users.filter((u) => u.rate === Number(selected));

  reviewList.innerHTML = "";

  value.forEach((review) => {
    const reviewClone = reviewTemplate.content.cloneNode(true);
    const li = reviewClone.querySelector(".review-list-template");
    const avatar = li.querySelector(".avatar-author");
    if (review.avatar) {
      avatar.src = review.avatar;
      avatar.alt = `${review.username} - avatar`;
    }
    li.querySelector(".review-author").textContent = review.username;
    li.querySelector(".review-rate").textContent = review.rate + "★";

    li.querySelector(".review-date").textContent = new Date(review.createdAt)
      .toISOString()
      .split("T")[0];

    li.querySelector(".review-comment").textContent = review.comment;

    reviewList.appendChild(li);
  });
});

//Supprimer un avis

const deleteBtn = document.getElementById("deleteBtnReview");

deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const closestLi = deleteBtn.closest(".review-list-template");
  closestLi.remove();
});
