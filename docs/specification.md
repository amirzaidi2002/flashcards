# Spanish Flashcards Web Application

## Software Specification

**Version:** 1.0
**Status:** Initial Product Specification
**Target Platform:** Web
**Frontend:** TypeScript + React + Vite
**Initial Storage:** IndexedDB / local browser storage
**Initial User Model:** Single user
**Future User Model:** Multi-user with authentication and cloud persistence

---

# 1. Product Overview

The Spanish Flashcards application is a responsive web application designed to help users learn Spanish vocabulary through interactive flashcards, repeated practice, quizzes, and progress tracking.

The initial version will be a **single-user, browser-based application** with no required backend or account. User progress and custom imported cards will be persisted locally in the browser.

The application architecture and data model should, however, be designed so that a future version can introduce:

* User accounts and authentication
* Cloud-based data persistence
* Cross-device synchronization
* Multiple users
* User-specific decks and learning history

The primary learning experience is:

> **See Spanish → recall English → flip card → reveal English → mark Correct/Wrong → continue**

Cards marked incorrect should receive higher priority so the user can quickly revisit vocabulary they do not yet know.

---

# 2. Goals

## 2.1 Primary Goals

The application must allow a user to:

1. Study Spanish vocabulary using flashcards.
2. See a Spanish word without immediately seeing its English translation.
3. Flip the card to reveal the English translation.
4. Mark whether they knew the answer.
5. Automatically remember incorrect cards.
6. Practice only cards they previously got wrong.
7. Organize flashcards into decks/categories.
8. Take multiple-choice quizzes.
9. Import flashcards from CSV or JSON.
10. View overall learning statistics.
11. View statistics for individual study sessions.
12. Persist learning progress across browser refreshes.
13. Use the application comfortably on desktop and mobile devices.

## 2.2 Secondary Goals

The architecture should make it straightforward to add:

* User authentication
* Backend APIs
* Cloud storage
* Synchronization between devices
* Spaced repetition
* Audio pronunciation
* Example sentences
* Additional languages
* More advanced quiz modes

---

# 3. Non-Goals for Version 1

The following capabilities are explicitly outside the initial release:

* User registration/login
* Social accounts
* Cloud synchronization
* Audio pronunciation
* Images
* Example sentences
* Grammar lessons
* Sentence construction
* Fill-in-the-blank quizzes
* AI-generated translations
* AI-generated cards
* Subscription/payment functionality
* Teacher/classroom functionality

The data model should not prevent these capabilities from being added later.

---

# 4. Target Users

## Initial User

A single person learning Spanish vocabulary.

The application should not require:

* Registration
* Login
* Internet connectivity after the application has loaded
* A backend server

## Future Users

The system should eventually support multiple users, where each user's:

* Decks
* Cards
* Study history
* Quiz results
* Statistics
* Preferences

are isolated from other users.

---

# 5. Core User Experience

The application should use a **simple, clean, friendly visual design inspired by modern language-learning applications such as Duolingo**, without attempting to reproduce its branding or UI.

The design should emphasize:

* Large readable vocabulary
* Clear calls to action
* Minimal distractions
* Immediate feedback
* Progress visibility
* Mobile-friendly interaction
* Positive reinforcement

---

# 6. Application Navigation

The primary navigation should contain:

1. **Study**
2. **Quiz**
3. **Decks**
4. **Statistics**
5. **Import**

A future version may add:

6. **Account**
7. **Settings**

Recommended route structure:

```text
/
├── /study
├── /study/:deckId
├── /study/review
├── /quiz
├── /quiz/:deckId
├── /decks
├── /decks/:deckId
├── /statistics
├── /import
└── /settings
```

Future authentication could add:

```text
/login
/register
/account
```

---

# 7. Flashcard Data Model

Each flashcard represents a Spanish vocabulary item and its English translation.

## 7.1 Minimum Card Fields

