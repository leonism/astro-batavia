// Debug version of search client to test functionality
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Search debug client loaded");
  
  const openSearchOverlayButton = document.getElementById("open-search-overlay");
  const closeSearchOverlayButton = document.getElementById("close-search-overlay");
  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");
  const searchResultsContainer = document.getElementById("search-results-container");

  console.log("Search elements:", {
    openButton: !!openSearchOverlayButton,
    closeButton: !!closeSearchOverlayButton,
    overlay: !!searchOverlay,
    input: !!searchInput,
    resultsContainer: !!searchResultsContainer
  });

  if (!searchInput || !searchResultsContainer || !searchOverlay || !closeSearchOverlayButton) {
    console.error("Search overlay elements not found.");
    return;
  }

  // Test fetch to search index
  try {
    console.log("Fetching search index...");
    const response = await fetch('/api/search-index');
    console.log("Search index response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Search index data:", data.length, "documents");
    console.log("First document:", data[0]);
    
    // Simple search test
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      console.log("Search query:", query);
      
      if (query.length < 2) {
        searchResultsContainer.innerHTML = '<p>Start typing to search...</p>';
        return;
      }
      
      const results = data.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
      
      console.log("Search results:", results.length);
      
      if (results.length === 0) {
        searchResultsContainer.innerHTML = `<p>No results found for "${query}"</p>`;
      } else {
        searchResultsContainer.innerHTML = results.map(result => `
          <div class="p-4 border rounded mb-2">
            <h3 class="font-bold">${result.title}</h3>
            <p class="text-gray-600">${result.description}</p>
            <div class="text-sm text-gray-500">Tags: ${result.tags.join(', ')}</div>
          </div>
        `).join('');
      }
    });
    
  } catch (error) {
    console.error("Failed to load search index:", error);
  }

  const toggleSearchOverlay = (show) => {
    console.log("Toggle search overlay:", show);
    if (show) {
      searchOverlay.classList.remove("hidden");
      searchOverlay.setAttribute("aria-hidden", "false");
      searchInput.focus();
    } else {
      searchOverlay.classList.add("hidden");
      searchOverlay.setAttribute("aria-hidden", "true");
      (searchInput as HTMLInputElement).value = "";
      searchResultsContainer.innerHTML = "";
    }
  };

  openSearchOverlayButton?.addEventListener("click", () => {
    console.log("Open search clicked");
    toggleSearchOverlay(true);
  });
  
  closeSearchOverlayButton?.addEventListener("click", () => {
    console.log("Close search clicked");
    toggleSearchOverlay(false);
  });

  // Close overlay when pressing Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !searchOverlay.classList.contains("hidden")) {
      toggleSearchOverlay(false);
    }
  });

  // Close overlay when clicking outside the content area
  searchOverlay.addEventListener("click", (event) => {
    const contentArea = searchOverlay.querySelector(".max-w-4xl");
    if (contentArea && !contentArea.contains(event.target)) {
      toggleSearchOverlay(false);
    }
  });
});

