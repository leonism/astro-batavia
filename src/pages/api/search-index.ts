import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostUrl } from "@/i18n/utils";
import EnterpriseSearchEngine from "../../features/search/EnterpriseSearchEngine";

export const GET: APIRoute = async () => {
  try {
    const allBlogPosts = await getCollection("blog", ({ data }) => {
      return !data.draft;
    });

    const documents = allBlogPosts.map((post) => {
      const lang = post.slug.split('/')[0];
      return {
        id: post.id,
        title: post.data.title,
        description: post.data.description,
        content: post.body,
        tags: post.data.tags || [],
        url: getPostUrl(post.slug, lang),
        pubDate: post.data.pubDate,
        author: post.data.author,
        lang: lang,
        slug: post.slug.split('/').slice(1).join('/'),
        heroImage: post.data.heroImage,
      };
    });

    // In a production environment, you'd want to pre-build this index
    // or use a persistent search service.

    return new Response(JSON.stringify(documents), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating search index:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate search index" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
