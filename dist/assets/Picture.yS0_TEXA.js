;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2dfe51f3-8eea-41ba-8cad-1595672a3747",e._sentryDebugIdIdentifier="sentry-dbid-2dfe51f3-8eea-41ba-8cad-1595672a3747")}catch(e){}}();import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, a as renderTemplate } from './astro/server.CrcP_Q54.js';
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
  const getImageUrl = (originalSrc, format) => {
    const ext = originalSrc.split(".").pop();
    return originalSrc.replace(`.${ext}`, `.${format}`);
  };
  const avifSrc = getImageUrl(src, "avif");
  const webpSrc = getImageUrl(src, "webp");
  return renderTemplate`${maybeRenderHead()}<picture> <source${addAttribute(avifSrc, "srcset")} type="image/avif"${addAttribute(sizes, "sizes")}> <source${addAttribute(webpSrc, "srcset")} type="image/webp"${addAttribute(sizes, "sizes")}> <img${addAttribute(src, "src")}${addAttribute(alt, "alt")}${addAttribute(width, "width")}${addAttribute(height, "height")}${addAttribute(className, "class")}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}> </picture>`;
}, "/Volumes/DATA/Astro/astro-batavia/src/components/ui/Picture.astro", void 0);

export { $$Picture as $ };
