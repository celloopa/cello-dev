// AK-1 concepts: theme switch, Copy and Download .md. Concept-only; not production code.
(function () {
  var root = document.documentElement;

  function syncSwitch() {
    var day = root.dataset.theme === "light";
    document.querySelectorAll("[data-set-theme]").forEach(function (b) {
      b.setAttribute("aria-pressed", String((b.dataset.setTheme === "light") === day));
    });
  }
  document.querySelectorAll("[data-set-theme]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.setTheme === "light") root.dataset.theme = "light";
      else delete root.dataset.theme;
      syncSwitch();
    });
  });
  new MutationObserver(syncSwitch).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  syncSwitch();

  function promptText(btn) {
    var el = document.getElementById(btn.dataset.target);
    return el ? el.textContent : "";
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.querySelector("[data-label]");
    var rest = label.textContent;
    btn.addEventListener("click", function () {
      function done(text) {
        label.textContent = text;
        setTimeout(function () {
          label.textContent = rest;
        }, 1800);
      }
      try {
        navigator.clipboard.writeText(promptText(btn)).then(
          function () {
            done("Copied");
          },
          function () {
            done("Select and copy");
          }
        );
      } catch (e) {
        done("Select and copy");
      }
    });
  });

  document.querySelectorAll("[data-download]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var blob = new Blob([promptText(btn)], { type: "text/markdown" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = btn.dataset.download;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 1000);
    });
  });

  var bug = document.getElementById("plant-bug");
  if (bug) {
    bug.addEventListener("change", function () {
      document.body.dataset.bug = bug.checked ? "on" : "off";
    });
  }
})();
