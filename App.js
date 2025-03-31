const routes = {
  "/": "pages/home.html",
  "/home": "pages/home.html",
  "/about": "pages/about.html",
};

const fallbackPage = "pages/404.html";

// Function to load content dynamically
function loadContent() {
  let path = location.hash.replace("#", "") || "/";

  // Default to 404 if the route doesn't exist
  const route = routes[path] || fallbackPage;

  fetch(route)
    .then((response) => {
      if (!response.ok) throw new Error("Page not found");
      return response.text();
    })
    .then((data) => {
      document.getElementById("contentWrapper").innerHTML = data;
    })
    .catch(() => {
      // Load 404 page in case of any error
      fetch(fallbackPage)
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("contentWrapper").innerHTML = data;
        });
    });
}

// Listen for hash changes
window.addEventListener("hashchange", loadContent);

// Load initial content
document.addEventListener("DOMContentLoaded", loadContent);
