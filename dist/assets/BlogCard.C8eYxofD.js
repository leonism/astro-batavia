;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="08f829de-7200-4c60-83c5-fff92f45183a",e._sentryDebugIdIdentifier="sentry-dbid-08f829de-7200-4c60-83c5-fff92f45183a")}catch(e){}}();import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderComponent, a as renderTemplate } from './astro/server.Ib_pSZqu.js';
import 'kleur/colors';
import { $ as $$Picture } from './Picture.ujX6GwVE.js';
import { f as formatDate, u as useTranslations } from './utils.D0MtOyzB.js';
/* empty css                                    */

const $$Astro = createAstro("https://your-blog.com");
const $$BlogCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogCard;
  const { post, lang, showExcerpt = true, isFeatured = false } = Astro2.props;
  const t = useTranslations(lang);
  const postUrl = `/${post.slug}`;
  const excerpt = showExcerpt ? post.data.description || post.body.slice(0, isFeatured ? 300 : 150) + "..." : "";
  const articleClasses = [
    "group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300",
    isFeatured ? "md:flex md:flex-row shadow-xl hover:shadow-2xl min-h-[400px]" : "hover:shadow-lg hover:scale-[1.02] min-h-[420px] max-h-[480px] flex flex-col"
  ].join(" ");
  const imageContainerClasses = [
    "overflow-hidden",
    isFeatured ? "md:w-1/2 md:aspect-auto h-96 md:h-full" : "h-72"
  ].join(" ");
  const imageClasses = [
    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
    isFeatured ? "md:rounded-l-lg md:rounded-r-none" : ""
  ].join(" ");
  const contentClasses = [
    "p-6",
    isFeatured ? "md:w-1/2 md:flex md:flex-col md:justify-center" : "flex-1 flex flex-col"
  ].join(" ");
  const titleClasses = [
    "font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2",
    isFeatured ? "text-2xl md:text-3xl" : "text-xl"
  ].join(" ");
  const excerptClasses = [
    "text-gray-600 dark:text-gray-300 leading-relaxed mb-4",
    isFeatured ? "text-base line-clamp-4" : "text-sm line-clamp-3"
  ].join(" ");
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(articleClasses, "class")} data-astro-cid-fkyubztb> <!-- Hero Image --> ${post.data.heroImage && renderTemplate`<div${addAttribute(imageContainerClasses, "class")} data-astro-cid-fkyubztb> ${renderComponent($$result, "Picture", $$Picture, { "src": post.data.heroImage, "alt": post.data.title, "width": 600, "height": 400, "class": imageClasses, "loading": isFeatured ? "eager" : "lazy", "decoding": isFeatured ? "auto" : "async", "sizes": "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px", "data-astro-cid-fkyubztb": true })} </div>`} <!-- Content --> <div${addAttribute(contentClasses, "class")} data-astro-cid-fkyubztb> <!-- Tags --> ${post.data.tags && post.data.tags.length > 0 && renderTemplate`<div${addAttribute(`flex flex-wrap gap-2 mb-3 ${isFeatured ? "md:mb-4" : ""}`, "class")} data-astro-cid-fkyubztb> ${post.data.tags.slice(0, 3).map((tag) => renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200" data-astro-cid-fkyubztb>
#${tag} </span>`)} ${post.data.tags.length > 3 && renderTemplate`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" data-astro-cid-fkyubztb>
+${post.data.tags.length - 3} </span>`} </div>`} <!-- Title --> <h2${addAttribute(titleClasses, "class")} data-astro-cid-fkyubztb> <a${addAttribute(postUrl, "href")} class="stretched-link" data-astro-cid-fkyubztb> ${post.data.title} </a> </h2> <!-- Excerpt --> ${showExcerpt && excerpt && renderTemplate`<p${addAttribute(excerptClasses, "class")} data-astro-cid-fkyubztb>${excerpt}</p>`} <!-- Meta Information --> <div class="flex-1" data-astro-cid-fkyubztb> <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4" data-astro-cid-fkyubztb> <div class="flex items-center space-x-3" data-astro-cid-fkyubztb> <!-- Author --> <div class="flex items-center" data-astro-cid-fkyubztb> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fkyubztb> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-astro-cid-fkyubztb></path> </svg> <span data-astro-cid-fkyubztb>${post.data.author}</span> </div> <!-- Published date --> <time${addAttribute(post.data.pubDate.toISOString(), "datetime")} class="flex items-center" data-astro-cid-fkyubztb> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fkyubztb> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fkyubztb></path> </svg> ${formatDate(post.data.pubDate, lang)} </time> </div> <!-- Reading time --> ${post.data.readingTime && renderTemplate`<div class="flex items-center" data-astro-cid-fkyubztb> <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fkyubztb> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fkyubztb></path> </svg> <span data-astro-cid-fkyubztb>${post.data.readingTime}</span> </div>`} </div> </div> <!-- Read more link --> <div class="mt-auto pt-4" data-astro-cid-fkyubztb> <a${addAttribute(postUrl, "href")} class="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 group" data-astro-cid-fkyubztb> ${t("blog.readMore")} <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fkyubztb> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-fkyubztb></path> </svg> </a> </div> </div> </article> `;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/blog/BlogCard.astro", void 0);

export { $$BlogCard as $ };
