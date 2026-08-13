/* ==========================================================================
   UI LOGIN GOOGLE — navbar (tombol login / chip user) + slot profil di drawer.
   Pengaturan profil lengkap (nama, foto) ada di halaman profileuser.html.
   Butuh elemen <span id="authSlot"></span> di navbar dan
   <div id="drawerProfileSlot"></div> di drawer (sudah ditambahkan tiap halaman),
   serta firebase-init.js sudah dimuat lebih dulu.
   ========================================================================== */
(function(){
  function whenAuthReady(cb){
    if (window.RevizaAuth) return cb();
    window.addEventListener("reviza-auth-ready", cb, { once: true });
  }

  document.addEventListener("DOMContentLoaded", function(){
    const slot = document.getElementById("authSlot");
    const drawerSlot = document.getElementById("drawerProfileSlot");
    if(!slot && !drawerSlot) return;

    if(slot){
      slot.innerHTML =
        '<button class="btn auth-login" id="rvLoginBtn" type="button">Login dengan Google</button>' +
        '<button class="auth-chip" id="rvUserChip" type="button" style="display:none">' +
          '<img id="rvUserPhoto" alt="">' +
          '<span id="rvUserName"></span>' +
        '</button>';

      const loginBtn  = document.getElementById("rvLoginBtn");
      const userChip  = document.getElementById("rvUserChip");

      userChip.addEventListener("click", function(){ window.location.href = "profileuser.html"; });

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
    }

    if(drawerSlot){
      drawerSlot.innerHTML =
        '<a href="profileuser.html" class="drawer-profile" id="rvDrawerProfile" style="display:none">' +
          '<img id="rvDrawerPhoto" alt="">' +
          '<span><strong id="rvDrawerName"></strong><small id="rvDrawerEmail"></small></span>' +
        '</a>';
    }

    whenAuthReady(function(){
      RevizaAuth.onAuthChange(async function(user){
        const loginBtn  = document.getElementById("rvLoginBtn");
        const userChip  = document.getElementById("rvUserChip");
        const userPhoto = document.getElementById("rvUserPhoto");
        const userName  = document.getElementById("rvUserName");
        const dp        = document.getElementById("rvDrawerProfile");

        if(user){
          const profile = (await RevizaAuth.getUserProfile(user.uid)) || {};
          const dispName = profile.displayName || user.displayName || "Pengguna";
          const dispPhoto = profile.photoURL || user.photoURL || "";

          if(loginBtn){ loginBtn.style.display = "none"; }
          if(userChip){
            userChip.style.display = "flex";
            userChip.dataset.uid = user.uid;
            userName.textContent = dispName;
            userPhoto.src = dispPhoto;
          }
          if(dp){
            dp.style.display = "flex";
            document.getElementById("rvDrawerPhoto").src = dispPhoto;
            document.getElementById("rvDrawerName").textContent = dispName;
            document.getElementById("rvDrawerEmail").textContent = user.email || "";
          }
        }else{
          if(loginBtn){ loginBtn.style.display = "inline-flex"; }
          if(userChip){ userChip.style.display = "none"; }
          if(dp){ dp.style.display = "none"; }
        }
      });
    });
  });
})();
