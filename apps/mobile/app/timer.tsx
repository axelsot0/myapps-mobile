import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Vibration,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Placeholder task lookup — will be replaced by real SQLite query in MYAAA-11
const PLACEHOLDER_TASK_TITLES: Record<string, string> = {
  '1': 'Finish Q2 proposal draft',
  '2': 'Review NDA with legal team',
  '3': 'Update project tracker',
};

const DURATION_OPTIONS = [15, 25, 45, 60] as const;
type DurationOption = (typeof DURATION_OPTIONS)[number];

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

const COLORS = {
  background: '#1A1A2E',
  surface: '#16213E',
  card: '#0F3460',
  primary: '#6C63FF',
  text: '#E8E8F0',
  muted: '#8888AA',
  success: '#4ECDC4',
  danger: '#FF6B6B',
  timerRing: '#6C63FF',
  timerRingBg: '#2A2A4A',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function FocusTimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId?: string }>();
  const taskTitle =
    (params.taskId ? PLACEHOLDER_TASK_TITLES[params.taskId] : null) ?? 'Focus Session';

  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(25);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(selectedDuration * 60);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const startTimer = () => {
    setTimerState('running');
    setSessionStartedAt(new Date());
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setTimerState('completed');
          setShowCompletionModal(true);
          Vibration.vibrate([0, 500, 200, 500]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearTimer();
    const elapsed = selectedDuration * 60 - secondsRemaining;
    // TODO: Write focus_sessions record to SQLite in MYAAA-11 implementation
    // { taskId: params.taskId, startedAt: sessionStartedAt, durationSeconds: elapsed, wasCompleted: false }
    router.back();
  };

  const handleDurationSelect = (duration: DurationOption) => {
    if (timerState === 'idle') {
      setSelectedDuration(duration);
      setSecondsRemaining(duration * 60);
    }
    setShowDurationPicker(false);
  };

  const handleMarkDone = () => {
    // TODO: Update task status to 'done' in SQLite
    setShowCompletionModal(false);
    router.back();
  };

  const handleKeepGoing = () => {
    setShowCompletionModal(false);
    setTimerState('idle');
    setSecondsRemaining(selectedDuration * 60);
  };

  const totalSeconds = selectedDuration * 60;
  const progress = 1 - secondsRemaining / totalSeconds;

  return (
    <SafeAreaView style={styles.container}>
      {/* Task Title */}
      <View style={styles.taskHeader}>
        <Text style={styles.taskLabel} numberOfLines={2}>
          {taskTitle}
        </Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <TouchableOpacity
          onPress={() => timerState === 'idle' && setShowDurationPicker(true)}
          disabled={timerState !== 'idle'}
          accessibilityLabel={`Timer: ${formatTime(secondsRemaining)}, tap to change duration`}
        >
          <View style={styles.timerRing}>
            <Text style={styles.timerText}>{formatTime(secondsRemaining)}</Text>
            {timerState === 'idle' && (
              <Text style={styles.timerHint}>tap to change</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Progress indicator */}
        <Text style={styles.progressLabel}>
          {Math.round(progress * 100)}% complete
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {timerState === 'idle' && (
          <TouchableOpacity style={styles.startButton} onPress={startTimer}>
            <Text style={styles.startButtonText}>Start Focus</Text>
          </TouchableOpacity>
        )}
        {timerState === 'running' && (
          <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Duration Picker Modal */}
      <Modal
        visible={showDurationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDurationPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDurationPicker(false)}
          activeOpacity={1}
        >
          <View style={styles.durationSheet}>
            <Text style={styles.durationSheetTitle}>Session Duration</Text>
            {DURATION_OPTIONS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.durationOption,
                  selectedDuration === d && styles.durationOptionSelected,
                ]}
                onPress={() => handleDurationSelect(d)}
              >
                <Text
                  style={[
                    styles.durationOptionText,
                    selectedDuration === d && styles.durationOptionTextSelected,
                  ]}
                >
                  {d} minutes
                </Text>
                {selectedDuration === d && <Text style={styles.durationCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.completionOverlay}>
          <View style={styles.completionSheet}>
            <Text style={styles.completionIcon}>🎉</Text>
            <Text style={styles.completionTitle}>Session complete!</Text>
            <Text style={styles.completionSubtitle}>{selectedDuration} minutes focused</Text>
            <TouchableOpacity style={styles.completionPrimary} onPress={handleMarkDone}>
              <Text style={styles.completionPrimaryText}>Mark Task Done ✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completionSecondary} onPress={handleKeepGoing}>
              <Text style={styles.completionSecondaryText}>Keep Going / New Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  taskHeader: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  taskLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  timerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: COLORS.timerRing,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  timerText: {
    fontSize: 52,
    fontWeight: '200',
    color: COLORS.text,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  timerHint: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 20,
  },
  controls: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 60,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  stopButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 60,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger + '60',
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  durationSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  durationSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  durationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.card,
  },
  durationOptionSelected: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  durationOptionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  durationOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  durationCheck: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  completionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  completionSheet: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  completionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 32,
  },
  completionPrimary: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.background,
  },
  completionSecondary: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  completionSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});
