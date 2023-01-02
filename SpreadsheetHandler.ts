import { Article } from './Code'

const spreadsheetID = PropertiesService.getScriptProperties().getProperty('spreadsheetID')

export namespace SpreadsheetHandler {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetID)
    const nextArticlesSheet = spreadsheet.getSheetByName('Next')
    const logSheet = spreadsheet.getSheetByName('Log')
    const subscribersSheet = spreadsheet.getSheetByName('Subscribers')

    export function loadArticles(count: number): Article[] {
        const rows = nextArticlesSheet.getRange(2, 1, count, 14).getValues()
        return rows.map(row => convertRowToArticle(row)).filter(article => article)
    }

    export function loadEmailRecipients(): string[] {
        const rows = subscribersSheet.getRange('A2:D').getValues()
        return rows.filter(row => row[3] === 'on').map(row => row[0])
    }

    export function getDailyArticleCount(): number {
        return getFirstEmptyRowIndex(nextArticlesSheet.getRange('A:A').getValues()) - 2
    }

    export function logSending(articles: Article[]): void {
        const rowIndex: number = getFirstEmptyRowIndex(logSheet.getRange('A:A').getValues())
        logSheet.insertRowsAfter(rowIndex - 1, articles.length)

        const today = new Date().toISOString().slice(0, 10)
        for (const [index, article] of articles.entries()) {
            logSheet.getRange(rowIndex + index, 1, 1, 2).setValues([[today, article.originalUrl]])
        }
    }

    function convertRowToArticle(row: string[]): Article | null {
        return row[3]
            ? {
                  url: row[0].startsWith('DELETED - ') ? row[0].slice(10) : row[0],
                  originalUrl: row[1],
                  isUrlDead: row[0].startsWith('DELETED - '),
                  readDate: new Date(row[2]),
                  title: row[3],
                  tags: row[4].split(','),
                  characterCount: parseInt(row[5], 10),
                  wordCount: parseInt(row[6], 10),
                  language: row[7] === 'EN' ? 'en' : row[7] === 'HU' ? 'hu' : 'other',
                  authors: row[8].split(','),
                  publicationDate: row[9] ? new Date(row[9]) : undefined,
                  minutes: parseInt(row[10], 10),
                  rating: parseInt(row[11], 10),
                  review: row[12],
                  category: row[13] || '(uncategorized)',
              }
            : null
    }

    function getFirstEmptyRowIndex(values: (string | number)[][]): number {
        let rowIndex = 0
        while (values[rowIndex] && values[rowIndex][0] !== '') {
            rowIndex++
        }
        return rowIndex + 1
    }
}
