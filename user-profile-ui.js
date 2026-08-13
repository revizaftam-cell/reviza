/* ==========================================================================
   UI LOGIN GOOGLE + PROFIL PENGGUNA
   Butuh elemen <span id="authSlot"></span> di navbar (sudah ditambahkan di
   header-inner tiap halaman) dan firebase-init.js sudah dimuat lebih dulu.
   ========================================================================== */
(function(){
  function whenAuthReady(cb){
    if (window.RevizaAuth) return cb();
    window.addEventListener("reviza-auth-ready", cb, { once: true });
  }

  document.addEventListener("DOMContentLoaded", function(){
    const slot = document.getElementById("authSlot");
    if(!slot) return;

    slot.innerHTML =
      '<button class="btn auth-login" id="rvLoginBtn" type="button">Login dengan Google</button>' +
      '<button class="auth-chip" id="rvUserChip" type="button" style="display:none">' +
        '<img id="rvUserPhoto" alt="">' +
        '<span id="rvUserName"></span>' +
      '</button>';

    const loginBtn  = document.getElementById("rvLoginBtn");
    const userChip  = document.getElementById("rvUserChip");
    const userPhoto = document.getElementById("rvUserPhoto");
    const userName  = document.getElementById("rvUserName");

    /* ---- Modal profil ---- */
    const modal = document.createElement("div");
    modal.className = "rv-modal-overlay";
    modal.id = "profileOverlay";
    modal.innerHTML =
      '<div class="rv-modal" role="dialog" aria-modal="true" aria-label="Profil saya">' +
        '<button class="rv-modal-close" data-close type="button" aria-label="Tutup">✕</button>' +
        '<h3>Profil Saya</h3>' +
        '<div class="rv-profile-form">' +
          '<img id="rvProfilePreview" class="rv-profile-avatar" alt="">' +
          '<label>Nama Lengkap<input type="text" id="rvProfileName" placeholder="Nama kamu" data-copyable></label>' +
          '<label>URL Foto Profil<input type="text" id="rvProfilePhoto" placeholder="https://..." data-copyable></label>' +
          '<label class="rv-profile-email">Email: <span id="rvProfileEmail"></span></label>' +
          '<div class="rv-profile-actions">' +
            '<button class="btn" id="rvProfileSave" type="button">Simpan Perubahan</button>' +
            '<button class="rv-logout-btn" id="rvProfileLogout" type="button">Keluar</button>' +
          '</div>' +
          '<p class="rv-profile-msg" id="rvProfileMsg"></p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function(e){
      if(e.target === modal || e.target.closest("[data-close]")) closeProfile();
    });
    function openProfile(){ modal.classList.add("show"); document.body.style.overflow = "hidden"; }
    function closeProfile(){ modal.classList.remove("show"); document.body.style.overflow = ""; }
    userChip.addEventListener("click", openProfile);

    loginBtn.addEventListener("click", async function(){
      loginBtn.disabled = true;
      loginBtn.textContent = "Membuka login...";
      const user = await RevizaAuth.loginWithGoogle();
      loginBtn.disabled = false;
      loginBtn.textContent = "Login dengan Google";
      if(!user) return;

      const existing = await RevizaAuth.getUserProfile(user.uid);
      const isNewUser = !existing;
      await RevizaAuth.saveUserProfile(user.uid, {
        displayName: (existing && existing.displayName) || user.displayName || "",
        photoURL: (existing && existing.photoURL) || user.photoURL || "",
        email: user.email,
        updatedAt: RevizaAuth.serverTimestamp(),
        ...(isNewUser ? { createdAt: RevizaAuth.serverTimestamp() } : {})
      });
      /* Email selamat datang OTOMATIS terkirim hanya untuk user yang baru pertama kali login */
      if(isNewUser && window.RevizaMail){
        RevizaMail.sendWelcomeEmail(user.email, user.displayName || "Pengguna");
      }
    });

    document.getElementById("rvProfileSave").addEventListener("click", async function(){
      const uid = userChip.dataset.uid;
      if(!uid) return;
      const name = document.getElementById("rvProfileName").value.trim();
      const photo = document.getElementById("rvProfilePhoto").value.trim();
      await RevizaAuth.saveUserProfile(uid, { displayName: name, photoURL: photo, updatedAt: RevizaAuth.serverTimestamp() });
      userName.textContent = name || "Pengguna";
      if(photo){ userPhoto.src = photo; document.getElementById("rvProfilePreview").src = photo; }
      const msg = document.getElementById("rvProfileMsg");
      msg.textContent = "Tersimpan!";
      setTimeout(function(){ msg.textContent = ""; }, 2200);
    });

    document.getElementById("rvProfileLogout").addEventListener("click", async function(){
      await RevizaAuth.logout();
      closeProfile();
    });

    whenAuthReady(function(){
      RevizaAuth.onAuthChange(async function(user){
        if(user){
          const profile = (await RevizaAuth.getUserProfile(user.uid)) || {};
          const dispName = profile.displayName || user.displayName || "Pengguna";
          const dispPhoto = profile.photoURL || user.photoURL || "";
          loginBtn.style.display = "none";
          userChip.style.display = "flex";
          userChip.dataset.uid = user.uid;
          userName.textContent = dispName;
          userPhoto.src = dispPhoto;
          document.getElementById("rvProfileName").value = dispName;
          document.getElementById("rvProfilePhoto").value = dispPhoto;
          document.getElementById("rvProfileEmail").textContent = user.email || "";
          document.getElementById("rvProfilePreview").src = dispPhoto;
        }else{
          loginBtn.style.display = "inline-flex";
          userChip.style.display = "none";
        }
      });
    });
  });
})();
