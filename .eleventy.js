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
	// Add build date to global config
	eleventy.addGlobalData('buildDate', () => {
		return new Intl.DateTimeFormat(
			'en-US',
			{ dateStyle: 'full' },
		).format(new Date());
	});
	// Custom sorting for pages (nav) collection
	eleventy.addCollection('nav', sortByOrderField('nav'));
	// Custom sorting for questions (faq) collection
	eleventy.addCollection('faq', sortByOrderField('faq'));
	// Add shortcodes & filters
	eleventy.addFilter('emoji-number', emojiNumber);
	eleventy.addFilter('prompt-amount', promptsAmount);
	eleventy.addFilter('prompt-recent-three', recentThree);
	eleventy.addFilter('prompt-calendar-group', groupPromptsForCalendar);
	eleventy.addFilter('prompt-table-group', groupPromptsForTable);
};

function sortByOrderField(tagName) {
	return function (collection) {
		return collection
			.getFilteredByTag(tagName)
			.sort((a, b) => a.data.order - b.data.order);
	};
}

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

function groupPromptsForCalendar(prompts) {
	function getMonth(date) {
		return date.toLocaleString('default', { month: 'long' });
	}

	return _groupPrompts(prompts, getMonth);
}

function groupPromptsForTable(prompts) {
	function getMonth(date) {
		return date
			.toLocaleString('default', { month: 'long' })
			.toUpperCase()
			.slice(0, 3);
	}

	const grouped = _groupPrompts(prompts, getMonth);

	for (const yearEntry of grouped) {
		yearEntry.months.reverse();
	}
	grouped.reverse();

	return grouped;
}

function _groupPrompts(prompts, getMonth) {
	function getYear(date) {
		return date.toLocaleString('default', { year: 'numeric' });
	}

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
	return grouped;
}
