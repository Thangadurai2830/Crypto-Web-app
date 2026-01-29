(function () {
  try {
    var t = localStorage.getItem("crypto-analytics-theme");
    var dark =
      t === "dark" ||
      (!t && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", !!dark);
  } catch (_) {}
})();
