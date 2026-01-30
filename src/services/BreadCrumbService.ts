import { removeLocaleFromPath, getLocalizedPath, useTranslations } from '@/i18n/utils';
import type { LanguageKey } from '@/i18n/types';

export interface BreadCrumbItem {
  name: string;
  url: string;
  isLast: boolean;
}

/**
 * Service for handling breadcrumb logic.
 * Encapsulates logic for generating breadcrumb items based on the current path.
 */
export class BreadCrumbService {
  /**
   * Generates breadcrumb items for a given path and language.
   *
   * @param {string} pathname - The current URL pathname.
   * @param {LanguageKey} lang - The current language key.
   * @returns {BreadCrumbItem[]} An array of breadcrumb items.
   */
  static getBreadCrumbs(pathname: string, lang: LanguageKey): BreadCrumbItem[] {
    const t = useTranslations(lang);
    const cleanPath = removeLocaleFromPath(pathname);
    const segments = cleanPath.split('/').filter(Boolean);

    const items: BreadCrumbItem[] = [];

    // Always add Home as the first item
    items.push({
      name: t('nav.home'),
      url: getLocalizedPath('/', lang),
      isLast: segments.length === 0,
    });

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Build the translation key (e.g., 'nav.blog', 'nav.services')
      const translationKey = `nav.${segment}` as any;
      let name = segment;

      // Try to translate using the nav key
      const translated = t(translationKey);
      if (translated !== translationKey) {
        name = translated;
      } else {
        // Fallback: format slug (e.g., "my-post" -> "My Post")
        name = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      // Avoid 404 for /blog/tags (it should not be clickable since it doesn't have an index page)
      const isTagsPath = segment === 'tags';
      const url = isTagsPath ? '' : getLocalizedPath(currentPath, lang);

      items.push({
        name,
        url,
        isLast,
      });
    });

    return items;
  }
}
