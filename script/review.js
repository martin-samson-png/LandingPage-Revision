import users from "./faker-seed.js";
console.log(users);

const reviewTemplate = document.getElementById("review-template");
const reviewList = document.getElementById("review-list");

users.forEach((review) => {
  const reviewClone = reviewTemplate?.content.cloneNode(true);
  const li = reviewClone.querySelector(".review-list-template");
  li.querySelector(".review-author").textContent = review.username;
  li.querySelector(".review-rate").textContent = review.rate + "★";

  li.querySelector(".review-date").textContent = new Date(review.createdAt)
    .toISOString()
    .split("T")[0];

  li.querySelector(".review-comment").textContent = review.comment;

  reviewList?.appendChild(li);
});
