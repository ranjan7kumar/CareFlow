import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#F5F8FC',
  navy: '#142B4A',
  teal: '#0E9F91',
  muted: '#718096',
  white: '#FFFFFF',
  border: '#E5EAF1',
  lightTeal: '#E7F7F5',
  green: '#16845B',
  lightBlue: '#EAF1FC',
  purple: '#F1ECFC',
  red: '#D9534F',
};

const APPOINTMENTS_KEY = '@careflow_appointments';

type Appointment = {
  id?: string;
  patientName?: string;
  doctorName?: string;
  date?: string;
  time?: string;
  status?: string;
  specialty?: string;
};

const AVAILABLE_DOCTORS = [
  {
    id: 'DOC001',
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiology',
    icon: 'heart-outline' as const,
  },
  {
    id: 'DOC002',
    name: 'Dr. Rahul Verma',
    specialty: 'Neurology',
    icon: 'fitness-outline' as const,
  },
  {
    id: 'DOC003',
    name: 'Dr. Priya Mehta',
    specialty: 'Dental',
    icon: 'medical-outline' as const,
  },
];

export default function DashboardScreen() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        setAppointments(Array.isArray(parsed) ? parsed : []);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Unable to load appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments]),
  );

  const activeAppointments = appointments.filter(
    (appointment) =>
      String(appointment.status ?? '').toLowerCase() !== 'cancelled',
  );

  const pendingAppointments = appointments.filter((appointment) => {
    const status = String(appointment.status ?? '').toLowerCase();
    return status === 'pending';
  });

  const stats = [
    {
      title: 'Total Patients',
      value: '128',
      subtitle: 'Sample records',
      icon: 'people-outline' as const,
      color: COLORS.teal,
      background: COLORS.lightTeal,
      route: '/patients' as const,
    },
    {
      title: 'Appointments',
      value: String(activeAppointments.length),
      subtitle: 'Local bookings',
      icon: 'calendar-outline' as const,
      color: '#4478C8',
      background: COLORS.lightBlue,
      route: '/my-bookings' as const,
    },
    {
      title: 'Doctors',
      value: '5',
      subtitle: 'Sample directory',
      icon: 'medkit-outline' as const,
      color: '#8064C8',
      background: COLORS.purple,
      route: '/doctors' as const,
    },
    {
      title: 'Pending',
      value: String(pendingAppointments.length),
      subtitle: 'Pending bookings',
      icon: 'time-outline' as const,
      color: '#C18A2C',
      background: '#FFF5E3',
      route: '/my-bookings' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Patients',
      subtitle: 'View patient records',
      icon: 'people-outline' as const,
      background: COLORS.lightTeal,
      color: COLORS.teal,
      onPress: () => router.push('/patients'),
    },
    {
      title: 'Find Doctors',
      subtitle: 'Browse specialists',
      icon: 'medkit-outline' as const,
      background: COLORS.lightBlue,
      color: '#4478C8',
      onPress: () => router.push('/doctors'),
    },
    {
      title: 'Appointments',
      subtitle: 'View your bookings',
      icon: 'calendar-outline' as const,
      background: COLORS.purple,
      color: '#8064C8',
      onPress: () => router.push('/my-bookings'),
    },
    {
      title: 'Departments',
      subtitle: 'Explore hospital services',
      icon: 'grid-outline' as const,
      background: '#FFF5E3',
      color: '#C18A2C',
      onPress: () => router.push('/explore'),
    },
  ];

  const renderAppointment = ({
    item,
  }: {
    item: Appointment;
  }) => {
    const status = item.status || 'Confirmed';
    const isCancelled = status.toLowerCase() === 'cancelled';

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentIcon}>
          <Ionicons
            name="calendar-outline"
            size={21}
            color={COLORS.teal}
          />
        </View>

        <View style={styles.appointmentInfo}>
          <Text style={styles.patientName} numberOfLines={1}>
            {item.patientName || 'Patient'}
          </Text>
          <Text style={styles.appointmentDoctor} numberOfLines={1}>
            {item.doctorName || 'Doctor not specified'}
          </Text>
          <Text style={styles.appointmentDate}>
            {[item.date, item.time].filter(Boolean).join(' • ') ||
              'Date not specified'}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isCancelled && styles.cancelledBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isCancelled && styles.cancelledText,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons
                name="medical"
                size={24}
                color={COLORS.white}
              />
            </View>
            <View>
              <Text style={styles.brandName}>CareFlow</Text>
              <Text style={styles.brandSubtitle}>Hospital Management</Text>
            </View>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => router.push('/my-bookings')}
            accessibilityRole="button"
            accessibilityLabel="View appointments"
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={COLORS.navy}
            />
            {pendingAppointments.length > 0 && (
              <View style={styles.notificationDot} />
            )}
          </Pressable>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>HOSPITAL OVERVIEW</Text>
          <Text style={styles.welcomeTitle}>Dashboard</Text>
          <Text style={styles.welcomeSubtitle}>
            Monitor your hospital activity in one place.
          </Text>
        </View>

        {/* Summary banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerEyebrow}>CAREFLOW WORKSPACE</Text>
            <Text style={styles.bannerTitle}>
              Better care,{'\n'}better coordination.
            </Text>
            <Text style={styles.bannerSubtitle}>
              Manage doctors, patients and follow-ups.
            </Text>
            <Pressable
              style={styles.bannerButton}
              onPress={() => router.push('/follow-up')}
            >
              <Text style={styles.bannerButtonText}>Start Follow-up</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={COLORS.navy}
              />
            </Pressable>
          </View>

          <View style={styles.bannerIllustration}>
            <Ionicons
              name="heart"
              size={38}
              color={COLORS.white}
            />
            <View style={styles.bannerPlus}>
              <Ionicons
                name="add"
                size={23}
                color={COLORS.teal}
              />
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Hospital Overview</Text>
            <Text style={styles.sectionSubtitle}>
              A quick look at your activity
            </Text>
          </View>
          <Ionicons
            name="stats-chart-outline"
            size={21}
            color={COLORS.teal}
          />
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <Pressable
              key={stat.title}
              style={styles.statCard}
              onPress={() => router.push(stat.route)}
            >
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.background },
                ]}
              >
                <Ionicons
                  name={stat.icon}
                  size={21}
                  color={stat.color}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
            </Pressable>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>
              Get things done faster
            </Text>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.title}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: action.background },
                ]}
              >
                <Ionicons
                  name={action.icon}
                  size={23}
                  color={action.color}
                />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              <View style={styles.actionArrow}>
                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={COLORS.teal}
                />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Follow-up workflow card */}
        <Pressable
          style={styles.followUpCard}
          onPress={() => router.push('/follow-up')}
        >
          <View style={styles.followUpIcon}>
            <Ionicons
              name="clipboard-outline"
              size={26}
              color={COLORS.teal}
            />
          </View>

          <View style={styles.followUpContent}>
            <Text style={styles.followUpTitle}>Patient Follow-up</Text>
            <Text style={styles.followUpSubtitle}>
              Select a patient, enter follow-up details and review the plan.
            </Text>
            <Text style={styles.followUpLink}>
              Open workflow
              <Ionicons
                name="arrow-forward"
                size={14}
                color={COLORS.teal}
              />
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.muted}
          />
        </Pressable>

        {/* Recent Appointments */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Appointments</Text>
            <Text style={styles.sectionSubtitle}>
              Bookings stored on this device
            </Text>
          </View>

          <Pressable onPress={() => router.push('/my-bookings')}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.teal} />
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : activeAppointments.length > 0 ? (
          <FlatList
            data={activeAppointments.slice(0, 4)}
            keyExtractor={(item, index) =>
              String(item.id || `${item.patientName || 'booking'}-${index}`)
            }
            renderItem={renderAppointment}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyAppointments}>
            <View style={styles.emptyAppointmentIcon}>
              <Ionicons
                name="calendar-outline"
                size={27}
                color={COLORS.teal}
              />
            </View>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptySubtitle}>
              Your bookings will appear here after you book a doctor.
            </Text>
            <Pressable
              style={styles.bookDoctorButton}
              onPress={() => router.push('/doctors')}
            >
              <Text style={styles.bookDoctorButtonText}>Find a Doctor</Text>
            </Pressable>
          </View>
        )}

        {/* Available doctors */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Doctor Directory</Text>
            <Text style={styles.sectionSubtitle}>
              Sample specialists in CareFlow
            </Text>
          </View>

          <Pressable onPress={() => router.push('/doctors')}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {AVAILABLE_DOCTORS.map((doctor) => (
          <Pressable
            key={doctor.id}
            style={styles.doctorRow}
            onPress={() => router.push('/doctors')}
          >
            <View style={styles.doctorIcon}>
              <Ionicons
                name={doctor.icon}
                size={22}
                color={COLORS.teal}
              />
            </View>
            <View style={styles.doctorRowInfo}>
              <Text style={styles.doctorRowName}>{doctor.name}</Text>
              <Text style={styles.doctorRowSpecialty}>
                {doctor.specialty}
              </Text>
            </View>
            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
              <Text style={styles.availableText}>Listed</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.muted}
            />
          </Pressable>
        ))}

        {/* Demo data notice */}
        <View style={styles.demoNotice}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.muted}
          />
          <Text style={styles.demoNoticeText}>
            Demo application: patient totals, doctor directory and task
            figures are sample data. Appointment counts are calculated from
            bookings saved locally on this device. No hospital backend is
            connected.
          </Text>
        </View>

        {/* Bottom navigation */}
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navItem}
            onPress={() => router.replace('/')}
          >
            <Ionicons
              name="home-outline"
              size={21}
              color={COLORS.muted}
            />
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/doctors')}
          >
            <Ionicons
              name="medkit-outline"
              size={21}
              color={COLORS.muted}
            />
            <Text style={styles.navLabel}>Doctors</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/my-bookings')}
          >
            <Ionicons
              name="calendar-outline"
              size={21}
              color={COLORS.muted}
            />
            <Text style={styles.navLabel}>Bookings</Text>
          </Pressable>

          <View style={[styles.navItem, styles.activeNavItem]}>
            <Ionicons
              name="grid"
              size={21}
              color={COLORS.teal}
            />
            <Text style={styles.activeNavLabel}>Dashboard</Text>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  brandIcon: {
    height: 46,
    width: 46,
    borderRadius: 15,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.navy,
  },
  brandSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 3,
  },
  notificationButton: {
    height: 44,
    width: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    right: 10,
    top: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  greeting: {
    color: COLORS.teal,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 7,
  },
  welcomeTitle: {
    color: COLORS.navy,
    fontSize: 30,
    fontWeight: '800',
  },
  welcomeSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
  },
  banner: {
    minHeight: 195,
    backgroundColor: COLORS.navy,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginBottom: 27,
  },
  bannerContent: {
    flex: 1,
    paddingRight: 4,
  },
  bannerEyebrow: {
    color: '#8BE0D4',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  bannerSubtitle: {
    color: '#D6E1F0',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
    marginBottom: 13,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerButtonText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '800',
  },
  bannerIllustration: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  bannerPlus: {
    position: 'absolute',
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    right: -4,
    bottom: -4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 12,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  statValue: {
    color: COLORS.navy,
    fontSize: 26,
    fontWeight: '800',
  },
  statTitle: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  statSubtitle: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 150,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '800',
  },
  actionSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    paddingRight: 5,
  },
  actionArrow: {
    position: 'absolute',
    right: 13,
    top: 14,
  },
  followUpCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CDECE7',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 27,
  },
  followUpIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.lightTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followUpContent: {
    flex: 1,
  },
  followUpTitle: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
  },
  followUpSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  followUpLink: {
    color: COLORS.teal,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 9,
    flexDirection: 'row',
  },
  viewAll: {
    color: COLORS.teal,
    fontSize: 12,
    fontWeight: '800',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 13,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 11,
  },
  appointmentIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.lightTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  appointmentDoctor: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  appointmentDate: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },
  statusBadge: {
    backgroundColor: COLORS.lightTeal,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: '800',
  },
  cancelledBadge: {
    backgroundColor: '#FCEAEA',
  },
  cancelledText: {
    color: COLORS.red,
  },
  emptyAppointments: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 26,
  },
  emptyAppointmentIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: COLORS.lightTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 7,
  },
  bookDoctorButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 11,
    marginTop: 15,
  },
  bookDoctorButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 11,
  },
  doctorIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.lightTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorRowInfo: {
    flex: 1,
  },
  doctorRowName: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  doctorRowSpecialty: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF7EF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  availableText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: '800',
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 14,
    backgroundColor: '#EDF1F6',
    borderRadius: 14,
    marginTop: 15,
    marginBottom: 22,
  },
  demoNoticeText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    flex: 1,
  },
  activeNavItem: {
    backgroundColor: COLORS.lightTeal,
    borderRadius: 12,
    paddingVertical: 7,
    marginHorizontal: 3,
  },
  navLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  activeNavLabel: {
    color: COLORS.teal,
    fontSize: 10,
    fontWeight: '800',
  },
});
