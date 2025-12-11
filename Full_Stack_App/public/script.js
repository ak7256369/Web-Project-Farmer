document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".hero .btn");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Thanks for visiting BeFarmer!");
    });
  }
});
