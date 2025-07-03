;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6a464019-0878-4102-90b5-f2bc0bf05d88",e._sentryDebugIdIdentifier="sentry-dbid-6a464019-0878-4102-90b5-f2bc0bf05d88")}catch(e){}}();import { b as createAstro, c as createComponent, e as addAttribute, d as renderScript, a as renderTemplate, m as maybeRenderHead, r as renderComponent, F as Fragment, u as unescapeHTML, j as renderHead, k as renderSlot } from './astro/server.Ib_pSZqu.js';
import 'kleur/colors';
import 'clsx';
/* empty css                         */
import { a as getLangFromUrl, u as useTranslations, g as getLocalizedPath, r as removeLocaleFromPath, l as languages } from './utils.D0MtOyzB.js';

const $$Astro$c = createAstro("https://your-blog.com");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/Volumes/DATA/Astro/astro-batavia/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Volumes/DATA/Astro/astro-batavia/node_modules/astro/components/ClientRouter.astro", void 0);

const $$Astro$b = createAstro("https://your-blog.com");
const $$SearchBox = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$SearchBox;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  return renderTemplate`${maybeRenderHead()}<div class="relative max-w-md w-full" data-astro-cid-feeqkpez> <div class="relative" data-astro-cid-feeqkpez> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-astro-cid-feeqkpez> <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-feeqkpez> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-feeqkpez></path> </svg> </div> <input type="search" id="search-input"${addAttribute(t("search.placeholder"), "placeholder")} class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200" autocomplete="off" spellcheck="false" data-astro-cid-feeqkpez> </div> <!-- Search Results Dropdown --> <div id="search-results" class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto hidden" data-astro-cid-feeqkpez> <div id="search-results-content" class="py-2" data-astro-cid-feeqkpez> <!-- Results will be populated by JavaScript --> </div> </div> </div> ${renderScript($$result, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/SearchBox.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/SearchBox.astro", void 0);

const $$Astro$a = createAstro("https://your-blog.com");
const $$HeaderLogo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$HeaderLogo;
  const { lang } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center"> <a${addAttribute(getLocalizedPath("/", lang), "href")} class="flex items-center space-x-2 group"> <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"> <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> <span class="leading-tight sm:text-sm md:text-xl block font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
Astro Batavia
</span> </a> </div>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/navigation/HeaderLogo.astro", void 0);

const $$Astro$9 = createAstro("https://your-blog.com");
const $$HeaderNavLinks = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$HeaderNavLinks;
  const { lang, currentPath, variant } = Astro2.props;
  const t = useTranslations(lang);
  const navLinks = [
    { href: "/", textKey: "nav.home" },
    { href: "/blog", textKey: "nav.blog", checkStartsWith: true },
    { href: "/services", textKey: "nav.services" },
    { href: "/about", textKey: "nav.about" },
    { href: "/contact", textKey: "nav.contact" }
  ];
  const underlineBaseClass = "absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300";
  const baseDesktopClass = "font-medium transition-colors duration-200 relative group";
  const activeDesktopClass = "text-blue-600 dark:text-blue-400";
  const inactiveDesktopClass = "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400";
  const baseMobileClass = "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200";
  const activeMobileClass = "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20";
  const inactiveMobileClass = "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800";
  return renderTemplate`${navLinks.map((link) => {
    const localizedHref = getLocalizedPath(link.href, lang);
    const isActive = link.checkStartsWith ? currentPath.startsWith(localizedHref) : currentPath === localizedHref;
    if (variant === "desktop") {
      return renderTemplate`${maybeRenderHead()}<a${addAttribute(localizedHref, "href")}${addAttribute(`${baseDesktopClass} ${isActive ? activeDesktopClass : inactiveDesktopClass}`, "class")}>${t(link.textKey)}<span${addAttribute(`${underlineBaseClass} ${isActive ? "w-full" : "w-0 group-hover:w-full"}`, "class")}></span></a>`;
    } else {
      return renderTemplate`<a${addAttribute(localizedHref, "href")}${addAttribute(`${baseMobileClass} ${isActive ? activeMobileClass : inactiveMobileClass}`, "class")}>${t(link.textKey)}</a>`;
    }
  })}`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/navigation/HeaderNavLinks.astro", void 0);

const $$Astro$8 = createAstro("https://your-blog.com");
const $$LanguageSwitcher = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$LanguageSwitcher;
  const lang = getLangFromUrl(Astro2.url);
  const currentPath = removeLocaleFromPath(Astro2.url.pathname);
  return renderTemplate`${maybeRenderHead()}<div class="relative" id="language-switcher"> <button id="language-toggle" class="flex items-center space-x-1 md:mx-2 md:mr-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200" aria-haspopup="true" aria-expanded="false"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path> </svg> <span>${languages[lang]}</span> <svg class="w-4 h-4 transition-transform duration-200" id="language-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div id="language-dropdown" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-50 hidden"> <div class="py-1" role="menu" aria-orientation="vertical"> ${Object.entries(languages).map(([langCode, langName]) => {
    const href = getLocalizedPath(currentPath, langCode);
    const isActive = langCode === lang;
    return renderTemplate`<a${addAttribute(href, "href")}${addAttribute(`block px-4 py-2 text-sm transition-colors duration-200 ${isActive ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"}`, "class")} role="menuitem"> <div class="flex items-center justify-between"> <span>${langName}</span> ${isActive && renderTemplate`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg>`} </div> </a>`;
  })} </div> </div> </div> ${renderScript($$result, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/LanguageSwitcher.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/LanguageSwitcher.astro", void 0);

const $$Astro$7 = createAstro("https://your-blog.com");
const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$ThemeToggle;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  return renderTemplate`${maybeRenderHead()}<button id="theme-toggle" class="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"${addAttribute(t("theme.toggle"), "aria-label")}${addAttribute(t("theme.toggle"), "title")}>  <svg id="theme-toggle-light-icon" class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path> </svg>  <svg id="theme-toggle-dark-icon" class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path> </svg> </button> ${renderScript($$result, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/ThemeToggle.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/ThemeToggle.astro", void 0);

const $$HeaderMobileMenuToggle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<button id="mobile-menu-button" class="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" aria-label="Toggle mobile menu"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/navigation/HeaderMobileMenuToggle.astro", void 0);

const $$HeaderUtilities = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center"> <div class="hidden lg:block" aria-label="Search"> ${renderComponent($$result, "SearchBox", $$SearchBox, {})} </div> ${renderComponent($$result, "LanguageSwitcher", $$LanguageSwitcher, {})} ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, {})} ${renderComponent($$result, "HeaderMobileMenuToggle", $$HeaderMobileMenuToggle, {})} </div>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/navigation/HeaderUtilities.astro", void 0);

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(cooked.slice()) }));
var _a$3;
const $$Astro$6 = createAstro("https://your-blog.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Header;
  const lang = getLangFromUrl(Astro2.url);
  const currentPath = Astro2.url.pathname;
  return renderTemplate(_a$3 || (_a$3 = __template$3(["", '<header class="fixed top-0 z-50 w-full bg-white/50 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50" aria-label="Main navigation"> <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between items-center h-16"> ', ' <div class="hidden md:flex items-center gap-5"> ', " </div> ", ' </div> <div id="mobile-menu" class="md:hidden hidden pb-4" aria-expanded="false" aria-label="Mobile menu"> <div class="flex flex-col gap-2"> ', ' <div class="pt-2" aria-label="Mobile search"> ', ` </div> </div> </div> </nav> </header> <script>
  document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    const toggleMobileMenu = () => {
      if (!mobileMenu) return;

      const isExpanded = mobileMenu.getAttribute("aria-expanded") === "true";
      mobileMenu.classList.toggle("hidden");
      mobileMenu.setAttribute("aria-expanded", String(!isExpanded));
    };

    const closeMobileMenu = (event) => {
      if (!mobileMenu || !mobileMenuButton) return;

      const target = event.target;
      const isClickInside =
        mobileMenuButton.contains(target) || mobileMenu.contains(target);

      if (!isClickInside) {
        mobileMenu.classList.add("hidden");
        mobileMenu.setAttribute("aria-expanded", "false");
      }
    };

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", toggleMobileMenu);
      document.addEventListener("click", closeMobileMenu);

      // Prevent clicks inside the mobile menu from closing it immediately
      mobileMenu.addEventListener("click", (event) => {
        if (event.target.tagName === "A") {
          event.stopPropagation();
        }
      });
    }

    return () => {
      if (mobileMenuButton) {
        mobileMenuButton.removeEventListener("click", toggleMobileMenu);
      }
      document.removeEventListener("click", closeMobileMenu);
      // No need to remove the mobileMenu click listener as it's tied to the element's lifecycle
    };
  });
