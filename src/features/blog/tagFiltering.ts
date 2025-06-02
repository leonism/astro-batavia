/**
 * Initializes tag filtering functionality on the blog page.
 * It finds all tag filter buttons and post items, then adds event listeners
 * to filter posts based on the selected tag.
 */
export function initializeTagFiltering(): void {
  const tagFilters = document.querySelectorAll<HTMLButtonElement>(".tag-filter");
  const postItems = document.querySelectorAll<HTMLElement>(".post-item");

  if (!tagFilters.length || !postItems.length) {
    return; // No filters or posts to work with
  }

  tagFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selectedTag = filter.getAttribute("data-tag");

      // Update active filter styles
      tagFilters.forEach((f) => {
        f.classList.remove("active", "bg-primary-600", "text-white");
        f.classList.add(
          "border-gray-300",
          "dark:border-gray-600",
          "text-gray-700",
          "dark:text-gray-300"
        );
      });

      filter.classList.add("active", "bg-primary-600", "text-white");
      filter.classList.remove(
        "border-gray-300",
        "dark:border-gray-600",
        "text-gray-700",
        "dark:text-gray-300"
      );

      // Filter posts
      postItems.forEach((item) => {
        const postTagsRaw = item.getAttribute("data-tags");
        if (postTagsRaw) {
          try {
            const postTags: string[] = JSON.parse(postTagsRaw);
            const shouldShow =
              selectedTag === "all" || (selectedTag && postTags.includes(selectedTag));

            if (shouldShow) {
              item.style.display = "block";
              item.classList.add("animate-fade-in");
            } else {
              item.style.display = "none";
              item.classList.remove("animate-fade-in");
            }
          } catch (e) {
            console.error("Failed to parse post tags:", postTagsRaw, e);
            // Optionally hide the item or show an error state
            item.style.display = "none";
          }
        } else {
          // If data-tags is missing, hide the item by default or handle as an error
          item.style.display = "none";
        }
      });
    });
  });
}
