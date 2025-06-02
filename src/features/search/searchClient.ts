export function initializeSearchPage(): void {
  const searchInput = document.getElementById('main-search-input') as HTMLInputElement;
  const tagFilters = document.querySelectorAll<HTMLButtonElement>('.tag-filter');
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
  const postItems = document.querySelectorAll<HTMLElement>('.post-item'); // Ensure items have this class
  const resultsContainer = document.getElementById('results-container');
  const searchStatus = document.getElementById('search-status');
  const noResults = document.getElementById('no-results');
  const clearSearch = document.getElementById('clear-search') as HTMLButtonElement;

  if (!searchInput || !resultsContainer || !searchStatus || !noResults || !clearSearch) {
    console.warn('Search page UI elements not found, search functionality may be impaired.');
    return;
  }

  let currentTag = 'all';
  let currentSort = 'date-desc'; // Default sort

  // Keyboard shortcut for search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filteredItems: HTMLElement[] = [];
    const isInitialOrClearedSearch = !query && currentTag === 'all' && searchInput.dataset.userInteracted !== 'true';

    postItems.forEach(item => {
      const title = item.dataset.title?.toLowerCase() || '';
      const description = item.dataset.description?.toLowerCase() || '';
      const tags = JSON.parse(item.dataset.tags || '[]') as string[];

      const matchesQuery = !query || title.includes(query) || description.includes(query) ||
                           tags.some((tag: string) => tag.toLowerCase().includes(query));
      const matchesTag = currentTag === 'all' || tags.includes(currentTag);

      if (isInitialOrClearedSearch) {
        item.style.display = 'none';
      } else if (matchesQuery && matchesTag) {
        filteredItems.push(item);
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    sortResults(filteredItems);
    updateSearchStatus(filteredItems.length, query);
  }

  function sortResults(items: HTMLElement[]) {
    const sortedItems = Array.from(items).sort((a, b) => {
      const aTitle = a.dataset.title || '';
      const bTitle = b.dataset.title || '';
      const aDate = new Date(a.dataset.date || '');
      const bDate = new Date(b.dataset.date || '');

      switch (currentSort) {
        case 'date-asc':
          return aDate.getTime() - bDate.getTime();
        case 'title-asc':
          return aTitle.localeCompare(bTitle);
        case 'title-desc':
          return bTitle.localeCompare(aTitle);
        case 'date-desc':
        default:
          return bDate.getTime() - aDate.getTime();
      }
    });

    if (resultsContainer) {
      resultsContainer.innerHTML = ''; // Clear existing items
      sortedItems.forEach(item => {
        resultsContainer.appendChild(item);
      });
    }
  }

  function updateSearchStatus(count: number, query: string) {
    const hasInteracted = searchInput.dataset.userInteracted === 'true';

    if (!searchStatus || !noResults || !resultsContainer) return;

    if (!query && currentTag === 'all' && !hasInteracted) {
      searchStatus.style.display = 'block';
      noResults.style.display = 'none';
      resultsContainer.innerHTML = ''; // Clear initially rendered posts
      // Ensure t('search.initialPrompt') or similar is available or pass text
      searchStatus.textContent = searchInput.dataset.initialPrompt || `Enter a search term or select a topic to find articles.`;
      return;
    }

    if (query || currentTag !== 'all') {
      if (count === 0) {
        searchStatus.style.display = 'none';
        noResults.style.display = 'block';
      } else {
        searchStatus.style.display = 'block';
        noResults.style.display = 'none';
        let statusText = `Found ${count} article${count === 1 ? '' : 's'}`;
        if (query && currentTag === 'all') {
          statusText += ` matching "${query}"`;
        } else if (!query && currentTag !== 'all') {
          statusText += ` tagged with "${currentTag}"`;
        } else {
          statusText += ` matching "${query}" and tagged with "${currentTag}"`;
        }
        searchStatus.textContent = statusText;
      }
    } else {
      searchStatus.style.display = 'block';
      noResults.style.display = 'none';
      // Ensure t('search.showingAllPrompt') or similar is available or pass text
      searchStatus.textContent = searchInput.dataset.showingAllPrompt || `Showing all ${count} articles. Enter a search term or select a topic to refine.`;
    }
  }

  searchInput.addEventListener('input', () => {
    searchInput.dataset.userInteracted = 'true';
    performSearch();
  });

  tagFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      tagFilters.forEach(f => {
        f.classList.remove('active', 'bg-primary-600', 'text-white');
        f.classList.add('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
      });
      filter.classList.add('active', 'bg-primary-600', 'text-white');
      filter.classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
      currentTag = filter.getAttribute('data-tag') || 'all';
      searchInput.dataset.userInteracted = 'true';
      performSearch();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      if(searchInput.value || currentTag !== 'all') {
        searchInput.dataset.userInteracted = 'true';
      }
      performSearch();
    });
  }

  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    currentTag = 'all';
    tagFilters.forEach(f => {
      f.classList.remove('active', 'bg-primary-600', 'text-white');
      f.classList.add('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
    });
    const allFilter = document.querySelector<HTMLButtonElement>('.tag-filter[data-tag="all"]');
    if (allFilter) {
      allFilter.classList.add('active', 'bg-primary-600', 'text-white');
      allFilter.classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
    }
    searchInput.dataset.userInteracted = 'false';
    performSearch();
    searchInput.focus();
  });

  // Initial call to hide posts if no interaction
  performSearch();
}
