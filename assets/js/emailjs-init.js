/* ==========================================================================
   EMAILJS CONFIG — WAJIB DIISI SEBELUM EMAIL OTOMATIS BISA TERKIRIM
   ==========================================================================
   1. Daftar gratis di https://www.emailjs.com
   2. Email Services -> Add New Service (contoh: Gmail) -> catat SERVICE ID-nya.
   3. Email Templates -> buat 2 template:
        a) Template SAMBUTAN (dikirim otomatis pas user baru pertama kali login)
           Variabel yang dikirim dari kode: {{to_email}}, {{to_name}}
        b) Template BROADCAST (dipakai admin.html buat kirim pengumuman)
           Variabel yang dikirim dari kode: {{to_email}}, {{to_name}}, {{subject}}, {{message}}
        Catat TEMPLATE ID masing-masing.
   4. Account -> General -> copy "Public Key".
   5. Tempel semua nilai di bawah ini menggantikan placeholder GANTI_...
   ========================================================================== */
(function(){
  const EMAILJS_PUBLIC_KEY      = "GANTI_DENGAN_PUBLIC_KEY_EMAILJS";
  const EMAILJS_SERVICE_ID      = "GANTI_DENGAN_SERVICE_ID_EMAILJS";
  const EMAILJS_TEMPLATE_WELCOME   = "GANTI_DENGAN_TEMPLATE_ID_SAMBUTAN";
  const EMAILJS_TEMPLATE_BROADCAST = "GANTI_DENGAN_TEMPLATE_ID_BROADCAST";

  if (window.emailjs && EMAILJS_PUBLIC_KEY.indexOf("GANTI_") !== 0){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  /* Dipanggil otomatis sekali saat user BARU pertama kali login Google (lihat user-profile-ui.js) */
  async function sendWelcomeEmail(toEmail, toName){
    if(!window.emailjs) return { ok:false };
    try{
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_WELCOME, {
        to_email: toEmail, to_name: toName || "Pengguna"
      });
      return { ok:true };
    }catch(err){
      console.error("Gagal kirim email sambutan:", err);
      return { ok:false, error: err };
    }
  }

  /* Dipanggil dari admin.html, satu-per-satu untuk tiap user terdaftar */
  async function sendBroadcastEmail(toEmail, toName, subject, message){
    if(!window.emailjs) return { ok:false };
    try{
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BROADCAST, {
        to_email: toEmail, to_name: toName || "Pengguna", subject, message
      });
      return { ok:true };
    }catch(err){
      console.error("Gagal kirim broadcast ke " + toEmail, err);
      return { ok:false, error: err };
    }
  }

  window.RevizaMail = { sendWelcomeEmail, sendBroadcastEmail };
})();
