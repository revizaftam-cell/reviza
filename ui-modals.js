/* ==========================================================================
   MODAL "SEDANG DALAM PENGEMBANGAN" — dipakai oleh menu FAQ & Syarat Ketentuan.
   Tinggal kasih atribut data-coming-soon di link/tombol manapun, klik-nya akan
   otomatis dicegat dan modal ini yang muncul (tidak pindah halaman).

   CATATAN PERBAIKAN: sebelumnya kalau file CSS gagal dimuat (misalnya path
   salah setelah upload manual ke hosting), kotak ini jadi kelihatan terus di
   paling bawah tiap halaman. Sekarang status tersembunyi/tampil diatur juga
   lewat inline style langsung dari JS (bukan cuma lewat class), jadi modal
   ini DIJAMIN tersembunyi di awal apa pun yang terjadi pada file CSS-nya.
   ========================================================================== */
(function(){
  var HIDDEN_STYLE = "position:fixed;inset:0;z-index:95;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .25s ease,visibility .25s ease;";

  var overlay = document.createElement("div");
  overlay.className = "rv-modal-overlay";
  overlay.id = "comingSoonOverlay";
  overlay.style.cssText = HIDDEN_STYLE;
  overlay.innerHTML =
    '<div class="rv-modal" role="dialog" aria-modal="true" aria-label="Fitur dalam pengembangan">' +
      '<button class="rv-modal-close" data-close type="button" aria-label="Tutup">✕</button>' +
      '<div class="rv-modal-icon">🚧</div>' +
      '<h3>Segera Hadir</h3>' +
      '<p>Mohon maaf, fitur ini sedang dalam tahap pengembangan.</p>' +
      '<button class="btn" data-close type="button">Tutup</button>' +
    '</div>';

  document.addEventListener("DOMContentLoaded", function(){
    document.body.appendChild(overlay);

    function openModal(){
      overlay.classList.add("show");
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";
      overlay.style.pointerEvents = "auto";
      document.body.style.overflow = "hidden";
    }
    function closeModal(){
      overlay.classList.remove("show");
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      overlay.style.pointerEvents = "none";
      document.body.style.overflow = "";
    }

    overlay.addEventListener("click", function(e){
      if(e.target === overlay || e.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") closeModal();
    });
    document.querySelectorAll("[data-coming-soon]").forEach(function(el){
      el.addEventListener("click", function(e){ e.preventDefault(); openModal(); });
    });

    window.RevizaUI = { openComingSoon: openModal, closeComingSoon: closeModal };
  });
})();
