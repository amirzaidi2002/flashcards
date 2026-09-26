# Spanish Flashcards App — Implementation TODO Checklist

## Phase 0 — Project Foundation

Goal: Get the React/TypeScript/Vite application running with a clean architecture.

### 0.1 Create the project

* [x] Create a new Vite React + TypeScript project.
* [x] Configure TypeScript.
* [x] Configure ESLint.
* [x] Configure Prettier.
* [x] Add a test framework such as Vitest.
* [x] Add React Testing Library.
* [x] Create the initial Git repository structure.

**Acceptance Criteria**

* [x] `npm install` completes successfully.
* [x] `npm run dev` starts the application.
* [x] `npm run build` completes without errors.
* [x] TypeScript compilation succeeds.
* [x] Linting succeeds.
* [x] At least one automated test runs successfully.

---

### 0.2 Establish the application folder structure

* [x] Create `components`, `pages`, `domain`, `services`, `repositories`, `storage`, `types`, `utils`, and `data` directories.
* [x] Create placeholder files for the major services and repositories.
* [x] Establish import/path conventions.

**Acceptance Criteria**

* [x] Application follows the defined architectural structure.
* [x] UI components do not directly access IndexedDB.
* [x] Business logic can be implemented independently of React components.

---

### 0.3 Add application routing

* [x] Add React Router.
* [x] Create routes for:

  * [x] Study
  * [x] Quiz
  * [x] Decks
  * [x] Statistics
  * [x] Import
* [x] Add a basic navigation component.
* [x] Add a default/home route.

**Acceptance Criteria**

* [x] Every primary screen has a working route.
* [x] Navigation works without full-page reloads.
* [x] Invalid routes show a useful fallback page.

---

# Phase 1 — Static Data and Basic UI

Goal: Build the simplest possible flashcard experience before adding persistence or learning logic.

### 1.1 Define TypeScript domain models

* [x] Create `Flashcard` type/interface.
* [x] Create `Deck` type/interface.
* [x] Create `StudySession` type/interface.
* [x] Create `StudyAttempt` type/interface.
* [x] Create quiz-related types.
* [x] Keep future `userId` extensibility in mind.

**Acceptance Criteria**

* [x] All core domain objects have strongly typed interfaces.
* [x] No `any` is required for core domain logic.
* [x] Flashcards can be represented independently of React state.

---

### 1.2 Create the initial deck dataset

* [x] Create starter decks.
* [x] Create initial Spanish/English cards.
* [x] Store seed data in JSON/TypeScript data files.
* [x] Include at least several decks.
* [x] Include enough cards for meaningful testing.

**Acceptance Criteria**

* [x] The application contains predefined cards on first launch.
* [x] Every seeded card has Spanish text, English text, and a deck.
* [x] Every deck contains valid cards.
* [x] No duplicate card IDs exist.

---

### 1.3 Build the application shell

* [x] Create the main layout.
* [x] Build header/navigation.
* [x] Add responsive page container.
* [x] Create reusable buttons and basic UI primitives.
* [x] Establish typography and spacing conventions.

**Acceptance Criteria**

* [x] All major pages render inside a consistent layout.
* [x] Navigation is usable on desktop and mobile.
* [x] UI has a consistent visual language.

---

### 1.4 Build the deck list

* [x] Create a Decks page.
* [x] Display all predefined decks.
* [x] Show deck name.
* [x] Show card count.
* [x] Add a button to study a deck.
* [x] Add a button to quiz a deck.

**Acceptance Criteria**

* [x] All decks appear on the Decks page.
* [x] Card counts are accurate.
* [x] Selecting a deck navigates to the correct study/quiz screen.

---

# Phase 2 — Core Flashcard Experience

Goal: Create the primary learning interaction.

### 2.1 Build the flashcard component

* [x] Create a reusable `Flashcard` component.
* [x] Display Spanish on the front.
* [x] Display English on the back.
* [x] Add a flip animation.
* [x] Add "Show Answer" interaction.
* [x] Add correct/incorrect controls on the back.

