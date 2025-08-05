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
      url: `/blog/${post.slug}`,
      pubDate: post.data.pubDate,
      author: post.data.author,
      category: post.data.category,
      lang: post.slug.split('/')[0], // Assuming slug format like 'en/post-title'
      slug: post.slug,
      readingTime: post.data.readingTime,
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
