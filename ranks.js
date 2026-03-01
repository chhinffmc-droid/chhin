/* Sidebar toggle */
const sidebar = document.getElementById("mobileSidebar");
function toggleSidebar(){ sidebar.classList.toggle("show"); }
window.addEventListener("click", e => {
  if(!e.target.closest(".menu-toggle") && !e.target.closest(".sidebar")) sidebar.classList.remove("show");
});

/* Smooth fade-in on scroll */
const fadeEls = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{ threshold: 0.12 });
fadeEls.forEach(el => observer.observe(el));

/* ====== RANK STORE Modal controls ====== */
const buyModal = document.getElementById('buyModal');
const modalClose = document.getElementById('modalClose');
const buyButtons = document.querySelectorAll('.buy');
const rankField = document.getElementById('rankField');
const priceField = document.getElementById('priceField');
const qrImage = document.getElementById('qrImage');

buyButtons.forEach(btn => btn.addEventListener('click', () => {
  const card = btn.closest('.card');
  const rank = card.dataset.rank || '';
  const price = '$' + (card.dataset.price || '0');
  const qr = card.dataset.qr || 'qr.jpg';
  rankField.value = rank;
  priceField.value = price;
  qrImage.src = qr;
  buyModal.style.display = 'flex';
  buyModal.setAttribute('aria-hidden', 'false');
}));

modalClose.addEventListener('click', () => {
  buyModal.style.display = 'none';
  buyModal.setAttribute('aria-hidden', 'true');
});
window.addEventListener('click', e => {
  if (e.target === buyModal) {
    buyModal.style.display = 'none';
    buyModal.setAttribute('aria-hidden', 'true');
  }
});

/* ====== Success modal ====== */
const successModal = document.getElementById('successModal');
const successClose = document.getElementById('successClose');
successClose.addEventListener('click', () => {
  successModal.style.display = 'none';
  successModal.setAttribute('aria-hidden', 'true');
});

/* ====== Form logic ====== */
const form = document.getElementById('buyForm');
const screenshotInput = document.getElementById('screenshot');
const hiddenScreenshot = document.getElementById('screenshot_url');
const payBtn = document.getElementById('payBtn');

function validateForm(){
  const mcName = document.getElementById('mcName').value.trim();
  const platform = document.getElementById('platform').value;
  const gamemode = document.getElementById('gamemode').value;
  const screenshot = screenshotInput.files.length;
  payBtn.disabled = !(mcName && platform && gamemode && screenshot > 0);
}
form.addEventListener('input', validateForm);
screenshotInput.addEventListener('change', validateForm);

/* ====== Form submit (upload to imgbb then send Telegram) ====== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  payBtn.disabled = true;
  payBtn.textContent = 'Uploading...';

  const file = screenshotInput.files[0];
  const fd = new FormData();
  fd.append('image', file);

  try {
    // NOTE: change imgbbKey to your own if needed
    const imgbbKey = '98d157030552998b3631bf24fb17bb39';
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: 'POST', body: fd });
    const data = await res.json();
    if (data && data.success) {
      hiddenScreenshot.value = data.data.url;
    } else {
      alert('Upload failed, សូមព្យាយាមម្ដងទៀត។');
      payBtn.disabled = false;
      payBtn.textContent = 'Pay';
      return;
    }
  } catch (err) {
    console.error('Upload error', err);
    alert('Upload error, សូមព្យាយាមម្ដងទៀត។');
    payBtn.disabled = false;
    payBtn.textContent = 'Pay';
    return;
  }

  payBtn.textContent = 'Sending...';

  const mcName = document.getElementById('mcName').value;
  const platform = document.getElementById('platform').value;
  const gamemode = document.getElementById('gamemode').value;
  const rank = rankField.value;
  const price = priceField.value;
  const screenshotUrl = hiddenScreenshot.value;

  try {
    // set your bot token & chat id
    const BOT_TOKEN = '8758022167:AAG-GELkVdzFJZCgWjHNauFelGgb8tmRfEw';
    const CHAT_ID = '-1003394117894';

    const message = `<b>អ្នកទទួលបានការទិញ RANK ពី PLAYER</b>\n\n👤 ឈ្មោះ : ${mcName}\n🎮 ប្រភេទហ្គេម : ${platform}\n🗺️ Server : ${gamemode}\n⭐ Rank: ${rank}\nតម្លៃ : ${price}\n@SOPANHA1213\n@DrSkript\n@CFs561\n@Lg_chhorng\nវិកាយប័ត្តិបាញលុយនៅខាងក្រោម👇 :\n${screenshotUrl}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
    });

    buyModal.style.display = 'none';
    successModal.style.display = 'flex';
    form.reset();
    payBtn.disabled = true;
    payBtn.textContent = 'Pay';
  } catch (err) {
    console.error('Telegram send error', err);
    alert('Send error, សូមព្យាយាមម្ដងទៀត។');
    payBtn.disabled = false;
    payBtn.textContent = 'Pay';
  }
});
