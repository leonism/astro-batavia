import"./_sentry-release-injection-file.R5khKiVr.js";(function(){try{var s=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},e=new s.Error().stack;e&&(s._sentryDebugIds=s._sentryDebugIds||{},s._sentryDebugIds[e]="3324ed64-307f-468a-94ec-8eaa8fe30f21",s._sentryDebugIdIdentifier="sentry-dbid-3324ed64-307f-468a-94ec-8eaa8fe30f21")}catch{}})();async function m(s){if(!s.trim())return[];try{const e=await fetch(`/api/search?query=${encodeURIComponent(s)}`);return e.ok?await e.json():(console.error("Search API error:",e.status,e.statusText),[])}catch(e){return console.error("Failed to fetch search results:",e),[]}}document.addEventListener("DOMContentLoaded",()=>{const s=document.getElementById("search-input"),e=document.getElementById("search-results"),r=document.getElementById("search-results-content");if(!s||!e||!r)return;let o;s.addEventListener("input",t=>{const n=t.target.value.trim();if(clearTimeout(o),n.length<2){e.classList.add("hidden");return}o=window.setTimeout(()=>{l(n)},300)});async function l(t){try{const n=await m(t);u(n,t)}catch(n){console.error("Search error:",n),c()}}function u(t,n){if(t.length===0){c();return}const i=t.map(a=>`
        <a
          href="${a.url}"
          class="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                ${d(a.title,n)}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                ${d(a.description,n)}
              </p>
              <div class="flex items-center mt-2 space-x-2">
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  ${a.pubDate}
                </span>
                ${a.tags?a.tags.map(f=>`
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    ${f}
                  </span>
                `).join(""):""}
              </div>
            </div>
          </div>
        </a>
      `).join("");r&&(r.innerHTML=i),e&&e.classList.remove("hidden")}function c(){const t=document.documentElement.lang||"en",n={en:"No articles found.",es:"No se encontraron artículos.",ja:"記事が見つかりません。"};r&&(r.innerHTML=`
          <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
            ${n[t]||n.en}
          </div>
        `),e&&e.classList.remove("hidden")}function d(t,n){if(!n)return t;const i=new RegExp(`(${n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return t.replace(i,'<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')}document.addEventListener("click",t=>{!s.contains(t.target)&&!e.contains(t.target)&&e.classList.add("hidden")}),s.addEventListener("keydown",t=>{t.key==="Escape"&&(e.classList.add("hidden"),s.blur())})});
