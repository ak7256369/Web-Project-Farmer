document.addEventListener("DOMContentLoaded", () => {
  // Only alert if the link is a placeholder '#'
  const btns = document.querySelectorAll("a[href='#']");
  btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // alert("Feature coming soon!");
    });
  });
});
