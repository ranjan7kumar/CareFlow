
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

const C = {
  bg: '#F5F8FC',
  navy: '#142B4A',
  teal: '#0E9F91',
  muted: '#718096',
  white: '#FFFFFF',
  border: '#E5EAF2',
};

const PATIENTS = [
  { id: 'P1001', name: 'Aarav Sharma', condition: 'General follow-up', initials: 'AS' },
  { id: 'P1002', name: 'Priya Verma', condition: 'Cardiology follow-up', initials: 'PV' },
  { id: 'P1003', name: 'Rahul Mehta', condition: 'Neurology follow-up', initials: 'RM' },
  { id: 'P1004', name: 'Ananya Singh', condition: 'Routine check-up', initials: 'AS' },
  { id: 'P1005', name: 'Kabir Gupta', condition: 'Post-treatment review', initials: 'KG' },
];

export default function FollowUpScreen() {
  const [search, setSearch] = useState('');

  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Ionicons name="arrow-back" size={22} color={C.navy} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Patient Follow-up</Text>
          <Text style={styles.headerSub}>Clinical workflow · Step 1 of 3</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progress, styles.active]} />
        <View style={styles.progress} />
        <View style={styles.progress} />
      </View>

      <View style={styles.intro}>
        <View style={styles.introIcon}>
          <Ionicons name="people-outline" size={27} color={C.teal} />
        </View>
        <Text style={styles.title}>Select a patient</Text>
        <Text style={styles.subtitle}>
          Choose a sample patient to prepare a follow-up plan.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={C.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, patient ID..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search patients"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={19} color={C.muted} />
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionLabel}>
        SAMPLE PATIENTS ({filteredPatients.length})
      </Text>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>No matching sample patients found.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.patientCard}
            onPress={() =>
              router.push({
                pathname: '/follow-up-details',
                params: {
                  patientId: item.id,
                  patientName: item.name,
                  condition: item.condition,
                },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Select ${item.name}`}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientId}>{item.id}</Text>
              <Text style={styles.condition}>{item.condition}</Text>
            </View>
            <Ionicons name="chevron-forward" size={21} color={C.teal} />
          </Pressable>
        )}
      />

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={19} color={C.teal} />
        <Text style={styles.noticeText}>
          Demo only: these are fictional patient records. Do not use them for real clinical decisions.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  back: {
    width: 43, height: 43, borderRadius: 14, backgroundColor: C.white,
    borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: C.navy, fontSize: 19, fontWeight: '900' },
  headerSub: { color: C.muted, fontSize: 11, marginTop: 4 },
  progressRow: { flexDirection: 'row', gap: 7, marginVertical: 12 },
  progress: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#DCE4ED' },
  active: { backgroundColor: C.teal },
  intro: { paddingVertical: 18, alignItems: 'flex-start' },
  introIcon: {
    width: 53, height: 53, borderRadius: 17, backgroundColor: '#E4F7F3',
    alignItems: 'center', justifyContent: 'center', marginBottom: 15,
  },
  title: { color: C.navy, fontSize: 25, fontWeight: '900' },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 7 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.white,
    borderWidth: 1, borderColor: C.border, borderRadius: 15, paddingHorizontal: 14,
    minHeight: 51,
  },
  searchInput: { flex: 1, color: C.navy, fontSize: 13, paddingVertical: 12 },
  sectionLabel: { color: C.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginTop: 23, marginBottom: 10 },
  list: { paddingBottom: 10, flexGrow: 1 },
  patientCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.white,
    borderRadius: 17, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: '#E4F7F3',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: C.teal, fontWeight: '900', fontSize: 14 },
  patientInfo: { flex: 1 },
  patientName: { color: C.navy, fontSize: 14, fontWeight: '900' },
  patientId: { color: C.muted, fontSize: 10, marginTop: 4 },
  condition: { color: C.teal, fontSize: 11, fontWeight: '700', marginTop: 5 },
  empty: { color: C.muted, textAlign: 'center', padding: 25 },
  notice: {
    flexDirection: 'row', gap: 9, alignItems: 'flex-start', backgroundColor: '#EAF8F6',
    borderRadius: 13, padding: 12, marginTop: 8, marginBottom: 10,
  },
  noticeText: { flex: 1, color: C.muted, fontSize: 10, lineHeight: 16 },
});
