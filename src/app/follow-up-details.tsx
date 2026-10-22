
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  bg: '#F5F8FC',
  navy: '#142B4A',
  teal: '#0E9F91',
  muted: '#718096',
  white: '#FFFFFF',
  border: '#E5EAF2',
};

const REASONS = [
  'Routine follow-up',
  'Treatment review',
  'Symptom review',
  'Post-treatment check',
];

const PRIORITIES = ['Low', 'Normal', 'High'];

export default function FollowUpDetailsScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    condition?: string;
  }>();

  const patientId = Array.isArray(params.patientId)
    ? params.patientId[0]
    : params.patientId ?? 'P1001';
  const patientName = Array.isArray(params.patientName)
    ? params.patientName[0]
    : params.patientName ?? 'Sample Patient';
  const condition = Array.isArray(params.condition)
    ? params.condition[0]
    : params.condition ?? 'General follow-up';

  const [date, setDate] = useState('');
  const [reason, setReason] = useState(REASONS[0]);
  const [priority, setPriority] = useState('Normal');
  const [notes, setNotes] = useState('');

  const continueWorkflow = () => {
    if (!date.trim()) {
      Alert.alert('Date required', 'Please enter a follow-up date, for example 2026-11-05.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim()) ||
        Number.isNaN(Date.parse(`${date.trim()}T00:00:00`))) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD format, for example 2026-11-05.');
      return;
    }

    const parsedDate = new Date(`${date.trim()}T00:00:00`);
    if (
      parsedDate.getFullYear() !== Number(date.slice(0, 4)) ||
      parsedDate.getMonth() + 1 !== Number(date.slice(5, 7)) ||
      parsedDate.getDate() !== Number(date.slice(8, 10))
    ) {
      Alert.alert('Invalid date', 'Please enter a real calendar date.');
      return;
    }

    router.push({
      pathname: '/follow-up-confirmation',
      params: {
        patientId,
        patientName,
        condition,
        date: date.trim(),
        reason,
        priority,
        notes: notes.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={C.navy} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Follow-up Details</Text>
            <Text style={styles.headerSub}>Clinical workflow · Step 2 of 3</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressDone} />
          <View style={styles.progressActive} />
          <View style={styles.progress} />
        </View>

        <Text style={styles.title}>Plan the next visit</Text>
        <Text style={styles.subtitle}>
          Add the follow-up information for the selected sample patient.
        </Text>

        <View style={styles.patientCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={23} color={C.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>{patientName}</Text>
            <Text style={styles.patientMeta}>{patientId} · {condition}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={23} color={C.teal} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>FOLLOW-UP DATE *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={19} color={C.teal} />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={C.muted}
              keyboardType="numbers-and-punctuation"
              accessibilityLabel="Follow-up date"
            />
          </View>
          <Text style={styles.helper}>Enter date in year-month-day format.</Text>

          <Text style={styles.label}>REASON FOR FOLLOW-UP</Text>
          {REASONS.map((item) => (
            <Pressable
              key={item}
              style={[styles.option, reason === item && styles.optionSelected]}
              onPress={() => setReason(item)}
            >
              <Text style={[styles.optionText, reason === item && styles.optionTextSelected]}>
                {item}
              </Text>
              <Ionicons
                name={reason === item ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={reason === item ? C.teal : C.muted}
              />
            </Pressable>
          ))}

          <Text style={styles.label}>PRIORITY</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((item) => (
              <Pressable
                key={item}
                style={[styles.priority, priority === item && styles.prioritySelected]}
                onPress={() => setPriority(item)}
              >
                <Text style={[styles.priorityText, priority === item && styles.priorityTextSelected]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>NOTES (OPTIONAL)</Text>
          <TextInput
            style={styles.notes}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add a brief administrative note..."
            placeholderTextColor={C.muted}
            multiline
            textAlignVertical="top"
            maxLength={300}
            accessibilityLabel="Follow-up notes"
          />
          <Text style={styles.helper}>{notes.length}/300 characters</Text>
        </View>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={19} color={C.teal} />
          <Text style={styles.noticeText}>
            Demo workflow only. This plan is not sent to a clinician and must not replace medical advice.
          </Text>
        </View>

        <Pressable style={styles.button} onPress={continueWorkflow}>
          <Text style={styles.buttonText}>Review Follow-up</Text>
          <Ionicons name="arrow-forward" size={19} color={C.white} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  back: {
    width: 43, height: 43, borderRadius: 14, backgroundColor: C.white,
    borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: C.navy, fontSize: 18, fontWeight: '900' },
  headerSub: { color: C.muted, fontSize: 11, marginTop: 4 },
  progressRow: { flexDirection: 'row', gap: 7, marginVertical: 12 },
  progress: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#DCE4ED' },
  progressDone: { flex: 1, height: 5, borderRadius: 5, backgroundColor: C.teal },
  progressActive: { flex: 1, height: 5, borderRadius: 5, backgroundColor: C.teal },
  title: { color: C.navy, fontSize: 25, fontWeight: '900', marginTop: 18 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  patientCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white,
    borderRadius: 17, borderWidth: 1, borderColor: C.border, padding: 14, marginTop: 20,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 15, backgroundColor: '#E4F7F3',
    alignItems: 'center', justifyContent: 'center',
  },
  patientName: { color: C.navy, fontSize: 14, fontWeight: '900' },
  patientMeta: { color: C.muted, fontSize: 10, marginTop: 5 },
  section: {
    backgroundColor: C.white, borderRadius: 20, borderWidth: 1, borderColor: C.border,
    padding: 17, marginTop: 17,
  },
  label: { color: C.navy, fontSize: 10, fontWeight: '900', letterSpacing: 0.7, marginTop: 16, marginBottom: 10 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1,
    borderColor: C.border, borderRadius: 13, paddingHorizontal: 12,
  },
  input: { flex: 1, color: C.navy, paddingVertical: 13, fontSize: 13 },
  helper: { color: C.muted, fontSize: 10, marginTop: 7 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 13, marginBottom: 8,
  },
  optionSelected: { borderColor: C.teal, backgroundColor: '#EAF8F6' },
  optionText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  optionTextSelected: { color: C.navy, fontWeight: '800' },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priority: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  prioritySelected: { backgroundColor: '#EAF8F6', borderColor: C.teal },
  priorityText: { color: C.muted, fontSize: 12, fontWeight: '800' },
  priorityTextSelected: { color: C.teal },
  notes: {
    minHeight: 100, borderWidth: 1, borderColor: C.border, borderRadius: 13,
    padding: 12, color: C.navy, fontSize: 12,
  },
  notice: {
    flexDirection: 'row', gap: 9, alignItems: 'flex-start', backgroundColor: '#EAF8F6',
    borderRadius: 13, padding: 12, marginTop: 15,
  },
  noticeText: { flex: 1, color: C.muted, fontSize: 10, lineHeight: 16 },
  button: {
    backgroundColor: C.teal, borderRadius: 15, padding: 17, marginTop: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  buttonText: { color: C.white, fontSize: 14, fontWeight: '900' },
});
