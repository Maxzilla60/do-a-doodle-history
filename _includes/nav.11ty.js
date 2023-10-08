module.exports = function (data) {
	const menuItems = [
		{ title: '🏠 Welcome', slug: '' },
		{ title: '📅 Calendar View', slug: 'calendar' },
		{ title: '🗄️ Table View', slug: 'table' }, ,
	];

	return `<nav>${
		menuItems
			.map(i => renderItem(i, data.page.fileSlug))
			.join('')
	}</nav>`;
};

function renderItem(item, currentSlug) {
	if (currentSlug === item.slug) {
		return `<a>${item.title}</a>`;
	}
	return `<a href="/${item.slug}">${item.title}</a>`;
}
