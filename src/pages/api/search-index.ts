import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import EnterpriseSearchEngine from "../../features/search/EnterpriseSearchEngine";

export const GET: APIRoute = async () => {
  try {
    const allBlogPosts = await getCollection("blog", ({ data }) => {
      return !data.draft;
    });

    const documents = allBlogPosts.map((post) => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      content: post.body,
      tags: post.data.tags || [],
      url: `/${post.slug}`,
      pubDate: post.data.pubDate,
      author: post.data.author,
      lang: post.slug.split('/')[0], // Assuming slug format like 'en/blog/post-title'
      slug: post.slug.split('/').slice(2).join('/'), // Get everything after 'en/blog/'
    }));

    const searchEngine = new EnterpriseSearchEngine();
    searchEngine.indexDocuments(documents);

    // For simplicity, we're re-indexing on each request.
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