**Acceptance Criteria**

* [x] Spanish is visible before the card is flipped.
* [x] English is not visible before the card is flipped.
* [x] Card flips reliably.
* [x] Correct and incorrect controls appear after revealing the answer.
* [x] The component works on mobile and desktop.

---

### 2.2 Add keyboard accessibility to the flashcard

* [x] Support keyboard interaction for flipping.
* [x] Support keyboard navigation for answer buttons.
* [x] Add accessible labels.
* [x] Add visible focus states.

**Acceptance Criteria**

* [x] The entire study flow can be completed without a mouse.
* [x] Buttons are reachable using keyboard navigation.
* [x] Screen readers receive meaningful labels.
* [x] Focus is not lost unexpectedly.

---

### 2.3 Build a basic study session

* [x] Add "Start Studying".
* [x] Load cards for the selected deck.
* [x] Display one card at a time.
* [x] Add "Next Card".
* [x] Track cards completed during the current session.
* [x] Display progress such as `5 / 20`.

**Acceptance Criteria**

* [x] User can start a session for a selected deck.
* [x] Exactly one current card is displayed.
* [x] User can progress through the cards.
* [x] Progress updates correctly.
* [x] Session ends when all selected cards have been processed.

---

### 2.4 Add correct/incorrect session state

* [x] Track correct answers for the current session.
* [x] Track incorrect answers for the current session.
* [x] Record results in memory first.
* [x] Display a simple session summary.

**Acceptance Criteria**

* [x] Every answered card produces exactly one result.
* [x] Correct count is accurate.
* [x] Incorrect count is accurate.
* [x] Session summary matches the user's responses.

---

# Phase 3 — Learning Logic

Goal: Make the application remember what the user knows and does not know.

### 3.1 Implement card result tracking

* [x] Increment `timesStudied`.
* [x] Increment `correctCount`.
* [x] Increment `incorrectCount`.
* [x] Set `lastResult`.
* [x] Set `lastStudiedAt`.

**Acceptance Criteria**

* [x] A correct answer increments only the correct counter.
* [x] An incorrect answer increments only the incorrect counter.
* [x] Total study attempts equal correct + incorrect.
* [x] Last-result information reflects the latest attempt.

---

### 3.2 Implement incorrect-card tracking

* [x] Identify cards that need review.
* [x] Define the initial review rule.
* [x] Add a service method for retrieving review cards.
* [x] Display the number of cards needing review.

Suggested initial rule:

```text
incorrectCount > 0
OR
lastResult === "incorrect"
```

**Acceptance Criteria**

* [x] A newly missed card becomes eligible for review.
* [x] A card that has never been answered does not appear in the review set.
* [x] Review count matches the number of eligible cards.

---

### 3.3 Implement adaptive card selection

* [x] Build a card-selection service.
* [x] Prioritize cards that were recently missed.
* [x] Prioritize cards with high incorrect rates.
* [x] Avoid showing the same card repeatedly without a short delay.
* [x] Allow lower-priority cards to appear as needed.

**Acceptance Criteria**

* [x] Missed cards receive greater selection priority than consistently correct cards.
* [x] A card marked wrong can reappear later in the same study session.
* [x] The card-selection logic is independently unit-testable.
* [x] Selecting cards does not depend on React components.

---

### 3.4 Build "Review Cards I Don't Know"

* [x] Add a review entry point.
* [x] Load only review-eligible cards.
* [x] Run them through the normal flashcard interaction.
* [x] Update their learning state.
* [x] Allow the user to finish the review session.

**Acceptance Criteria**

* [x] Review mode contains only cards requiring review.
* [x] A card marked wrong remains eligible for review.
* [x] A card marked correctly can eventually leave the active review set according to the defined rule.
* [x] Starting review mode with zero eligible cards shows an appropriate empty state.

---

# Phase 4 — Local Persistence

