
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#F5F8FC',
  navy: '#142B4A',
  teal: '#0E9F91',
  muted: '#718096',
  white: '#FFFFFF',
  border: '#E5EAF2',
  greenBg: '#E2F8F1',
  red: '#D9485F',
};

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  lastVisit: string;
  status: 'Active' | 'Follow-up';
};

const PATIENTS: Patient[] = [
  {
    id: 'PT-1001',
    name: 'Aarav Sharma',
    age: 34,
    gender: 'Male',
    department: 'Cardiology',
    lastVisit: '18 Oct 2026',
    status: 'Active',
  },
  {
    id: 'PT-1002',
    name: 'Priya Verma',
    age: 28,
    gender: 'Female',
    department: 'Neurology',
    lastVisit: '17 Oct 2026',
    status: 'Follow-up',
  },
  {
    id: 'PT-1003',
    name: 'Rohan Singh',
    age: 45,
    gender: 'Male',
    department: 'Orthopedics',
    lastVisit: '15 Oct 2026',
    status: 'Active',
  },
  {
    id: 'PT-1004',
    name: 'Ananya Gupta',
    age: 31,
    gender: 'Female',
    department: 'Dermatology',
    lastVisit: '14 Oct 2026',
    status: 'Follow-up',
  },
  {
    id: 'PT-1005',
    name: 'Kabir Mehta',
    age: 52,
    gender: 'Male',
    department: 'Cardiology',
    lastVisit: '12 Oct 2026',
    status: 'Active',
  },
  {
    id: 'PT-1006',
    name: 'Isha Patel',
    age: 24,
    gender: 'Female',
    department: 'Dental',
    lastVisit: '10 Oct 2026',
    status: 'Active',
  },
];

export default function PatientsScreen() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return PATIENTS;

    return PATIENTS.filter(patient =>
      [
        patient.name,
        patient.id,
        patient.department,
        patient.status,
      ].some(value => value.toLowerCase().includes(query))
    );
  }, [search]);

  const renderPatient = ({ item }: { item: Patient }) => {
    const expanded = selectedPatient === item.id;

    return (
      <Pressable
        style={styles.patientCard}
        onPress={() =>
          setSelectedPatient(expanded ? null : item.id)
        }
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.name}`}
      >
        <View style={styles.patientTop}>
          <View style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={24}
              color={COLORS.teal}
            />
          </View>

          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientId}>{item.id}</Text>
            <Text style={styles.department}>{item.department}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.status === 'Active'
                ? styles.activeBadge
                : styles.followUpBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === 'Active'
                  ? styles.activeText
                  : styles.followUpText,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        {expanded ? (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{item.age} years</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{item.gender}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{item.department}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last visit</Text>
              <Text style={styles.detailValue}>{item.lastVisit}</Text>
            </View>

            <Text style={styles.demoLabel}>
              Sample patient record — demo data only
            </Text>
          </View>
        ) : (
          <View style={styles.cardFooter}>
            <Text style={styles.tapHint}>Tap to view details</Text>
            <Ionicons
              name="chevron-down"
              size={17}
              color={COLORS.muted}
            />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id}
        renderItem={renderPatient}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={() => router.push('/dashboard')}
                accessibilityRole="button"
                accessibilityLabel="Back to dashboard"
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={COLORS.navy}
                />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={styles.eyebrow}>CAREFLOW MANAGEMENT</Text>
                <Text style={styles.heading}>Patients</Text>
              </View>

              <View style={styles.headerIcon}>
                <Ionicons
                  name="people-outline"
                  size={23}
                  color={COLORS.teal}
                />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View>
                <Text style={styles.summaryLabel}>PATIENT DIRECTORY</Text>
                <Text style={styles.summaryTitle}>
                  Patient records
                </Text>
                <Text style={styles.summarySubtitle}>
                  Search and view patient information.
                </Text>
              </View>

              <View style={styles.summaryIcon}>
                <Ionicons
                  name="folder-open-outline"
                  size={30}
                  color={COLORS.white}
                />
              </View>
            </View>

            <View style={styles.notice}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={COLORS.teal}
              />
              <Text style={styles.noticeText}>
                This directory uses sample records for demonstration.
                No real patient information is stored here.
              </Text>
            </View>

            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={20}
                color={COLORS.muted}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search name, ID or department..."
                placeholderTextColor={COLORS.muted}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                returnKeyType="search"
                accessibilityLabel="Search patients"
              />

              {search.length > 0 ? (
                <Pressable
                  onPress={() => setSearch('')}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                >
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={COLORS.muted}
                  />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>All patients</Text>
              <Text style={styles.resultsCount}>
                {filteredPatients.length} records
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={38}
              color={COLORS.muted}
            />
            <Text style={styles.emptyTitle}>No patients found</Text>
            <Text style={styles.emptyText}>
              Try searching with another name, patient ID or department.
            </Text>
            <Pressable
              style={styles.clearButton}
              onPress={() => setSearch('')}
            >
              <Text style={styles.clearButtonText}>Clear search</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={COLORS.teal}
            />
            <Text style={styles.footerText}>
              CareFlow · Sample patient directory
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 22,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: COLORS.teal,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  heading: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 5,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  summaryLabel: {
    color: '#A8E8DC',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  summaryTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  summarySubtitle: {
    color: '#D2DCE8',
    fontSize: 11,
    marginTop: 6,
    lineHeight: 17,
  },
  summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 13,
    backgroundColor: '#EAF7F5',
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
  },
  searchBox: {
    minHeight: 52,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 23,
  },
  searchInput: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 12,
    paddingVertical: 12,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '900',
  },
  resultsCount: {
    color: COLORS.muted,
    fontSize: 11,
  },
  patientCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  patientTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E4F7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  patientId: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },
  department: {
    color: COLORS.teal,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
  },
  activeBadge: {
    backgroundColor: COLORS.greenBg,
  },
  followUpBadge: {
    backgroundColor: '#FFF3DE',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  activeText: {
    color: COLORS.teal,
  },
  followUpText: {
    color: '#9A6700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tapHint: {
    color: COLORS.muted,
    fontSize: 10,
  },
  details: {
    marginTop: 14,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 7,
  },
  detailLabel: {
    color: COLORS.muted,
    fontSize: 11,
  },
  detailValue: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  demoLabel: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
  },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },
  clearButton: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 15,
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 24,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 9,
  },
});
