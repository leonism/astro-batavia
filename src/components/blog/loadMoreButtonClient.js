document.addEventListener("DOMContentLoaded", () => {
  /**
   * Initializes the "load more" button functionality.
   * For this demo, it simply disables the button and changes its text
   * upon clicking, as the full pagination logic is not implemented.
   */
  function initializeLoadMoreButton(): void {
    const loadMoreBtn = document.getElementById("load-more") as HTMLButtonElement | null;

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        loadMoreBtn.textContent = "No more articles to load";
        loadMoreBtn.disabled = true;
        loadMoreBtn.classList.add("opacity-50", "cursor-not-allowed");
      });
    }
  }

  // Only initialize if the button is actually rendered
  if (document.getElementById("load-more")) {
    initializeLoadMoreButton();
  }
});