Goal: Make the application survive browser refreshes.

### 4.1 Set up IndexedDB

* [ ] Add Dexie or another IndexedDB abstraction.
* [ ] Create database initialization.
* [ ] Create tables/stores for:

  * [ ] Decks
  * [ ] Flashcards
  * [ ] Study sessions
  * [ ] Study attempts
  * [ ] Settings

**Acceptance Criteria**

* [ ] Database initializes successfully.
* [ ] Application can create/read/update records.
* [ ] Database operations are asynchronous.
* [ ] No React component directly performs raw IndexedDB operations.

---

### 4.2 Implement repository interfaces

* [ ] Create `FlashcardRepository`.
* [ ] Create `DeckRepository`.
* [ ] Create `StudySessionRepository`.
* [ ] Implement IndexedDB-backed repositories.

**Acceptance Criteria**

* [ ] Domain/services interact with repositories rather than IndexedDB directly.
* [ ] Repositories can be mocked in unit tests.
* [ ] Replacing IndexedDB with an API-backed implementation would not require UI changes.

---

### 4.3 Migrate seed data into local storage

* [ ] Detect first application launch.
* [ ] Load predefined decks into IndexedDB.
* [ ] Load predefined cards into IndexedDB.
* [ ] Prevent duplicate seeding.

**Acceptance Criteria**

* [ ] First launch creates the starter dataset.
* [ ] Refreshing the application does not duplicate cards.
* [ ] Existing user data is preserved.

---

### 4.4 Persist study results

* [ ] Save flashcard updates.
* [ ] Save study sessions.
* [ ] Save study attempts.
* [ ] Restore statistics from IndexedDB.

**Acceptance Criteria**

* [ ] Correct/incorrect results survive refresh.
* [ ] Review cards survive refresh.
* [ ] Completed sessions survive refresh.
* [ ] Statistics survive refresh.

---

### 4.5 Add storage error handling

* [ ] Handle database initialization failure.
* [ ] Handle read/write failures.
* [ ] Display a user-friendly message.
* [ ] Log useful diagnostic information during development.

**Acceptance Criteria**

* [ ] Storage failures do not cause the entire application to crash.
* [ ] The user sees a meaningful error message.
* [ ] Developers can diagnose storage failures.

---

# Phase 5 — Statistics

Goal: Give the user visibility into learning progress.

### 5.1 Implement statistics calculations

* [ ] Calculate total cards.
* [ ] Calculate cards studied.
* [ ] Calculate total sessions.
* [ ] Calculate correct answers.
* [ ] Calculate incorrect answers.
* [ ] Calculate overall accuracy.
* [ ] Calculate cards needing review.

**Acceptance Criteria**

* [ ] Statistics are calculated from persisted data.
* [ ] Accuracy is `correct / total attempts`.
* [ ] Division-by-zero cases are handled.
* [ ] Results are deterministic and unit-testable.

---

### 5.2 Build overall statistics dashboard

* [ ] Create Statistics page.
* [ ] Add total cards.
* [ ] Add cards studied.
* [ ] Add overall accuracy.
* [ ] Add study session count.
* [ ] Add cards needing review.

**Acceptance Criteria**

* [ ] Every displayed metric matches persisted data.
* [ ] Statistics update after a completed session.
* [ ] Statistics work correctly with zero activity.

---

### 5.3 Build per-session statistics

* [ ] Store session start time.
* [ ] Store session end time.
* [ ] Calculate session duration.
* [ ] Display cards studied.
* [ ] Display correct/incorrect.
* [ ] Display session accuracy.
* [ ] Display recent sessions.

**Acceptance Criteria**

* [ ] Every completed session appears in session history.
* [ ] Session accuracy is correct.
* [ ] Duration is calculated correctly.
* [ ] Most recent sessions appear first.

---

### 5.4 Build deck-level statistics

* [ ] Show studied cards per deck.
* [ ] Show accuracy per deck.
* [ ] Show review cards per deck.
* [ ] Show total cards per deck.

