interface LoadMoreContext {
	button: HTMLButtonElement;
	container: HTMLElement;
	totalPages: number;
	lang: string;
}

export function initializeBlogIndex(totalPages: number, lang: string) {
	const button = document.getElementById('load-more') as HTMLButtonElement | null;
	const container = document.getElementById('posts-container') as HTMLElement | null;

	if (!button || !container) return;

	const context: LoadMoreContext = {
		button,
		container,
		totalPages,
		lang,
	};

	attachLoadMore(context);
}

function attachLoadMore({ button, container, totalPages, lang }: LoadMoreContext) {
	let currentPage = 1;

	button.addEventListener('click', async () => {
		const originalText = button.innerHTML;
		button.disabled = true;
		button.innerHTML = `
			<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			Loading...
		`;

		try {
			currentPage++;
			const response = await fetch(`/api/get-posts?page=${currentPage}&lang=${lang}`);

			if (!response.ok) throw new Error('Failed to fetch posts');

			const html = await response.text();
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = html;

			const newPosts = Array.from(tempDiv.querySelectorAll('.post-item')) as HTMLElement[];
			newPosts.forEach((post) => {
				post.classList.add('animate-fade-in');
				container.appendChild(post);
			});

			if (currentPage >= totalPages) {
				button.style.display = 'none';
			}
		} catch (error) {
			console.error('Error loading more posts:', error);
			alert('Failed to load more articles. Please try again.');
		} finally {
			button.disabled = false;
			button.innerHTML = originalText;
		}
	});
}

if (typeof window !== 'undefined') {
	(window as any).initializeBlogIndex = initializeBlogIndex;
}

