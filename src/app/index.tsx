
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  background: '#F5F8FC',
  navy: '#142B4A',
  teal: '#0E9F91',
  muted: '#718096',
  white: '#FFFFFF',
};

const departments = [
  { id: '1', name: 'Cardiology', icon: 'heart-outline' as const, color: '#FDE8E8' },
  { id: '2', name: 'Neurology', icon: 'pulse-outline' as const, color: '#E9E9FF' },
  { id: '3', name: 'Dental', icon: 'happy-outline' as const, color: '#DDF7F1' },
  { id: '4', name: 'Orthopedic', icon: 'body-outline' as const, color: '#FFF0D9' },
];

const doctors = [
  {
    id: '1',
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiologist',
    time: 'Available today',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300',
  },
  {
    id: '2',
    name: 'Dr. Rahul Mehta',
    specialty: 'Neurologist',
    time: 'Available today',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300',
  },
];

const services = [
  { id: '1', name: 'Blood Tests', icon: 'flask-outline' as const },
  { id: '2', name: 'MRI Scan', icon: 'scan-outline' as const },
  { id: '3', name: 'X-Ray', icon: 'body-outline' as const },
];

export default function HomeScreen() {
  const router = useRouter();

  const openDoctors = () => router.push('/doctors');
  const openBookings = () => router.push('/my-bookings');
  const openDashboard = () => router.push('/dashboard');
  const openExplore = () => router.push('/explore');

  const SectionTitle = ({
    title,
    onPress,
  }: {
    title: string;
    onPress?: () => void;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onPress} hitSlop={10}>
        <Text style={styles.viewAll}>View all →</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CARE THAT FEELS CLOSER</Text>
            <Text style={styles.heading}>Hello, there 👋</Text>
            <Text style={styles.subtitle}>How can we help you today?</Text>
          </View>

          <Pressable
            style={styles.notification}
            onPress={openBookings}
            accessibilityLabel="View notifications and bookings"
          >
            <Ionicons name="notifications-outline" size={23} color={COLORS.navy} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <Pressable
          style={styles.search}
          onPress={openDoctors}
          accessibilityRole="button"
          accessibilityLabel="Search doctors and departments"
        >
          <Ionicons name="search-outline" size={21} color={COLORS.muted} />
          <Text style={styles.searchText}>
            Doctors, departments, services...
          </Text>
          <Ionicons name="options-outline" size={21} color={COLORS.teal} />
        </Pressable>

        <Pressable style={styles.banner} onPress={openExplore}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerLabel}>YOUR HEALTH, OUR PRIORITY</Text>
            <Text style={styles.bannerTitle}>A healthier you{' \n'}starts here.</Text>
            <Text style={styles.bannerDescription}>
              Complete health checkup packages
            </Text>

            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Explore packages</Text>
              <Ionicons name="arrow-forward" size={15} color={COLORS.navy} />
            </View>
          </View>

          <View style={styles.bannerArt}>
            <Ionicons name="medical" size={66} color={COLORS.white} />
            <View style={styles.artBadge}>
              <Ionicons name="heart" size={19} color={COLORS.teal} />
            </View>
          </View>
        </Pressable>

        <SectionTitle title="Explore departments" onPress={openDoctors} />

        <FlatList
          data={departments}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <Pressable
              style={styles.departmentCard}
              onPress={openDoctors}
            >
              <View style={[styles.departmentIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={25} color={COLORS.navy} />
              </View>
              <Text style={styles.departmentName}>{item.name}</Text>
              <Text style={styles.cardCaption}>Specialist care</Text>
            </Pressable>
          )}
        />

        <SectionTitle title="Find your doctor" onPress={openDoctors} />

        <FlatList
          data={doctors}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <Pressable style={styles.doctorCard} onPress={openDoctors}>
              <Image
                source={{ uri: item.image }}
                style={styles.doctorImage}
                onError={() => console.log('Doctor image failed to load')}
              />

              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.doctorSpecialty}>{item.specialty}</Text>

                <View style={styles.availability}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.availabilityText}>{item.time}</Text>
                </View>

                <Text style={styles.profileLink}>View profile →</Text>
              </View>
            </Pressable>
          )}
        />

        <SectionTitle title="Diagnostic services" onPress={openExplore} />

        <View style={styles.serviceList}>
          {services.map((item) => (
            <Pressable
              key={item.id}
              style={styles.serviceRow}
              onPress={openExplore}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name={item.icon} size={23} color={COLORS.teal} />
              </View>

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.cardCaption}>
                  Quality care and reliable reports
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.facilityCard} onPress={openExplore}>
          <Ionicons name="business-outline" size={26} color={COLORS.teal} />

          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>Hospital facilities</Text>
            <Text style={styles.cardCaption}>
              Emergency care · Pharmacy · Parking
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </Pressable>

        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.teal} />
          <Text style={styles.footerText}>
            Your health information deserves care.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.tab} onPress={() => router.replace('/')}>
          <Ionicons name="home" size={23} color={COLORS.teal} />
          <Text style={[styles.tabText, { color: COLORS.teal }]}>Home</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={openDoctors}>
          <Ionicons name="people-outline" size={23} color={COLORS.muted} />
          <Text style={styles.tabText}>Doctors</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={openBookings}>
          <Ionicons name="calendar-outline" size={23} color={COLORS.muted} />
          <Text style={styles.tabText}>Bookings</Text>
        </Pressable>

        <Pressable style={styles.tab} onPress={openDashboard}>
          <Ionicons name="grid-outline" size={23} color={COLORS.muted} />
          <Text style={styles.tabText}>Dashboard</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: { fontSize: 10, letterSpacing: 2, color: COLORS.teal, fontWeight: '800' },
  heading: { fontSize: 27, fontWeight: '800', color: COLORS.navy, marginTop: 8 },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 5 },
  notification: {
    width: 46, height: 46, borderRadius: 16, backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute', top: 10, right: 11, width: 7, height: 7,
    borderRadius: 4, backgroundColor: '#F97373',
  },
  search: {
    marginHorizontal: 20, marginBottom: 22, backgroundColor: COLORS.white,
    height: 54, borderRadius: 17, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 15, gap: 10,
  },
  searchText: { flex: 1, fontSize: 12, color: COLORS.muted },
  banner: {
    marginHorizontal: 20, backgroundColor: COLORS.navy, borderRadius: 25,
    padding: 20, flexDirection: 'row', overflow: 'hidden', minHeight: 205,
  },
  bannerContent: { flex: 1, zIndex: 1 },
  bannerLabel: { color: '#9FE8DC', fontSize: 9, letterSpacing: 1, fontWeight: '800' },
  bannerTitle: { color: COLORS.white, fontSize: 25, fontWeight: '800', marginTop: 12, lineHeight: 30 },
  bannerDescription: { color: '#CFD9E6', fontSize: 10, marginTop: 8 },
  bannerButton: {
    marginTop: 15, backgroundColor: '#A8E8DC', paddingHorizontal: 12,
    paddingVertical: 9, borderRadius: 11, flexDirection: 'row',
    alignItems: 'center', alignSelf: 'flex-start', gap: 7,
  },
  bannerButtonText: { color: COLORS.navy, fontWeight: '700', fontSize: 10 },
  bannerArt: {
    width: 83, height: 100, borderRadius: 26, backgroundColor: COLORS.teal,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    marginLeft: 3, transform: [{ rotate: '7deg' }],
  },
  artBadge: {
    position: 'absolute', right: -6, bottom: -6, backgroundColor: COLORS.white,
    width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  sectionHeader: {
    marginHorizontal: 21, marginTop: 27, marginBottom: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sectionTitle: { fontSize: 17, color: COLORS.navy, fontWeight: '800' },
  viewAll: { color: COLORS.teal, fontSize: 11, fontWeight: '700' },
  horizontalList: { paddingHorizontal: 20, gap: 12, paddingBottom: 3 },
  departmentCard: {
    width: 135, backgroundColor: COLORS.white, borderRadius: 19,
    padding: 14, marginBottom: 2,
  },
  departmentIcon: {
    width: 47, height: 47, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
  },
  departmentName: { color: COLORS.navy, fontSize: 12, fontWeight: '800', marginTop: 13 },
  cardCaption: { color: COLORS.muted, fontSize: 10, marginTop: 5 },
  doctorCard: {
    width: 275, backgroundColor: COLORS.white, borderRadius: 20,
    flexDirection: 'row', padding: 12, gap: 12, marginBottom: 2,
  },
  doctorImage: { width: 91, height: 120, borderRadius: 15, backgroundColor: '#E2E8F0' },
  doctorDetails: { flex: 1, justifyContent: 'center' },
  doctorName: { color: COLORS.navy, fontWeight: '800', fontSize: 12 },
  doctorSpecialty: { color: COLORS.muted, fontSize: 11, marginTop: 6 },
  availability: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.teal },
  availabilityText: { color: COLORS.teal, fontSize: 9, fontWeight: '700' },
  profileLink: { color: COLORS.navy, fontSize: 10, fontWeight: '800', marginTop: 12 },
  serviceList: { marginHorizontal: 20, gap: 9 },
  serviceRow: {
    backgroundColor: COLORS.white, padding: 12, borderRadius: 17,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  serviceIcon: {
    width: 46, height: 46, borderRadius: 14, backgroundColor: '#E4F7F3',
    alignItems: 'center', justifyContent: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: { color: COLORS.navy, fontSize: 12, fontWeight: '800' },
  facilityCard: {
    marginHorizontal: 20, marginTop: 10, padding: 15, borderRadius: 17,
    backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 27, paddingHorizontal: 10,
  },
  footerText: { color: COLORS.muted, fontSize: 10 },
  bottomBar: {
    flexDirection: 'row', backgroundColor: COLORS.white, paddingTop: 12,
    paddingBottom: 23, borderTopWidth: 1, borderTopColor: '#E8EDF4',
    justifyContent: 'space-around',
  },
  tab: { alignItems: 'center', gap: 5, minWidth: 55 },
  tabText: { color: COLORS.muted, fontSize: 10, fontWeight: '600' },
});
