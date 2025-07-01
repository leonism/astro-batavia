;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a2438409-cbf5-41bd-a111-c70d70458b1b",e._sentryDebugIdIdentifier="sentry-dbid-a2438409-cbf5-41bd-a111-c70d70458b1b")}catch(e){}}();import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, s as spreadAttributes, g as renderSlot, r as renderComponent, F as Fragment, a as renderTemplate, u as unescapeHTML } from './astro/server.CrcP_Q54.js';
import 'kleur/colors';
import { g as getLangFromUrl, u as useTranslations, a as getLocalizedPath } from './utils.BsNdZzoF.js';
import 'clsx';
import { g as getCollection } from './_astro_content.UJUyYyve.js';
import { $ as $$Picture } from './Picture.yS0_TEXA.js';

const $$Astro$d = createAstro("https://your-blog.com");
const $$BaseHero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$BaseHero;
  const {
    title,
    subtitle,
    cta1Text,
    cta1Link,
    cta1IconSvg,
    cta1IconPosition = "after",
    cta1AriaLabel,
    cta2Text,
    cta2Link,
    cta2IconSvg,
    cta2IconPosition = "before",
    cta2AriaLabel,
    showDecorativeElements = false,
    showScrollIndicator = false,
    sectionClass = "relative py-20 lg:py-32",
    containerClass = "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
    titleClass = "text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6",
    subtitleClass = "text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto",
    ctaContainerClass = "flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 md:pt-20",
    cta1Class = "group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105",
    cta2Class = "group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105",
    decorativeElement1Class = "absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl",
    decorativeElement2Class = "absolute -bottom-32 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl",
    scrollIndicatorContainerClass = "absolute mt-20 md:-mb-10 -bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce",
    scrollIndicatorOuterClass = "w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center",
    scrollIndicatorInnerClass = "w-1 h-3 bg-slate-400 dark:bg-slate-600 rounded-full mt-2 animate-pulse",
    ...rest
  } = Astro2.props;
  const iconBaseClass = "w-5 h-5 transition-transform";
  return renderTemplate`${maybeRenderHead()}<header${addAttribute([sectionClass], "class:list")}${spreadAttributes(rest)}> ${showDecorativeElements && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <div aria-hidden="true"${addAttribute([decorativeElement1Class], "class:list")}></div> <div aria-hidden="true"${addAttribute([decorativeElement2Class], "class:list")}></div> ` })}`} <div${addAttribute([containerClass], "class:list")}> <hgroup class="space-y-6"> ${title && renderTemplate`<h1${addAttribute([titleClass], "class:list")}>${unescapeHTML(title)}</h1>`} ${subtitle && renderTemplate`<p${addAttribute([subtitleClass], "class:list")}>${unescapeHTML(subtitle)}</p>`} </hgroup> ${(cta1Text || cta2Text) && renderTemplate`<div${addAttribute([ctaContainerClass], "class:list")}> ${cta1Text && cta1Link && renderTemplate`<a${addAttribute(cta1Link, "href")}${addAttribute([cta1Class], "class:list")}${addAttribute(cta1AriaLabel, "aria-label")}> ${cta1IconSvg && cta1IconPosition === "before" && renderTemplate`<svg${addAttribute([iconBaseClass, "mr-2"], "class:list")} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(cta1IconSvg, "d")}></path> </svg>`} <span>${unescapeHTML(cta1Text)}</span> ${cta1IconSvg && cta1IconPosition === "after" && renderTemplate`<svg${addAttribute([
    iconBaseClass,
    "ml-2",
    cta1Class?.includes("group") ? "group-hover:translate-x-1" : ""
  ], "class:list")} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(cta1IconSvg, "d")}></path> </svg>`} </a>`} ${cta2Text && cta2Link && renderTemplate`<a${addAttribute(cta2Link, "href")}${addAttribute([cta2Class], "class:list")}${addAttribute(cta2AriaLabel, "aria-label")}> ${cta2IconSvg && cta2IconPosition === "before" && renderTemplate`<svg${addAttribute([iconBaseClass, "mr-2"], "class:list")} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(cta2IconSvg, "d")}></path> </svg>`} <span>${unescapeHTML(cta2Text)}</span> ${cta2IconSvg && cta2IconPosition === "after" && renderTemplate`<svg${addAttribute([
    iconBaseClass,
    "ml-2",
    cta2Class?.includes("group") ? "group-hover:translate-x-1" : ""
  ], "class:list")} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(cta2IconSvg, "d")}></path> </svg>`} </a>`} </div>`} ${renderSlot($$result, $$slots["default"])}  ${showScrollIndicator && renderTemplate`<div${addAttribute([scrollIndicatorContainerClass], "class:list")}> <div${addAttribute([scrollIndicatorOuterClass], "class:list")} aria-hidden="true"> <div${addAttribute([scrollIndicatorInnerClass], "class:list")}></div> </div> </div>`} </div> </header>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/BaseHero.astro", void 0);

const $$Astro$c = createAstro("https://your-blog.com");
const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$HeroSection;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const title = `${t("home.hero.mainTitle")}`;
  const subtitle = t("home.hero.description");
  const cta1Text = t("home.hero.startReading");
  const cta1Link = getLocalizedPath("/blog", lang);
  const cta1IconSvg = "M13 7l5 5m0 0l-5 5m5-5H6";
  const cta1AriaLabel = "Start reading blog articles";
  const cta2Text = t("home.hero.exploreContent");
  const cta2Link = getLocalizedPath("/search", lang);
  const cta2IconSvg = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z";
  const cta2AriaLabel = "Explore blog content";
  return renderTemplate`${renderComponent($$result, "BaseHero", $$BaseHero, { "title": title, "subtitle": subtitle, "cta1Text": cta1Text, "cta1Link": cta1Link, "cta1IconSvg": cta1IconSvg, "cta1AriaLabel": cta1AriaLabel, "cta1Class": "group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25", "cta2Text": cta2Text, "cta2Link": cta2Link, "cta2IconSvg": cta2IconSvg, "cta2AriaLabel": cta2AriaLabel, "cta2Class": "group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-white dark:hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-all duration-300 hover:scale-105", "showDecorativeElements": true, "showScrollIndicator": true, "sectionClass": "relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden", "titleClass": "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-slate-900 dark:text-white", "subtitleClass": "max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed" })}`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/sections/HeroSection.astro", void 0);

const $$Astro$b = createAstro("https://your-blog.com");
const $$FeatureCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$FeatureCard;
  const { title, description, link, iconGradientFrom, iconGradientTo } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="FeatureCard" class="group relative p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"> <div${addAttribute(`absolute top-6 right-6 w-12 h-12 bg-gradient-to-br ${iconGradientFrom} ${iconGradientTo} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`, "class")}> ${renderSlot($$result, $$slots["icon"])} </div> <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"> ${title} </h2> <p class="text-slate-600 dark:text-slate-400 leading-relaxed"> ${description} </p> ${link && renderTemplate`<div class="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform"> <span class="text-sm">Learn more</span> <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path> </svg> </div>`} </div>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeatureCard.astro", void 0);

const $$Astro$a = createAstro("https://your-blog.com");
const $$FeaturesSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$FeaturesSection;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  return renderTemplate`${maybeRenderHead()}<section class="py-24 bg-slate-50 dark:bg-slate-800"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <header class="text-center mb-16"> <h2 class="text-5xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4"> ${t("home.features.sectionTitle")} </h2> <p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"> ${t("home.features.sectionSubtitle")} </p> </header> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.fast.title"), "description": t("home.features.fast.fullDescription"), "iconGradientFrom": "from-blue-500", "iconGradientTo": "to-indigo-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.multilang.title"), "description": t("home.features.multilang.fullDescription"), "iconGradientFrom": "from-purple-500", "iconGradientTo": "to-pink-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.easyManage.title"), "description": t("home.features.easyManage.fullDescription"), "iconGradientFrom": "from-green-500", "iconGradientTo": "to-emerald-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.accessibility.title"), "description": t("home.features.accessibility.description"), "iconGradientFrom": "from-amber-500", "iconGradientTo": "to-orange-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.responsive.title"), "description": t("home.features.responsive.description"), "iconGradientFrom": "from-cyan-500", "iconGradientTo": "to-sky-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.seo.title"), "description": t("home.features.seo.description"), "iconGradientFrom": "from-fuchsia-500", "iconGradientTo": "to-violet-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.secure.title"), "description": t("home.features.secure.description"), "iconGradientFrom": "from-red-500", "iconGradientTo": "to-rose-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.analytics.title"), "description": t("home.features.analytics.description"), "iconGradientFrom": "from-lime-500", "iconGradientTo": "to-teal-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg>` })} ${renderComponent($$result, "FeatureCard", $$FeatureCard, { "title": t("home.features.community.title"), "description": t("home.features.community.description"), "iconGradientFrom": "from-violet-500", "iconGradientTo": "to-purple-600" }, { "icon": ($$result2) => renderTemplate`<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg>` })} </div> </div> </section>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/sections/FeaturesSection.astro", void 0);

