import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

type ReviewStep = 'wins' | 'deferred' | 'top3';

// Placeholder data — will be replaced by real SQLite queries in MYAAA-11/12
const PLACEHOLDER_COMPLETED = [
  { id: '1', title: 'Finish Q2 proposal draft', project: 'Acme Corp' },
  { id: '2', title: 'Team standup', project: 'Internal' },
];

const PLACEHOLDER_DEFERRED = [
  { id: '3', title: 'Review NDA with legal team', project: 'Client A' },
  { id: '4', title: 'Update project tracker', project: 'Internal' },
];

const PLACEHOLDER_CANDIDATES = [
  { id: '5', title: 'Send invoice — March retainer', project: 'Billing', priority: 'critical' },
  { id: '6', title: 'Prep for 3pm call with Sarah', project: 'Client B', priority: 'high' },
  { id: '7', title: 'Review contract terms', project: 'Legal', priority: 'high' },
  { id: '8', title: 'Write blog post draft', project: 'Marketing', priority: 'medium' },
  { id: '9', title: 'Backup files', project: 'Admin', priority: 'low' },
];

type DeferredAction = 'tomorrow' | 'someday' | 'cancel';

const COLORS = {
  background: '#1A1A2E',
  surface: '#16213E',
  card: '#0F3460',
  primary: '#6C63FF',
  text: '#E8E8F0',
  muted: '#8888AA',
  success: '#4ECDC4',
  warning: '#FFB347',
  danger: '#FF6B6B',
};

const STEP_LABELS: Record<ReviewStep, string> = {
  wins: 'Step 1 of 3 — Wins',
  deferred: 'Step 2 of 3 — Deferred',
  top3: 'Step 3 of 3 — Tomorrow',
};

export default function EndOfDayReviewScreen() {
  const [step, setStep] = useState<ReviewStep>('wins');
  const [deferredActions, setDeferredActions] = useState<Record<string, DeferredAction>>({});
  const [selectedTop3, setSelectedTop3] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);

  const handleDeferredAction = (taskId: string, action: DeferredAction) => {
    setDeferredActions((prev) => ({ ...prev, [taskId]: action }));
  };

  const allDeferredActioned =
    PLACEHOLDER_DEFERRED.length === 0 ||
    PLACEHOLDER_DEFERRED.every((t) => deferredActions[t.id] !== undefined);

  const toggleTop3 = (taskId: string) => {
    setSelectedTop3((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else if (next.size < 3) {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleFinish = () => {
    // TODO: Write daily_reviews record to SQLite/Supabase in full implementation
    setCompleted(true);
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedIcon}>✓</Text>
          <Text style={styles.completedTitle}>Review complete</Text>
          <Text style={styles.completedSub}>
            Tomorrow&apos;s top tasks are set. See you in the morning.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>{STEP_LABELS[step]}</Text>
        <View style={styles.stepDots}>
          {(['wins', 'deferred', 'top3'] as ReviewStep[]).map((s) => (
            <View key={s} style={[styles.stepDot, step === s && styles.stepDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Wins Step */}
        {step === 'wins' && (
          <View>
            <Text style={styles.stepTitle}>What you shipped today</Text>
            {PLACEHOLDER_COMPLETED.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No tasks completed today — that happens. Tomorrow is a fresh start.
                </Text>
              </View>
            ) : (
              PLACEHOLDER_COMPLETED.map((task) => (
                <View key={task.id} style={styles.winCard}>
                  <Text style={styles.winCheckmark}>✓</Text>
                  <View style={styles.winInfo}>
                    <Text style={styles.winTitle}>{task.title}</Text>
                    <Text style={styles.winProject}>{task.project}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Deferred Step */}
        {step === 'deferred' && (
          <View>
            <Text style={styles.stepTitle}>What didn&apos;t get done</Text>
            <Text style={styles.stepSubtitle}>Choose an action for each task before continuing.</Text>
            {PLACEHOLDER_DEFERRED.map((task) => (
              <View key={task.id} style={styles.deferredCard}>
                <Text style={styles.deferredTitle}>{task.title}</Text>
                <Text style={styles.deferredProject}>{task.project}</Text>
                <View style={styles.deferredActions}>
                  {(['tomorrow', 'someday', 'cancel'] as DeferredAction[]).map((action) => (
                    <TouchableOpacity
                      key={action}
                      style={[
                        styles.deferredActionBtn,
                        deferredActions[task.id] === action && styles.deferredActionBtnActive,
                      ]}
                      onPress={() => handleDeferredAction(task.id, action)}
                    >
                      <Text
                        style={[
                          styles.deferredActionText,
                          deferredActions[task.id] === action && styles.deferredActionTextActive,
                        ]}
                      >
                        {action === 'tomorrow' ? 'Tomorrow' : action === 'someday' ? 'Someday' : 'Cancel'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Top 3 Step */}
        {step === 'top3' && (
          <View>
            <Text style={styles.stepTitle}>Pick tomorrow&apos;s top 3</Text>
            <Text style={styles.stepSubtitle}>
              {selectedTop3.size}/3 selected
            </Text>
            {PLACEHOLDER_CANDIDATES.map((task) => {
              const selected = selectedTop3.has(task.id);
              const disabled = !selected && selectedTop3.size >= 3;
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.candidateCard,
                    selected && styles.candidateCardSelected,
                    disabled && styles.candidateCardDisabled,
                  ]}
                  onPress={() => toggleTop3(task.id)}
                  disabled={disabled}
                >
                  <View style={styles.candidateCheck}>
                    {selected && <Text style={styles.candidateCheckMark}>✓</Text>}
                  </View>
                  <View style={styles.candidateInfo}>
                    <Text style={styles.candidateTitle}>{task.title}</Text>
                    <Text style={styles.candidateProject}>{task.project}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        {step === 'wins' && (
          <TouchableOpacity style={styles.ctaButton} onPress={() => setStep('deferred')}>
            <Text style={styles.ctaButtonText}>Next →</Text>
          </TouchableOpacity>
        )}
        {step === 'deferred' && (
          <TouchableOpacity
            style={[styles.ctaButton, !allDeferredActioned && styles.ctaButtonDisabled]}
            onPress={() => setStep('top3')}
            disabled={!allDeferredActioned}
          >
            <Text style={styles.ctaButtonText}>Next →</Text>
          </TouchableOpacity>
        )}
        {step === 'top3' && (
          <TouchableOpacity
            style={[styles.ctaButton, selectedTop3.size === 0 && styles.ctaButtonDisabled]}
            onPress={handleFinish}
            disabled={selectedTop3.size === 0}
          >
            <Text style={styles.ctaButtonText}>Finish Review ✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 6,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.surface,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 20,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  winCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  winCheckmark: {
    fontSize: 18,
    color: COLORS.success,
    marginRight: 12,
  },
  winInfo: {
    flex: 1,
  },
  winTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  winProject: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  deferredCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  deferredTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  deferredProject: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 12,
  },
  deferredActions: {
    flexDirection: 'row',
    gap: 8,
  },
  deferredActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.card,
  },
  deferredActionBtnActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  deferredActionText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  deferredActionTextActive: {
    color: COLORS.primary,
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  candidateCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  candidateCardDisabled: {
    opacity: 0.4,
  },
  candidateCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.muted,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidateCheckMark: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  candidateProject: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: COLORS.surface,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  completedIcon: {
    fontSize: 64,
    color: COLORS.success,
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  completedSub: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