```typescript
interface Flashcard {
  id: string;
  spanish: string;
  english: string;
  deckId: string;

  createdAt: string;
  updatedAt: string;

  timesStudied: number;
  correctCount: number;
  incorrectCount: number;

  lastStudiedAt?: string;
  lastResult?: "correct" | "incorrect";
}
```

## 7.2 Future Learning Fields

The model should allow future addition of spaced-repetition fields without requiring a major migration:

```typescript
interface LearningState {
  intervalDays?: number;
  easeFactor?: number;
  dueAt?: string;
  repetitionCount?: number;
}
```

These should not be required for Version 1.

---

# 8. Deck Data Model

Cards should belong to a deck/category.

```typescript
interface Deck {
  id: string;
  name: string;
  description?: string;

  cardCount: number;

  createdAt: string;
  updatedAt: string;
}
```

Example decks:

```text
Beginner Vocabulary
Common Verbs
Food
Travel
Numbers
Adjectives
Daily Conversation
```

Version 1 should include several predefined decks.

---

# 9. Predefined Flashcard Dataset

The application must ship with a predefined Spanish/English vocabulary dataset.

Example:

| Spanish | English   | Deck     |
| ------- | --------- | -------- |
| hola    | hello     | Beginner |
| adiós   | goodbye   | Beginner |
| gracias | thank you | Beginner |
| casa    | house     | Beginner |
| comida  | food      | Beginner |
| agua    | water     | Beginner |
| perro   | dog       | Animals  |
| gato    | cat       | Animals  |

The initial release should contain enough cards to make the application useful immediately.

A recommended starting dataset is approximately:

**100–300 cards**

organized across several beginner-friendly decks.

---

# 10. Study Mode

Study Mode is the primary learning experience.

## 10.1 Study Flow

The standard flow is:

```text
Select Deck
   ↓
Start Study Session
   ↓
Display Spanish Word
   ↓
User thinks of English translation
   ↓
User flips card
   ↓
Display English Translation
   ↓
User selects:
   ├── I Got It
   └── I Got It Wrong
   ↓
Record result
   ↓
Show next card
```

## 10.2 Front of Card

The front of the card displays:

```text
hola
```

The English translation must not be visible.

Optional supporting UI:

```text
Card 4 of 20
```

and a progress indicator.

## 10.3 Card Flip

The user should be able to flip the card by:

* Clicking/tapping the card
* Clicking a "Show Answer" button

Keyboard interaction should also be supported where practical.

## 10.4 Back of Card

The back should display:

```text
hola

hello
```

The Spanish word should remain visible so the user can associate the two words.

Below the card:

```text
[ I Got It Wrong ]     [ I Got It Right ]
```

---

# 11. Correct / Incorrect Tracking

When the user selects **I Got It Right**:

The system must:

* Record the study attempt.
* Increment `timesStudied`.
* Increment `correctCount`.
* Set `lastResult = "correct"`.
* Update `lastStudiedAt`.

When the user selects **I Got It Wrong**:

The system must:

* Record the study attempt.
* Increment `timesStudied`.
* Increment `incorrectCount`.
* Set `lastResult = "incorrect"`.
* Update `lastStudiedAt`.
* Add/increase the card's retry priority.

---

# 12. Learning Algorithm

Version 1 should use a simple adaptive learning algorithm.

The objective is not to implement a sophisticated spaced-repetition system initially. Instead, the application should focus on rapidly identifying cards the user does not know.

## 12.1 Card Priority

Cards should generally be selected using the following priority:

```text
High Priority
    ↓
Recently missed cards
    ↓
Cards with high incorrect rate
    ↓
Cards not recently studied
    ↓
Cards the user consistently answers correctly
    ↓
Low Priority
```

## 12.2 Retry Behavior

Cards marked incorrect should be eligible to reappear later in the same session.

Example:

```text
Card A → Wrong
Card B → Right
Card C → Right
Card A → appears again
```

The same card should not immediately reappear every time. A short delay should be introduced so the user has another opportunity to recall it.

