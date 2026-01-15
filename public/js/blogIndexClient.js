/**
 * Handles the "Load More" functionality for the blog index page.
 * Fetches additional posts from the API and appends them to the grid.
 *
 * @param {number} totalPages - Total number of pages available.
 * @param {string} lang - Current language code (en, es, ja).
 */
export function initializeBlogIndex(totalPages, lang) {
  let currentPage = 1;
  const loadMoreBtn = /** @type {HTMLButtonElement} */ (document.getElementById("load-more"));
  const postsContainer = document.getElementById("posts-container");

  if (!loadMoreBtn || !postsContainer) return;

  loadMoreBtn.addEventListener("click", async () => {
    // Disable button and show loading state
    const originalText = loadMoreBtn.innerHTML;
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    `;

    try {
      currentPage++;
      const response = await fetch(`/api/get-posts?page=${currentPage}&lang=${lang}`);

      if (!response.ok) throw new Error("Failed to fetch posts");

      const html = await response.text();

      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Append new posts to the grid with a fade-in animation
      const newPosts = Array.from(tempDiv.querySelectorAll(".post-item"));
      newPosts.forEach((post) => {
        post.classList.add("animate-fade-in");
        postsContainer.appendChild(post);
      });

      // Hide button if we reached the last page
      if (currentPage >= totalPages) {
        loadMoreBtn.style.display = "none";
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      alert("Failed to load more articles. Please try again.");
    } finally {
      // Restore button state
      loadMoreBtn.disabled = false;
      loadMoreBtn.innerHTML = originalText;
    }
  });
}

if (typeof window !== "undefined") {
	window.initializeBlogIndex = initializeBlogIndex;
}
