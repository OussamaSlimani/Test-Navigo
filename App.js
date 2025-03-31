const routes = {
  "/": "pages/home.html",
  "/home": "pages/home.html",
  "/about": "pages/about.html",
};

const fallbackPage = "pages/404.html";

// Load cached pages from sessionStorage
const cache = JSON.parse(sessionStorage.getItem("spaCache")) || {};

// Preload pages into cache
async function preloadPages() {
  const pages = Object.values(routes).concat(fallbackPage);

  await Promise.all(
    pages.map(async (route) => {
      if (!cache[route]) {
        try {
          const response = await fetch(route);
          if (response.ok) {
            const data = await response.text();
            cache[route] = data;
          }
        } catch (error) {
          console.error(`Failed to preload ${route}:`, error);
        }
      }
    })
  );

  sessionStorage.setItem("spaCache", JSON.stringify(cache));
}

// Function to load content dynamically
async function loadContent() {
  const path = location.hash.replace("#", "") || "/";
  const route = routes[path] || fallbackPage;

  document.getElementById("contentWrapper").innerHTML =
    cache[route] || "Loading...";

  if (!cache[route]) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        const data = await response.text();
        cache[route] = data;
        sessionStorage.setItem("spaCache", JSON.stringify(cache));
        document.getElementById("contentWrapper").innerHTML = data;
      } else {
        throw new Error("Failed to fetch page");
      }
    } catch (error) {
      console.error(`Error loading ${route}:`, error);
      document.getElementById("contentWrapper").innerHTML =
        cache[fallbackPage] || "Error loading page";
    }
  }
}

// Debounce function to limit hashchange event calls
function debounce(func, delay = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// Preload pages on startup
document.addEventListener("DOMContentLoaded", async () => {
  await preloadPages();
  loadContent();
});

// Listen for hash changes with debounce
window.addEventListener("hashchange", debounce(loadContent));
