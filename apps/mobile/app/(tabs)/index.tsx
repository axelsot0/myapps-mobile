import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

// Placeholder data — will be replaced by real SQLite queries in MYAAA-11/12
const PLACEHOLDER_TASKS = [
  {
    id: '1',
    title: 'Finish Q2 proposal draft',
    project: 'Acme Corp',
    dueLabel: 'Due today',
    priority: 'critical',
    estimatedMin: 60,
  },
  {
    id: '2',
    title: 'Review NDA with legal team',
    project: 'Client A',
    dueLabel: 'Due tomorrow',
    priority: 'high',
    estimatedMin: 30,
  },
  {
    id: '3',
    title: 'Update project tracker',
    project: 'Internal',
    dueLabel: 'No due date',
    priority: 'medium',
    estimatedMin: 15,
  },
];

const COLORS = {
  background: '#1A1A2E',
  surface: '#16213E',
  card: '#0F3460',
  primary: '#6C63FF',
  text: '#E8E8F0',
  muted: '#8888AA',
  critical: '#FF6B6B',
  high: '#FFB347',
  medium: '#6C63FF',
  low: '#4ECDC4',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: COLORS.critical,
  high: COLORS.high,
  medium: COLORS.medium,
  low: COLORS.low,
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function DailyFocusListScreen() {
  const router = useRouter();

  const handleStartFocus = (taskId: string) => {
    router.push({ pathname: '/timer', params: { taskId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, Marcus</Text>
          <Text style={styles.date}>{formatDate()}</Text>
        </View>

        {/* Section Label */}
        <Text style={styles.sectionLabel}>YOUR FOCUS TODAY</Text>

        {/* Task List */}
        {PLACEHOLDER_TASKS.map((task, index) => (
          <View key={task.id} style={[styles.taskCard, index === 0 && styles.taskCardElevated]}>
            <View style={styles.taskCardInner}>
              <View style={styles.taskInfo}>
                <View style={styles.taskTitleRow}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: PRIORITY_COLORS[task.priority] ?? COLORS.medium },
                    ]}
                  />
                  <Text style={styles.taskTitle} numberOfLines={2}>
                    {task.title}
                  </Text>
                </View>
                <View style={styles.taskMeta}>
                  <Text style={styles.taskMetaText}>{task.project}</Text>
                  <Text style={styles.taskMetaDivider}> · </Text>
                  <Text style={styles.taskMetaText}>{task.dueLabel}</Text>
                  <Text style={styles.taskMetaDivider}> · </Text>
                  <Text style={styles.taskMetaText}>{task.estimatedMin}m</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.startButton, index === 0 && styles.startButtonElevated]}
                onPress={() => handleStartFocus(task.id)}
                accessibilityLabel={`Start focus session for ${task.title}`}
              >
                <Text style={styles.startButtonText}>{index === 0 ? 'START →' : '▶'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Backlog count */}
        <View style={styles.backlogRow}>
          <Text style={styles.backlogText}>23 more tasks in backlog</Text>
          <TouchableOpacity>
            <Text style={styles.backlogView}>View</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Quick Add Bar */}
      <View style={styles.quickAddBar}>
        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={() => router.push('/capture')}
          accessibilityLabel="Quick add task"
        >
          <Text style={styles.quickAddText}>+ Quick Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: '400',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  taskCardElevated: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    marginBottom: 16,
  },
  taskCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitleRow: {
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
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  taskMetaText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  taskMetaDivider: {
    fontSize: 12,
    color: COLORS.muted,
  },
  startButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
  },
  startButtonElevated: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  startButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surface,
    marginVertical: 20,
  },
  backlogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  backlogText: {
    fontSize: 14,
    color: COLORS.muted,
  },
  backlogView: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickAddBar: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
  },
  quickAddButton: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
