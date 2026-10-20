# Solar Bean: project spec for the AI agent

A retro pixel-art web game that teaches complete beginners Java. The player arrives at a broken solarpunk farm and rebuilds it by solving small Java tasks. This is a uni project (solo, 6-day deadline, graded Approved / Not Approved on: the idea, how AI was used, whether the app works, and how it was tested and improved). **A small app that works beats an ambitious one that doesn't.**

## How to work with me (rules for the agent)

1. **Plan first, then build in thin vertical slices.** Get one exercise working end to end (data -> UI -> validation -> farm change) before adding more. Never generate the whole app in one go.
2. **One change per step.** After each step, tell me how to run it and what I should see. Wait for me to confirm before the next step.
3. **Keep it simple.** No extra libraries, patterns or features beyond this spec. If you think something is needed, ask first.
4. **Explain as you go.** Briefly say what each new component/file is for. I need to be able to explain the architecture myself.
5. **Commit-friendly.** Keep changes small and working so I can commit after every step.
6. **Tests are part of the work.** Whenever you write validation logic, write Vitest tests for it in the same step, including tricky variants (extra whitespace, alternative valid answers, wrong answers that look almost right).
7. **Placeholders first, art later.** All visuals must work with simple colored rectangles before any polish. Keep the mapping from game state to visuals in one file so styling can be changed in one place.
8. **Log decisions.** When something breaks or we change direction, add a short line to `docs/process-log.md` (what went wrong, what we changed). This feeds my "how I used AI / tested and improved" write-up.
9. **Be extremely concise.** Sacrifice grammar for the sake of concision
10. **Clean code.** Write readable and maintainable code.

## Stack

- React + Vite + TypeScript (no backend)
- CodeMirror 6 for the code display/edit area (`@uiw/react-codemirror` is fine)
- Vitest for unit tests (answer validation, game state logic)
- Playwright for 2-3 end-to-end tests only (keep it small, avoid flaky tests)
- Progress saved in `localStorage` (wrap reads/writes in try/catch)
- Deploy as a static site to GitHub Pages. Set `base` in `vite.config.ts` to the repo name.

## Core concept

- The player sees an **overworld map** (Mario-style world map, not free walking). Nodes are broken farm buildings connected by a winding path. A token (farmer + pet) sits on the current node.
- Selecting the current node opens a **terminal-style task panel** to the right of the map.
- Solving a task repairs the building (gray + cracked -> colored + animated) and unlocks the next node.
- The next node stays locked until the current one is solved.

### Map nodes (in order)

| #   | Building   | Java topic                                  |
| --- | ---------- | ------------------------------------------- |
| 1   | Seed Shed  | variables and types                         |
| 2   | Water Pump | if / else                                   |
| 3   | Windmill   | loops                                       |
| 4   | Greenhouse | methods and arrays (keep simple)            |
| 5   | Pet Barn   | classes, objects, inheritance (pet builder) |
| 6   | Beacon     | final quiz, then the "farm restored" ending |

States per node: `locked`, `current`, `fixed`.

## The 3 features (everything else is out of scope)

### Feature 1: Exercise engine

- Exercises are **data, not code**. Adding an exercise means adding an object to a data file.
- Task types:
  - `fix-code`: a short broken snippet; the player rewrites the broken line
  - `fill-blank`: dropdowns or short inputs in a snippet
  - `quiz` / `pair-match`: multiple choice, or match code to what it does
  - (optional, tiny) `write-line`: write one line, e.g. "declare an int called water set to 10"
- Validation runs **in the app** (no Java compiler, no backend): normalize the input (trim, collapse whitespace, normalize spaces around `=`, `;` and brackets), then compare against a list of accepted answers and/or regex patterns.
- Feedback: on failure show which check failed plus a hint (hint is also available via a button). On success show a short success message and trigger the repair animation.
- About 8-10 exercises total across the first 5 nodes, plus a short quiz at node 3 and 6.

Suggested data shape (adjust if something simpler works):

```ts
type Exercise = {
  id: string;
  nodeId: string; // which building it repairs
  type: "fix-code" | "fill-blank" | "quiz" | "pair-match" | "write-line";
  title: string;
  prompt: string; // plain-language mission text
  starterCode?: string; // shown in the editor
  editableLine?: number; // for fix-code
  acceptedAnswers?: string[]; // compared after normalization
  acceptedPatterns?: string[]; // regex sources, alternative to exact answers
  options?: string[]; // for quiz / fill-blank
  correctOption?: number;
  hint: string;
  failMessage?: string;
};

type MapNode = {
  id: string;
  name: string;
  position: { x: number; y: number };
  unlocks: string | null; // next node id
  exerciseIds: string[];
};
```

### Feature 2: Farm that visibly rebuilds

- Map built with SVG or plain DOM + CSS (not canvas, no game loop, no collision).
- Each node has a "broken" and a "fixed" visual. The transition is the payoff moment: a flash, a pop animation, color returning, and the token hopping to the next node with a stepped bounce.
- Title screen and a simple "farm restored" ending screen.
- Progress (fixed nodes, pet choice) persists via `localStorage`, with a reset button.

### Feature 3: Pet builder (inheritance and objects)

- Show a `Pet` base class in the editor. The player completes a subclass (e.g. `class Fox extends Pet`) and overrides one method (e.g. `sound()` or `move()`).
- The validated result changes the pet on the map: sprite variant/color and a speech line reflecting what the player wrote.
- Keep it to 2-3 sprite variants plus color tinting. No new art per subclass.

## Visual style: "Option 1", pixel overworld + CRT terminal

