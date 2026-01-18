import { BlogIndexUI, type BlogPost } from './BlogIndexUI';

interface LoadMoreContext {
  ui: BlogIndexUI;
  button: HTMLButtonElement;
  totalPages: number;
  lang: string;
  loadedSlugs: Set<string>;
  tag?: string | null;
}

/**
 * Initializes the Blog Index Load More functionality.
 * @param totalPages Total number of pages available.
 * @param lang Current language code.
 */
export function initializeBlogIndex(totalPages: number, lang: string) {
  const button = document.getElementById('load-more') as HTMLButtonElement | null;
  const container = document.getElementById('posts-container') as HTMLElement | null;

  if (!button || !container) return;

  // Prevent double initialization
  if (button.dataset.loadMoreInitialized === 'true') {
    return;
  }

  button.dataset.loadMoreInitialized = 'true';

  // Track loaded slugs to prevent duplicates
  const loadedSlugs = new Set<string>();

  const existingItems = container.querySelectorAll<HTMLElement>('[data-slug]');
  existingItems.forEach((item) => {
    const slug = item.getAttribute('data-slug');
    if (slug) {
      loadedSlugs.add(slug);
    }
  });

  const ui = new BlogIndexUI(container, button);
  const tag = button.getAttribute('data-tag');

  const context: LoadMoreContext = {
    ui,
    button,
    totalPages,
    lang,
    loadedSlugs,
    tag,
  };

  attachLoadMore(context);
}

function attachLoadMore({ ui, button, totalPages, lang, loadedSlugs, tag }: LoadMoreContext) {
  let currentPage = 1;

  button.addEventListener('click', async () => {
    const clickTime = performance.now();
    ui.setButtonLoading();

    // Performance metrics
    const metrics: any = {
      lang,
      page: currentPage + 1,
      tag: tag || 'none'
    };

    // specific for Chrome
    const anyPerformance = performance as any;
    const memoryBefore = anyPerformance.memory ? anyPerformance.memory.usedJSHeapSize : null;

    try {
      const nextPage = currentPage + 1;
      const fetchStart = performance.now();

      let url = `/api/get-posts?page=${nextPage}&lang=${lang}`;
      if (tag) {
        url += `&tag=${encodeURIComponent(tag)}`;
      }

      const response = await fetch(url);
      const fetchEnd = performance.now();
      metrics.networkDurationMs = Math.round(fetchEnd - fetchStart);

      if (!response.ok) {
        console.error('Error fetching posts for pagination', {
          status: response.status,
          statusText: response.statusText,
          page: nextPage,
          lang,
        });
        throw new Error('Failed to fetch posts');
      }

      // Clone response to measure size
      const clone = response.clone();
      const text = await clone.text();
      metrics.payloadSizeBytes = new Blob([text]).size;

      const posts = await response.json();
      const uniquePosts = Array.isArray(posts)
        ? posts.filter((post: BlogPost) => {
            if (!post || !post.slug) return true;
            if (loadedSlugs.has(post.slug)) {
              return false;
            }
            loadedSlugs.add(post.slug);
            return true;
          })
        : [];

      if (!uniquePosts.length) {
        ui.hideButton();
        currentPage = nextPage;
        return;
      }

      const domStart = performance.now();
      ui.appendPosts(uniquePosts, lang);
      const domEnd = performance.now();

      metrics.domUpdateDurationMs = Math.round(domEnd - domStart);
      metrics.totalDurationMs = Math.round(domEnd - clickTime);
      metrics.postsLoaded = uniquePosts.length;

      console.log('[BlogIndex] Load more performance:', metrics);

      currentPage = nextPage;

      if (currentPage >= totalPages) {
        ui.hideButton();
      }
    } catch (error) {
      console.error('Error loading more posts', {
        error,
        lang,
        currentPage,
        totalPages,
      });
      ui.showErrorMessage('Failed to load more articles. Please try again.');
    } finally {
      ui.resetButton();
    }
  });
}

if (typeof window !== 'undefined') {
  (window as any).initializeBlogIndex = initializeBlogIndex;
}