const $$Astro$9 = createAstro("https://your-blog.com");
const $$FeaturedPostImage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$FeaturedPostImage;
  const { heroImage, index } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Picture", $$Picture, { "src": heroImage || "/images/placeholder-hero.svg", "alt": "", "width": 800, "height": 600, "class": "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", "loading": index > 1 ? "lazy" : "eager", "decoding": "async", "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px" })}`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard/FeaturedPostImage.astro", void 0);

const $$FeaturedPostOverlay = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent transition-all duration-500 group-hover:from-gray-900/70 group-hover:via-gray-900/30 dark:from-gray-950/80 dark:via-gray-950/40 dark:group-hover:from-gray-950/70 dark:group-hover:via-gray-950/30"></div>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard/FeaturedPostOverlay.astro", void 0);

const $$Astro$8 = createAstro("https://your-blog.com");
const $$PostMeta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$PostMeta;
  const { post, authorImage, authorSlug } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center text-left gap-3 sm:gap-1 text-sm sm:text-xs text-blue-200"> <a${addAttribute(`/authors/${authorSlug}`, "href")} class="flex items-center gap-1.5 font-medium group-author"> <div class="relative w-8 h-8 rounded-full overflow-hidden border-2 border-transparent group-hover/author:border-blue-400 transition-colors duration-300 avatar-gradient"> <img${addAttribute(authorImage || "/images/placeholder-hero.svg", "src")}${addAttribute(post.data.author, "alt")} class="absolute inset-0 w-full h-full object-cover rounded-full"> </div> <span class="group-hover/author:text-blue-300 transition-colors duration-300"> ${post.data.author} </span> </a> <span class="h-1 w-1 rounded-full bg-blue-200" aria-hidden="true"></span> <time${addAttribute(new Date(post.data.pubDate).toISOString(), "datetime")} class="flex items-center gap-1.5 text-blue-200/80 font-light"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path> </svg> ${new Date(post.data.pubDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })} </time> </div>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard/PostMeta.astro", void 0);

