var SpreadsheetHandler = function(options) {
    options = options || {};

    /* Settings */
    const SPREADSHEET_ID = options.spreadsheetId || '11dMx4HvCGE4kpiycqeol5q9ie1AWxRR-dSRfKCwrbWc';
    const NEXT_ARTICLES_SHEET_NAME = options.nextArticlesSheetName || 'Next';
    const LOG_SHEET_NAME = options.logSheetName || 'Log';
    const SUBSCRIPTIONS_SHEET_NAME = options.subscriptionsSheetName || 'Subscriptions';
    const SUBSCRIBERS_SHEET_NAME = options.subscribersSheetName || 'Subscribers';

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const nextArticlesSheet = spreadsheet.getSheetByName(NEXT_ARTICLES_SHEET_NAME);
    const logSheet = spreadsheet.getSheetByName(LOG_SHEET_NAME);
    const subscribersSheet = spreadsheet.getSheetByName(SUBSCRIBERS_SHEET_NAME);
    const subscriptionsSheet = spreadsheet.getSheetByName(SUBSCRIPTIONS_SHEET_NAME);

    /**
     * Loads the given number of articles from the "Next" sheet of the spreadsheet.
     *
     * @param {string} spreadsheetId ID of the Google Sheets file to write
     * @param {string} sheetName Name of the sheet in the given Google Sheets file to write
     * @param {int} count The number of articles to expect to find on the sheet.
     * @return {Object[]} The articles as objects, in the same order as they are in the spreadsheet.
     */
    this.loadArticles = function(count) {
        const rows = nextArticlesSheet.getRange(2, 1, count, 13).getValues();
        return rows.map(function(row) { return convertRowToArticle(row) }).filter(function(article) { return article; });
    }

    /**
     *
     * @return {string[]} Email addresses.
     */
    this.loadEmailRecipients = function() {
        const rows = subscribersSheet.getRange('A2:D').getValues();
        return rows.filter(function(row) { return row[3] === 'on'; })
            .map(function(row) { return row[0]; });
    }

    this.getDailyArticleCount = function() {
        return getFirstEmptyRowIndex(nextArticlesSheet.getRange('A:A').getValues()) - 2;
    }

    /**
     * Logs that the email for the given articles are sent today.
     *
     * @param {string} spreadsheetId ID of the Google Sheets file to write
     * @param {string} sheetName Name of the sheet in the given Google Sheets file to write
     * @param {Object[]} articles A number of articles to mark as sent.
     */
    this.logSending = function(articles) {
        const firstEmptyRowIndex = getFirstEmptyRowIndex(logSheet.getRange('A:A').getValues());
        logSheet.insertRowsAfter(firstEmptyRowIndex - 1, articles.length);

        articles.forEach(function(article, index) {
            logSheet.getRange(firstEmptyRowIndex + index, 1, 1, 2).setValues([[(new Date()).toISOString().substring(0, 10), article.url]]);
        });
    };

    /**
     *
     * @param {string} emailAddress
     * @param (boolean} hungarianPosts
     * @param (boolean} englishPosts
     * @param (boolean} articleSrs
     */
    this.addSubscription = function(emailAddress, hungarianPosts, englishPosts, articleSrs) {
        //TODO: This is not done yet!
        // I was here: https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendRow(Object)
        // And here: https://stackoverflow.com/questions/34689556/how-do-i-append-a-blank-row-in-a-google-spreadsheet-with-apps-script
        // And here: https://developers.google.com/apps-script/guides/web

        // we'll assume header is in row 1 but you can override with header_row in GET/POST data
        var headRow = e.parameter.header_row || 1;
        var headers = subscriptionsSheet.getRange(1, 1, 1, subscriptionsSheet.getLastColumn()).getValues()[0];
        var nextRow = subscriptionsSheet.getLastRow()+1; // get next row
        var row = [];
        // loop through the header columns
        for (i in headers){
            if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
                row.push(new Date());
            } else { // else use header name to get data
                row.push(e.parameter[headers[i]]);
            }
        }
        // more efficient to set values as [][] array than individually
        subscriptionsSheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

        return nextRow;
    }

    /**
     * Converts a raw row from the spreadsheet to an Article object.
     *
     * @param {string[]} 13 columns of article data
     * @return {Object|null} The article, or null if the row is invalid.
     */
    function convertRowToArticle(row) {
        return row[2] ? {
            url: row[0],
            readDate: new Date(row[1]),
            title: row[2],
            tags: row[3].split(','),
            characterCount: parseInt(row[4]),
            workCount: parseInt(row[5]),
            language: (row[6] === 'EN') ? 'English' : ((row[6] === 'HU') ? 'Hungarian' : row[6]),
            authors: row[7].split(','),
            publicationDate: row[8] ? new Date(row[8]) : undefined,
            minutes: parseInt(row[9]),
            rating: parseInt(row[10]),
            review: row[11],
            category: row[12] ? row[12] : '(uncategorized)'
        } : null;
    }

    /**
     * Helper function to find the first empty row in the given column of values
     *
     * @param {string[][]} values A set of single-element arrays
     * @return {int} The 1-based index of the first row that has this given cell empty
     */
    function getFirstEmptyRowIndex(values) {
        var rowIndex = 0;
        while (values[rowIndex] && (values[rowIndex][0] !== "")) {
            rowIndex++;
        }
        return (rowIndex + 1);
    }
}
