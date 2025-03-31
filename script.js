// Initialize the router with history mode enabled
const router = new Navigo("/", { linksSelector: "a", historyAPI: true });

// Function to load pages dynamically
function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("content").innerHTML = html;
    })
    .catch((error) => console.error("Error loading page:", error));
}

// Define routes
router.on("/", () => loadPage("home/home.html"));
router.on("/home", () => loadPage("home/home.html"));
router.on("/about", () => loadPage("about/about.html"));

// Handle not found routes
router.notFound(() => {
  document.getElementById("content").innerHTML =
    "<h1>404 - Page not found</h1>";
});

// Resolve routes on initial load
router.resolve();
