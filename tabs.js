(() => {
  const groups = document.querySelectorAll("[data-tabs]");
  if (!groups.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION = 240;

  groups.forEach((group) => {
    const tabs = Array.from(group.querySelectorAll(".tab"));
    const panels = Array.from(group.querySelectorAll(".panel"));

    if (!tabs.length || !panels.length) return;

    const getPanel = (id) => group.querySelector(`#${CSS.escape(id)}`);

    const hardShow = (panelId) => {
      const next = getPanel(panelId);
      if (!next) return;

      // tabs
      tabs.forEach(t => {
        if (t.dataset.panel === panelId) {
          t.classList.add("active");
        } else {
          t.classList.remove("active");
        }
      });

      // panels
      panels.forEach(p => {
        const isActive = p === next;
        p.hidden = !isActive;
        p.classList.toggle("active", isActive);
        // safety: if something set inline display none, undo it
        if (isActive) p.style.display = "";
      });
    };

    const show = (panelId) => {
      const next = getPanel(panelId);
      if (!next) {
        // fallback: show first panel
        hardShow(tabs[0].dataset.panel);
        return;
      }

      const current = group.querySelector(".panel.active");

      // First load / same / reduced motion
      if (!current || current === next || prefersReduced) {
        hardShow(panelId);
        return;
      }

      // Fade out current
      current.classList.remove("active");

      window.setTimeout(() => {
        current.hidden = true;

        // show next
        next.hidden = false;
        next.style.display = "";
        requestAnimationFrame(() => next.classList.add("active"));
      }, DURATION);
    };

    tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.panel)));

    const initial =
      group.getAttribute("data-default") ||
      group.querySelector(".tab.active")?.dataset.panel ||
      tabs[0].dataset.panel;
    // Set initial active tab class (remove from all, add to matching one)
    tabs.forEach(t => {
      if (t.dataset.panel === initial) {
        t.classList.add("active");
      } else {
        t.classList.remove("active");
      }
    });
    // Ensure ALL panels start hidden except initial (prevents “everything hidden” bugs)
    panels.forEach(p => { p.hidden = true; p.classList.remove("active"); });
    show(initial);
  });
})();
