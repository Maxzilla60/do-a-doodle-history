---js
{
title: 'What are the nerdy details of this website?',
order: 4,
buildDate: new Intl.DateTimeFormat(
'en-US',
{ dateStyle: 'full' },
).format(new Date()),
}
---
- A static site built with [Eleventy](https://www.11ty.dev)
- Hosted for free on [Netlify](https://netlify.com)
- Base stylesheet is [Doodle CSS](https://github.com/chr15m/DoodleCSS)
- Source code can be found on [GitHub](https://github.com/Maxzilla60/do-a-doodle-history)
- Was last updated on _{{ buildDate }}_
