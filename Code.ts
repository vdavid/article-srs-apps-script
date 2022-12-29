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
 *
 * License
 * =======
 *
 * Copyright (c) 2018 Dávid Veszelovszki (veszelovszki@gmail.com)
 */

function sendArticleReminderToDavid() {
    sendArticleReminder({recipients: ['veszelovszki@gmail.com'], logSendingEvent: false});
}

function sendArticleReminderToOthers() {
    const spreadsheetHandler = new SpreadsheetHandler();
    const recipients = spreadsheetHandler.loadEmailRecipients();

    sendArticleReminder({recipients, logSendingEvent: true});
}

/**
 * Collects data, sends an email and marks the sending event
 *
 * @param {string[]} recipients Email addresses to send to
 * @param {boolean} logSendingEvent True if the sending should be logged in the spreadsheet, false if it should be kept silent.
 */
function sendArticleReminder({recipients, logSendingEvent}) {
    const spreadsheetHandler = new SpreadsheetHandler();
    const articleEmailSender = new ArticleEmailSender();

    const articleCount = spreadsheetHandler.getDailyArticleCount();

    if (articleCount > 0) {
        const articles = spreadsheetHandler.loadArticles(articleCount);
        const emailBody = articleEmailSender.convertArticlesToHtml(articles);
        const sendingResult = articleEmailSender.sendEmail(recipients, emailBody);

        if (logSendingEvent) { spreadsheetHandler.logSending(articles); }
    }
}


/* Source: https://gist.github.com/mhawksey/1276293 (by Martin Hawksey, 2011) */

var SHEET_NAME = "Subscriptions";

// How to use:

//  3. Publish > Deploy as web app
//    - enter Project Version name and click 'Save New Version'
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously)
//
//  4. Copy the 'Current web app URL' and post this in your form/script action
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doGet(request) {
    return handleResponse(request.parameter);
}

function doPost(request) {
    return handleResponse(request.parameter);
}

function handleResponse(parameters) {
    /* A public lock to prevent concurrent access overwritting data.
       More info: http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html */

    var lock = LockService.getPublicLock();
    lock.waitLock(10000);  /* Wait 10 seconds before conceding defeat */

    try {
        const newRow = spreadsheetHandler.addSubscription(parameters.emailAddress, parameters.hungarianPosts, parameters.englishPosts, parameters.articleSrs);

        lock.releaseLock();
        return assembleJsonOutput({result: "success", newRow: newRow});
    } catch(error){
        lock.releaseLock();
        return assembleJsonOutput({result: "error", error: error});
    }

    function assembleJsonOutput(object) {
        return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
    }
}
