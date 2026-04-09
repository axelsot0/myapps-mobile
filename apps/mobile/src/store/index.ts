// Zustand store — placeholder until MYAAA-11 (SQLite data model) is implemented
// Full state management for tasks, sessions, and focus lists will be wired here

export type TaskStatus = 'inbox' | 'today' | 'scheduled' | 'someday' | 'done' | 'cancelled';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  userId: string;
  projectId: string | null;
  areaId: string | null;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedEffortMin: number | null;
  dueDate: string | null;
  deferCount: number;
  scheduledDate: string | null;
  completedAt: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  wasCompleted: boolean;
  cancelledAt: string | null;
  localCreatedAt: string;
  metadata: Record<string, unknown>;
}

// Store will be implemented in MYAAA-11 with expo-sqlite + Zustand
// export const useAppStore = create<AppState>(...)
