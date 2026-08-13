/* ==========================================================================
   MODAL "SEDANG DALAM PENGEMBANGAN" — dipakai oleh menu FAQ & Syarat Ketentuan.
   Tinggal kasih atribut data-coming-soon di link/tombol manapun, klik-nya akan
   otomatis dicegat dan modal ini yang muncul (tidak pindah halaman).
   ========================================================================== */
(function(){
  const overlay = document.createElement("div");
  overlay.className = "rv-modal-overlay";
  overlay.id = "comingSoonOverlay";
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

    function openModal(){ overlay.classList.add("show"); document.body.style.overflow = "hidden"; }
    function closeModal(){ overlay.classList.remove("show"); document.body.style.overflow = ""; }

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
