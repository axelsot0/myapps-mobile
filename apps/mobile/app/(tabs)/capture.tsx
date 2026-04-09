import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

// Placeholder NLP parsing — will be implemented in full feature work
interface ParsedChip {
  type: 'dueDate' | 'priority' | 'project';
  label: string;
  value: string;
}

function parseTaskTitle(title: string): ParsedChip[] {
  const chips: ParsedChip[] = [];
  const lower = title.toLowerCase();

  // Date parsing (stub)
  if (lower.includes('tomorrow')) {
    chips.push({ type: 'dueDate', label: 'Due tomorrow', value: 'tomorrow' });
  } else if (lower.includes('today')) {
    chips.push({ type: 'dueDate', label: 'Due today', value: 'today' });
  } else if (lower.includes('friday')) {
    chips.push({ type: 'dueDate', label: 'Due Fri', value: 'friday' });
  }

  // Priority parsing (stub)
  if (lower.includes('urgent') || lower.includes('asap')) {
    chips.push({ type: 'priority', label: 'High priority', value: 'high' });
  } else if (lower.includes('critical')) {
    chips.push({ type: 'priority', label: 'Critical', value: 'critical' });
  }

  return chips;
}

const COLORS = {
  background: '#1A1A2E',
  surface: '#16213E',
  card: '#0F3460',
  primary: '#6C63FF',
  text: '#E8E8F0',
  muted: '#8888AA',
  inputBorder: '#2A2A4A',
  chipBg: '#2A2A4A',
  chipText: '#A0A0C8',
  success: '#4ECDC4',
};

export default function FrictionlessCaptureScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [chips, setChips] = useState<ParsedChip[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleTitleChange = (text: string) => {
    setTitle(text);
    const parsed = parseTaskTitle(text);
    setChips(parsed.filter((c) => !dismissed.has(c.type)));
  };

  const dismissChip = (type: string) => {
    setDismissed((prev) => new Set([...prev, type]));
    setChips((prev) => prev.filter((c) => c.type !== type));
  };

  const handleCapture = () => {
    if (!title.trim()) return;
    // TODO: Write to SQLite in MYAAA-11 implementation
    // For scaffold: just navigate back
    setTitle('');
    setChips([]);
    setDismissed(new Set());
    router.back();
  };

  const canCapture = title.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Capture</Text>
          <TouchableOpacity
            onPress={handleCapture}
            style={[styles.saveButton, canCapture && styles.saveButtonActive]}
            disabled={!canCapture}
          >
            <Text style={[styles.saveText, canCapture && styles.saveTextActive]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {/* Task Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="What needs to get done?"
              placeholderTextColor={COLORS.muted}
              value={title}
              onChangeText={handleTitleChange}
              autoFocus
              multiline
              returnKeyType="done"
              onSubmitEditing={handleCapture}
              maxLength={500}
            />
          </View>

          {/* Parsed Chips */}
          {chips.length > 0 && (
            <View style={styles.chipsContainer}>
              <Text style={styles.chipsLabel}>Detected:</Text>
              <View style={styles.chips}>
                {chips.map((chip) => (
                  <TouchableOpacity
                    key={chip.type}
                    style={styles.chip}
                    onPress={() => dismissChip(chip.type)}
                    accessibilityLabel={`Remove ${chip.label}`}
                  >
                    <Text style={styles.chipText}>{chip.label}</Text>
                    <Text style={styles.chipDismiss}> ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Hint */}
          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Tip: Type &quot;tomorrow&quot;, &quot;urgent&quot;, or &quot;Friday&quot; to auto-fill fields
            </Text>
          </View>

          {/* Additional fields placeholder */}
          <View style={styles.fieldsSection}>
            <Text style={styles.fieldsSectionLabel}>OPTIONAL</Text>
            <TouchableOpacity style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Priority</Text>
              <Text style={styles.fieldValue}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Project</Text>
              <Text style={[styles.fieldValue, styles.fieldValueMuted]}>None</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Due Date</Text>
              <Text style={[styles.fieldValue, styles.fieldValueMuted]}>None</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Effort</Text>
              <Text style={[styles.fieldValue, styles.fieldValueMuted]}>—</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.muted,
  },
  saveButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  saveButtonActive: {},
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.muted,
  },
  saveTextActive: {
    color: COLORS.primary,
  },
  inputContainer: {
    padding: 20,
    paddingBottom: 12,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 28,
    minHeight: 80,
  },
  chipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  chipsLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  chipText: {
    fontSize: 13,
    color: COLORS.chipText,
    fontWeight: '500',
  },
  chipDismiss: {
    fontSize: 11,
    color: COLORS.muted,
  },
  hint: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.muted,
    fontStyle: 'italic',
  },
  fieldsSection: {
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
  },
  fieldsSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1.2,
    padding: 16,
    paddingBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  fieldLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  fieldValue: {
    fontSize: 15,
    color: COLORS.text,
  },
  fieldValueMuted: {
    color: COLORS.muted,
  },
});