<\/script>`])), maybeRenderHead(), renderComponent($$result, "HeaderLogo", $$HeaderLogo, { "lang": lang }), renderComponent($$result, "HeaderNavLinks", $$HeaderNavLinks, { "lang": lang, "currentPath": currentPath, "variant": "desktop" }), renderComponent($$result, "HeaderUtilities", $$HeaderUtilities, {}), renderComponent($$result, "HeaderNavLinks", $$HeaderNavLinks, { "lang": lang, "currentPath": currentPath, "variant": "mobile" }), renderComponent($$result, "SearchBox", $$SearchBox, {}));
}, "/Volumes/DATA/Astro/astro-batavia/src/components/navigation/Header.astro", void 0);

const $$Astro$5 = createAstro("https://your-blog.com");
const $$FooterBrand = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$FooterBrand;
  const { lang } = Astro2.props;
  const t = useTranslations(lang);
  return renderTemplate`${maybeRenderHead()}<footer class="col-span-1 md:col-span-2"> <div class="flex items-center gap-2 mt-7 mb-4"> <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.1"></circle> <path d="M16 8l8 8-8 8-8-8 8-8z" fill="currentColor"></path> </svg> <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
Astro Batavia
</h2> </div> <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-md"> ${t("meta.description")} </p> <ul class="flex justify-start mx-auto text-left"> <!-- GitHub --> <li> <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200" aria-label="GitHub"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path> </svg> </a> </li> <!-- Twitter/X --> <li> <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200" aria-label="Twitter"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path> </svg> </a> </li> <!-- LinkedIn --> <li> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200" aria-label="LinkedIn"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd"></path> </svg> </a> </li> <!-- YouTube --> <li> <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200" aria-label="YouTube"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clip-rule="evenodd"></path> </svg> </a> </li> <!-- Instagram --> <li> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200" aria-label="Instagram"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path> </svg> </a> </li> <!-- TikTok --> <li> <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200" aria-label="TikTok"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"></path> </svg> </a> </li> </ul> </footer>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/footer/FooterBrand.astro", void 0);

