import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#F5F8FC',
  navy: '#142B4A',
  teal: '#0E9F91',
  muted: '#718096',
  white: '#FFFFFF',
  border: '#E5EAF1',
};

export default function FollowUpConfirmationScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    patientId?: string | string[];
    patientName?: string | string[];
    condition?: string | string[];
    date?: string | string[];
    reason?: string | string[];
    priority?: string | string[];
    notes?: string | string[];
  }>();

  const getValue = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] ?? '' : value ?? '';

  const patientId = getValue(params.patientId);
  const patientName = getValue(params.patientName);
  const condition = getValue(params.condition);
  const date = getValue(params.date);
  const reason = getValue(params.reason);
  const priority = getValue(params.priority);
  const notes = getValue(params.notes);

  const confirmationId = `FU-${patientId || 'DEMO'}-${date.replace(/-/g, '') || 'DRAFT'}`;

  const DetailRow = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
  }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={19} color={COLORS.teal} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
          </Pressable>
          <Text style={styles.headerTitle}>Follow-up Workflow</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>STEP 3 OF 3</Text>
            <Text style={styles.progressPercent}>100%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressCaption}>Review complete</Text>
        </View>

        <View style={styles.successSection}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={42} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Follow-up plan reviewed!</Text>
          <Text style={styles.subtitle}>
            The details you entered are shown below for review.
          </Text>
        </View>

        <View style={styles.confirmationIdCard}>
          <Ionicons name="document-text-outline" size={22} color={COLORS.teal} />
          <View style={styles.confirmationIdText}>
            <Text style={styles.detailLabel}>DEMO REFERENCE</Text>
            <Text style={styles.confirmationId}>{confirmationId}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Follow-up summary</Text>

          <DetailRow
            label="Patient"
            value={patientName}
            icon="person-outline"
          />
          <DetailRow
            label="Patient ID"
            value={patientId}
            icon="card-outline"
          />
          <DetailRow
            label="Condition"
            value={condition}
            icon="medkit-outline"
          />
          <DetailRow
            label="Follow-up date"
            value={date}
            icon="calendar-outline"
          />
          <DetailRow
            label="Follow-up reason"
            value={reason}
            icon="clipboard-outline"
          />
          <DetailRow
            label="Priority"
            value={priority}
            icon="flag-outline"
          />

          <View style={styles.notesSection}>
            <Text style={styles.detailLabel}>Additional notes</Text>
            <Text style={styles.notesText}>{notes || 'No additional notes entered.'}</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.muted} />
          <Text style={styles.noticeText}>
            This is a demonstration workflow. The follow-up plan is not saved
            to a hospital database and no real appointment has been scheduled.
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace('/follow-up')}
          accessibilityRole="button"
        >
          <Ionicons name="refresh-outline" size={20} color={COLORS.white} />
          <Text style={styles.primaryButtonText}>Start Another Follow-up</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
        >
          <Ionicons name="home-outline" size={19} color={COLORS.navy} />
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 44,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    color: COLORS.navy,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  progressPercent: {
    color: COLORS.teal,
    fontWeight: '800',
    fontSize: 12,
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#E6F4F2',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.teal,
    borderRadius: 8,
  },
  progressCaption: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  confirmationIdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF8F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    gap: 12,
  },
  confirmationIdText: {
    flex: 1,
  },
  confirmationId: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F7',
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#EAF8F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  notesSection: {
    paddingTop: 16,
  },
  notesText: {
    color: COLORS.navy,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EDF1F6',
    padding: 14,
    borderRadius: 14,
    marginTop: 18,
    marginBottom: 20,
  },
  noticeText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  primaryButton: {
    minHeight: 54,
    backgroundColor: COLORS.teal,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 52,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
  },
});
