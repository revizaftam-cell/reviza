/* ==========================================================================
   ANTI-SALIN TEKS — berlaku global di semua halaman.
   Mematikan klik-kanan, seleksi teks, dan pop-up "Salin/Cari/Terjemahkan"
   saat tekan-tahan di HP, KECUALI pada elemen interaktif (input, textarea,
   [contenteditable], atau elemen apa pun yang diberi atribut data-copyable
   — dipakai misalnya di kolom nomor Dana yang punya tombol "Copy" sendiri).
   ========================================================================== */
(function(){
  const ALLOW = "input,textarea,[contenteditable],[contenteditable='true'],[data-copyable]";

  document.addEventListener("contextmenu", function(e){
    if(!e.target.closest(ALLOW)) e.preventDefault();
  });
  document.addEventListener("selectstart", function(e){
    if(!e.target.closest(ALLOW)) e.preventDefault();
  });
  document.addEventListener("copy", function(e){
    const t = e.target;
    if(!(t.closest && t.closest(ALLOW))) e.preventDefault();
  });
  document.addEventListener("dragstart", function(e){
    if(e.target.tagName === "IMG") e.preventDefault();
  });
})();
