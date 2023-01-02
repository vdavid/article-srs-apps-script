const article = {
    url: 'https://example.com/2',
    originalUrl: 'https://example.com/1',
    isUrlDead: false,
    readDate: new Date('2021-01-01'),
    title: 'Title 1',
    tags: ['tag1', 'tag2'],
    characterCount: 100,
    wordCount: 10,
    language: 'en' as Article['language'],
    authors: ['Author 1', 'Author 2'],
    publicationDate: new Date('1999-01-01'),
    minutes: 5,
    rating: 8,
    review: 'Review test',
    category: 'Test category',
}

describe('convertArticleToHtml', () => {
    it('converts a simple article to HTML', () => {
        const html = ArticleEmailSender.convertArticleToHtml(article)

        const expectedHtml = `<li class="rating8">🇺🇸
  <strong><a href="https://example.com/1">Title 1</a></strong> <em>by Author 1, Author 2</em> (1999-01-01, 5 minutes)<br />
  Review test<br />
  <em>(Read date: 2021-01-01, Rating: 8 / 10)</em> — <a class="pocketLink" href="https://getpocket.com/edit?url=https://example.com/1">Add to Pocket</a>
</li>
`

        expect(html).toEqual(expectedHtml)
    })

    it('displays broken links well', () => {
        const article2 = { ...article, isUrlDead: true }

        const html = ArticleEmailSender.convertArticleToHtml(article2)

        const expectedHtml = `<li class="rating8">🇺🇸
  <strong>Title 1</strong> <em>by Author 1, Author 2</em> (<a href="https://example.com/1">dead link</a>, 1999-01-01, 5 minutes)<br />
  Review test<br />
  <em>(Read date: 2021-01-01, Rating: 8 / 10)</em> — <a class="pocketLink" href="https://getpocket.com/edit?url=https://example.com/1">Add to Pocket</a>
</li>
`

        expect(html).toEqual(expectedHtml)
    })
})

describe('convertArticlesToHtml', () => {
    it('converts a list of articles to HTML', () => {
        const articles = [article, article, article]

        const htmlWithoutCSS = ArticleEmailSender.convertArticlesToHtml(articles).replace(
            /<style>[\S\s]*?<\/style>/,
            '<style></style>'
        )

        const header = '<html lang="en"><head><style></style><title>Your daily article reviews</title></head><body>'
        const footer = '</body></html>'
        const articleHtml = ArticleEmailSender.convertArticleToHtml(article)

        const expectedHtmlBody = `<h2>${article.category}</h2>
<ul>
${articleHtml}${articleHtml}${articleHtml}
</ul>`

        expect(htmlWithoutCSS).toEqual(header + expectedHtmlBody + footer)
    })
})
