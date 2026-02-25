setTimeout(() => {
  const welcome = document.getElementById('welcome');
  welcome.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = "homes.html";
  }, 1000);
}, 3000);