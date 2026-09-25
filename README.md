# Math Jedi

Math Jedi is a browser app for drilling the long addition and subtraction sums used in abacus and mental-arithmetic training, where a student adds a vertical column of numbers, some of them negative, in their head. After a one-time setup that asks for the student's name and email and lets you pick the number range, the number of sums per session, the numbers per sum and the share of negative numbers, it generates a fresh set of sums for every session and shows them one at a time in the UCMAS-style digit font. The student types each total, and when the session ends a report lists every sum with the expected total, the given answer and the seconds it took, with wrong answers highlighted. Everything, including unfinished sessions, is saved in the browser's `localStorage`, so there is no server or account. It is a small React 16 single-page app made with Create React App and published on GitHub Pages, built with a Jedi theme ("May the force be with you") between May and December 2020 and unchanged since.

> Personal project from 2020. Not actively maintained.

**Live demo:** https://www.rach.im/math-jedi/

## Features

- Settings wizard (one field per step, with validation): name, email, number range (default 10 to 99), sums per session (default 200), numbers per sum (default 6) and percentage of negative numbers (default 30%)
- Sums are generated so the running total never goes below zero, with no multiples of 10 or 11 and no number repeated back to back
- Question column and answer box scale their font size to the screen height; the answer box turns teal when the typed total is correct
- Answer with Enter or the Next button; a progress ring shows how far through the session the student is
- Continue an unfinished session, start a new one (which discards the unfinished one after a confirmation), or reopen the last score
- Session report with total time and a per-sum table: numbers, expected total, given answer and time in seconds, with wrong answers highlighted
- State kept in `localStorage` under the `math-jedi` key

## Tech stack

React 16 · React Router 5 (hash routing) · react-svg-piechart · Font Awesome · CSS Modules · Create React App (react-scripts 3.4) · GitHub Pages

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm start          # dev server on http://localhost:3000
npm run build      # production build, then renames build/ to docs/ for GitHub Pages
npm test           # Create React App test runner (no tests are committed)
```

The `build` script calls the `rename` command. On Linux or macOS, delete the old `docs/` folder and run `mv build docs` yourself if `rename` is not available or behaves differently.

## Project structure

```text
src/
  index.js                      mounts <App/>
  app/
    App.js                      hash routes: / , /register , /session/:sessionId
    App.actions.js              context, localStorage persistence, sum generator, answer recording
    opening-screen/             home screen: Register/Settings, Continue, Last Score, New
    registration-screen/        step-by-step settings wizard
    session-screen/
      SessionScreen.js          shows the exercise or, once finished, the report
      ExerciseScreen.js         one sum at a time with answer input
      ReportScreen.js           session summary table
      ProgressPie.js            progress ring
    common/                     layout primitives, button, input, notifications
    fonts/                      StarJedi and UCMAS KG web fonts
docs/                           built site served by GitHub Pages
```
