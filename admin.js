/* Sidebar toggle */
const sidebar = document.getElementById("mobileSidebar");
function toggleSidebar(){ sidebar.classList.toggle("show"); }
window.addEventListener("click", e => {
  if(!e.target.closest(".menu-toggle") && !e.target.closest(".sidebar")) sidebar.classList.remove("show");
});

/* Smooth scroll reveal animation */
const fadeEls = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{ threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));