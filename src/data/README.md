# data

Static seed data shipped with the application: starter decks and Spanish/English
flashcards, available on first launch before any persistence layer exists.

```text
data/
└── seed/
    ├── decks.ts        # hand-authored deck metadata (id, name, description)
    ├── flashcards.ts    # hand-authored word lists, keyed by deck id
    └── index.ts          # combines the above into fully-typed `Deck[]` / `Flashcard[]`
```

`seedDecks` and `seedFlashcards` (from `index.ts`) are the only exports other layers
should import; they are fully-typed domain objects with computed card counts and
zeroed learning counters, ready to be loaded into IndexedDB in Phase 4.