## 12.3 Review Incorrect Cards

The application must provide:

**"Review Cards I Don't Know"**

This mode creates a study session containing cards that meet one or more of these conditions:

```text
incorrectCount > 0
AND/OR
lastResult = incorrect
```

The user should be able to continue reviewing these cards until they demonstrate improvement.

## 12.4 Future Spaced Repetition

The architecture should allow the learning algorithm to evolve into a full spaced-repetition system.

Potential future states:

```text
New
Learning
Familiar
Mastered
Review
```

A future algorithm could use:

* Frequency of errors
* Time since last review
* Success streak
* Difficulty
* Interval
* Ease factor

---

# 13. Study Sessions

Every time the user starts a study session, the system should create a session record.

```typescript
interface StudySession {
  id: string;
  deckId?: string;

  startedAt: string;
  completedAt?: string;

  cardsStudied: number;
  correctCount: number;
  incorrectCount: number;
}
```

A session may represent:

* A full deck
* A selected subset
* Incorrect-card review

---

# 14. Quiz/Test Mode

Quiz Mode provides a more formal assessment experience.

Version 1 will support:

**Multiple Choice**

Fill-in-the-blank is reserved for a future release.

---

# 15. Multiple-Choice Quiz

## 15.1 Quiz Flow

```text
Select Deck
   ↓
Start Quiz
   ↓
Show Spanish Word
   ↓
Display 4 English options
   ↓
User selects answer
   ↓
Show correct/incorrect feedback
   ↓
Continue
   ↓
Show final results
```

## 15.2 Answer Options

The application should normally display four choices:

```text
hola

A. goodbye
B. hello
C. thank you
D. good night
```

The correct answer should come from the flashcard.

Incorrect choices should be selected automatically from other cards in the same deck when possible.

## 15.3 Distractor Rules

Incorrect choices should:

* Come from the same deck where possible.
* Be unique.
* Never equal the correct answer.
* Preferably have similar difficulty.

Future versions may use semantic or difficulty-aware distractor generation.

---

# 16. Quiz Feedback

After answering, the application should clearly indicate:

### Correct

```text
✓ Correct!

hola = hello
```

### Incorrect

```text
✗ Incorrect

You selected: goodbye
Correct answer: hello
```

The result must be recorded in the user's statistics.

---

# 17. Quiz Results

At the end of the quiz, display:

```text
Quiz Complete

Score
8 / 10

Accuracy
80%

Correct
8

Incorrect
2
```

The user should have options to:

```text
[ Try Again ]
[ Review Missed Cards ]
[ Back to Deck ]
```

---

# 18. Statistics

The Statistics page should provide both **overall statistics** and **individual session statistics**.

---

# 19. Overall Statistics

The overall dashboard should include:

* Total cards
* Total cards studied
* Total study sessions
* Total correct answers
* Total incorrect answers
* Overall accuracy
* Number of cards currently requiring review
* Number of cards never studied

Example:

```text
Learning Progress

Cards
250 total
187 studied

Accuracy
84%

Study Sessions
23

Need Review
31
```

---

# 20. Per-Session Statistics

For each study session:

```text
Session Date
September 26, 2026

Cards Studied
20

Correct
16

Incorrect
4

Accuracy
80%

Duration
8 minutes
```

Recent sessions should be displayed in a list or table.

---

# 21. Deck Statistics

Each deck should display:

```text
Beginner Vocabulary

Cards: 50
Studied: 42
Accuracy: 86%
Needs Review: 8
```

This provides the user with a quick understanding of progress by category.

---

# 22. Import Functionality

The application must support importing flashcards from:

* CSV
* JSON

Imported cards should be mapped into an existing deck or a newly created deck.

---

# 23. CSV Import

Example CSV:

```csv
spanish,english,deck
hola,hello,Beginner
gracias,thank you,Beginner
casa,house,Beginner
perro,dog,Animals
```

Minimum required columns:

