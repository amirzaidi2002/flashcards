/**
 * Storage layer: owns IndexedDB initialization and schema/migrations.
 *
 * This is the ONLY module allowed to talk to IndexedDB directly (e.g. via
 * Dexie). Repositories depend on this module; UI components and services
 * must never import it directly.
 *
 * Implemented in Phase 4.1 (Set up IndexedDB).
 */
export {}
