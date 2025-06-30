import { getCollection, type CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";

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

// Advanced search with filters
export interface SearchFilters {
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  author?: string;
  sortBy?: "date" | "title" | "relevance";
  sortOrder?: "asc" | "desc";
}

export async function advancedSearch(
  query: string,
  filters: SearchFilters = {},
  lang: string = "en"
): Promise<SearchResult[]> {
  try {
    const allPosts = await getCollection(
      "blog",
      ({ id, data }: { id: string; data: { draft: boolean } }) => {
        return id.startsWith(`${lang}/`) && !data.draft;
      }
    );

    let filteredPosts = allPosts;

    // Apply text search
    if (query.trim()) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<"blog">) => {
        const searchText = `${post.data.title} ${post.data.description} ${(
          post.data.tags || []
        ).join(" ")}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<"blog">) => {
        return filters.tags!.some((tag) =>
          (post.data.tags || []).includes(tag)
        );
      });
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filteredPosts = filteredPosts.filter(
        (post: CollectionEntry<"blog">) =>
          post.data.pubDate >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      filteredPosts = filteredPosts.filter(
        (post: CollectionEntry<"blog">) => post.data.pubDate <= filters.dateTo!
      );
    }

    // Apply author filter
    if (filters.author) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<"blog">) =>
        post.data.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    // Sort results
    const sortBy = filters.sortBy || "date";
    const sortOrder = filters.sortOrder || "desc";

    filteredPosts.sort(
      (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) => {
        let comparison = 0;

        switch (sortBy) {
          case "title":
            comparison = a.data.title.localeCompare(b.data.title);
            break;
          case "date":
            comparison = a.data.pubDate.getTime() - b.data.pubDate.getTime();
            break;
          case "relevance":
            // Simple relevance scoring based on query matches in title vs description
            const aTitle = a.data.title.toLowerCase();
            const bTitle = b.data.title.toLowerCase();
            const queryLower = query.toLowerCase();

            const aScore =
              (aTitle.includes(queryLower) ? 2 : 0) +
              (a.data.description.toLowerCase().includes(queryLower) ? 1 : 0);
            const bScore =
              (bTitle.includes(queryLower) ? 2 : 0) +
              (b.data.description.toLowerCase().includes(queryLower) ? 1 : 0);

            comparison = bScore - aScore;
            break;
        }

        return sortOrder === "desc" ? -comparison : comparison;
      }
    );

    return filteredPosts.map((post: CollectionEntry<"blog">) => ({
      title: post.data.title,
      description: post.data.description,
      url: `/${lang}/blog/${post.slug.replace(`${lang}/`, "")}`, // All URLs now include /lang/ prefix
      pubDate: formatSearchDate(post.data.pubDate),
      tags: post.data.tags,
      lang: lang,
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Advanced search error:", error);
    return [];
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { query, filters, lang } = await request.json();
    const results = await advancedSearch(
      query || "",
      filters || {},
      lang || "en"
    );
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to perform advanced search" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
