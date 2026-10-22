
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
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
};

type Service = {
  id: string;
  title: string;
  subtitle: string;
  category: 'Department' | 'Diagnostic' | 'Facility';
  icon: React.ComponentProps<typeof Ionicons>['name'];
  image: string;
  details: string;
};

const SERVICES: Service[] = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    subtitle: 'Heart and vascular care',
    category: 'Department',
    icon: 'heart-outline',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800',
    details: 'Heart health consultations, cardiac assessment and specialist care.',
  },
  {
    id: 'neurology',
    title: 'Neurology',
    subtitle: 'Brain and nervous system',
    category: 'Department',
    icon: 'pulse-outline',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
    details: 'Consultations for neurological health and nervous system concerns.',
  },
  {
    id: 'dental',
    title: 'Dental Care',
    subtitle: 'Oral health and hygiene',
    category: 'Department',
    icon: 'happy-outline',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
    details: 'Routine oral examinations, dental consultations and preventive care.',
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics',
    subtitle: 'Bone, joint and mobility care',
    category: 'Department',
    icon: 'body-outline',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    details: 'Bone and joint consultations, mobility assessment and orthopedic care.',
  },
  {
    id: 'blood-test',
    title: 'Blood Tests',
    subtitle: 'Laboratory diagnostics',
    category: 'Diagnostic',
    icon: 'flask-outline',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800',
    details: 'Laboratory testing information. Test availability and preparation must be confirmed with the hospital.',
  },
  {
    id: 'mri',
    title: 'MRI Scan',
    subtitle: 'Medical imaging',
    category: 'Diagnostic',
    icon: 'scan-outline',
    image: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?w=800',
    details: 'Medical imaging service information. Appointment and scan availability require confirmation.',
  },
  {
    id: 'xray',
    title: 'X-Ray',
    subtitle: 'Diagnostic imaging',
    category: 'Diagnostic',
    icon: 'fitness-outline',
    image: 'https://images.unsplash.com/photo-1516069677018-378515003435?w=800',
    details: 'X-ray service information. Please confirm the required procedure with the provider.',
  },
  {
    id: 'emergency',
    title: 'Emergency Care',
    subtitle: 'Urgent medical assistance',
    category: 'Facility',
    icon: 'medkit-outline',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    details: 'This is a demo directory entry, not a live emergency service locator. For a real emergency, contact local emergency services.',
  },
  {
    id: 'patient-rooms',
    title: 'Patient Rooms',
    subtitle: 'Inpatient facilities',
    category: 'Facility',
    icon: 'bed-outline',
    image: 'https://images.unsplash.com/photo-1519494080410-f9aa8f52f7e4?w=800',
    details: 'General information about patient accommodation. Room availability is not connected to a live hospital system.',
  },
];