const $$Astro$4 = createAstro("https://your-blog.com");
const $$FooterLinks = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$FooterLinks;
  const { title, links, lang } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="my-0"> <h3 class="text-sm mt-7 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4"> ${title} </h3> <ul class="space-y-2"> ${links.map((link) => renderTemplate`<li> <a${addAttribute(
    link.isLocalized ? getLocalizedPath(link.href, lang) : link.href,
    "href"
  )}${addAttribute(link.isExternal ? "_blank" : void 0, "target")}${addAttribute(link.isExternal ? "noopener noreferrer" : void 0, "rel")} class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"> ${link.text} </a> </li>`)} </ul> </div>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/footer/FooterLinks.astro", void 0);

const $$Astro$3 = createAstro("https://your-blog.com");
const $$FooterBottomBar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$FooterBottomBar;
  const { lang, currentYear } = Astro2.props;
  const t = useTranslations(lang);
  return renderTemplate`${maybeRenderHead()}<footer class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"> <div class="flex flex-col md:flex-row justify-between items-center gap-4"> <div class="flex items-center gap-4"> <p class="text-gray-500 dark:text-gray-400 text-sm"> ${t("footer.copyright")} </p> <a href="/rss.xml" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200" aria-label="RSS Feed"> <svg class="sm:w-3 sm:h-3 w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415a3.3 3.3 0 013.293 3.295A3.303 3.303 0 013.283 24C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" clip-rule="evenodd"></path> </svg> </a> </div> <p class="text-gray-500 dark:text-gray-400 text-sm"> ${t("footer.madeWith")} <a href="https://astro.build" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 ml-1" aria-label="Astro">
Astro
</a> </p> </div> </footer>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/footer/FooterBottomBar.astro", void 0);

const $$Astro$2 = createAstro("https://your-blog.com");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Footer;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const navigationLinks = [
    { href: getLocalizedPath("/", lang), text: t("nav.home"), isLocalized: false },
    { href: getLocalizedPath("/blog", lang), text: t("nav.blog"), isLocalized: false },
    { href: getLocalizedPath("/services", lang), text: t("nav.services"), isLocalized: false },
    { href: getLocalizedPath("/about", lang), text: t("nav.about"), isLocalized: false },
    { href: getLocalizedPath("/search", lang), text: t("nav.search"), isLocalized: false }
  ];
  const legalLinks = [
    { href: getLocalizedPath("/contact", lang), text: t("footer.links.contact"), isLocalized: false },
    {
      href: getLocalizedPath("/cookies", lang),
      text: t("footer.links.cookies"),
      isLocalized: false
    },
    {
      href: getLocalizedPath("/privacy", lang),
      text: t("footer.links.privacy"),
      isLocalized: false
    },
    {
      href: getLocalizedPath("/terms", lang),
      text: t("footer.links.terms"),
      isLocalized: false
    }
  ];
  const resourceLinks = [
    { href: "https://astro.build", text: "Astro.js", isExternal: true },
    { href: "https://tailwindcss.com", text: "Tailwind CSS", isExternal: true },
    { href: "https://decapcms.org", text: "Decap CMS", isExternal: true }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-50 dark:bg-slate-900/80 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300"> <div class="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 md:grid-cols-5 justify-around"> ${renderComponent($$result, "FooterBrand", $$FooterBrand, { "lang": lang })} ${renderComponent($$result, "FooterLinks", $$FooterLinks, { "title": "Navigation", "links": navigationLinks, "lang": lang })} ${renderComponent($$result, "FooterLinks", $$FooterLinks, { "title": "Resources", "links": resourceLinks, "lang": lang })} ${renderComponent($$result, "FooterLinks", $$FooterLinks, { "title": "Legal", "links": legalLinks, "lang": lang })} </div> ${renderComponent($$result, "FooterBottomBar", $$FooterBottomBar, { "lang": lang, "currentYear": currentYear })} </div> </footer>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/footer/Footer.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Astro$1 = createAstro("https://your-blog.com");
const $$SEO = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SEO;
  const {
    title,
    description,
    image,
    noindex = false,
    canonical,
    lang = "en",
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    authorUrl,
    authorImage,
    tags = [],
    category,
    readingTime,
    wordCount,
    excerpt,
    breadcrumbs = [],
    organization,
    video,
    product
  } = Astro2.props;
  const siteTitle = "Astro Batavia";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const siteUrl = Astro2.site?.href || "https://your-blog.com";
  const imageUrl = image ? new URL(image, siteUrl).href : `${siteUrl}/images/og-default.jpg`;
  const canonicalUrl = canonical || Astro2.url.href;
  const finalExcerpt = excerpt || description;
  const defaultOrganization = {
    name: "Astro Batavia",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    sameAs: [
      "https://twitter.com/astrobatavia",
      "https://github.com/astrobatavia",
      "https://linkedin.com/company/astrobatavia"
    ]
  };
  const orgData = organization || defaultOrganization;
  const generateJsonLd = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : type === "blog" ? "BlogPosting" : "WebPage",
      "headline": title,
      "description": description,
      "url": canonicalUrl,
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 630
      },
      "publisher": {
        "@type": "Organization",
        "name": orgData.name,
        "url": orgData.url,
        "logo": {
          "@type": "ImageObject",
          "url": orgData.logo
        },
        ...orgData.sameAs && { "sameAs": orgData.sameAs }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      }
    };
    if (type === "article" || type === "blog") {
      Object.assign(baseSchema, {
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        ...author && {
          "author": {
            "@type": "Person",
            "name": author,
            ...authorUrl && { "url": authorUrl },
            ...authorImage && { "image": authorImage }
          }
        },
        ...category && { "articleSection": category },
        ...tags.length > 0 && { "keywords": tags.join(", ") },
        ...wordCount && { "wordCount": wordCount },
        ...readingTime && { "timeRequired": `PT${readingTime}M` }
      });
    }
    if (breadcrumbs.length > 0) {
      baseSchema["breadcrumb"] = {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
    }
    if (video) {
      baseSchema["video"] = {
        "@type": "VideoObject",
        "name": title,
        "description": video.description || description,
        "thumbnailUrl": video.thumbnail,
        "contentUrl": video.url,
        ...video.duration && { "duration": video.duration }
      };
    }
    if (product) {
      baseSchema["mainEntity"] = {
        "@type": "Product",
        "name": product.name,
        "description": description,
        "image": imageUrl,
        ...product.brand && { "brand": { "@type": "Brand", "name": product.brand } },
        ...product.price && {
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": product.currency || "USD",
            "availability": `https://schema.org/${product.availability || "InStock"}`
          }
        }
      };
    }
    return JSON.stringify(baseSchema);
  };
  const jsonLdData = generateJsonLd();
  const hreflangMap = {
    en: "en-US",
    es: "es-ES",
    ja: "ja-JP"
  };
  const getAlternateUrls = () => {
    const currentPath = Astro2.url.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|es|ja)/, "") || "/";
    return {
      en: pathWithoutLang === "/" ? siteUrl : `${siteUrl}${pathWithoutLang}`,
      es: `${siteUrl}/es${pathWithoutLang}`,
      ja: `${siteUrl}/ja${pathWithoutLang}`
    };
  };
  const alternateUrls = getAlternateUrls();
  return renderTemplate(_a$2 || (_a$2 = __template$2(['<!-- JSON-LD Structured Data --><script type="application/ld+json">', "<\/script> <!-- Basic Meta Tags --><title>", '</title><meta name="description"', '><meta name="keywords"', ">", "", "", "", "", "", "", '<!-- Enhanced Open Graph --><meta property="og:type"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:alt"', '><meta property="og:url"', '><meta property="og:site_name"', '><meta property="og:locale"', ">", "", "", '<!-- Enhanced Twitter Card --><meta name="twitter:card"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="twitter:image:alt"', '><meta name="twitter:site" content="@yoursitehandle">', "", '<!-- LinkedIn Specific --><meta property="linkedin:owner" content="your-linkedin-company-id"><!-- WhatsApp Specific --><meta property="whatsapp:title"', '><meta property="whatsapp:description"', '><meta property="whatsapp:image"', '><!-- Telegram Specific --><meta property="telegram:channel" content="@yourchannel"><!-- Pinterest Specific --><meta name="pinterest-rich-pin" content="true"><meta property="pinterest:description"', '><!-- Apple Specific --><meta name="apple-mobile-web-app-title"', '><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><!-- Microsoft Specific --><meta name="msapplication-TileColor" content="#000000"><meta name="msapplication-TileImage"', `><meta name="msapplication-config" content="/browserconfig.xml"><!-- Performance & Security Headers --><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="referrer" content="strict-origin-when-cross-origin"><meta name="format-detection" content="telephone=no"><meta name="theme-color" content="#000000"><meta name="color-scheme" content="light dark"><!-- Preconnect to external domains --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://www.google-analytics.com"><!-- DNS Prefetch --><link rel="dns-prefetch" href="//www.google-analytics.com"><link rel="dns-prefetch" href="//fonts.googleapis.com"><!-- Accessibility --><meta name="accessibility" content="WCAG 2.1 AA compliant"><!-- Content Security Policy (Basic) --><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com blob: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:*; worker-src 'self' blob: data:;"><!-- Hreflang Tags -->`, '<link rel="alternate" hreflang="x-default"', '><!-- Additional Meta Tags --><meta name="theme-color" content="#3b82f6"><meta name="msapplication-TileColor" content="#3b82f6"><meta name="apple-mobile-web-app-status-bar-style" content="black" name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black"><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">'])), unescapeHTML(jsonLdData), fullTitle, addAttribute(description, "content"), addAttribute(tags.join(", "), "content"), author && renderTemplate`<meta name="author"${addAttribute(author, "content")}>`, category && renderTemplate`<meta name="article:section"${addAttribute(category, "content")}>`, readingTime && renderTemplate`<meta name="reading-time"${addAttribute(`${readingTime} minutes`, "content")}>`, wordCount && renderTemplate`<meta name="word-count"${addAttribute(wordCount.toString(), "content")}>`, finalExcerpt && finalExcerpt !== description && renderTemplate`<meta name="excerpt"${addAttribute(finalExcerpt, "content")}>`, noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, canonical && renderTemplate`<link rel="canonical"${addAttribute(canonicalUrl, "href")}>`, addAttribute(type, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(imageUrl, "content"), addAttribute(title, "content"), addAttribute(canonicalUrl, "content"), addAttribute(siteTitle, "content"), addAttribute(hreflangMap[lang], "content"), authorImage && renderTemplate`<meta property="og:image:secure_url"${addAttribute(imageUrl, "content")}>`, video && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<meta property="og:video"${addAttribute(video.url, "content")}><meta property="og:video:secure_url"${addAttribute(video.url, "content")}><meta property="og:video:type" content="video/mp4"><meta property="og:video:width" content="1280"><meta property="og:video:height" content="720">` })}`, type === "article" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`}${modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>`}${author && renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`}${tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`)}` })}`, addAttribute(video ? "player" : "summary_large_image", "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(imageUrl, "content"), addAttribute(title, "content"), author && renderTemplate`<meta name="twitter:creator"${addAttribute(`@${author.replace(/\s+/g, "").toLowerCase()}`, "content")}>`, video && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<meta name="twitter:player"${addAttribute(video.url, "content")}><meta name="twitter:player:width" content="1280"><meta name="twitter:player:height" content="720">` })}`, addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(imageUrl, "content"), addAttribute(description, "content"), addAttribute(siteTitle, "content"), addAttribute(imageUrl, "content"), Object.entries(alternateUrls).map(([langCode, url]) => renderTemplate`<link rel="alternate"${addAttribute(hreflangMap[langCode], "hreflang")}${addAttribute(url, "href")}>`), addAttribute(alternateUrls.en, "href"));
}, "/Volumes/DATA/Astro/astro-batavia/src/components/common/SEO.astro", void 0);

