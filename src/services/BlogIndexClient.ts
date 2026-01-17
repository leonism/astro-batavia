interface LoadMoreContext {
  button: HTMLButtonElement;
  container: HTMLElement;
  totalPages: number;
  lang: string;
  loadedSlugs: Set<string>;
}

// Helper function to create the HTML for a blog post card
function createPostCardHtml(post: any, lang: string): string {
  // Translate "Read More"
  const readMoreText = lang === 'es' ? 'Leer Más' : lang === 'ja' ? '続きを読む' : 'Read More';
  const postUrl = `/${lang}/blog/${post.slug.split('/').pop()}`;

  return `
    <div class="post-item animate-fade-in bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg hover:scale-[1.02] min-h-[420px] max-h-[480px]" data-slug="${post.slug}">
      ${
        post.heroImage
          ? `
        <div class="overflow-hidden h-52">
          <a href="${postUrl}" tabindex="-1" aria-hidden="true">
            <img src="${post.heroImage}" alt="${post.heroImageAlt || post.title}" width="600" height="400" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async">
          </a>
        </div>
      `
          : ''
      }
      <div class="p-6 flex-1 flex flex-col">
        <h2 class="font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2 text-xl">
          <a href="${postUrl}">${post.title}</a>
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm line-clamp-3">${post.excerpt}</p>
        <div class="mt-auto pt-4">
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-3">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>${post.author}</span>
              </div>
              <time datetime="${post.pubDate}" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                ${new Date(post.pubDate).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            ${
              post.readingTime
                ? `
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>${post.readingTime}</span>
              </div>
            `
                : ''
            }
          </div>
          <div class="mt-4">
            <a href="${postUrl}" class="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 group" aria-label="Read more about ${post.title}">
              ${readMoreText}
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
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

  const context: LoadMoreContext = {
    button,
    container,
    totalPages,
    lang,
    loadedSlugs,
  };

  attachLoadMore(context);
}

function attachLoadMore({ button, container, totalPages, lang, loadedSlugs }: LoadMoreContext) {
  let currentPage = 1;

  button.addEventListener('click', async () => {
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
			<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			Loading...
		`;

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
        ? posts.filter((post) => {
            if (!post || !post.slug) return true;
            if (loadedSlugs.has(post.slug)) {
              return false;
            }
            loadedSlugs.add(post.slug);
            return true;
          })
        : [];

      if (!uniquePosts.length) {
        button.style.display = 'none';
        currentPage = nextPage;
        return;
      }

      let newPostsHtml = '';
      for (const post of uniquePosts) {
        newPostsHtml += createPostCardHtml(post, lang);
      }

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newPostsHtml;

      const newPosts = Array.from(tempDiv.children) as HTMLElement[];
      newPosts.forEach((post) => {
        post.classList.add('animate-fade-in');
        container.appendChild(post);
      });

      currentPage = nextPage;

      if (currentPage >= totalPages) {
        button.style.display = 'none';
      }
    } catch (error) {
      console.error('Error loading more posts', {
        error,
        lang,
        currentPage,
        totalPages,
      });
      alert('Failed to load more articles. Please try again.');
    } finally {
      button.disabled = false;
      button.innerHTML = originalText;
    }
  });
}

if (typeof window !== 'undefined') {
  (window as any).initializeBlogIndex = initializeBlogIndex;
}
