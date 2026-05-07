import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const normalizedPath =
    pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  // Explicitly handle redirects for non-localized root paths to their English versions
  const redirects: Record<string, string> = {
    '/search': '/en/search',
    '/blog': '/en/blog',
    '/services': '/en/services',
    '/about': '/en/about',
    '/contact': '/en/contact',
    '/terms': '/en/terms',
    '/privacy': '/en/privacy',
    '/cookies': '/en/cookies',
  };

  if (redirects[normalizedPath]) {
    return context.redirect(redirects[normalizedPath], 301);
  }

  // Handle /en/ to root
  if (pathname === '/en' || pathname === '/en/') {
    return context.redirect('/', 301);
  }

  return next();
});
