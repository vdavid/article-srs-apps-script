
## What is this?

This is a project based on Simon Hørup Eskildsen's article: https://sirupsen.com/playlists/
It helps acquired knowledge to stick better by sending out email summaries of the

## How does it work?

There is my "Queues and reviews" spreadsheet where I put my article reviews.

Then there is my "Article SRS" spreadsheet, that builds chunks of my articles read in the past.
It repeats articles with good ratings more often than ones with bad ratings. (Ratings 1-2 are never even sent.)
As I already have 1,350 reviews and just started this project, I made it capable of sending old articles as well,
and it will catch up to new articles in a year or so.

And this is the script that's triggered every morning to send out email reminders.

## How to use it?

Run the `sendArticleReminder` function to send out the latest article reminders that are due.
To auto-send, set up a trigger for it, say, for every 4am.
Find all settings in the `sendArticleReminder` function.
To send more articles per day, just set the QUERY LIMIT on the "Next" sheet from 10 to anything you like.

## How to change daily article count?

Just set the LIMIT in Next:A2 in the spreadsheet. The script will follow.

## Environment

Uses these inputs from script properties:

- spreadsheetID

## Development

Use `yarn watch` to develop.

Use `yarn push` for a single deploy.

- Known issue: need to manually delete `.eslintrc.gs`, `tsconfig.gs` and a bunch of other files (all except 3). It's very annoying. `.claspignore` should ignore it but it's [broken](https://github.com/google/clasp/issues/66).
- Go to the [script](https://script.google.com/home/projects/1PG2YTlZFJUzIvlgZOqXoK0RzmpLKs8jT-9XJuJXZnN6toD8FBoN4eQMS/edit) to run it

## License

Copyright (c) 2018–2022 David Veszelovszki (veszelovszki@gmail.com)