```text
spanish
english
```

Optional:

```text
deck
```

If no deck is provided, the user must be prompted to select a destination deck.

---

# 24. JSON Import

Example:

```json
[
  {
    "spanish": "hola",
    "english": "hello",
    "deck": "Beginner"
  },
  {
    "spanish": "gracias",
    "english": "thank you",
    "deck": "Beginner"
  }
]
```

The importer should validate:

* Required fields
* Empty values
* Duplicate cards
* Invalid file format
* Unsupported extensions

---

# 25. Import Workflow

```text
Import
  ↓
Select CSV or JSON
  ↓
Parse file
  ↓
Validate data
  ↓
Display preview
  ↓
Report errors/warnings
  ↓
User confirms import
  ↓
Create/update cards
  ↓
Show import results
```

Example:

```text
Import Preview

Valid Cards: 48
Warnings: 2
Errors: 1

[ Cancel ] [ Import 48 Cards ]
```

The application should never silently import malformed records.

---

# 26. Duplicate Handling

When importing a card that already exists, the user should be given a choice:

```text
Skip duplicates
Replace existing cards
Import as new cards
```

The default should be:

**Skip duplicates**

---

# 27. Deck Management

Version 1 should include predefined decks.

Users should be able to:

* View decks
* Open a deck
* Study a deck
* Quiz on a deck
* View deck statistics
* Import cards into a deck

The application should not provide manual card creation/edit/delete in Version 1.

The code architecture should nevertheless separate the card repository from the UI so CRUD functionality can be added later.

---

# 28. Local Persistence

The application should persist data locally in the browser.

## Recommended Approach

Use:

**IndexedDB**

for application data.

Recommended storage structure:

```text
IndexedDB
└── spanish-flashcards
    ├── decks
    ├── flashcards
    ├── studySessions
    ├── studyAttempts
    └── settings
```

`localStorage` may be used for small UI preferences such as:

```text
theme
last selected deck
user preferences
```

IndexedDB should be preferred for actual learning data because it is better suited to larger datasets and structured records.

---

# 29. Persistence Requirements

After a browser refresh:

* Imported cards must remain.
* Study progress must remain.
* Statistics must remain.
* Decks must remain.
* Incorrect-card state must remain.

The application should not require a server to restore the user's local data.

---

# 30. Future Multi-User Architecture

Although Version 1 is local-only, the application should separate business logic from storage.

Recommended architecture:

```text
React UI
   ↓
Application Services
   ↓
Repositories
   ↓
Storage Adapter
   ↓
IndexedDB
```

For the future:

```text
React UI
   ↓
Application Services
   ↓
Repositories
   ↓
Storage Adapter
   ├── IndexedDB
   └── REST/GraphQL API
             ↓
         Backend
             ↓
         Database
```

The UI should not directly depend on IndexedDB.

For example:

```typescript
interface FlashcardRepository {
  getById(id: string): Promise<Flashcard | undefined>;
  getByDeckId(deckId: string): Promise<Flashcard[]>;
  save(card: Flashcard): Promise<void>;
  delete(id: string): Promise<void>;
}
```

Version 1:

```text
IndexedDbFlashcardRepository
```

Future:

```text
ApiFlashcardRepository
```

This abstraction will make the transition to accounts and cloud storage significantly easier.

---

# 31. Future Authentication

The data model should anticipate a future `userId`.

Future models could become:

```typescript
interface Flashcard {
  id: string;
  userId: string;
  deckId: string;

  spanish: string;
  english: string;

  ...
}
```

Similarly:

```typescript
interface StudySession {
  id: string;
  userId: string;
  deckId?: string;

  ...
}
```

Version 1 may use a local default user identifier:

```text
local-user
```

This allows user-specific ownership to be introduced later without fundamentally changing the application model.

---

# 32. Technical Architecture

## Frontend

Required technologies:

```text
TypeScript
React
Vite
```

Recommended supporting technologies:

