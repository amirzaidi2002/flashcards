/**
 * Repository contract for reading and writing StudySession (and
 * StudyAttempt) records.
 *
 * Services depend on this interface rather than on IndexedDB directly, so
 * the storage backend can be swapped without changing service or UI code.
 *
 * TODO(Phase 4.2): once the `StudySession`/`StudyAttempt` domain models
 * exist (Phase 1.1), define the contract, e.g.:
 *
 *   interface StudySessionRepository {
 *     getById(id: string): Promise<StudySession | undefined>
 *     getRecent(limit: number): Promise<StudySession[]>
 *     save(session: StudySession): Promise<void>
 *   }
 */
export {}
