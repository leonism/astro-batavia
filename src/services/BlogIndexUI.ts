import { slugifyTag } from '@/i18n/utils';
import { DateService } from '@/services/DateService';

export interface BlogPost {
  id: string;
  slug: string;
  heroImage?: string;
  heroImageAlt?: string;
  title: string;
  excerpt: string;
  author: string;
  pubDate: string;
  readingTime?: string;
  tags?: string[];
  url?: string;
}

/**
 * UI Controller for the Blog Index page.
 * Handles client-side interactions such as pagination (load more),
 * loading states, and dynamic content rendering.
 */
export class BlogIndexUI {
  private container: HTMLElement;
  private button: HTMLElement;
  private originalButtonText: string = '';

  /**
   * Creates an instance of BlogIndexUI.
   * @param {HTMLElement} container - The container element where blog posts will be appended.
   * @param {HTMLElement} button - The 'Load More' button element.
   */
  constructor(container: HTMLElement, button: HTMLElement) {
    this.container = container;
    this.button = button;
    this.originalButtonText = button.innerHTML;
  }

  /**
   * Sets the 'Load More' button to a loading state.
   * Disables interactions and shows a spinner.
   */
  public setButtonLoading(): void {
    if (this.button instanceof HTMLButtonElement) {
      this.button.disabled = true;
    } else {
      this.button.style.pointerEvents = 'none';
      this.button.setAttribute('aria-disabled', 'true');
    }

    this.button.setAttribute('aria-busy', 'true');
    this.container.setAttribute('aria-busy', 'true');
    this.button.innerHTML = `
			<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			Loading...
		`;
  }

  /**
   * Resets the 'Load More' button to its original state.
   * Re-enables interactions and restores original text.
   */
  public resetButton(): void {
    if (this.button.style.display === 'none') return;

    if (this.button instanceof HTMLButtonElement) {
      this.button.disabled = false;
    } else {
      this.button.style.pointerEvents = 'auto';
      this.button.removeAttribute('aria-disabled');
    }

    this.button.removeAttribute('aria-busy');
    this.container.removeAttribute('aria-busy');
    this.button.innerHTML = this.originalButtonText;
  }

  /**
   * Hides the 'Load More' button completely (e.g., when no more posts).
   */
  public hideButton(): void {
    this.button.style.display = 'none';
  }

  /**
   * Displays an error message near the button.
   * @param {string} message - The error message to display.
   */
  public showErrorMessage(message: string): void {
    const existingError = this.button.parentNode?.querySelector('.load-more-error');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'load-more-error text-red-500 text-center mt-2 text-sm';
    errorDiv.role = 'alert';
    errorDiv.textContent = message;

    this.button.parentNode?.insertBefore(errorDiv, this.button.nextSibling);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  /**
   * Appends new blog posts to the container.
   * @param {BlogPost[]} posts - The array of blog posts to append.
   * @param {string} lang - The current language code.
   */
  public appendPosts(posts: BlogPost[], lang: string): void {
    let newPostsHtml = '';
    for (const post of posts) {
      newPostsHtml += this.createPostCardHtml(post, lang);
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newPostsHtml;

    const newPosts = Array.from(tempDiv.children) as HTMLElement[];
    this.appendPostElements(newPosts);
  }

  /**
   * Appends post elements to the container and triggers animations.
   * @param {Element[]} elements - The HTML elements to append.
   */
  public appendPostElements(elements: Element[]): void {
    elements.forEach((post) => {
      post.classList.add('animate-fade-in');
      this.container.appendChild(post);
    });

    if (elements.length > 0) {
      const firstNewPost = elements[0] as HTMLElement;
      firstNewPost.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  /**
   * Generates the HTML string for a single blog post card.
   * @param {BlogPost} post - The blog post data.
   * @param {string} lang - The current language code.
   * @returns {string} The HTML string.
   */
  private createPostCardHtml(post: BlogPost, lang: string): string {
    const readMoreText = lang === 'es' ? 'Leer Más' : lang === 'ja' ? '続きを読む' : 'Read More';
    const postUrl = post.url || `/${lang}/blog/${post.slug.split('/').pop()}`;
    const readMoreAboutLabel =
      lang === 'es'
        ? `Leer más sobre ${post.title}`
        : lang === 'ja'
          ? `${post.title} について続きを読む`
          : `Read more about ${post.title}`;

    const tagsHtml = this.createTagsHtml(post.tags, lang);
    const formattedDate = DateService.format(new Date(post.pubDate), lang);

    return `
    <div class="post-item animate-fade-in" data-slug="${post.slug}">
      <article class="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg hover:scale-[1.02] min-h-[420px] max-h-[480px]" aria-labelledby="blog-post-title-${post.id}">
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
          ${tagsHtml}

          <h2 class="font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2 text-xl" id="blog-post-title-${post.id}">
            <a href="${postUrl}">${post.title}</a>
          </h2>

          ${post.excerpt ? `<p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm line-clamp-3">${post.excerpt}</p>` : ''}

          <div class="mt-auto pt-4">
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-3">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span>${post.author}</span>
                </div>
                <time datetime="${post.pubDate}" class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  ${formattedDate}
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
              <a href="${postUrl}" class="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 group" aria-label="${readMoreAboutLabel}">
                ${readMoreText}
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
  }

  /**
   * Helper to generate HTML for tags.
   */
  private createTagsHtml(tags: string[] | undefined, lang: string): string {
    if (!tags || tags.length === 0) return '';

    const tagItems = tags
      .slice(0, 3)
      .map((tag) => {
        const tagUrl =
          lang === 'en' ? `/blog/tags/${slugifyTag(tag)}` : `/${lang}/blog/tags/${slugifyTag(tag)}`;

        return `
        <a href="${tagUrl}" class="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 transition-colors duration-200 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800">
          #${tag}
        </a>
      `;
      })
      .join('');

    const moreTags =
      tags.length > 3
        ? `<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">+${tags.length - 3}</span>`
        : '';

    return `
      <div class="mb-3 flex flex-wrap gap-2" role="group" aria-label="Post tags">
        ${tagItems}
        ${moreTags}
      </div>
    `;
  }
}
