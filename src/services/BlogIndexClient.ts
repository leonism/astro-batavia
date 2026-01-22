import { BlogIndexUI } from './BlogIndexUI';

/**
 * Service for managing client-side behavior of the Blog Index page.
 * Handles initialization and event binding for infinite scroll/pagination.
 */
export class BlogIndexClient {
  /**
   * Initializes the blog index functionality.
   * Sets up the 'Load More' button listener and handles post loading.
   */
  static init(): void {
    const button = document.getElementById('load-more');
    const container = document.getElementById('posts-container');

    if (!button || !container) {
      return;
    }

    if (button.dataset.loadMoreInitialized === 'true') {
      return;
    }

    button.dataset.loadMoreInitialized = 'true';

    const ui = new BlogIndexUI(container as HTMLElement, button as HTMLElement);
    const loadedSlugs = new Set<string>();

    // Track initial posts
    container.querySelectorAll('[data-slug]').forEach((el) => {
      const slug = el.getAttribute('data-slug');
      if (slug) loadedSlugs.add(slug);
    });

    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const nextUrl = button.getAttribute('data-next-url') || button.getAttribute('href');
      if (!nextUrl) {
        ui.hideButton();
        return;
      }

      ui.setButtonLoading();

      try {
        // Fetch the next page HTML
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error(`Failed to load: ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find new posts
        const newPosts = Array.from(doc.querySelectorAll('#posts-container .post-item'));

        // Filter out duplicates if any (though pagination shouldn't have duplicates ideally)
        const uniquePosts = newPosts.filter((post) => {
          const slug = post.getAttribute('data-slug');
          if (slug && loadedSlugs.has(slug)) {
            return false;
          }
          if (slug) loadedSlugs.add(slug);
          return true;
        });

        if (uniquePosts.length > 0) {
          ui.appendPostElements(uniquePosts);

          // Update URL
          window.history.pushState(null, '', nextUrl);

          // Update Page Content (Title and Meta Tags)
          document.title = doc.title;

          // Update Canonical
          const newCanonical = doc.querySelector('link[rel="canonical"]');
          const oldCanonical = document.querySelector('link[rel="canonical"]');
          if (newCanonical && oldCanonical) {
            oldCanonical.setAttribute('href', newCanonical.getAttribute('href') || '');
          }

          // Update Prev/Next
          ['prev', 'next'].forEach((rel) => {
            const newLink = doc.querySelector(`link[rel="${rel}"]`);
            const oldLink = document.querySelector(`link[rel="${rel}"]`);
            if (newLink) {
              if (oldLink) {
                oldLink.setAttribute('href', newLink.getAttribute('href') || '');
              } else {
                document.head.appendChild(newLink.cloneNode(true));
              }
            } else if (oldLink) {
              oldLink.remove();
            }
          });

          // Update Description
          const newDesc = doc.querySelector('meta[name="description"]');
          const oldDesc = document.querySelector('meta[name="description"]');
          if (newDesc && oldDesc) {
            oldDesc.setAttribute('content', newDesc.getAttribute('content') || '');
          }

          // Update OG URL and Title
          const newOgUrl = doc.querySelector('meta[property="og:url"]');
          const oldOgUrl = document.querySelector('meta[property="og:url"]');
          if (newOgUrl && oldOgUrl) {
            oldOgUrl.setAttribute('content', newOgUrl.getAttribute('content') || '');
          }

          const newOgTitle = doc.querySelector('meta[property="og:title"]');
          const oldOgTitle = document.querySelector('meta[property="og:title"]');
          if (newOgTitle && oldOgTitle) {
            oldOgTitle.setAttribute('content', newOgTitle.getAttribute('content') || '');
          }
        } else {
          // No unique posts found? maybe end of list
          ui.hideButton();
        }

        // Check for next button in the new page
        const newButton = doc.getElementById('load-more');
        if (newButton) {
          const newNextUrl =
            newButton.getAttribute('data-next-url') || newButton.getAttribute('href');
          if (newNextUrl) {
            button.setAttribute('data-next-url', newNextUrl);
            button.setAttribute('href', newNextUrl);
          } else {
            ui.hideButton();
          }
        } else {
          ui.hideButton();
        }
      } catch (error) {
        console.error('Error loading more posts:', error);
        ui.showErrorMessage('Failed to load more articles. Please try again.');
      } finally {
        ui.resetButton();
      }
    });
  }
}
