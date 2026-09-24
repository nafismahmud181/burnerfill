// ============ links: fill these in as the listings go live ============
// Empty = not published yet: store buttons say "Coming soon" and don't navigate,
// and the Contact link is hidden. Paste the real URLs here - nothing else to edit.
const LINKS = {
  firefox: "",   // in review - once public: https://addons.mozilla.org/firefox/addon/burnerfill/
  edge: "https://microsoftedge.microsoft.com/addons/detail/bligfeiplfmfcjipbehcbddifdahomod",
  contact: "https://github.com/nafismahmud181/burnerfill/issues",
};

document.querySelectorAll("[data-store]").forEach((a) => {
  const url = LINKS[a.dataset.store];
  if (url) { a.href = url; return; }
  a.removeAttribute("href");
  a.setAttribute("aria-disabled", "true");
  a.title = "Coming soon";
  a.style.cursor = "default";
  const small = a.querySelector("span > span");
  if (small) small.textContent = "Coming soon to";
});
document.querySelectorAll('[data-link="contact"]').forEach((a) => {
  if (LINKS.contact) a.href = LINKS.contact;
  else a.remove();
});

// BurnerFill landing page animations
(function () {
  var anims, io;
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    anims = [];
    const ease = 'cubic-bezier(.2,.8,.2,1)';
    const run = (el, k, o) => anims.push(el.animate(k, o));
    document.querySelectorAll('[data-anim]').forEach(el => {
      const d = el.dataset, type = d.anim;
      if (type === 'marquee') run(el, [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 32000, iterations: Infinity });
      else if (type === 'float') {
        const amp = +d.amp || 10, r = +d.rot || 0, s = +d.spin || 0;
        run(el, [
          { transform: `translateY(0) rotate(${r}deg)` },
          { transform: `translateY(-${amp}px) rotate(${r + s}deg)` },
          { transform: `translateY(0) rotate(${r}deg)` }
        ], { duration: +d.dur || 6000, iterations: Infinity, easing: 'ease-in-out', delay: -Math.random() * 3000 });
      } else if (type === 'rise') {
        run(el, [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: +d.delay || 0, easing: ease, fill: 'backwards' });
      } else if (type === 'pop') {
        run(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }, { transform: 'scale(1)' }], { duration: 2400, iterations: Infinity, easing: 'ease-out' });
      } else if (type === 'pulse') {
        run(el, [{ boxShadow: '0 0 0 0 rgba(255,77,18,.5)' }, { boxShadow: '0 0 0 10px rgba(255,77,18,0)' }], { duration: 1800, iterations: Infinity });
      }
    });
    io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const targets = e.target.dataset.reveal === 'stagger' ? [...e.target.children] : [e.target];
      targets.forEach((t, i) => run(t, [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 750, delay: i * 110, easing: ease, fill: 'backwards' }));
    }), { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