**Acceptance Criteria**

* [ ] Each deck displays independent statistics.
* [ ] Deck statistics do not include cards from other decks.
* [ ] Statistics update after studying the deck.

---

# Phase 6 — Quiz Mode

Goal: Add assessment functionality after the basic learning system is stable.

### 6.1 Create quiz session model

* [ ] Define quiz state.
* [ ] Define question state.
* [ ] Define answer option state.
* [ ] Define quiz result data.

**Acceptance Criteria**

* [ ] Quiz state is strongly typed.
* [ ] A quiz can track current question and score.
* [ ] Quiz results can be persisted.

---

### 6.2 Generate multiple-choice questions

* [ ] Select a deck.
* [ ] Select a Spanish card.
* [ ] Generate the correct English answer.
* [ ] Generate three incorrect answers.
* [ ] Prevent duplicate options.

**Acceptance Criteria**

* [ ] Normal quiz questions contain four unique options.
* [ ] Exactly one option is correct.
* [ ] Incorrect choices are not the same as the correct answer.
* [ ] Questions can be generated repeatedly without corrupting state.

---

### 6.3 Handle small decks

* [ ] Define behavior when fewer than four unique cards exist.
* [ ] Either reduce the number of options or display a useful message.

**Acceptance Criteria**

* [ ] Quiz never generates duplicate answer choices.
* [ ] A deck with fewer than four cards does not crash the application.
* [ ] The user receives an understandable result.

---

### 6.4 Build quiz UI

* [ ] Display Spanish vocabulary.
* [ ] Display answer choices.
* [ ] Provide answer feedback.
* [ ] Disable additional choices after answering.
* [ ] Show progress.

**Acceptance Criteria**

* [ ] User can answer every question.
* [ ] Correct/incorrect feedback is immediately visible.
* [ ] User cannot submit multiple answers for one question.
* [ ] Progress accurately reflects quiz position.

---

### 6.5 Build quiz results

* [ ] Display score.
* [ ] Display accuracy.
* [ ] Display correct answers.
* [ ] Display incorrect answers.
* [ ] Provide "Try Again".
* [ ] Provide "Review Missed Cards".

**Acceptance Criteria**

* [ ] Final score matches answered questions.
* [ ] Accuracy is correct.
* [ ] Missed cards are available for review.
* [ ] Retaking a quiz starts a fresh quiz session.

---

### 6.6 Persist quiz results

* [ ] Save quiz results.
* [ ] Include quiz activity in statistics where appropriate.
* [ ] Distinguish study sessions from quiz sessions.

**Acceptance Criteria**

* [ ] Quiz results survive refresh.
* [ ] Statistics accurately represent quiz activity.
* [ ] Study and quiz records are not incorrectly merged.

---

# Phase 7 — Import CSV/JSON

Goal: Allow the user to expand the vocabulary without manually creating cards.

### 7.1 Build CSV parser

* [ ] Accept `.csv` files.
* [ ] Parse headers.
* [ ] Read Spanish/English fields.
* [ ] Optionally read deck.
* [ ] Report malformed rows.

**Acceptance Criteria**

* [ ] Valid CSV files are parsed successfully.
* [ ] Required fields are detected.
* [ ] Invalid rows are identified rather than silently discarded.
* [ ] Parsing does not corrupt existing data.

---

### 7.2 Build JSON parser

* [ ] Accept `.json` files.
* [ ] Parse arrays of cards.
* [ ] Validate object structure.
* [ ] Support optional deck values.

**Acceptance Criteria**

* [ ] Valid JSON imports successfully.
* [ ] Invalid JSON produces a user-friendly error.
* [ ] Cards missing required fields are rejected.
* [ ] Existing data remains unchanged when an import fails.

---

### 7.3 Build import validation

* [ ] Validate Spanish field.
* [ ] Validate English field.
* [ ] Validate deck field when supplied.
* [ ] Detect blank records.
* [ ] Detect duplicate cards.
* [ ] Report row numbers for errors where possible.

