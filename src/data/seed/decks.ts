/** Minimal, hand-authored metadata for each starter deck. */
export interface DeckSeed {
  id: string
  name: string
  description: string
}

export const deckSeeds: DeckSeed[] = [
  {
    id: 'deck-beginner-basics',
    name: 'Beginner Basics',
    description: 'Essential greetings and everyday phrases.',
  },
  {
    id: 'deck-common-verbs',
    name: 'Common Verbs',
    description: 'The most frequently used Spanish verbs.',
  },
  {
    id: 'deck-food-drinks',
    name: 'Food & Drinks',
    description: 'Vocabulary for meals, ingredients, and beverages.',
  },
  {
    id: 'deck-travel',
    name: 'Travel',
    description: 'Words for getting around and exploring.',
  },
  {
    id: 'deck-people-family',
    name: 'People & Family',
    description: 'Family members and people vocabulary.',
  },
  {
    id: 'deck-numbers-time',
    name: 'Numbers & Time',
    description: 'Numbers, days, and time-related words.',
  },
  {
    id: 'deck-common-adjectives',
    name: 'Common Adjectives',
    description: 'Descriptive words for everyday use.',
  },
  {
    id: 'deck-everyday-objects',
    name: 'Everyday Objects',
    description: 'Common household and everyday items.',
  },
]
