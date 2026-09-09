# Крестики-нолики Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать polished статическую веб-игру «Крестики-нолики» с локальным запуском через `make run` и публикацией исходников в GitHub.

**Architecture:** Один HTML-документ подключает отдельные CSS и JavaScript-файлы. Игровая логика полностью клиентская: JavaScript хранит состояние партии в памяти, а `Makefile` использует встроенный сервер Python без зависимостей.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES2020), Python 3, Make, Git/GitHub CLI.

**Spec:** `docs/superpowers/specs/2026-09-09-krestiki-design.md`

## Global Constraints

- No npm, build step, framework, external CDN, analytics, or network request at runtime.
- First move is `X`; score survives a new round but resets via a dedicated score-reset control.
- `make check` must validate the five required project files.
- Preserve a readable commit history with a commit after each meaningful change group.

---

### Task 1: Project baseline and design records

**Files:**
- Create: `.gitignore`
- Create: `docs/superpowers/specs/2026-09-09-krestiki-design.md`
- Create: `docs/superpowers/plans/2026-09-09-krestiki-implementation.md`

**Interfaces:**
- Produces the approved design and implementation contract used by all later tasks.

- [x] **Step 1: Record the design and plan**

  The design and plan are stored at the paths above with the exact game rules, visual direction, and verification commands.

- [ ] **Step 2: Add the baseline ignore rules**

  Include `.DS_Store`, editor metadata, and local server logs in `.gitignore`.

- [ ] **Step 3: Commit the project baseline**

  ```bash
  git add .gitignore docs/superpowers
  git commit -m "docs: define krestiki game design and plan"
  ```

### Task 2: Semantic game shell

**Files:**
- Create: `index.html`

**Interfaces:**
- Produces DOM hooks: `#game-status`, `#score-x`, `#score-o`, `#board`, `#new-round`, and `#reset-score`.
- Each board cell has `data-cell-index` from `0` to `8` and an accessible label.

- [ ] **Step 1: Create the page shell**

  Add a semantic `main` element with a header, score cards, status region, nine-button board cells, and game controls. Link `style.css` and defer-load `app.js`.

- [ ] **Step 2: Verify the shell is structurally complete**

  Run `make check` after `Makefile` exists; before then verify the DOM hooks with `rg -n 'game-status|score-x|score-o|data-cell-index' index.html`.

- [ ] **Step 3: Commit the shell**

  ```bash
  git add index.html
  git commit -m "feat: add accessible game shell"
  ```

### Task 3: Visual system and responsive board

**Files:**
- Create: `style.css`

**Interfaces:**
- Styles the DOM contract from Task 2.
- Uses the CSS classes `.is-current`, `.is-x`, `.is-o`, `.is-winning`, and `.is-disabled` toggled by `app.js`.

- [ ] **Step 1: Add the visual tokens and layout**

  Define colors, spacing, typography, panel styles, score cards, and a 3×3 board with `aspect-ratio: 1`.

- [ ] **Step 2: Add interaction and state styles**

  Add hover/focus-visible states, X/O color treatment, winning-cell animation, disabled cells, and current-player emphasis.

- [ ] **Step 3: Add the mobile breakpoint**

  At a narrow viewport, reduce padding and typography while keeping the board cells large enough for touch input.

- [ ] **Step 4: Commit the visual layer**

  ```bash
  git add style.css
  git commit -m "feat: add arcade-inspired responsive styling"
  ```

### Task 4: Deterministic game engine and UI updates

**Files:**
- Create: `app.js`

**Interfaces:**
- Internal functions: `startRound()`, `handleCellClick(index)`, `evaluateBoard(board)`, `render()`, `resetScore()`.
- `evaluateBoard(board)` returns `{ winner: 'X'|'O'|null, line: number[]|[], draw: boolean }`.

- [ ] **Step 1: Implement the state model**

  Store `board` as nine `null`/`X`/`O` values, `currentPlayer` as `X` or `O`, `gameOver` as a boolean, `scores` as `{ X: 0, O: 0 }`, and `winningLine` as an array.

- [ ] **Step 2: Implement board evaluation**

  Check these winning lines in order: `[0,1,2]`, `[3,4,5]`, `[6,7,8]`, `[0,3,6]`, `[1,4,7]`, `[2,5,8]`, `[0,4,8]`, `[2,4,6]`. Return a draw only when every cell is occupied and no winner exists.

- [ ] **Step 3: Implement input handling**

  Ignore clicks on occupied cells or after game over; on a valid click, place the current symbol, evaluate the board, update score/status or alternate the player.

- [ ] **Step 4: Implement rendering and controls**

  Render each cell, status text, scores, current-player class, winning classes, and disabled state. Wire new-round, score-reset, and `R` keyboard shortcut.

- [ ] **Step 5: Commit game behavior**

  ```bash
  git add app.js
  git commit -m "feat: implement tic-tac-toe gameplay"
  ```

### Task 5: Local workflow and documentation

**Files:**
- Create: `Makefile`
- Create: `README.md`

**Interfaces:**
- `make run`: executes `python3 -m http.server 8000`.
- `make check`: checks the required files and prints a success message.

- [ ] **Step 1: Add Make targets**

  Define `.PHONY: run check`, a configurable `PORT ?= 8000`, and shell checks for the five required files.

- [ ] **Step 2: Document usage**

  Explain prerequisites, `make check`, `make run`, browser URL, controls, rules, and the no-build/no-dependency model.

- [ ] **Step 3: Run local checks**

  Run `make check`; start `make run` and verify `curl -fsS http://localhost:8000/` returns the page title and board markup.

- [ ] **Step 4: Commit the local workflow**

  ```bash
  git add Makefile README.md
  git commit -m "chore: add local run workflow and documentation"
  ```

### Task 6: Browser verification and GitHub synchronization

**Files:**
- Modify: `README.md` only if verification reveals an incorrect command or URL.

**Interfaces:**
- Final branch is `main`; GitHub remote is named `origin` unless an existing authenticated setup requires another explicit name.

- [ ] **Step 1: Run static and syntax checks**

  Run `make check` and `node --check app.js`.

- [ ] **Step 2: Verify the live browser flow**

  With `make run` active, test a win for X, a win for O, a draw, new round score retention, score reset, and narrow responsive layout. Confirm no console errors.

- [ ] **Step 3: Commit verification-driven fixes**

  If a fix is needed, run the relevant check again and commit it with a focused message such as `fix: correct draw state rendering`.

- [ ] **Step 4: Create or connect the GitHub repository**

  Confirm `gh auth status`, then create `krestiki` under the authenticated account if it does not exist, set the remote, and ensure the local branch is `main`.

- [ ] **Step 5: Push and verify the remote**

  Run `git push -u origin main`, then verify `git log --oneline --decorate -5`, `git remote -v`, and the GitHub repository URL.
