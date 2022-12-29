const spreadsheetID = PropertiesService.getScriptProperties().getProperty('spreadsheetID')

namespace SpreadsheetHandler {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetID)
    const nextArticlesSheet = spreadsheet.getSheetByName('Next')
    const logSheet = spreadsheet.getSheetByName('Log')
    const subscribersSheet = spreadsheet.getSheetByName('Subscribers')
    const subscriptionsSheet = spreadsheet.getSheetByName('Subscriptions')

    export function loadArticles(count: number): Article[] {
        const rows = nextArticlesSheet.getRange(2, 1, count, 13).getValues()
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
            logSheet.getRange(rowIndex + index, 1, 1, 2).setValues([[today, article.url]])
        }
    }

    // noinspection JSUnusedLocalSymbols
    export function addSubscription(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        emailAddress: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hungarianPosts: boolean,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        englishPosts: boolean,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        articleSrs: boolean
    ): number {
        // TODO: This is not done yet!
        // I was here: https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendRow(Object)
        // And here: https://stackoverflow.com/questions/34689556/how-do-i-append-a-blank-row-in-a-google-spreadsheet-with-apps-script
        // And here: https://developers.google.com/apps-script/guides/web
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const request: any = {}

        // we'll assume header is in row 1, but you can override with header_row in GET/POST data
        // noinspection JSUnusedLocalSymbols
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const headRow = request.parameter.header_row || 1
        const headers = subscriptionsSheet.getRange(1, 1, 1, subscriptionsSheet.getLastColumn()).getValues()[0]
        const nextRow = subscriptionsSheet.getLastRow() + 1 // get next row
        const row = []
        // loop through the header columns
        for (const header of headers) {
            if (header === 'Timestamp') {
                // special case if you include a 'Timestamp' column
                row.push(new Date())
            } else {
                // else use header name to get data
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                row.push(request.parameter[header])
            }
        }
        // more efficient to set values as [][] array than individually
        subscriptionsSheet.getRange(nextRow, 1, 1, row.length).setValues([row])

        return nextRow
    }

    function convertRowToArticle(row: string[]): Article | null {
        return row[2]
            ? {
                  url: row[0],
                  readDate: new Date(row[1]),
                  title: row[2],
                  tags: row[3].split(','),
                  characterCount: parseInt(row[4], 10),
                  workCount: parseInt(row[5], 10),
                  language: row[6] === 'EN' ? 'English' : row[6] === 'HU' ? 'Hungarian' : row[6],
                  authors: row[7].split(','),
                  publicationDate: row[8] ? new Date(row[8]) : undefined,
                  minutes: parseInt(row[9], 10),
                  rating: parseInt(row[10], 10),
                  review: row[11],
                  category: row[12] || '(uncategorized)',
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
