export function initializeBlogIndex(totalPages, lang) {
  const loadMoreBtn = document.getElementById("load-more");
  const postsContainer = document.getElementById("posts-container");

  if (!loadMoreBtn || !postsContainer) {
    return;
  }

  let currentPage = 1;
  const currentTag = new URLSearchParams(window.location.search).get("tag");

  loadMoreBtn.addEventListener("click", async () => {
    const nextPage = currentPage + 1;
    const params = new URLSearchParams({
      page: nextPage.toString(),
      lang: lang,
    });

    if (currentTag) {
      params.set("tag", currentTag);
    }

    try {
      const response = await fetch(`/api/get-posts?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newPosts = await response.json();

      if (newPosts.error) {
        throw new Error(`API Error: ${newPosts.error}`);
      }

      if (newPosts.length > 0) {
        newPosts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.classList.add('post-item', 'animate-fade-in');
          postElement.innerHTML = `
            <article class="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] min-h-[380px] max-h-[380px] flex flex-col">
              ${post.heroImage ? `
              <div class="overflow-hidden h-52">
                <img src="${post.heroImage}" alt="${post.title}" width="600" height="400" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px">
              </div>
              ` : ''}
              <div class="p-6 flex-1 flex flex-col">
                ${post.tags && post.tags.length > 0 ? `
                <div class="flex flex-wrap gap-2 mb-3">
                  ${post.tags.slice(0, 3).map(tag => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">#${tag}</span>`).join('')}
                  ${post.tags.length > 3 ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">+${post.tags.length - 3}</span>` : ''}
                </div>
                ` : ''}
                <h2 class="font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2 text-xl">
                  <a href="${post.url}" class="stretched-link">${post.title}</a>
                </h2>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm line-clamp-3">${post.description}</p>
                <div class="flex-1">
                  <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span>${post.author}</span>
                      </div>
                      <time datetime="${post.pubDate}" class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        ${post.pubDate}
                      </time>
                    </div>
                    ${post.readingTime ? `
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>${post.readingTime}</span>
                    </div>
                    ` : ''}
                  </div>
                </div>
                <div class="mt-auto pt-4">
                  <a href="${post.url}" class="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 group">
                    Read More
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </a>
                </div>
              </div>
            </article>
          `;
          postsContainer.appendChild(postElement);
        });
        currentPage = nextPage;
      }

      if (newPosts.length < 9 || currentPage >= totalPages) {
        const currentDocumentLang = document.documentElement.lang;
        const messages = {
          en: "No more articles to load",
          es: "No hay más artículos para cargar",
          ja: "読み込む記事がありません",
        };

        loadMoreBtn.textContent = messages[currentDocumentLang] || messages.en;
        loadMoreBtn.disabled = true;
        loadMoreBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
      loadMoreBtn.textContent = "Error! Check console";
    }
  });
}