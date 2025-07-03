import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  pubDate: string;
  tags?: string[];
  lang: string;
  slug: string;
}

function formatSearchDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Server-side search API implementation
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const lang = url.searchParams.get("lang") || "en";

  // In a real implementation, this would be replaced with Algolia or another search service, for now, we'll do a simple client-side search
  try {
    const allPosts = await getCollection("blog", ({ id, data }: CollectionEntry<"blog">) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const filteredPosts = allPosts
      .filter((post: CollectionEntry<"blog">) => {
        const searchText = `${post.data.title} ${post.data.description} ${
          (post.data.tags || []).join(" ")
        }`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
      .sort(
        (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
          b.data.pubDate.getTime() - a.data.pubDate.getTime()
      );

    const results = filteredPosts.map(
      (post: CollectionEntry<"blog">) => ({
        title: post.data.title,
        description: post.data.description,
        url: `/${lang}/blog/${post.slug.replace(new RegExp(`^${lang}\/blog\/`), "")}`, // All URLs now include /lang/ prefix
        pubDate: formatSearchDate(post.data.pubDate),
        tags: post.data.tags,
        lang: lang,
        slug: post.slug,
      })
    );

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
