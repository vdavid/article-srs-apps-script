import { Article } from './Code'

export namespace ArticleEmailSender {
    export function convertArticlesToHtml(articles: Article[]): string {
        const body =
            articles.reduce(
                (acc, article) => {
                    const categoryHeader =
                        article.category === acc.lastCategory
                            ? ''
                            : (acc.lastCategory ? '</ul>\n' : '') + getCategoryHeader(article.category)

                    return {
                        html: acc.html + categoryHeader + convertArticleToHtml(article),
                        lastCategory: article.category,
                    }
                },
                { html: '', lastCategory: '' }
            ).html + '\n</ul>'

        return assembleEmailHeader() + body + assembleEmailFooter()
    }

    export function assembleEmailHeader(): string {
        const css =
            '    li { list-style:none; margin-left:0; border-left:4px solid; padding-left:5px; margin-bottom:2px; }\n' +
            'li.rating1 { border-left-color:#cc4125; }\n' +
            'li.rating2 { border-left-color:#D86735; }\n' +
            'li.rating3 { border-left-color:#E58D45; }\n' +
            'li.rating4 { border-left-color:#F2B355; }\n' +
            'li.rating5 { border-left-color:#ffd966; }\n' +
            'li.rating6 { border-left-color:#D8D57C; }\n' +
            'li.rating7 { border-left-color:#D4D16F; }\n' +
            'li.rating8 { border-left-color:#BFCD73; }\n' +
            'li.rating9 { border-left-color:#A9C978; }\n' +
            'li.rating10 { border-left-color:#93c47d; }\n'

        return '<html lang="en"><head><style>' + css + '</style><title>Your daily article reviews</title></head><body>'
    }

    function getCategoryHeader(category: string): string {
        return `<h2>${category.charAt(0).toUpperCase()}${category.slice(1)}</h2>
<ul>
`
    }

    export function convertArticleToHtml(article: Article): string {
        /* Pre-formats parts of the line of data */
        const flag = article.language === 'en' ? '🇺🇸' : '🇭🇺'
        const title = article.isUrlDead
            ? `<strong>${escapeHtml(article.title)}</strong>`
            : `<strong><a href="${article.url}">${escapeHtml(article.title)}</a></strong>`
        const authorInfo = article.authors[0] ? ` <em>by ${article.authors.join(', ')}</em>` : ''

        const objectiveProperties = []
        if (article.isUrlDead) {
            objectiveProperties.push(`<a href="${article.url}">dead link</a>`)
        }
        if (article.publicationDate) {
            objectiveProperties.push(article.publicationDate.toISOString().slice(0, 10))
        }
        if (article.minutes) {
            objectiveProperties.push(`${article.minutes} minutes`)
        }
        const subjectiveProperties = [
            'Read date: ' + article.readDate.toISOString().slice(0, 10),
            `Rating: ${article.rating} / 10`,
        ]

        const pocketUrl = 'https://getpocket.com/edit?url=' + article.url

        /* Assembles <li> */
        return `<li class="rating${article.rating}">${flag}
  ${title}${authorInfo}${objectiveProperties.length ? ' (' + objectiveProperties.join(', ') + ')' : ''}<br />
  ${escapeHtml(article.review)}<br />
  <em>(${subjectiveProperties.join(', ')})</em> — <a class="pocketLink" href="${pocketUrl}">Add to Pocket</a>
</li>
`
    }

    function assembleEmailFooter(): string {
        return '</body></html>'
    }

    function escapeHtml(string: string): string {
        return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    export function sendEmail(recipientEmails: string[], body: string): void {
        const senderName = 'Article SRS bot'
        const subject = '[Article digest] Your daily article reviews for ' + new Date().toISOString().slice(0, 10)
        MailApp.sendEmail('', subject, '', {
            name: senderName,
            htmlBody: body,
            bcc: recipientEmails.join(','),
        })
    }
}