const FILTERS = ['All', 'Department', 'Diagnostic', 'Facility'] as const;
type Filter = (typeof FILTERS)[number];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<Service | null>(null);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return SERVICES.filter(service => {
      const matchesFilter = filter === 'All' || service.category === filter;
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.subtitle.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  const renderService = ({ item }: { item: Service }) => (
    <Pressable
      style={styles.serviceCard}
      onPress={() => setSelected(item)}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.title} details`}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.serviceImage}
        resizeMode="cover"
        onError={() => undefined}
      />

      <View style={styles.cardIcon}>
        <Ionicons name={item.icon} size={19} color={COLORS.teal} />
      </View>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.muted}
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={filteredServices}
        keyExtractor={item => item.id}
        renderItem={renderService}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={() => router.replace('/')}
                accessibilityRole="button"
                accessibilityLabel="Back to home"
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={COLORS.navy}
                />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={styles.eyebrow}>CAREFLOW DIRECTORY</Text>
                <Text style={styles.heading}>Explore Care</Text>
              </View>

              <View style={styles.headerIcon}>
                <Ionicons
                  name="business-outline"
                  size={22}
                  color={COLORS.teal}
                />
              </View>
            </View>

            <View style={styles.banner}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerLabel}>YOUR HEALTH, OUR PRIORITY</Text>
                <Text style={styles.bannerTitle}>
                  Care for every stage of life
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Explore departments, diagnostics and facilities.
                </Text>
              </View>

              <Ionicons
                name="heart-circle-outline"
                size={54}
                color="#A8E8DC"
              />
            </View>

            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={20}
                color={COLORS.muted}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search departments or services..."
                placeholderTextColor={COLORS.muted}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {search.length > 0 ? (
                <Pressable onPress={() => setSearch('')}>
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={COLORS.muted}
                  />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.filterRow}>
              {FILTERS.map(item => (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  style={[
                    styles.filterChip,
                    filter === item && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item && styles.filterTextActive,
                    ]}
                  >
                    {item === 'All' ? 'All' : item === 'Department' ? 'Departments' : item === 'Diagnostic' ? 'Diagnostics' : 'Facilities'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>
                {filter === 'All' ? 'All services' : `${filter}s`}
              </Text>
              <Text style={styles.resultsCount}>
                {filteredServices.length} items
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
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptyText}>
              Try another search or change the category filter.
            </Text>
            <Pressable
              style={styles.clearButton}
              onPress={() => {
                setSearch('');
                setFilter('All');
              }}
            >
              <Text style={styles.clearButtonText}>Reset filters</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.teal}
            />
            <Text style={styles.footerText}>
              Demo directory · Service availability is not live
            </Text>
          </View>
        }
      />

      {selected ? (
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setSelected(null)}
            accessibilityRole="button"
            accessibilityLabel="Close service details"
          />
          <View style={styles.detailSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeadingRow}>
              <View style={styles.sheetIcon}>
                <Ionicons
                  name={selected.icon}
                  size={25}
                  color={COLORS.teal}
                />
              </View>
              <View style={styles.sheetTitleContainer}>
                <Text style={styles.sheetTitle}>{selected.title}</Text>
                <Text style={styles.sheetSubtitle}>{selected.subtitle}</Text>
              </View>
              <Pressable
                onPress={() => setSelected(null)}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close details"
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={COLORS.navy}
                />
              </Pressable>
            </View>

            <Text style={styles.detailCategory}>{selected.category}</Text>
            <Text style={styles.detailDescription}>{selected.details}</Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                setSelected(null);
                router.push('/doctors');
              }}
            >
              <Text style={styles.primaryButtonText}>Browse doctors</Text>
              <Ionicons
                name="arrow-forward"
                size={17}
                color={COLORS.white}
              />
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingHorizontal: 20, paddingBottom: 28 },
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
  headerText: { flex: 1 },
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
  banner: {
    backgroundColor: COLORS.navy,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  bannerText: { flex: 1 },
  bannerLabel: {
    color: '#A8E8DC',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 9,
    lineHeight: 25,
  },
  bannerSubtitle: {
    color: '#D2DCE8',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },
  searchBox: {
    minHeight: 51,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 12,
    paddingVertical: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },
  filterChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  filterChipActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  filterTextActive: { color: COLORS.white },
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
  resultsCount: { color: COLORS.muted, fontSize: 10 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 11,
  },
  serviceImage: {
    width: 68,
    height: 75,
    borderRadius: 13,
    backgroundColor: '#E4F7F3',
  },
  cardIcon: {
    position: 'absolute',
    top: 19,
    left: 19,
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceTitle: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  serviceSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4F7F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    marginTop: 7,
  },
  categoryText: {
    color: COLORS.teal,
    fontSize: 9,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 25,
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
    textAlign: 'center',
    lineHeight: 17,
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
  footerText: { color: COLORS.muted, fontSize: 9 },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 25, 45, 0.48)',
  },
  detailSheet: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginBottom: 22,
  },
  sheetHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#E4F7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitleContainer: { flex: 1 },
  sheetTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '900',
  },
  sheetSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCategory: {
    color: COLORS.teal,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 20,
    textTransform: 'uppercase',
  },
  detailDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 13,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 22,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
