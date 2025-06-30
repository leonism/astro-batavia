(function(){try{var n=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},c=new n.Error().stack;c&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[c]="dd5559d0-e8e6-46d7-afc8-c6f3ae36b356",n._sentryDebugIdIdentifier="sentry-dbid-dd5559d0-e8e6-46d7-afc8-c6f3ae36b356")}catch{}})();document.addEventListener("astro:page-load",()=>{const n=document.getElementById("main-search-input"),c=document.querySelectorAll(".tag-filter"),p=document.getElementById("sort-select"),h=document.getElementById("results-container"),i=document.getElementById("search-status"),f=document.getElementById("no-results"),k=document.getElementById("clear-search"),g=document.documentElement.lang;if(!n)return;let u=[],b=[],l="all",w="date-desc";document.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="k"&&(e.preventDefault(),n.focus())});function E(){const e=n.value.toLowerCase().trim(),t=[];[].forEach(d=>{const o=d.getAttribute("data-title")?.toLowerCase()||"",a=d.getAttribute("data-description")?.toLowerCase()||"",s=JSON.parse(d.getAttribute("data-tags")||"[]"),y=!e||o.includes(e)||a.includes(e)||s.some(S=>S.toLowerCase().includes(e)),T=l==="all"||s.includes(l);y&&T?(t.push(d),d.style.display="block"):d.style.display="none"}),L(t),v(t.length,e)}function L(e){Array.from(e).sort((r,d)=>{const o=r.getAttribute("data-title")||"",a=d.getAttribute("data-title")||"",s=new Date(r.getAttribute("data-date")||""),y=new Date(d.getAttribute("data-date")||"");switch(w){case"date-asc":return s.getTime()-y.getTime();case"title-asc":return o.localeCompare(a);case"title-desc":return a.localeCompare(o);case"date-desc":default:return y.getTime()-s.getTime()}}).forEach(r=>{h?.appendChild(r)})}function v(e,t){const r=document.documentElement.lang,d={en:{found:(a,s)=>`Found ${a} article${a===1?"":"s"} matching "${s}"`,showing:a=>`Showing all ${a} articles`,tagged:(a,s)=>`Showing ${a} article${a===1?"":"s"} tagged with "${s}"`},es:{found:(a,s)=>`Se encontraron ${a} artículo${a===1?"":"s"} que coinciden con "${s}"`,showing:a=>`Mostrando todos los ${a} artículos`,tagged:(a,s)=>`Mostrando ${a} artículo${a===1?"":"s"} etiquetado${a===1?"":"s"} con "${s}"`},ja:{found:(a,s)=>`"${s}"に一致する${a}件の記事が見つかりました`,showing:a=>`${a}件の記事をすべて表示`,tagged:(a,s)=>`"${s}"でタグ付けされた${a}件の記事を表示`}},o=d[r]||d.en;t?e===0?(i.style.display="none",f.style.display="block"):(i.style.display="block",f.style.display="none",i.textContent=o.found(e,t)):(i.style.display="block",f.style.display="none",l==="all"?i.textContent=o.showing(e):i.textContent=o.tagged(e,l))}function D(e,t){let r;return(...d)=>{clearTimeout(r),r=setTimeout(()=>e(...d),t)}}function m(){let e=[...u];l!=="all"&&(e=e.filter(t=>t.data.tags&&t.data.tags.includes(l))),e.sort((t,r)=>{switch(w){case"date-asc":return new Date(t.data.pubDate).getTime()-new Date(r.data.pubDate).getTime();case"title-asc":return t.data.title.localeCompare(r.data.title);case"title-desc":return r.data.title.localeCompare(t.data.title);case"date-desc":default:return new Date(r.data.pubDate).getTime()-new Date(t.data.pubDate).getTime()}}),b=e,I()}function I(){h.innerHTML="",b.forEach(e=>{const t=document.createElement("div");t.innerHTML=`
          <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <a href="/${g}/blog/${e.slug.replace(`${g}/`,"")}" class="block">
              <div class="aspect-w-16 aspect-h-9">
                <img
                  src="${e.data.heroImage||"/placeholder.jpg"}"
                  alt="${e.data.title}"
                  class="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
              <div class="p-6">
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <time datetime="${e.data.pubDate}">
                    ${new Date(e.data.pubDate).toLocaleDateString(g==="es"?"es-ES":g==="ja"?"ja-JP":"en-US",{year:"numeric",month:"long",day:"numeric"})}
                  </time>
                  <span class="mx-2">•</span>
                  <span>${e.data.readingTime||"5 min read"}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  ${e.data.title}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                  ${e.data.description||""}
                </p>
                <div class="flex flex-wrap gap-2">
                  ${(e.data.tags||[]).map(r=>`
                    <span class="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded-full">
                      ${r}
                    </span>
                  `).join("")}
                </div>
              </div>
            </a>
          </article>
        `,h.appendChild(t)}),v(b.length,n.value.trim())}const $=D(async()=>{const e=n.value.toLowerCase().trim();if(!e){u=[],m();return}try{const t=await fetch(`/api/search?q=${encodeURIComponent(e)}&lang=${g}`);if(!t.ok)throw new Error("Search request failed");u=await t.json(),m()}catch(t){console.error("Search error:",t),u=[]}},300);n.addEventListener("input",()=>{$()}),c.forEach(e=>{e.addEventListener("click",()=>{c.forEach(t=>{t.classList.remove("active","bg-primary-600","text-white"),t.classList.add("border-gray-300","dark:border-gray-600","text-gray-700","dark:text-gray-300")}),e.classList.add("active","bg-primary-600","text-white"),e.classList.remove("border-gray-300","dark:border-gray-600","text-gray-700","dark:text-gray-300"),l=e.getAttribute("data-tag")||"all",m()})}),p.addEventListener("change",()=>{w=p.value,m()}),k?.addEventListener("click",()=>{n.value="",l="all",u=[],c.forEach(t=>{t.classList.remove("active","bg-primary-600","text-white"),t.classList.add("border-gray-300","dark:border-gray-600","text-gray-700","dark:text-gray-300")});const e=document.querySelector('.tag-filter[data-tag="all"]');e&&(e.classList.add("active","bg-primary-600","text-white"),e.classList.remove("border-gray-300","dark:border-gray-600","text-gray-700","dark:text-gray-300")),E(),n.focus()});const x=new URLSearchParams(window.location.search).get("q");x?(n.value=x,$()):v(0,"")});
