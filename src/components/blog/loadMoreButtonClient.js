import { initializeLoadMoreButton } from "@/features/blog/loadMorePosts";

document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if the button is actually rendered
  if (document.getElementById("load-more")) {
    initializeLoadMoreButton();
  }
});