```text
React Router
IndexedDB wrapper such as Dexie
Vitest
React Testing Library
ESLint
Prettier
```

A state-management library is not required initially.

React state plus a small application/service layer should be sufficient for Version 1.

---

# 33. Suggested Project Structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers/
│
├── components/
│   ├── Flashcard/
│   ├── DeckCard/
│   ├── ProgressBar/
│   ├── QuizOption/
│   ├── StatisticsCard/
│   └── Navigation/
│
├── pages/
│   ├── StudyPage/
│   ├── QuizPage/
│   ├── DecksPage/
│   ├── StatisticsPage/
│   └── ImportPage/
│
├── domain/
│   ├── flashcards/
│   ├── decks/
│   ├── study/
│   ├── quiz/
│   └── statistics/
│
├── services/
│   ├── StudyService.ts
│   ├── QuizService.ts
│   ├── ImportService.ts
│   └── StatisticsService.ts
│
├── repositories/
│   ├── FlashcardRepository.ts
│   ├── DeckRepository.ts
│   └── StudySessionRepository.ts
│
├── storage/
│   ├── db.ts
│   └── indexedDb/
│
├── types/
│
├── utils/
│
├── data/
│   └── seed/
│       └── flashcards.json
│
└── main.tsx
```

---

# 34. Separation of Responsibilities

## UI Layer

Responsible for:

* Rendering screens
* User interaction
* Displaying application state
* Navigation

## Service Layer

Responsible for:

* Study-session logic
* Card selection
* Quiz generation
* Import processing
* Statistics calculations

## Repository Layer

Responsible for:

* Reading data
* Writing data
* Updating records
* Deleting records

## Storage Layer

Responsible for:

* IndexedDB implementation
* Database initialization
* Migrations

This separation is important because the backend can later replace the local storage implementation.

---

# 35. Core Application Services

## StudyService

Responsibilities:

```typescript
startSession()
getNextCard()
recordCorrect()
recordIncorrect()
getReviewCards()
completeSession()
```

## QuizService

Responsibilities:

```typescript
createQuiz()
generateOptions()
submitAnswer()
calculateScore()
completeQuiz()
```

## ImportService

Responsibilities:

```typescript
parseCsv()
parseJson()
validateCards()
detectDuplicates()
importCards()
```

## StatisticsService

Responsibilities:

```typescript
getOverallStatistics()
getSessionStatistics()
getDeckStatistics()
calculateAccuracy()
getCardsNeedingReview()
```

---

# 36. Application State

The system should maintain application state such as:

```typescript
interface StudyState {
  sessionId: string;
  deckId?: string;

  currentCard?: Flashcard;

  cardsRemaining: number;
  cardsCompleted: number;

  correctCount: number;
  incorrectCount: number;

  isFlipped: boolean;
}
```

State should be reset when a study session finishes.

Persisted information should be stored separately from transient UI state.

---

# 37. Error Handling

The application should gracefully handle:

* Invalid import files
* Corrupt JSON
* Invalid CSV
* Missing fields
* Duplicate records
* IndexedDB failures
* Empty decks
* Decks with fewer than four quiz choices
* Browser storage limitations
* Unexpected application errors

User-facing errors should be understandable.

Example:

```text
We couldn't import this file.

3 rows are missing an English translation.
Please correct the file and try again.
```

---

# 38. Empty States

The application should provide useful empty states.

### No Cards

```text
No flashcards available.

Import a flashcard file to get started.
```

### No Review Cards

```text
Great job!

You don't have any cards currently marked for review.
```

### No Statistics

```text
Start your first study session to see your progress here.
```

---

# 39. Responsive Design

The application must support:

* Desktop
* Tablet
* Mobile

The flashcard should remain the primary visual element.

On mobile:

```text
Header
   ↓
Progress
   ↓
Flashcard
   ↓
Flip
   ↓
