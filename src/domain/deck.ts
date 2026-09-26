/**
 * A named collection/category of flashcards (e.g. "Beginner Basics").
 */
export interface Deck {
  id: string
  name: string
  description?: string

  /** Denormalized count of cards belonging to this deck. */
  cardCount: number

  createdAt: string
  updatedAt: string

  /**
   * Reserved for future multi-user support (Phase 11). Version 1 is
   * single-user, so this is omitted/undefined everywhere.
   */
  userId?: string
}