A canvas mockup for this exists (Rustleaf Farm Aesthetic Options, Option 1). Match it.

- **Layout** (desktop, designed at 1280x760): top HUD bar (56px), map area on the left (about 760px), terminal task panel on the right (about 520px).
- **Map look:** top-down, hard-edged blocky shapes, no gradients or soft blurs, no outlines. Checkerboard grass tiles, stepped roofs, sandy path for completed sections, dim gray dashed path for locked sections. Each node sits on a square plate with a number badge and a label chip. `shape-rendering: crispEdges` on SVG.
- **Node states:** fixed = colored sprite + gold border; current = gray cracked sprite + blinking green ring + bouncing red "!" marker; locked = gray sprite + padlock + gray border.
- **Animations:** use CSS `steps()` timing so movement feels frame-by-frame (token hop, blinking ring, marker).
- **Terminal panel:** dark background, green text with a subtle glow, amber headings and keywords, subtle scanline overlay (repeating-linear-gradient). Mission title, short instruction, code box with line numbers and syntax colors, the buggy line highlighted, a text input to rewrite the line, `RUN TESTS` and `HINT` buttons, and an output console (`[FAIL]` / `[PASS]` lines plus a hint).
- **Fonts (Google Fonts):** `Press Start 2P` for headings, labels and buttons; `VT323` for terminal and code text. Keep Press Start 2P sizes at about 10-14px.
- **Palette (define as CSS variables):**

  | Token                       | Hex                                                         |
  | --------------------------- | ----------------------------------------------------------- |
  | grass                       | `#86c46c` / `#8fcc75`                                       |
  | sand path                   | `#f0d9a0` (edge `#c9a96a`, dashes `#fbeac0`)                |
  | locked path                 | `#6f8591` (dashes `#b3c3cc`)                                |
  | water                       | `#6fc3d9` (highlight `#b8ecf6`)                             |
  | trees                       | `#4f9a5a` / `#5fae66` / `#7cc47f`, trunk `#8a5a3a`          |
  | gold (fixed)                | `#f7d56b` (tile border `#e3a92d`)                           |
  | fixed / current tile        | `#dff1fb`                                                   |
  | locked tile                 | `#cdd7dd` (border `#55646f`)                                |
  | current ring                | `#22a06b`                                                   |
  | alert coral                 | `#f2806f`                                                   |
  | HUD / label chips           | `#2a3a4a`                                                   |
  | terminal panel bg           | `#243242` (code box and input `#1b2733`, console `#17222c`) |
  | panel borders               | `#3f566a`                                                   |
  | terminal text (mint)        | `#b9f0cf` / `#8fe3b0`                                       |
  | amber (headings, keywords)  | `#ffcf70`                                                   |
  | dim text, line numbers      | `#8aa3b2`                                                   |
  | error coral (text)          | `#ff9d8a`                                                   |
  | code types / numbers        | `#8fd9ec` / `#f5a9d0`                                       |
  | player overalls (Mario nod) | `#4f8fd9`                                                   |
  | fox                         | `#f09a4a`                                                   |
  | cream text                  | `#fff8e1`                                                   |

- **Assets:** no art files required. Sprites are drawn from simple SVG rectangles. If real pixel assets are added later, they must be CC0 / free (e.g. Kenney.nl), credited in the README, and swapped in via the single state-to-visual mapping file.
- **Accessibility basics:** real `<button>` and `<input>` elements with labels, text contrast at least 4.5:1, keyboard-usable (Enter to run tests).

## Suggested file structure

```
src/
  data/exercises.ts       # all exercises (data only)
  data/nodes.ts           # map nodes, positions, unlock order
  game/validate.ts        # normalize + check answers (pure functions, unit-tested)
  game/state.ts           # progress state + localStorage persistence
  components/
    TitleScreen.tsx
    OverworldMap.tsx
    MapNode.tsx
    TaskPanel.tsx         # terminal-style panel, renders by exercise type
    CodeBox.tsx
    PetBuilder.tsx
    EndingScreen.tsx
  styles/theme.css        # CSS variables, fonts, scanlines
  visuals/spriteMap.ts    # single place mapping node state -> visuals
tests/
  validate.test.ts        # Vitest
e2e/
  game.spec.ts            # Playwright, 2-3 tests
docs/
  process-log.md          # prompts, bugs, fixes (for the AI-usage write-up)
README.md
```

## Testing requirements

- **Vitest:** `validate.ts` and the progress/unlock logic. Cover: extra/missing whitespace, `i++` vs `i ++`, alternative valid answers, near-miss wrong answers, empty input.
- **Playwright (keep to 2-3 tests):** (1) solve exercise 1 correctly -> node becomes fixed and next node unlocks; (2) wrong answer shows a hint and the node stays locked/current; (3) progress persists after reload.
- Before I submit, I will playtest with at least one other person. Record what they got stuck on and what I changed in `docs/process-log.md`.

## Out of scope (do NOT build)

Accounts or login, a backend or database, real Java compilation/execution, free-walking movement or collision, multiplayer, more than 8 nodes, sound (optional only if everything else is done), mobile layout beyond "doesn't break".

## Deliverables (for context)

Demo link (GitHub Pages or video), GitHub repo with source, and a short description of the app and its purpose. The README must include: what the app does, how to run it, how AI was used, how it was tested, known limitations (real Java execution is the planned next step for the full version), and asset credits.

## First task for the agent

Read this whole file. Do not write code yet. Propose: (1) the exact file structure you will create, (2) a plan for day 1 that ends with one exercise working end to end on a placeholder map, and (3) any questions or risks you see. Wait for my approval before building.