**Acceptance Criteria**

* [ ] Invalid records are clearly identified.
* [ ] Valid records can be imported without manual correction.
* [ ] User can understand why invalid records were rejected.

---

### 7.4 Build import preview

* [ ] Show parsed cards before importing.
* [ ] Display valid records.
* [ ] Display warnings.
* [ ] Display errors.
* [ ] Add Cancel action.
* [ ] Add Confirm Import action.

**Acceptance Criteria**

* [ ] No records are persisted before confirmation.
* [ ] User can cancel an import.
* [ ] Preview accurately represents what will be imported.

---

### 7.5 Implement duplicate handling

* [ ] Detect existing cards.
* [ ] Support "Skip duplicates".
* [ ] Support "Replace existing".
* [ ] Support "Import as new".
* [ ] Default to "Skip duplicates".

**Acceptance Criteria**

* [ ] Existing cards are never accidentally overwritten under the default behavior.
* [ ] Duplicate counts are reported.
* [ ] Each duplicate mode behaves according to its documented behavior.

---

### 7.6 Import into decks

* [ ] Allow imported cards to specify a deck.
* [ ] Allow the user to select a destination deck.
* [ ] Optionally create a new deck from imported data.

**Acceptance Criteria**

* [ ] Imported cards appear in the intended deck.
* [ ] Cards without a deck cannot be imported without a valid destination.
* [ ] Deck card counts update after import.

---

# Phase 8 — UX and Accessibility Polish

Goal: Make the application pleasant and production-quality.

### 8.1 Responsive mobile design

* [ ] Optimize flashcard dimensions for mobile.
* [ ] Make answer buttons touch-friendly.
* [ ] Verify navigation on narrow screens.
* [ ] Verify statistics layout on mobile.

**Acceptance Criteria**

* [ ] Core flows work without horizontal scrolling.
* [ ] Buttons can be comfortably tapped.
* [ ] Text remains readable on small screens.

---

### 8.2 Loading states

* [ ] Add loading indicators for storage operations.
* [ ] Add loading states for sessions/statistics.
* [ ] Prevent duplicate submissions.

**Acceptance Criteria**

* [ ] Users receive feedback while asynchronous operations run.
* [ ] The same action cannot accidentally be submitted twice.

---

### 8.3 Empty states

* [ ] No cards available.
* [ ] No review cards.
* [ ] No study history.
* [ ] Empty deck.
* [ ] Empty quiz candidate set.

**Acceptance Criteria**

* [ ] Every empty state explains what happened.
* [ ] Each empty state provides a useful next action where appropriate.

---

### 8.4 Accessibility audit

* [ ] Verify keyboard navigation.
* [ ] Verify focus states.
* [ ] Verify accessible labels.
* [ ] Verify color contrast.
* [ ] Verify reduced-motion behavior.

**Acceptance Criteria**

* [ ] All major user flows can be completed using a keyboard.
* [ ] Interactive elements have accessible names.
* [ ] Feedback does not rely on color alone.
* [ ] Reduced-motion preferences are respected.

---

# Phase 9 — Robustness and Quality

Goal: Harden the application before considering the MVP complete.

### 9.1 Add unit tests for learning logic

* [ ] Test card selection.
* [ ] Test incorrect-card prioritization.
* [ ] Test review-card determination.
* [ ] Test statistics calculation.
* [ ] Test quiz scoring.

**Acceptance Criteria**

* [ ] Core business logic has automated tests.
* [ ] Edge cases are covered.
* [ ] Tests do not require a browser UI.

---

### 9.2 Add component tests

* [ ] Test flashcard flip.
* [ ] Test correct/incorrect interactions.
* [ ] Test quiz selection.
* [ ] Test import preview.
* [ ] Test statistics rendering.

**Acceptance Criteria**

* [ ] Major interactive components have tests.
* [ ] Tests verify observable user behavior.

