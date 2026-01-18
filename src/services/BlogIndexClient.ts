import { BlogIndexUI, type BlogPost } from './BlogIndexUI';

interface LoadMoreContext {
  ui: BlogIndexUI;
  button: HTMLButtonElement;
  totalPages: number;
  lang: string;
  loadedSlugs: Set<string>;
}

export function initializeBlogIndex(totalPages: number, lang: string) {
  const button = document.getElementById('load-more') as HTMLButtonElement | null;
  const container = document.getElementById('posts-container') as HTMLElement | null;

  if (!button || !container) return;

  if (button.dataset.loadMoreInitialized === 'true') {
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

  const ui = new BlogIndexUI(container, button);

  const context: LoadMoreContext = {
    ui,
    button,
    totalPages,
    lang,
    loadedSlugs,
  };

  attachLoadMore(context);
}

function attachLoadMore({ ui, button, totalPages, lang, loadedSlugs }: LoadMoreContext) {
  let currentPage = 1;

  button.addEventListener('click', async () => {
    ui.setButtonLoading();

    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/api/get-posts?page=${nextPage}&lang=${lang}`);

      if (!response.ok) {
        console.error('Error fetching posts for pagination', {
          status: response.status,
          statusText: response.statusText,
          page: nextPage,
          lang,
        });
        throw new Error('Failed to fetch posts');
      }

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

      ui.appendPosts(uniquePosts, lang);

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