/**
 * What is this?
 * =================
 * This is a project based on Simon Hørup Eskildsen's article: https://sirupsen.com/playlists/
 * It helps acquired knowledge to stick better by sending out email summaries of the
 *
 * How does it work?
 * =================
 *
 * There is my "Queues and reviews" spreadsheet where I put my article reviews.
 *
 * Then there is my "Article SRS" spreadsheet, that builds chunks of my articles read in the past.
 * It repeats articles with good ratings more often than ones with bad ratings. (Ratings 1-2 are never even sent.)
 * As I already have 1,350 reviews and just started this project, I made it capable of sending old articles as well,
 * and it will catch up to new articles in a year or so.
 *
 * And this is the script that's triggered every morning to send out email reminders.
 *
 * How to use it?
 * ==============
 *
 * Run the `sendArticleReminder` function to send out the latest article reminders that are due.
 * To auto-send, set up a trigger for it, say, for every 4am.
 * Find all settings in the `sendArticleReminder` function.
 * To send more articles per day, just set the QUERY LIMIT on the "Next" sheet from 10 to anything you like.
 *
 * How to change daily article count?
 * ==================================
 *
 * Just set the LIMIT in Next:A2 in the spreadsheet. The script will follow.
 *
 * Version history
 * ===============
 *   - 2018-08-25 Project created, first version of script written.
 *   - 2022-12-29 Moved it to Clasp with TypeScript
 *
 * License
 * =======
 *
 * Copyright (c) 2018–2022 David Veszelovszki (veszelovszki@gmail.com)
 */

type Article = {
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

        if (logSendingEvent) { SpreadsheetHandler.logSending(articles) }
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

type HttpParameters = {
    emailAddress?: string
    hungarianPosts?: string
    englishPosts?: string
    articleSrs?: string
}

function handleResponse(parameters: HttpParameters): GoogleAppsScript.Content.TextOutput {
    /* A public lock to prevent concurrent access overwriting data.
       More info: http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html */

    const lock = LockService.getScriptLock()
    lock.waitLock(10000)  /* Wait 10 seconds before conceding defeat */

    try {
        const newRow = SpreadsheetHandler.addSubscription(parameters.emailAddress, parameters.hungarianPosts === '1', parameters.englishPosts === '1', parameters.articleSrs === '1')

        lock.releaseLock()
        return assembleJsonOutput({ result: 'success', newRow: newRow })
    } catch (error) {
        lock.releaseLock()
        return assembleJsonOutput({ result: 'error', error: error })
    }

    function assembleJsonOutput(object): GoogleAppsScript.Content.TextOutput {
        return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON)
    }
}