---

### 9.3 Add end-to-end tests

Recommended flows:

* [ ] Start a study session.
* [ ] Mark cards correct/incorrect.
* [ ] Finish a session.
* [ ] Review missed cards.
* [ ] Take a quiz.
* [ ] Import CSV.
* [ ] Refresh and verify persistence.

**Acceptance Criteria**

* [ ] Core end-to-end workflows pass consistently.
* [ ] A complete study flow can be executed automatically.

---

### 9.4 Add data migration/versioning

* [ ] Version the IndexedDB schema.
* [ ] Add migration strategy.
* [ ] Document schema changes.
* [ ] Test upgrades from older schema versions.

**Acceptance Criteria**

* [ ] Schema changes do not silently destroy user data.
* [ ] Existing data can be upgraded safely.
* [ ] Database version is explicitly managed.

---

# Phase 10 — Performance and Offline Improvements

Goal: Prepare the application for larger datasets and stronger offline behavior.

### 10.1 Performance testing

* [ ] Test with hundreds of cards.
* [ ] Test with thousands of cards.
* [ ] Measure startup performance.
* [ ] Measure study-session responsiveness.
* [ ] Measure large imports.

**Acceptance Criteria**

* [ ] Study interactions remain responsive with large datasets.
* [ ] Large imports do not freeze the browser unnecessarily.
* [ ] Rendering remains stable as the dataset grows.

---

### 10.2 Optimize database access

* [ ] Add appropriate indexes.
* [ ] Avoid loading unnecessary records.
* [ ] Batch import operations.
* [ ] Batch updates where appropriate.

**Acceptance Criteria**

* [ ] Large datasets remain usable.
* [ ] Queries retrieve only required data.
* [ ] Import performance is acceptable for the supported dataset size.

---

### 10.3 Add PWA/offline support

* [ ] Add service worker.
* [ ] Cache application assets.
* [ ] Support offline application launch.
* [ ] Confirm study mode works offline.

**Acceptance Criteria**

* [ ] After initial installation/loading, the application can launch without network access.
* [ ] Existing local cards and progress remain available offline.
* [ ] Offline operation does not corrupt stored data.

---

# Phase 11 — Architectural Preparation for Multi-User Support

Goal: Prepare for accounts and cloud synchronization without prematurely building a backend.

### 11.1 Introduce user ownership into the domain model

* [ ] Define an optional/future `userId`.
* [ ] Keep repositories capable of filtering by user.
* [ ] Avoid assuming there can only ever be one user.

**Acceptance Criteria**

* [ ] Domain models can support user ownership without redesign.
* [ ] Repository contracts can eventually scope data by user.

---

### 11.2 Introduce a local-user abstraction

* [ ] Create a local-user identity.
* [ ] Associate local records with that identity.
* [ ] Keep the implementation behind a user/session service.

**Acceptance Criteria**

* [ ] Current application behaves exactly like a single-user app.
* [ ] User identity is not hard-coded throughout the application.
* [ ] Replacing the local identity with authenticated identity would not require UI rewrites.

---

### 11.3 Create authentication-ready interfaces

* [ ] Define an authentication service interface.
* [ ] Define a user model.
* [ ] Define session/authentication state.
* [ ] Keep authentication implementation out of the domain layer.

Example:

```typescript
interface AuthService {
  getCurrentUser(): Promise<User | null>;
  signIn(credentials: Credentials): Promise<User>;
  signOut(): Promise<void>;
}
```

**Acceptance Criteria**

* [ ] UI can query the current user through an abstraction.
* [ ] Core learning logic does not depend on a specific authentication provider.
* [ ] Authentication can later be added without rewriting study/quiz logic.

---

# Phase 12 — Future Spaced Repetition

Goal: Upgrade the simple retry system into a more sophisticated learning algorithm.

### 12.1 Define learning states

* [ ] Define New.
* [ ] Define Learning.
* [ ] Define Familiar.
* [ ] Define Review.
* [ ] Define Mastered.

