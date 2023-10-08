const { EleventyRenderPlugin } = require('@11ty/eleventy');
const markdownIt = require('markdown-it');

module.exports = (eleventy) => {
	// Add render plugin
	eleventy.addPlugin(EleventyRenderPlugin);
	// Add static files
	eleventy.addPassthroughCopy('public/**');
	// Render links in Markdown
	eleventy.setLibrary('md', markdownIt({
		linkify: true,
	}));
	// Custom sorting for pages (nav) collection
	eleventy.addCollection('nav', function (collection) {
		return collection
			.getFilteredByTag('nav')
			.sort((a, b) => a.data.order - b.data.order);
	});
	// Add shortcodes & filters
	eleventy.addFilter('emoji-number', emojiNumber);
	eleventy.addFilter('prompt-amount', promptsAmount);
	eleventy.addFilter('prompt-recent-three', recentThree);
	eleventy.addFilter('prompt-calendar-group', (prompts) => groupPrompts(prompts, false));
	eleventy.addFilter('prompt-table-group', (prompts) => groupPrompts(prompts, true));
};

function emojiNumber(number) {
	function digitToEmoji(digit) {
		switch (digit) {
			case '0':
				return '0️⃣';
			case '1':
				return '1️⃣';
			case '2':
				return '2️⃣';
			case '3':
				return '3️⃣';
			case '4':
				return '4️⃣';
			case '5':
				return '5️⃣';
			case '6':
				return '6️⃣';
			case '7':
				return '7️⃣';
			case '8':
				return '8️⃣';
			case '9':
				return '9️⃣';
		}
	}

	const emoji = `${number}`
		.split('')
		.map(digitToEmoji)
		.join('');
	return `<span aria-label="${number}" title="${number}">${emoji}</span>`;
}

function promptsAmount(prompts) {
	return emojiNumber(prompts.filter(p => p.data.permalink).length);
}

function recentThree(prompts) {
	return prompts
		.filter(a => !a.data.skipped)
		.sort((a, b) => b.date - a.date)
		.slice(0, 3);
}

function groupPrompts(prompts, reversed = false) {
	const grouped = [];
	for (const prompt of prompts) {
		const year = getYear(prompt.page.date);
		const month = getMonth(prompt.page.date);

		const yearEntry = grouped.find(entry => entry.year === year);
		if (!yearEntry) {
			grouped.push({
				year,
				months: [{
					month,
					prompt,
				}],
			});
		} else {
			yearEntry.months.push({
				month,
				prompt,
			});
		}
	}

	if (reversed) {
		for (const yearEntry of grouped) {
			yearEntry.months.reverse();
		}
		grouped.reverse();
	}
	return grouped;

	function getYear(date) {
		return date.toLocaleString('default', { year: 'numeric' });
	}

	function getMonth(date) {
		return date.toLocaleString('default', { month: 'long' });
	}
}
