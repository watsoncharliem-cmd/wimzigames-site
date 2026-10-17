// Friend invite page: wimzigames.com/f/CODE (also /f/?c=CODE). Used by /f/index.html and /404.html.
// The game makes these links (FriendLinks.cs) and adds the friend automatically:
//  - app installed: the "Open Wimzi Solitaire" button opens wimzi://friend/CODE
//  - Android, not installed: the Google Play link carries the code; the game reads it on first launch
//  - iPhone, not installed: the App Store passes nothing through, so the page shows the code to type in
(function () {
  // Fill in once the App Store listing is live (App Store Connect → App Information → Apple ID):
  var APP_STORE_URL = ""; // e.g. "https://apps.apple.com/app/id1234567890"
  var PACKAGE = "com.wimzigames.solitaire";

  function codeFromLocation() {
    var q = new URLSearchParams(location.search).get("c");
    var m = location.pathname.match(/^\/f\/([A-Za-z0-9]{4,10})\/?$/);
    var c = (q || (m && m[1]) || "").trim().toUpperCase();
    return /^[A-Z0-9]{4,10}$/.test(c) ? c : "";
  }

  var code = codeFromLocation();
  var invite = document.getElementById("invite");
  var notFound = document.getElementById("notfound");
  var isFriendPath = /^\/f(\/|$)/.test(location.pathname);
  if (!code) {
    if (invite) invite.hidden = true;
    if (notFound) notFound.hidden = false;
    if (notFound && isFriendPath) {
      var h = notFound.querySelector("h1"); if (h) h.textContent = "This invite link isn't complete";
      var p = notFound.querySelector("p"); if (p) p.textContent = "Ask your friend to send it again, or add them in the game with their friend code.";
    }
    return;
  }
  if (notFound) notFound.hidden = true;
  if (invite) invite.hidden = false;
  document.title = "Join me on Wimzi Solitaire!";

  document.querySelectorAll("[data-code]").forEach(function (el) { el.textContent = code; });

  var ua = navigator.userAgent || "";
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  var open = document.getElementById("open-app");
  open.href = "wimzi://friend/" + code;

  var referrer = encodeURIComponent("utm_source=friend&utm_medium=referral&utm_campaign=friend_invite&utm_content=" + code);
  var play = document.getElementById("google-play");
  play.href = "https://play.google.com/store/apps/details?id=" + PACKAGE + "&referrer=" + referrer;

  var apple = document.getElementById("app-store");
  if (APP_STORE_URL) apple.href = APP_STORE_URL;
  else { apple.removeAttribute("href"); apple.classList.add("soon"); apple.querySelector("small").textContent = "Coming soon"; }

  // Put this phone's store first
  var stores = document.getElementById("stores");
  if (isAndroid && stores) stores.insertBefore(play, stores.firstChild);
  document.getElementById("ios-steps").hidden = isAndroid;
  document.getElementById("android-note").hidden = isIOS;

  var copy = document.getElementById("copy-code");
  copy.addEventListener("click", function () {
    var done = function () { copy.textContent = "Copied!"; setTimeout(function () { copy.textContent = "Copy code"; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done();
  });
})();
