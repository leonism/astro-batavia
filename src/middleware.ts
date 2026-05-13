import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Handle /en/ to root
  if (pathname === '/en' || pathname === '/en/') {
    return context.redirect('/', 301);
  }

  return next();
});