Correct / Wrong
```

Buttons should be large enough to comfortably tap.

---

# 40. Accessibility

The application should follow WCAG-oriented accessibility practices.

Requirements include:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* Accessible buttons
* Appropriate ARIA labels when required
* Sufficient color contrast
* Screen-reader-friendly text
* Do not rely solely on color to indicate correctness
* Responsive text sizing

The flashcard flip interaction should remain usable without a mouse.

---

# 41. Visual Design

Design direction:

**Simple, modern, friendly, language-learning focused**

Characteristics:

* Clean white/light background
* Rounded cards
* Large typography
* Soft visual hierarchy
* Clear progress indicators
* Friendly icons
* Subtle animations
* Minimal navigation complexity

The UI should feel approachable rather than like an enterprise dashboard.

---

# 42. Animation

The flashcard should have a subtle flip animation.

Suggested behavior:

```text
Front
 ↓
3D flip
 ↓
Back
```

Animations should not interfere with usability.

Users with reduced-motion preferences should receive a reduced/no-animation experience.

---

# 43. Performance Requirements

The application should:

* Load quickly.
* Render the study screen without noticeable delay.
* Process normal imports locally without blocking the UI.
* Support at least several thousand flashcards.
* Avoid unnecessary React re-renders.
* Keep quiz transitions responsive.

Large imports should be processed asynchronously where appropriate.

---

# 44. Offline Capability

Version 1 should be designed so that once the application assets are loaded, study data is available without a backend.

A future release may convert the application into a full Progressive Web App (PWA) with:

* Service-worker caching
* Offline launch
* Offline study
* Background synchronization

---

# 45. Security Considerations

Version 1 does not contain an authentication system.

Nevertheless:

* Do not store sensitive information.
* Validate imported data.
* Treat imported files as untrusted input.
* Do not use `dangerouslySetInnerHTML` for imported content.
* Sanitize any content that could eventually be rendered as HTML.
* Keep storage access isolated within the repository layer.

Future authentication and cloud synchronization will require:

* Secure authentication
* Authorization
* User isolation
* API validation
* Secure token handling
* Server-side access control

---

# 46. Testing Strategy

The application should include unit, component, and integration tests.

## Unit Tests

Test:

* Card-selection algorithm
* Accuracy calculation
* Statistics calculations
* CSV parsing
* JSON parsing
* Duplicate detection
* Quiz option generation

Example:

```text
Given a card marked incorrect
When requesting the next cards
Then the card receives increased retry priority.
```

## Component Tests

Test:

* Flashcard rendering
* Flip interaction
* Correct/incorrect buttons
* Quiz answer selection
* Progress display
* Import preview

## Integration Tests

Test complete flows:

```text
Start Study
→ Flip
→ Mark Wrong
→ Next Card
→ End Session
→ Statistics Updated
```

and:

```text
Import CSV
→ Validate
→ Confirm
→ Cards Stored
→ Deck Updated
```

---

# 47. Example User Stories

## Study

**As a Spanish learner,**

I want to see a Spanish word first,

so that I can attempt to recall its English meaning before seeing the answer.

## Card Evaluation

**As a learner,**

I want to mark an answer correct or incorrect,

so the application can adapt my future practice.

## Review

**As a learner,**

I want to review only words I previously got wrong,

so I can focus on vocabulary I have difficulty remembering.

## Quiz

**As a learner,**

I want to take a multiple-choice quiz,

so I can test whether I actually remember the vocabulary.

## Statistics

**As a learner,**

I want to see my study history and accuracy,

so I can understand my progress.

## Import

**As a learner,**

I want to import a CSV or JSON file,

so I can expand my vocabulary without manually entering every card.

---

# 48. Acceptance Criteria

## Flashcards

* [ ] Spanish word is displayed before the English translation.
* [ ] English translation is hidden until the card is flipped.
* [ ] Card can be flipped by clicking/tapping.
* [ ] User can mark the card correct.
* [ ] User can mark the card incorrect.
* [ ] Correct/incorrect results are persisted.

## Review

* [ ] Incorrect cards are remembered.
* [ ] User can start a review session containing only cards needing review.
* [ ] Review cards receive higher selection priority.

## Quiz

* [ ] User can select a deck.
* [ ] Quiz displays multiple-choice answers.
* [ ] Correct answers are recorded.
* [ ] Incorrect answers are recorded.
* [ ] Final score is displayed.
* [ ] Missed cards can be reviewed.

## Statistics

* [ ] Overall statistics are displayed.
* [ ] Per-session statistics are displayed.
* [ ] Deck-level statistics are displayed.
* [ ] Accuracy is calculated correctly.

## Import

* [ ] CSV files can be imported.
* [ ] JSON files can be imported.
* [ ] Invalid records are reported.
* [ ] Duplicate handling is supported.
* [ ] User can preview data before importing.

## Persistence

* [ ] Progress survives browser refresh.
* [ ] Imported cards survive browser refresh.
* [ ] Statistics survive browser refresh.

---

# 49. Recommended Initial Seed Dataset

The application should ship with several starter decks.

Example:

```text
01 - Beginner Basics
02 - Common Verbs
03 - Food & Drinks
04 - Travel
05 - People & Family
06 - Numbers & Time
07 - Common Adjectives
08 - Everyday Objects
```

Each deck should initially contain approximately 20–50 cards.

---

# 50. Future Roadmap

## Phase 1 — MVP

```text
React + TypeScript + Vite
        ↓
