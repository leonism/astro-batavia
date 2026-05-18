import { defineMiddleware } from 'astro:middleware';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const acceptHeader = context.request.headers.get('accept') || '';

  // Handle /en/ to root
  if (pathname === '/en' || pathname === '/en/') {
    return context.redirect('/', 301);
  }

  // Check if agent is requesting markdown
  if (acceptHeader.includes('text/markdown')) {
    const response = await next();

    // Only process successful HTML responses
    const contentType = response.headers.get('content-type') || '';
    if (response.status === 200 && contentType.includes('text/html')) {
      // Clone the response so we can read the text without consuming the original body
      const html = await response.clone().text();

      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });

      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Extract content for markdown
      let contentNode = document.querySelector('main');
      if (!contentNode) {
        contentNode = document.body;
      }

      // Cleanup unwanted elements to keep the markdown clean
      const unwantedSelectors = [
        'nav',
        'footer',
        'script',
        'style',
        'noscript',
        '.no-print',
        '#cookie-banner',
        '[role="navigation"]',
        'aside',
        '.sr-only', // Skip screen reader only content
      ];
      unwantedSelectors.forEach((selector) => {
        contentNode?.querySelectorAll(selector).forEach((el: Element) => el.remove());
      });

      const markdown = turndownService.turndown(contentNode?.innerHTML || '');

      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': response.headers.get('Cache-Control') || 'public, max-age=3600',
          'Vary': 'Accept', // Tell caches that the response depends on the Accept header
        },
      });
    }
    
    return response;
  }

  return next();
});

