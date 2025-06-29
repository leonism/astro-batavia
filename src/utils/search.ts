export interface SearchResult {
  url: string;
  title: string;
  description: string;
  pubDate: string; // Or Date, depending on API response
  tags?: string[];
  [key: string]: any; // Allow other properties if the API returns more
}

export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.error('Search API error:', response.status, response.statusText);
      return [];
    }
    const results: SearchResult[] = await response.json();
    return results;
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    return [];
  }
}
