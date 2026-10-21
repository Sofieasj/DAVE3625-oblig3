# Solar Bean Farm

**Learn Java by helping rebuild a broken farm.**

Solar Bean Farm is a browser game and proof of concept for teaching Java to complete beginners. After a storm damages the farm, the player helps Bean, a caretaker robot, solve small Java tasks. Each repaired building unlocks the next step on the farm map, leading to the final Beacon quiz and restored-farm ending.

The project tests whether visible progress in a story based game world can make beginner programming concepts feel more approachable. It is a small prototype, not a full Java learning platform.

## How to play

Work through the farm buildings in order. Read each short lesson, then complete the task using a choice, a code line, or a quiz answer. Select **RUN TESTS** to check your answer; if it is incorrect, the panel gives feedback and a hint. Complete all tasks for a building to repair it and unlock the next one.

The seven buildings introduce:

1. **Seed Shed** — variables and types
2. **Water Pump** — `if` conditions and equality checks
3. **Windmill** — `for` loops
4. **Greenhouse** — arrays and indexes
5. **Solar Roof** — objects and method calls
6. **Pet Barn** — classes and inheritance
7. **Beacon** — a final two-question quiz

There are 12 short exercises in total. At the Pet Barn, the player completes a `Raccoon` subclass of `Pet` and chooses the raccoon's sound; the sound is shown in its speech bubble on the map.

## How it works

Exercises are stored as data in `src/data/exercises.ts`. The app displays Java snippets and collects answers through text areas, dropdowns, or multiple-choice options. It checks answers locally against accepted answers and patterns; it does not compile or run Java. The map and task panel are built with React, HTML, CSS, and SVG.

Game progress, completed exercises, and the pet sound are saved in browser `localStorage`. Use **RESET GAME** to clear the in-game progress and start again.

## Tech stack

- React, TypeScript, and Vite
- Vitest for unit tests
- Browser `localStorage` for saved progress
- No backend and no Java compiler

## Run locally

Install [Node.js](https://nodejs.org/) and npm, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Other available project commands:

```bash
npm test       # run the Vitest unit tests
npm run build  # type-check and build the static site
npm run lint   # run Oxlint
npm run preview # preview the production build locally
```

## Deployment

Vite is configured with `/solar-bean/` as its base path for a static deployment under that repository path. Add the public GitHub Pages URL here once the site has been published.

## How AI was used

This project was developed with AI assistance: Claude was used for planning and comparing project ideas, and GitHub Copilot was used during implementation.

- **Planning:** I have been brainstorming this project for a while and wanted to prototype and create a PoC of my idea for this university project. I used AI to explore the project idea further, choose a scope that fit the deadline, plan the technical approach, and develop the visual direction before coding.
- **Specification:** I wrote the project requirements in [`AGENTS.md`](AGENTS.md) and asked the coding assistant to propose a plan before implementation.
- **Thin slices:** Development started with one end-to-end exercise, then expanded the game in small working steps.
- **Content:** AI helped draft story, lessons, and exercises based on my ideas. I reviewed and adjusted the content and answer validation.
- **Review and testing:** I played through the game several times, checking correct and incorrect answers and hint delivery. I also asked another person to test it. This project taught me to give coding assistants specific requirements and to think carefully about the details of the user flow.

The [`docs/process-log.md`](docs/process-log.md) records selected implementation decisions, problems, and fixes.

## Testing and improvements

- **Automated tests:** `npm test` currently runs 34 Vitest tests in two test files. They cover answer validation (including whitespace, alternative answers, near misses, and empty input), exercise-to-node mapping, node unlock progression, and completing the farm.
- **End-to-end tests:** There is no Playwright setup or automated browser test suite in the current project.
- **Manual testing:** I played through the game multiple times and asked one other person to test it. Specific observations from that tester were not recorded in the process log.
- **Improvements during development:** Water Pump validation was expanded to accept equivalent ways to decrement a value. When Solar Roof was added to the map, saved progress was migrated so players would not skip the new task. The exercise content and progression were also updated to match the story.

## Known limitations

- Answers are checked by string normalization and patterns, not by a Java compiler. Some valid Java solutions may be rejected.
- Tasks focus on short beginner examples; the game does not teach Java comprehensively.
- The project is desktop-focused; mobile layouts have not been tested.
- There is no automated end-to-end test suite yet.

## Next steps

For a fuller version, add real Java execution in a safe environment, broaden the lessons and exercises, improve mobile support, and add more visual and audio assets.

## Credits

- Fonts: Press Start 2P and VT323, loaded from Google Fonts (SIL Open Font License).
- Map visuals: drawn with SVG and CSS; no external art assets are used.
- Built by Sofie Jensen as a DAVE3625 course project at OsloMet, 2026.