const $$BackToTop = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Back to Top Button -->${maybeRenderHead()}<button id="back-to-top" aria-label="Back to top" title="Back to top" class="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-opacity duration-300 opacity-0 pointer-events-none z-50"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path> </svg> </button>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/BackToTop.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$ThemeInitializer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1([`<script>
  function initializeTheme() {
    try {
      const getThemePreference = () => {
        if (typeof localStorage !== "undefined") {
          const storedTheme = localStorage.getItem("theme");
          if (storedTheme) {
            console.log("ThemeInitializer: Found theme in localStorage:", storedTheme);
            return storedTheme;
          }
        } else {
          console.warn("ThemeInitializer: localStorage is not available.");
        }

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        console.log("ThemeInitializer: No theme in localStorage. System prefers dark:", prefersDark);
        return prefersDark ? "dark" : "light";
      };

      const initialTheme = getThemePreference();
      const isDark = initialTheme === "dark";
      console.log("ThemeInitializer: Initial theme determined as:", initialTheme);
      document.documentElement.classList[isDark ? "add" : "remove"]("dark");
      console.log("ThemeInitializer: html element classes after initialization:", document.documentElement.classList);
    } catch (error) {
      console.error("Error in ThemeInitializer.astro script:", error);
    }
  }

  // Initialize theme on initial page load
  initializeTheme();

  // Initialize theme on subsequent page loads (View Transitions)
  document.addEventListener('astro:page-load', initializeTheme);
<\/script>`])));
}, "/Volumes/DATA/Astro/astro-batavia/src/components/common/ThemeInitializer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BackToTopScript = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<script>\n  const backToTopButton = document.getElementById("back-to-top");\n\n  if (backToTopButton) {\n    window.addEventListener("scroll", () => {\n      if (window.scrollY > 200) {\n        backToTopButton.classList.remove("opacity-0", "pointer-events-none");\n        backToTopButton.classList.add("opacity-100", "pointer-events-auto");\n      } else {\n        backToTopButton.classList.remove("opacity-100", "pointer-events-auto");\n        backToTopButton.classList.add("opacity-0", "pointer-events-none");\n      }\n    });\n\n    backToTopButton.addEventListener("click", () => {\n      window.scrollTo({\n        top: 0,\n        behavior: "smooth",\n      });\n    });\n  }\n<\/script>'])));
}, "/Volumes/DATA/Astro/astro-batavia/src/components/common/BackToTopScript.astro", void 0);

