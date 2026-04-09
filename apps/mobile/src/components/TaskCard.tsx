import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Task } from '../store/index';

interface TaskCardProps {
  task: Pick<Task, 'id' | 'title' | 'priority' | 'estimatedEffortMin' | 'dueDate'>;
  projectName?: string;
  onStartFocus?: (taskId: string) => void;
  elevated?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#FF6B6B',
  high: '#FFB347',
  medium: '#6C63FF',
  low: '#4ECDC4',
};

const COLORS = {
  surface: '#16213E',
  card: '#0F3460',
  primary: '#6C63FF',
  text: '#E8E8F0',
  muted: '#8888AA',
};

export function TaskCard({ task, projectName, onStartFocus, elevated = false }: TaskCardProps) {
  return (
    <View style={[styles.card, elevated && styles.cardElevated]}>
      <View style={styles.inner}>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: PRIORITY_COLORS[task.priority] ?? COLORS.primary },
              ]}
            />
            <Text style={styles.title} numberOfLines={2}>
              {task.title}
            </Text>
          </View>
          <View style={styles.meta}>
            {projectName && <Text style={styles.metaText}>{projectName}</Text>}
            {task.dueDate && (
              <>
                <Text style={styles.metaDivider}> · </Text>
                <Text style={styles.metaText}>{task.dueDate}</Text>
              </>
            )}
            {task.estimatedEffortMin && (
              <>
                <Text style={styles.metaDivider}> · </Text>
                <Text style={styles.metaText}>{task.estimatedEffortMin}m</Text>
              </>
            )}
          </View>
        </View>
        {onStartFocus && (
          <TouchableOpacity
            style={[styles.startBtn, elevated && styles.startBtnElevated]}
            onPress={() => onStartFocus(task.id)}
            accessibilityLabel={`Start focus on ${task.title}`}
          >
            <Text style={styles.startBtnText}>{elevated ? 'START →' : '▶'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardElevated: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: 8,
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  metaDivider: {
    fontSize: 12,
    color: COLORS.muted,
  },
  startBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
  },
  startBtnElevated: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  startBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
});