const $$Astro$7 = createAstro("https://your-blog.com");
const $$PostTitle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$PostTitle;
  const { post, index } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<h2${addAttribute(`featured-post-title-${post.slug}`, "id")}${addAttribute(["font-bold leading-tight text-white mb-3", [
    index === 0 ? "text-2xl sm:text-3xl md:text-3xl lg:text-4xl lg:leading-[1.2]" : "text-xl sm:text-2xl md:text-xl lg:leading-[1.3]"
  ]], "class:list")}${addAttribute(index === 0 ? 1 : 2, "aria-level")}> <a${addAttribute(`/blog/${post.slug}`, "href")} class="hover:text-primary-200 focus:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"${addAttribute(`featured-post-desc-${post.slug}`, "aria-describedby")}> ${post.data.title} </a> </h2>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard/PostTitle.astro", void 0);

const $$Astro$6 = createAstro("https://your-blog.com");
const $$PostDescription = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$PostDescription;
  const { post, index } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<p${addAttribute(["text-blue-100 leading-relaxed", [
    index === 0 ? "text-base sm:text-lg md:text-xl max-w-2xl" : "text-sm sm:text-base md:text-lg"
  ]], "class:list")}> ${post.data.description} </p>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard/PostDescription.astro", void 0);

const $$Astro$5 = createAstro("https://your-blog.com");
const $$PostTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$PostTags;
  const { tags = [] } = Astro2.props;
  return renderTemplate`${tags.length > 0 && renderTemplate`${maybeRenderHead()}<div class="flex flex-wrap gap-2 pt-3">${tags.slice(0, 3).map((tag) => renderTemplate`<a${addAttribute(`/blog/tags/${tag.toLowerCase()}`, "href")} class="inline-flex items-center px-3 py-1 text-xs font-medium transition-colors hover:bg-white/30 bg-white/20 backdrop-blur-sm rounded-full sm:px-4 sm:py-2 sm:text-sm"${addAttribute(`View all posts tagged ${tag}`, "aria-label")}>${tag}</a>`)}</div>`}`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard/PostTags.astro", void 0);

