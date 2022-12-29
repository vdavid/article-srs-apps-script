interface Article {
    url: string
    readDate: Date
    title: string
    tags: string[]
    characterCount: number
    workCount: number
    language: string
    authors: string[]
    publicationDate: Date | undefined
    minutes: number
    rating: number
    review: string
    category: string
}

// noinspection JSUnusedGlobalSymbols
function sendArticleReminderToDavid(): void {
    sendArticleReminder(['veszelovszki@gmail.com'], false)
}

// noinspection JSUnusedGlobalSymbols
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

/* Source: https://gist.github.com/mhawksey/1276293 (by Martin Hawksey, 2011) */

// How to use:

//  3. Publish > Deploy as web app
//    - enter Project Version name and click 'Save New Version'
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously)
//
//  4. Copy the 'Current web app URL' and post this in your form/script action
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
// noinspection JSUnusedGlobalSymbols
function doGet(request: { parameter: HttpParameters }): GoogleAppsScript.Content.TextOutput {
    return handleResponse(request.parameter)
}

// noinspection JSUnusedGlobalSymbols
function doPost(request: { parameter: HttpParameters }): GoogleAppsScript.Content.TextOutput {
    return handleResponse(request.parameter)
}

interface HttpParameters {
    emailAddress?: string
    hungarianPosts?: string
    englishPosts?: string
    articleSrs?: string
}

function handleResponse(parameters: HttpParameters): GoogleAppsScript.Content.TextOutput {
    /* A public lock to prevent concurrent access overwriting data.
       More info: http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html */

    const lock = LockService.getScriptLock()
    lock.waitLock(10000) /* Wait 10 seconds before conceding defeat */

    try {
        const newRow = SpreadsheetHandler.addSubscription(
            parameters.emailAddress,
            parameters.hungarianPosts === '1',
            parameters.englishPosts === '1',
            parameters.articleSrs === '1'
        )

        lock.releaseLock()
        return assembleJsonOutput({ result: 'success', newRow })
    } catch (error) {
        lock.releaseLock()
        return assembleJsonOutput({ result: 'error', error: error as Error })
    }

    function assembleJsonOutput(object: {
        result: string
        newRow?: number
        error?: Error
    }): GoogleAppsScript.Content.TextOutput {
        return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON)
    }
}
