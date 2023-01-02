import { ArticleEmailSender } from './ArticleEmailSender'
import { SpreadsheetHandler } from './SpreadsheetHandler'

export interface Article {
    url: string
    originalUrl: string // Might be broken, but this is sort of the ID of the article
    isUrlDead: boolean
    readDate: Date
    title: string
    tags: string[]
    characterCount: number
    wordCount: number
    language: 'en' | 'hu' | 'other'
    authors: string[]
    publicationDate: Date | undefined
    minutes: number // float
    rating: number // 1 to 10
    review: string // May have markdown-like underscores and asterisks
    category: string
}

// noinspection JSUnusedLocalSymbols
function sendArticleReminderToDavid(): void {
    sendArticleReminder(['veszelovszki@gmail.com'], false)
}

// noinspection JSUnusedLocalSymbols
function sendArticleReminderToOthers(): void {
    const recipients = SpreadsheetHandler.loadEmailRecipients()

    sendArticleReminder(recipients, true)
}

function sendArticleReminder(recipients: string[], logSendingEvent: boolean): void {
    const articleCount = SpreadsheetHandler.getDailyArticleCount()

    if (articleCount > 0) {
        const articles = SpreadsheetHandler.loadArticles(articleCount)
        const emailBody = ArticleEmailSender.convertArticlesToHtml(articles)
        ArticleEmailSender.sendEmail(recipients, emailBody)

        if (logSendingEvent) {
            SpreadsheetHandler.logSending(articles)
        }
    }
}