const $$Astro = createAstro("https://your-blog.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "A modern multi-language blog built with Astro.js",
    image,
    noindex = false,
    lang = "en",
    canonical,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    authorUrl,
    authorImage,
    tags = [],
    category,
    readingTime,
    wordCount,
    excerpt,
    breadcrumbs = [],
    organization,
    video,
    product
  } = Astro2.props;
  return renderTemplate`<html${addAttribute(lang, "lang")} class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Preconnect to external domains --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Fonts --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"><!-- SEO Component -->${renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "image": image, "noindex": noindex, "canonical": canonical, "lang": lang, "type": type, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "author": author, "authorUrl": authorUrl, "authorImage": authorImage, "tags": tags, "category": category, "readingTime": readingTime?.toString(), "wordCount": wordCount, "excerpt": excerpt, "breadcrumbs": breadcrumbs, "organization": organization, "video": video, "product": product })}${renderComponent($$result, "ThemeInitializer", $$ThemeInitializer, {})}${renderComponent($$result, "ViewTransitions", $$ClientRouter, {})}<link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300"> <div class="md:min-h-full lg:min-h-screen flex flex-col"> ${renderComponent($$result, "Header", $$Header, {})} <main class="flex-1 pt-16"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </div> ${renderComponent($$result, "BackToTop", $$BackToTop, {})} ${renderComponent($$result, "BackToTopScript", $$BackToTopScript, {})} </body></html>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
