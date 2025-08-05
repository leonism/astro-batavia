import EnterpriseSearchEngine, { type SearchResult } from '../../features/search/EnterpriseSearchEngine';

document.addEventListener("DOMContentLoaded", async () => {
  const openSearchOverlayButton = document.getElementById(
    "open-search-overlay"
  );
  const closeSearchOverlayButton = document.getElementById(
    "close-search-overlay"
  );
  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");
  const searchResultsContainer = document.getElementById(
    "search-results-container"
  );

  if (!searchInput || !searchResultsContainer || !searchOverlay || !closeSearchOverlayButton) {
    console.error("Search overlay elements not found.");
    return;
  }

  const searchEngine = new EnterpriseSearchEngine();

  let allDocuments: any[] = [];

  // Fetch and index documents
  try {
    const response = await fetch('/api/search-index');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allDocuments = await response.json();
    searchEngine.indexDocuments(allDocuments);
    console.log(`Search engine initialized with ${allDocuments.length} documents for overlay.`);
  } catch (error) {
    console.error("Failed to load search index for overlay:", error);
    // Optionally display an error message in the overlay
    return;
  }

  const toggleSearchOverlay = (show: boolean) => {
    const searchOverlay = document.getElementById("search-overlay");
    if (!searchOverlay) return;
    if (show) {
      searchOverlay.classList.remove("hidden");
      searchOverlay.setAttribute("aria-hidden", "false");
      const searchInput = searchOverlay.querySelector("#search-input");
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
      }
    } else {
      searchOverlay.classList.add("hidden");
      searchOverlay.setAttribute("aria-hidden", "true");
      const searchInput = searchOverlay.querySelector("#search-input");
      if (searchInput instanceof HTMLInputElement) {
        searchInput.value = ""; // Clear search input on close
      }
      const searchResultsContainer = searchOverlay.querySelector("#search-results-container");
      if (searchResultsContainer) {
        searchResultsContainer.innerHTML = ""; // Clear results on close
      }
    }
  };

  const performSearch = () => {
    const query = (searchInput as HTMLInputElement).value;
    const results = searchEngine.search(query);
    displayResults(results, query);
  };

  const displayResults = (results: SearchResult[], query: string) => {
    searchResultsContainer.innerHTML = '';
    if (results.length === 0 && query.length > 0) {
      searchResultsContainer.innerHTML = `
        <p class="text-center text-gray-600 dark:text-gray-400 text-lg">No results found for "${query}".</p>
      `;
    } else if (results.length > 0) {
      searchResultsContainer.innerHTML = `
        <ul class="space-y-4">
          ${results
            .map(
              (result: SearchResult) => `
              <li>
                <a href="/${result.lang}/blog/${result.slug}" class="block p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">${result.highlightedTitle || result.title}</h3>
                  <p class="text-gray-600 dark:text-gray-400">${result.highlightedDescription || result.description}</p>
                </a>
              </li>
            `
            )
            .join("")}
        </ul>
      `;
    } else {
      searchResultsContainer.innerHTML = ""; // Clear results if query is empty
    }
  };

  openSearchOverlayButton?.addEventListener("click", () =>
    toggleSearchOverlay(true)
  );
  closeSearchOverlayButton?.addEventListener("click", () =>
    toggleSearchOverlay(false)
  );

  // Close overlay when pressing Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !searchOverlay.classList.contains("hidden")) {
      toggleSearchOverlay(false);
    }
  });

  // Close overlay when clicking outside the content area
  searchOverlay.addEventListener("click", (event) => {
    const contentArea = searchOverlay.querySelector(".w-full.max-w-3xl");
    if (contentArea && !contentArea.contains(event.target as Node)) {
      toggleSearchOverlay(false);
    }
  });

  searchInput.addEventListener('input', performSearch);
});