Predefined flashcards
        ↓
Decks
        ↓
Study mode
        ↓
Correct / Wrong tracking
        ↓
Review incorrect cards
        ↓
Multiple-choice quiz
        ↓
Statistics
        ↓
CSV/JSON import
        ↓
IndexedDB persistence
```

## Phase 2 — Enhanced Learning

Potential additions:

* Spaced repetition
* Difficulty levels
* Study streaks
* Daily goals
* Improved card scheduling
* Fill-in-the-blank quizzes
* More detailed analytics

## Phase 3 — Multi-User

Potential architecture:

```text
React Application
        ↓
Authentication
        ↓
API
        ↓
Application Services
        ↓
Database
```

Features:

* Login/register
* User profiles
* Cloud synchronization
* Multi-device support
* Server-side statistics

## Phase 4 — Advanced Language Learning

Potential additions:

* Audio pronunciation
* Text-to-speech
* Example sentences
* Grammar
* Verb conjugation
* Sentence exercises
* AI-generated practice
* Personalized learning paths

---

# 51. Architectural Principles

The implementation should follow these principles:

### 1. Local-first

The initial application should work without requiring a backend.

### 2. Storage abstraction

Business logic must not depend directly on IndexedDB.

### 3. Domain-driven structure

Study, Quiz, Import, Decks, and Statistics should have clearly separated responsibilities.

### 4. Extensibility

The design should make it possible to add authentication, cloud synchronization, and spaced repetition without rebuilding the application.

### 5. Type safety

TypeScript should be used throughout the application.

### 6. Testability

Core learning logic should be isolated from React components so it can be tested independently.

### 7. Accessibility

All core learning functionality should be accessible by keyboard and usable on mobile devices.

---

# 52. Definition of Done for Version 1

Version 1 is complete when a new user can:

```text
Open the application
        ↓
Select a predefined Spanish deck
        ↓
Start studying
        ↓
See Spanish vocabulary
        ↓
Flip cards to reveal English
        ↓
Mark answers correct/incorrect
        ↓
Finish the session
        ↓
See session results
        ↓
Return later
        ↓
Review missed cards
        ↓
Take a multiple-choice quiz
        ↓
View overall statistics
        ↓
Import additional cards from CSV/JSON
        ↓
Refresh the browser
        ↓
Find all progress and imported data intact
```

The resulting application should provide a solid local-first learning experience while keeping the architecture ready for the eventual addition of authentication, cloud storage, synchronization, and more sophisticated learning algorithms.
