/* ---------------- I18N ---------------- */
const I18N = {
  en:{nav_home:"HOME",nav_vote:"VOTE",nav_help:"HELP",nav_rank:"RANK",nav_staff:"STAFF",nav_download:"DOWNLOAD",nav_soon:"SOON",brand_title:"COOKIEMC",brand_sub:"Minecraft Bedrock • Community Server",brand_java:"Minecraft Java • Community Server",label_players:"Players Online",loading:"Loading...",label_ip:"Server IP",click_copy:"Click to copy",label_join:"Quick Join",join:"Bedrock Join",port:"Port: 25257",card_rank:"Rank Shop",card_online:"Player Online",card_viewrank:"View Rank",card_playerrank:"Player Rank"},
  km:{nav_home:"ទំព័រដើម",nav_vote:"វ៉ូត",nav_help:"ជំនួយ",nav_rank:"RANK",nav_staff:"បុគ្គលិក",nav_download:"ទាញយក",nav_soon:"ឆាប់ៗនេះ",brand_title:"COOKIEMC",brand_sub:"Minecraft Bedrock • សេវាកម្មសហគមន៍",brand_java:"Minecraft Java • សេវាកម្មសហគមន៍",label_players:"អ្នកលេង",loading:"កំពុងផ្ទុក...",label_ip:"IP សឺវឺ",click_copy:"ចុចដើម្បីចម្លង",label_join:"ចូលរហ័ស",join:"ចូល Bedrock",port:"port: 25257",card_rank:"ហាង Rank",card_online:"អ្នកលេង",card_viewrank:"មើល Rank",card_playerrank:"Rank អ្នកលេង"},
  zh:{nav_home:"主页",nav_vote:"投票",nav_help:"帮助",nav_rank:"等级",nav_staff:"工作人员",nav_download:"下载",nav_soon:"即将推出",brand_title:"COOKIEMC",brand_sub:"社区服务器",label_players:"在线人数",loading:"加载中...",label_ip:"服务器 IP",click_copy:"点击复制",label_join:"快速加入",join:"加入 Bedrock",port:"端口: 16800",card_rank:"等级商店",card_online:"在线玩家",card_viewrank:"查看等级",card_playerrank:"玩家等级"}
};

/* ---------------- BROADCAST API ---------------- */
const bc = new BroadcastChannel("nokormckak");

function setValue(key,val){
  localStorage.setItem(key,val);
  bc.postMessage({key,val});
}

function getValue(key,def=null){
  return localStorage.getItem(key) || def;
}

/* ---------------- LANGUAGE ---------------- */
let lang = getValue("lang","en");
applyLang(lang);

function applyLang(l){
  document.body.classList.remove("lang-en","lang-km","lang-zh");
  document.body.classList.add("lang-"+l);

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    let k = el.getAttribute("data-i18n");
    el.textContent = I18N[l][k] || k;
  });

  document.getElementById("langBtn").textContent = l.toUpperCase() + " 🌐";
}

/* lang events */
const langBtn = document.getElementById("langBtn");
const langDrop = document.getElementById("langDrop");

langBtn.onclick = ()=> langDrop.classList.toggle("show");

document.querySelectorAll(".lang-drop button").forEach(btn=>{
  btn.onclick = ()=>{
    let l = btn.dataset.lang;
    setValue("lang",l);
    applyLang(l);
    langDrop.classList.remove("show");
  };
});

window.onclick = e=>{
  if(!e.target.closest(".lang-wrap")){
    langDrop.classList.remove("show");
  }
};

/* broadcast update */
bc.onmessage = e=>{
  if(e.data.key==="lang") applyLang(e.data.val);
  if(e.data.key==="theme"){
    if(e.data.val==="light"){
      document.body.classList.add("light");
      themeToggle.checked=true;
    } else {
      document.body.classList.remove("light");
      themeToggle.checked=false;
    }
  }
};

/* ---------------- THEME ---------------- */
let themeToggle = document.getElementById("themeToggle");
let savedTheme = getValue("theme","dark");

if(savedTheme==="light"){
  document.body.classList.add("light");
  themeToggle.checked=true;
}

themeToggle.onchange = ()=>{
  let t = themeToggle.checked ? "light" : "dark";
  setValue("theme",t);
  if(t==="light") document.body.classList.add("light");
  else document.body.classList.remove("light");
};

/* ---------------- SIDEBAR ---------------- */
let sidebar = document.getElementById("sidebar");

document.getElementById("mobileMenu").onclick = ()=>{
  sidebar.classList.add("show");
};

document.getElementById("closeSidebar").onclick = ()=>{
  sidebar.classList.remove("show");
};

window.onclick = e=>{
  if(!e.target.closest(".sidebar") && !e.target.closest(".menu-btn")){
    sidebar.classList.remove("show");
  }
};

/* ---------------- COPY IP ---------------- */
function copyIP(){
  navigator.clipboard.writeText("cookiemc.lol");

  let t = document.getElementById("copyMsg");
  t.classList.add("show");

  setTimeout(()=> t.classList.remove("show"),1300);
}
window.copyIP = copyIP;

/* ---------------- ONLINE STATUS ---------------- */
function fetchOnline(){
  fetch("https://api.mcsrvstat.us/bedrock/2/cookiemc.lol:25257")
  .then(r=>r.json())
  .then(d=>{
    let o = d.players?.online ?? 0;
    let m = d.players?.max ?? "";

    document.getElementById("onlineCount").textContent = o;
    document.getElementById("onlineSub").textContent = m ? `${o} / ${m} players` : `${o} players`;
  });
}
setInterval(fetchOnline,1000);
fetchOnline();

/* ---------------- SLOW-MOTION SNOW ---------------- */
(function(){
  const canvas = document.getElementById("snowCanvas");
  const ctx = canvas.getContext("2d");

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const SLOW = 0.35;  // MAIN SPEED CONTROL
  const FLAKES = 150;
  const flakes = [];

  function rand(a,b){ return a + Math.random()*(b-a); }

  for(let i=0;i<FLAKES;i++){
    flakes.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: rand(1.5,4),
      vx: rand(-0.2,0.2) * SLOW,
      vy: rand(0.15,0.6) * SLOW,
      o: rand(0.5,1)
    });
  }

  function color(){
    return document.body.classList.contains("light")
      ? "rgba(40,50,60,0.9)"
      : "rgba(255,255,255,0.95)";
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = color();

    for(const f of flakes){
      f.x += f.vx + Math.sin((f.y + Date.now()/1500)/40) * 0.3;
      f.y += f.vy;

      if(f.y > h){ f.y = -10; f.x = Math.random()*w; }

      ctx.globalAlpha = f.o;
      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }
  draw();

  window.onresize = ()=>{
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  };
})();