const $$Astro$4 = createAstro("https://your-blog.com");
const $$FeaturedPostContent = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$FeaturedPostContent;
  const { post, index, authorImage, authorSlug } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative flex h-full flex-col justify-end text-white p-6 sm:p-8 md:p-10 lg:p-12"> <div class="z-10 space-y-3"> ${renderComponent($$result, "PostMeta", $$PostMeta, { "post": post, "authorImage": authorImage, "authorSlug": authorSlug })} ${renderComponent($$result, "PostTitle", $$PostTitle, { "post": post, "index": index })} ${renderComponent($$result, "PostDescription", $$PostDescription, { "post": post, "index": index })} ${renderComponent($$result, "PostTags", $$PostTags, { "tags": post.data.tags })} </div> </div>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard/FeaturedPostContent.astro", void 0);

const $$Astro$3 = createAstro("https://your-blog.com");
const $$FeaturedPostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$FeaturedPostCard;
  const { post, index, authorImage, authorSlug } = Astro2.props;
  const postUrl = `/${post.slug}`;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(`featured-post-${post.slug}`, "id")}${addAttribute(["group relative h-64 sm:h-80 overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-800/50 md:h-[400px] lg:h-[600px]", [index === 0 && "lg:col-span-2 lg:row-span-2"]], "class:list")}${addAttribute(`featured-post-title-${post.slug}`, "aria-labelledby")}> ${renderComponent($$result, "FeaturedPostImage", $$FeaturedPostImage, { "heroImage": post.data.heroImage, "index": index })} ${renderComponent($$result, "FeaturedPostOverlay", $$FeaturedPostOverlay, {})} ${renderComponent($$result, "FeaturedPostContent", $$FeaturedPostContent, { "post": post, "index": index, "authorImage": authorImage, "authorSlug": authorSlug })} <a${addAttribute(postUrl, "href")} class="absolute inset-0 z-20"${addAttribute(`featured-post-title-${post.slug}`, "aria-labelledby")}></a> </article>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/cards/FeaturedPostCard.astro", void 0);

const $$Astro$2 = createAstro("https://your-blog.com");
const $$FeaturedStoriesSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$FeaturedStoriesSection;
  const { latestPosts } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const allAuthors = await getCollection("authors");
  const getAuthorDetails = (authorSlug) => {
    return allAuthors.find(
      (author) => author.slug === authorSlug
    );
  };
  return renderTemplate`${maybeRenderHead()}<section id="FeaturedStoriesSection" class="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-300" aria-labelledby="featured-stories-heading"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <header class="text-center mb-12 sm:mb-16"> <h2 id="featured-stories-heading" class="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6"> ${t("home.featuredStories.title")} </h2> <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"> ${t("home.featuredStories.subtitle")} </p> </header> ${latestPosts.length > 0 && renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16"> ${latestPosts.map((post, index) => {
    const author = getAuthorDetails(post.data.author);
    const authorImage = post.data.authorImage || "/images/placeholder-hero.svg";
    const authorSlug = author?.slug || "admin";
    return renderTemplate`${renderComponent($$result, "FeaturedPostCard", $$FeaturedPostCard, { "post": post, "index": index, "authorImage": authorImage, "authorSlug": authorSlug })}`;
  })} </div>`} <div class="text-center"> <a${addAttribute(getLocalizedPath("/blog", lang), "href")} class="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white/90 dark:text-slate-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:ring-offset-slate-900"> ${t("home.featuredStories.viewAll")} <svg aria-hidden="true" class="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path> </svg> </a> </div> </div> </section>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/sections/FeaturedStoriesSection.astro", void 0);

