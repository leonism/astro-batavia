import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export async function getSearchSuggestions(
  query: string,
  lang: string = "en",
  limit: number = 5
): Promise<string[]> {
  try {
    if (query.length < 2) return [];

    const allPosts = await getCollection("blog", ({ id, data }) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const suggestions = new Set<string>();
    const lowerCaseQuery = query.toLowerCase();

    allPosts.forEach((post) => {
      if (post.data.title.toLowerCase().includes(lowerCaseQuery)) {
        suggestions.add(post.data.title);
      }
      if (post.data.description.toLowerCase().includes(lowerCaseQuery)) {
        suggestions.add(post.data.description);
      }
      (post.data.tags || []).forEach((tag) => {
        if (tag.toLowerCase().includes(lowerCaseQuery)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  } catch (error) {
    console.error("Get search suggestions error:", error);
    return [];
  }
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const lang = url.searchParams.get("lang") || "en";
  const limit = parseInt(url.searchParams.get("limit") || "5");

  try {
    const suggestions = await getSearchSuggestions(query, lang, limit);
    return new Response(JSON.stringify(suggestions), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get search suggestions" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
