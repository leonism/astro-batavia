document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.getElementById("load-more");
  const postsContainer = document.getElementById("posts-container");

  // postsPerPage, totalPages, and lang are passed via define:vars from Astro
  const { postsPerPage, totalPages, lang } = window.__astro_vars_blog_index_script;

  if (!loadMoreBtn || !postsContainer) {
    return;
  }

  const postItems = Array.from(postsContainer.children);
  let currentPage = 1;

  if (postItems.length > postsPerPage) {
    for (let i = postsPerPage; i < postItems.length; i++) {
      const item = postItems[i];
      if (item instanceof HTMLElement) {
        item.style.display = "none";
      }
    }
  } else {
    loadMoreBtn.style.display = "none";
  }

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(currentPage * postsPerPage, postItems.length);

    for (let i = startIndex; i < endIndex; i++) {
      const item = postItems[i];
      if (item instanceof HTMLElement) {
        item.style.display = "block";
        item.classList.add("animate-fade-in");
      }
    }

    if (currentPage >= totalPages || endIndex >= postItems.length) {
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
  });

  const tagList = document.getElementById("tag-list");
  const toggleTagsBtn = document.getElementById("toggle-tags-btn");
  const tagsToShowInitially = 5;

  if (tagList && toggleTagsBtn) {
    const tagItems = Array.from(tagList.querySelectorAll("a.tag-item"));

    if (tagItems.length > tagsToShowInitially) {
      for (let i = tagsToShowInitially; i < tagItems.length; i++) {
        tagItems[i].style.display = "none";
      }

      let tagsHidden = true;

      toggleTagsBtn.addEventListener("click", () => {
        tagsHidden = !tagsHidden;
        for (let i = tagsToShowInitially; i < tagItems.length; i++) {
          tagItems[i].style.display = tagsHidden ? "none" : "inline-flex";
        }
        toggleTagsBtn.textContent = tagsHidden
          ? (lang === 'es' ? 'Mostrar más' : lang === 'ja' ? 'さらに表示' : 'Show more')
          : (lang === 'es' ? 'Mostrar menos' : lang === 'ja' ? '表示を減らす' : 'Show less');
      });
    } else {
      toggleTagsBtn.style.display = "none";
    }
  }
});