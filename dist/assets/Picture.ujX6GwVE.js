;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b9db21cc-1048-4807-af61-4fcf1506c200",e._sentryDebugIdIdentifier="sentry-dbid-b9db21cc-1048-4807-af61-4fcf1506c200")}catch(e){}}();import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, a as renderTemplate } from './astro/server.Ib_pSZqu.js';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://your-blog.com");
const $$Picture = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    width,
    height,
    class: className = "",
    loading = "lazy",
    decoding = "async",
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  } = Astro2.props;
  const isExternalImage = src.startsWith("http");
  const getImageUrl = (originalSrc, format) => {
    if (isExternalImage) return null;
    const ext = originalSrc.split(".").pop();
    return originalSrc.replace(`.${ext}`, `.${format}`);
  };
  const avifSrc = getImageUrl(src, "avif");
  const webpSrc = getImageUrl(src, "webp");
  return renderTemplate`${maybeRenderHead()}<picture> ${avifSrc && renderTemplate`<source${addAttribute(avifSrc, "srcset")} type="image/avif"${addAttribute(sizes, "sizes")}>`} ${webpSrc && renderTemplate`<source${addAttribute(webpSrc, "srcset")} type="image/webp"${addAttribute(sizes, "sizes")}>`} <img${addAttribute(src, "src")}${addAttribute(alt, "alt")}${addAttribute(width, "width")}${addAttribute(height, "height")}${addAttribute(className, "class")}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}> </picture>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/Picture.astro", void 0);

export { $$Picture as $ };
