import"./_sentry-release-injection-file.CxpsxR23.js";(function(){try{var r=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},n=new r.Error().stack;n&&(r._sentryDebugIds=r._sentryDebugIds||{},r._sentryDebugIds[n]="be77c06b-7fed-4357-a313-69c52e4158d0",r._sentryDebugIdIdentifier="sentry-dbid-be77c06b-7fed-4357-a313-69c52e4158d0")}catch{}})();async function m(r,n="en"){try{const s=await fetch(`/api/search?q=${encodeURIComponent(r)}&lang=${n}`);if(!s.ok)throw new Error("Search API request failed");return await s.json()}catch(s){return console.error("Search error:",s),[]}}document.addEventListener("DOMContentLoaded",()=>{const r=document.getElementById("search-input"),n=document.getElementById("search-results"),s=document.getElementById("search-results-content");if(!r||!n||!s)return;let i;r.addEventListener("input",e=>{const t=e.target.value.trim();if(clearTimeout(i),t.length<2){n.classList.add("hidden");return}i=window.setTimeout(()=>{l(t)},300)});async function l(e){try{const t=await m(e);u(t,e)}catch(t){console.error("Search error:",t),o()}}function u(e,t){if(e.length===0){o();return}const c=e.map(a=>`
        <a
          href="${a.url}"
          class="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                ${d(a.title,t)}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                ${d(a.description,t)}
              </p>
              <div class="flex items-center mt-2 space-x-2">
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  ${a.pubDate}
                </span>
                ${a.tags?a.tags.map(g=>`
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    ${g}
                  </span>
                `).join(""):""}
              </div>
            </div>
          </div>
        </a>
      `).join("");s&&(s.innerHTML=c),n&&n.classList.remove("hidden")}function o(){const e=document.documentElement.lang||"en",t={en:"No articles found.",es:"No se encontraron artículos.",ja:"記事が見つかりません。"};s&&(s.innerHTML=`
          <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
            ${t[e]||t.en}
          </div>
        `),n&&n.classList.remove("hidden")}function d(e,t){if(!t)return e;const c=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return e.replace(c,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')}document.addEventListener("click",e=>{!r.contains(e.target)&&!n.contains(e.target)&&n.classList.add("hidden")}),r.addEventListener("keydown",e=>{e.key==="Escape"&&(n.classList.add("hidden"),r.blur())})});
