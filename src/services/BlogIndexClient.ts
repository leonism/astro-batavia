import { BlogIndexUI, type BlogPost } from './BlogIndexUI';

interface LoadMoreContext {
  ui: BlogIndexUI;
  button: HTMLButtonElement;
  totalPages: number;
  lang: string;
  loadedSlugs: Set<string>;
  tag?: string | null;
}

export function initializeBlogIndex(totalPages: number, lang: string) {
  console.log('[BlogIndex] Initializing with:', { totalPages, lang });

  const button = document.getElementById('load-more') as HTMLButtonElement | null;
  const container = document.getElementById('posts-container') as HTMLElement | null;

  if (!button || !container) {
    console.warn('[BlogIndex] Missing elements:', { button: !!button, container: !!container });
    return;
  }

  if (button.dataset.loadMoreInitialized === 'true') {
    console.log('[BlogIndex] Already initialized');
    return;
  }

  button.dataset.loadMoreInitialized = 'true';

  const loadedSlugs = new Set<string>();

  const existingItems = container.querySelectorAll<HTMLElement>('[data-slug]');
  existingItems.forEach((item) => {
    const slug = item.getAttribute('data-slug');
    if (slug) {
      loadedSlugs.add(slug);
    }
  });

  console.log('[BlogIndex] Initial loaded slugs:', loadedSlugs.size);

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
    if (currentPage >= totalPages) {
      ui.hideButton();
      return;
    }

    console.log('[BlogIndex] Load More clicked. Current page:', currentPage);
    ui.setButtonLoading();

    try {
      const nextPage = currentPage + 1;
      let url;
      if (tag) {
        url = `/api/posts/${lang}/tag/${encodeURIComponent(tag)}/${nextPage}.json`;
      } else {
        url = `/api/posts/${lang}/${nextPage}.json`;
      }
      console.log('[BlogIndex] Fetching:', url);

      const response = await fetch(url);

      if (!response.ok) {
        console.error('Error fetching posts for pagination', {
          status: response.status,
          statusText: response.statusText,
          page: nextPage,
          lang,
        });
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const posts = await response.json();
      console.log(`[BlogIndex] Fetched ${posts.length} posts`);

      const uniquePosts = Array.isArray(posts)
        ? posts.filter((post: BlogPost) => {
            if (!post || !post.slug) return true;
            if (loadedSlugs.has(post.slug)) {
              console.log('[BlogIndex] Skipping duplicate slug:', post.slug);
              return false;
            }
            loadedSlugs.add(post.slug);
            return true;
          })
        : [];

      console.log(`[BlogIndex] Unique new posts to append: ${uniquePosts.length}`);

      if (!uniquePosts.length) {
        console.log('[BlogIndex] No unique posts. Hiding button.');
        ui.hideButton();
        currentPage = nextPage; // Still increment to avoid infinite loop of trying same page
        return;
      }

      ui.appendPosts(uniquePosts, lang);

      currentPage = nextPage;
      console.log('[BlogIndex] New current page:', currentPage);

      if (currentPage >= totalPages) {
        console.log('[BlogIndex] Reached total pages. Hiding button.');
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
      // Only reset if we didn't hide it (i.e., not finished)
      // Actually ui.resetButton just resets state/text, if hidden it stays hidden via style
      ui.resetButton();
    }
  });
}

if (typeof window !== 'undefined') {
  (window as any).initializeBlogIndex = initializeBlogIndex;
}