**Acceptance Criteria**

* [ ] Every card can have a clearly defined learning state.
* [ ] State transitions are deterministic.

---

### 12.2 Add scheduling data

* [ ] Add interval.
* [ ] Add due date.
* [ ] Add repetition count.
* [ ] Add ease/difficulty information.

**Acceptance Criteria**

* [ ] Scheduling information is persisted.
* [ ] Existing cards without scheduling data receive sensible defaults.

---

### 12.3 Implement spaced-repetition scheduling

* [ ] Replace simple retry priority with a scheduling algorithm.
* [ ] Prioritize cards based on due date and performance.
* [ ] Preserve the review-mode concept.
* [ ] Keep the algorithm isolated behind a service/interface.

**Acceptance Criteria**

* [ ] Due cards are selected appropriately.
* [ ] Successful cards receive progressively longer intervals.
* [ ] Difficult cards receive shorter intervals.
* [ ] The scheduling algorithm is independently testable.

---

# Final MVP Checklist

The application should not be considered MVP-complete until all of the following are checked:

## Foundation

* [ ] React + TypeScript + Vite application works.
* [ ] Routing works.
* [ ] Automated testing works.

## Flashcards

* [ ] Predefined Spanish/English cards exist.
* [ ] Cards belong to decks.
* [ ] Spanish appears before English.
* [ ] Cards flip.
* [ ] User can mark Correct/Wrong.
* [ ] Progress is shown during study.

## Learning

* [ ] Incorrect cards are remembered.
* [ ] Incorrect cards receive higher priority.
* [ ] User can review cards they don't know.
* [ ] Learning data persists across browser refreshes.

## Quiz

* [ ] Multiple-choice quizzes work.
* [ ] Four-option questions work where enough cards exist.
* [ ] Correct/incorrect answers are tracked.
* [ ] Quiz results are shown.
* [ ] Missed cards can be reviewed.

## Statistics

* [ ] Overall statistics work.
* [ ] Session statistics work.
* [ ] Deck statistics work.
* [ ] Accuracy is correct.

## Import

* [ ] CSV import works.
* [ ] JSON import works.
* [ ] Validation works.
* [ ] Preview works.
* [ ] Duplicate handling works.
* [ ] Imported cards persist.

## UX

* [ ] Responsive desktop/mobile layout works.
* [ ] Keyboard navigation works.
* [ ] Empty states exist.
* [ ] Loading/error states exist.
* [ ] Accessibility requirements are addressed.

## Architecture

* [ ] Business logic is separated from UI.
* [ ] Repository pattern is implemented.
* [ ] IndexedDB is abstracted behind repositories.
* [ ] Data model can support future `userId`.
* [ ] Authentication can be introduced without redesigning the learning domain.

---

# Suggested Implementation Order

For the actual development sequence, implement the items in roughly this order:

```text
1.  Project Foundation
2.  Domain Models
3.  Seed Data
4.  Application Shell + Routing
5.  Deck List
6.  Flashcard UI
7.  Basic Study Session
8.  Correct/Incorrect Tracking
9.  IndexedDB
10. Repository Layer
11. Persist Study Results
12. Review Cards
13. Adaptive Card Selection
14. Statistics
15. Multiple-Choice Quiz
16. CSV Import
17. JSON Import
18. Duplicate Handling
19. Responsive/Accessibility Polish
20. Automated Test Coverage
21. Performance Hardening
22. Multi-user Architecture Preparation
23. Spaced Repetition
24. Authentication + Backend
25. Cloud Synchronization
```

The key principle is to **build one complete vertical slice early**:

```text
Seed Card
   ↓
Display Card
   ↓
Flip Card
   ↓
Mark Right/Wrong
   ↓
Save Result
   ↓
Refresh Browser
   ↓
Result Still Exists
```

Once that slice works, the quiz, statistics, import, and more advanced learning capabilities can be layered on top without having to redesign the core application.
