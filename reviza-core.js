/* ==========================================================================
   REVIZA CORE — satu file JS untuk semua halaman:
   1) Auto-generate background nebula + hologram shard (tak perlu markup
      manual lagi per halaman — cukup ubah angka di sini kalau mau diubah).
   2) Jalankan loading screen (ikon SVG) tiap halaman dibuka.
   3) Transisi fade out sebelum pindah halaman, fade akan lewat CSS body.
   4) Scroll-reveal: elemen <section> di dalam <main> muncul fade+geser
      pas discroll ke posisinya.
   Ditaruh SEKALI di root sebagai "reviza-core.js" — file inilah yang bikin
   ke depannya cukup edit 1 file buat ubah tampilan semua halaman sekaligus.
   ========================================================================== */
(function(){
  "use strict";

  /* ---------- 1. NEBULA + HOLOGRAM BACKGROUND ---------- */
  function buildBackgroundFX(){
    if(document.querySelector(".nebula-field")) return; // jaga-jaga kalau sudah ada

    var neb = document.createElement("div");
    neb.className = "nebula-field";
    neb.setAttribute("aria-hidden","true");
    neb.innerHTML =
      '<div class="nebula-glow"></div>' +
      '<div class="nebula-glow n2"></div>' +
      '<div class="moon"></div>' +
      '<div class="star-orbit orbit-a"><i></i><i></i></div>' +
      '<div class="star-orbit orbit-b"><i></i><i></i></div>' +
      '<div class="star-orbit orbit-c"><i></i><i></i></div>';

    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var anims = ["holoFloat1","holoFloat2","holoFloat3","holoFloat4","holoFloat5","holoFloat6"];
    /* Jumlah shard sengaja dijaga tidak terlalu banyak — tiap shard adalah
       layer 3D animasi sendiri, kalau kebanyakan HP kelas menengah/bawah
       bisa nge-lag pas scroll cepat (background jadi keliatan patah-patah). */
    var count = window.innerWidth < 480 ? 9 : 14;

    var holo = document.createElement("div");
    holo.className = "holo-field";
    holo.setAttribute("aria-hidden","true");
    var html = "";
    for(var i=0;i<count;i++){
      var size = 10 + Math.round(Math.random()*20);
      var top = Math.round(Math.random()*92);
      var left = Math.round(Math.random()*92);
      var dur = 15 + Math.round(Math.random()*18);
      var anim = anims[i % anims.length];
      var dir = (i % 3 === 0) ? " reverse" : "";
      var delay = (-(Math.random()*dur)).toFixed(1);
      var style = "--s:" + size + "px;width:" + size + "px;height:" + size + "px;top:" + top + "%;left:" + left + "%;";
      if(!reduceMotion){
        style += "animation:" + anim + " " + dur + "s ease-in-out infinite" + dir + ";animation-delay:" + delay + "s;";
      }
      html += '<div class="holo" style="' + style + '"><i class="hf hf1"></i><i class="hf hf2"></i><i class="hf hf3"></i><i class="hf hf4"></i></div>';
    }
    holo.innerHTML = html;

    document.body.insertBefore(holo, document.body.firstChild);
    document.body.insertBefore(neb, document.body.firstChild);
  }

  /* ---------- 2. LOADING SCREEN ---------- */
  function runLoadingScreen(){
    var loading = document.getElementById("loading");
    if(!loading){ document.dispatchEvent(new CustomEvent("reviza:ready")); return; }
    var bar = document.getElementById("loadingBar");
    var status = document.getElementById("loadingStatus");
    var messages = ["Menginisialisasi sistem...","Memuat aset visual...","Menyiapkan fitur REVIZA...","Sistem siap digunakan"];
    var progress = 0;
    var timer = setInterval(function(){
      progress = Math.min(100, progress + Math.ceil(Math.random() * 16));
      if(bar) bar.style.width = progress + "%";
      if(status) status.textContent = progress < 35 ? messages[0] : progress < 65 ? messages[1] : progress < 95 ? messages[2] : messages[3];
      if(progress >= 100){
        clearInterval(timer);
        setTimeout(function(){
          loading.classList.add("hide");
          document.dispatchEvent(new CustomEvent("reviza:ready"));
          setTimeout(function(){ if(loading.parentNode) loading.parentNode.removeChild(loading); }, 650);
        }, 200);
      }
    }, 90);
  }

  /* ---------- 3. TRANSISI FADE ANTAR HALAMAN ---------- */
  function wireLinkTransitions(){
    document.addEventListener("click", function(e){
      if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      if(!a || a.hasAttribute("data-coming-soon")) return;
      var href = a.getAttribute("href");
      if(!href || href.charAt(0) === "#") return;
      if(a.target && a.target !== "" && a.target !== "_self") return;
      var url;
      try{ url = new URL(href, window.location.href); }catch(err){ return; }
      if(url.origin !== window.location.origin || !/\.html?$/i.test(url.pathname)) return;
      e.preventDefault();
      document.documentElement.classList.add("rv-leaving");
      setTimeout(function(){ window.location.href = url.href; }, 260);
    });
  }

  /* ---------- 4. SCROLL REVEAL ---------- */
  function wireScrollReveal(){
    var els = document.querySelectorAll("main section");
    if(!els.length) return;
    if(!("IntersectionObserver" in window)){
      els.forEach(function(el){ el.classList.add("rv-in"); });
      return;
    }
    els.forEach(function(el){ el.classList.add("rv-reveal"); });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("rv-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function(el){ io.observe(el); });
  }

  /* ---------- INIT ---------- */
  document.documentElement.classList.add("rv-js");
  buildBackgroundFX();
  wireLinkTransitions();
  wireScrollReveal();
  runLoadingScreen();
})();