const $$Astro$1 = createAstro("https://your-blog.com");
const $$NewsletterForm = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$NewsletterForm;
  const {
    title,
    subtitle,
    emailPlaceholder = "Enter your email",
    buttonText = "Subscribe",
    buttonIconSvg = "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    formAction = "#",
    formMethod = "POST",
    showPrivacyNote = false,
    privacyNoteText = "We respect your privacy. Unsubscribe at any time.",
    sectionClass = "py-16 bg-gray-50 dark:bg-gray-800",
    containerClass = "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
    titleClass = "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4",
    subtitleClass = "text-xl text-gray-600 dark:text-gray-300 mb-8",
    formClass = "flex flex-col sm:flex-row gap-4 max-w-md mx-auto",
    inputClass = "group text-wrap flex-1 mx-auto px-4 py-3 text-center md:text-left border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
    buttonClass = "w-full group text-wrap text-center sm:text-center mx-auto sm:mx-auto inline-flex justify-center sm:items-center items-center gap-3 px-auto py-4 bg-white text-blue-600 font-semibold text-lg rounded-2xl hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl",
    privacyNoteClass = "text-sm text-gray-500 dark:text-gray-400 mt-4",
    ...rest
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(sectionClass, "class")}${spreadAttributes(rest)}> <div${addAttribute(containerClass, "class")}> ${title && renderTemplate`<h2${addAttribute(titleClass, "class")}>${unescapeHTML(title)}</h2>`} ${subtitle && renderTemplate`<p${addAttribute(subtitleClass, "class")}>${unescapeHTML(subtitle)}</p>`} <form${addAttribute(formAction, "action")}${addAttribute(formMethod, "method")}${addAttribute(formClass, "class")}> <input type="email" name="email"${addAttribute(emailPlaceholder, "placeholder")}${addAttribute(inputClass, "class")} required> <button type="submit"${addAttribute(buttonClass, "class")}> ${buttonText} <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(buttonIconSvg, "d")}></path> </svg> </button> </form> ${showPrivacyNote && renderTemplate`<p${addAttribute(privacyNoteClass, "class")}>${privacyNoteText}</p>`} </div> </section>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/NewsletterForm.astro", void 0);

const $$Astro = createAstro("https://your-blog.com");
const $$NewsletterSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NewsletterSection;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const title = t("home.newsletter.title");
  const subtitle = t("home.newsletter.subtitle");
  const emailPlaceholder = t("home.newsletter.emailPlaceholder");
  const buttonText = t("home.newsletter.buttonText");
  const privacyNoteText = t("home.newsletter.privacyNote");
  return renderTemplate`${renderComponent($$result, "NewsletterForm", $$NewsletterForm, { "title": title, "subtitle": subtitle, "emailPlaceholder": emailPlaceholder, "buttonText": buttonText, "showPrivacyNote": true, "privacyNoteText": privacyNoteText, "sectionClass": "py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700", "containerClass": "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", "titleClass": "text-4xl sm:text-5xl font-bold text-white mb-6", "subtitleClass": "text-xl text-blue-100 max-w-2xl mx-auto mb-8", "formClass": "flex flex-col sm:flex-row gap-4 max-w-lg mx-auto", "inputClass": "flex-1 px-6 py-4 text-lg border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 transition-all duration-300", "buttonClass": "text-center inline-flex items-center gap-1 px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-2xl hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl", "privacyNoteClass": "text-sm text-blue-200 mt-8" })}`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/sections/NewsletterSection.astro", void 0);

export { $$HeroSection as $, $$FeaturesSection as a, $$FeaturedStoriesSection as b, $$NewsletterSection as c };
