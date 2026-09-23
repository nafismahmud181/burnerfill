// Live details for the user guide: the installed version and the shortcut the
// user actually has (it may differ from the suggested Alt+Shift+E). The same page is
// also published on the website, where there's no extension API - then it keeps the
// defaults written into the HTML.
const IN_EXTENSION = !!globalThis.chrome?.runtime?.getManifest;

if (IN_EXTENSION) {
  const version = "v" + chrome.runtime.getManifest().version;
  document.getElementById("version").textContent = version;
  document.querySelectorAll(".version-copy").forEach((n) => (n.textContent = version));

  chrome.commands.getAll().then((cmds) => {
    const key = cmds.find((c) => c.name === "generate-fill")?.shortcut;
    document.querySelectorAll("[data-shortcut]").forEach((n) => (n.textContent = key || "no shortcut set"));
  });
}

// chrome:// pages can't be opened by a plain link from an extension page, and not at all
// from a website. Firefox won't let extensions open its settings pages either. In those
// cases the link becomes directions.
const IS_FIREFOX = IN_EXTENSION && chrome.runtime.getURL("").startsWith("moz-extension:");
document.querySelectorAll("[data-open]").forEach((a) => {
  if (!IN_EXTENSION || IS_FIREFOX) {
    const text = document.createElement("span");
    text.textContent = a.textContent + (IS_FIREFOX
      ? " (open about:addons, click the ⚙ gear, then “Manage Extension Shortcuts”)"
      : " (Chrome and Edge: chrome://extensions/shortcuts · Firefox: about:addons → ⚙ → Manage Extension Shortcuts)");
    a.replaceWith(text);
    return;
  }
  a.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: a.dataset.open });
  });
});

// highlight the section being read in the contents list
const links = new Map([...document.querySelectorAll(".toc a")].map((a) => [a.hash.slice(1), a]));
const seen = new Set();
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)));
  const first = [...links.keys()].find((id) => seen.has(id));
  if (first) links.forEach((a, id) => a.classList.toggle("active", id === first));
}, { rootMargin: "0px 0px -60% 0px" });
document.querySelectorAll("main section").forEach((s) => sectionObserver.observe(s));
