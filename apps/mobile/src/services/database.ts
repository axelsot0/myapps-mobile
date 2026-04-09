// SQLite database service — placeholder until MYAAA-11 (SQLite data model) is implemented
// Will use expo-sqlite for all local persistence operations

// Full implementation in MYAAA-11 will include:
// - Schema creation and migrations
// - CRUD operations for Task, Project, Area, FocusSession, DailyReview, DailyFocusList
// - Reactive queries via expo-sqlite subscriptions
// - Offline sync queue for Supabase background sync

export const DATABASE_NAME = 'myapps.db';

// Placeholder — real implementation in MYAAA-11
export async function initDatabase(): Promise<void> {
  // await SQLiteProvider setup
}
