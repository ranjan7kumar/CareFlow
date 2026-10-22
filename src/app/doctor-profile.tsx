
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
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

const DOCTOR_DETAILS: Record<
  string,
  {
    name: string;
    specialty: string;
    experience: string;
    rating: string;
    reviews: string;
    fee: string;
    image: string;
    qualification: string;
    about: string;
  }
> = {
  '1': {
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiologist',
    experience: '12 years',
    rating: '4.9',
    reviews: '240 reviews',
    fee: '800',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900',
    qualification: 'MBBS, MD Cardiology',
    about:
      'Provides consultations for heart health, blood pressure and cardiovascular wellness.',
  },
  '2': {
    name: 'Dr. Rahul Mehta',
    specialty: 'Neurologist',
    experience: '10 years',
    rating: '4.8',
    reviews: '186 reviews',
    fee: '700',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900',
    qualification: 'MBBS, MD Neurology',
    about:
      'Focuses on neurological consultations, headache assessment and nervous system health.',
  },
  '3': {
    name: 'Dr. Priya Verma',
    specialty: 'Pediatrician',
    experience: '8 years',
    rating: '4.8',
    reviews: '154 reviews',
    fee: '600',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900',
    qualification: 'MBBS, MD Pediatrics',
    about:
      'Provides general pediatric consultations and child health guidance.',
  },
  '4': {
    name: 'Dr. Amit Kapoor',
    specialty: 'Dermatologist',
    experience: '9 years',
    rating: '4.7',
    reviews: '132 reviews',
    fee: '650',
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=900',
    qualification: 'MBBS, MD Dermatology',
    about:
      'Provides consultations for common skin, hair and dermatological concerns.',
  },
  '5': {
    name: 'Dr. Neha Gupta',
    specialty: 'Orthopedic Specialist',
    experience: '11 years',
    rating: '4.9',
    reviews: '205 reviews',
    fee: '750',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900',
    qualification: 'MBBS, MS Orthopedics',
    about:
      'Focuses on bone and joint consultations, mobility and musculoskeletal health.',
  },
};

export default function DoctorProfileScreen() {
  const params = useLocalSearchParams<{
    doctorId?: string | string[];
    doctorName?: string | string[];
    specialty?: string | string[];
    fee?: string | string[];
  }>();

  const doctorId = Array.isArray(params.doctorId)
    ? params.doctorId[0]
    : params.doctorId;

  const doctorName = Array.isArray(params.doctorName)
    ? params.doctorName[0]
    : params.doctorName;

  const specialtyParam = Array.isArray(params.specialty)
    ? params.specialty[0]
    : params.specialty;

  const feeParam = Array.isArray(params.fee)
    ? params.fee[0]
    : params.fee;

  const fallbackDoctor = {
    name: doctorName || 'CareFlow Specialist',
    specialty: specialtyParam || 'Medical Specialist',
    experience: 'Experienced professional',
    rating: '4.8',
    reviews: 'Demo reviews',
    fee: feeParam || '700',
    image:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=900',
    qualification: 'Medical qualifications to be verified',
    about:
      'View specialist information and continue to the appointment booking screen.',
  };

  const doctor = {
    ...(doctorId ? DOCTOR_DETAILS[doctorId] : undefined),
    ...fallbackDoctor,
    ...(doctorId && DOCTOR_DETAILS[doctorId]
      ? DOCTOR_DETAILS[doctorId]
      : {}),
    name: doctorName || DOCTOR_DETAILS[doctorId || '']?.name || fallbackDoctor.name,
    specialty:
      specialtyParam ||
      DOCTOR_DETAILS[doctorId || '']?.specialty ||
      fallbackDoctor.specialty,
    fee: feeParam || DOCTOR_DETAILS[doctorId || '']?.fee || fallbackDoctor.fee,
  };

  

  const openBooking = () => {
    router.push({
      pathname: '/booking',
      params: {
        doctorId: String(doctorId ?? ''),
        doctorName: doctor.name,
        specialty: doctor.specialty,
        fee: String(doctor.fee),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable
            style={styles.iconButton}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace('/doctors')
            }
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
          </Pressable>

          <Text style={styles.topTitle}>Doctor Profile</Text>

          <View style={styles.iconButton}>
            <Ionicons name="heart-outline" size={21} color={COLORS.teal} />
          </View>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: doctor.image }}
            style={styles.doctorImage}
            resizeMode="cover"
          />

          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Demo availability</Text>
          </View>

          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <Text style={styles.qualification}>{doctor.qualification}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={17} color="#F5A623" />
            <Text style={styles.rating}>{doctor.rating}</Text>
            <Text style={styles.reviewCount}>({doctor.reviews})</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="briefcase-outline" size={20} color={COLORS.teal} />
            </View>
            <Text style={styles.statValue}>{doctor.experience}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="cash-outline" size={20} color={COLORS.teal} />
            </View>
            <Text style={styles.statValue}>₹{doctor.fee}</Text>
            <Text style={styles.statLabel}>Consultation</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={20} color={COLORS.teal} />
            </View>
            <Text style={styles.statValue}>30 min</Text>
            <Text style={styles.statLabel}>Demo duration</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the doctor</Text>
          <Text style={styles.aboutText}>{doctor.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultation details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="location-outline" size={20} color={COLORS.teal} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailTitle}>Location</Text>
              <Text style={styles.detailSubtitle}>
                CareFlow Hospital · Demo location
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.teal} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailTitle}>Appointments</Text>
              <Text style={styles.detailSubtitle}>
                Select a date and time on the next screen
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.teal} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailTitle}>Demo profile</Text>
              <Text style={styles.detailSubtitle}>
                Details and availability are sample data
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={COLORS.teal}
          />
          <Text style={styles.noticeText}>
            This is a demo profile. Doctor credentials, ratings and real-time
            availability are not verified by a live hospital system.
          </Text>
        </View>

        <Pressable
          style={styles.bookButton}
          onPress={openBooking}
          accessibilityRole="button"
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
          <Ionicons name="arrow-forward" size={19} color={COLORS.white} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 20, paddingBottom: 35 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
  },
  iconButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topTitle: { color: COLORS.navy, fontSize: 17, fontWeight: '900' },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  doctorImage: {
    width: 116,
    height: 116,
    borderRadius: 30,
    backgroundColor: '#E4F7F3',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E4F7F3',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 13,
  },
  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.teal,
  },
  availableText: { color: COLORS.teal, fontSize: 10, fontWeight: '800' },
  doctorName: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 13,
  },
  specialty: { color: COLORS.teal, fontSize: 13, fontWeight: '800', marginTop: 6 },
  qualification: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 13 },
  rating: { color: COLORS.navy, fontSize: 13, fontWeight: '900' },
  reviewCount: { color: COLORS.muted, fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 17,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E4F7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  statValue: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  statLabel: { color: COLORS.muted, fontSize: 9, marginTop: 5, textAlign: 'center' },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: { color: COLORS.navy, fontSize: 15, fontWeight: '900', marginBottom: 12 },
  aboutText: { color: COLORS.muted, fontSize: 12, lineHeight: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  detailIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: '#E4F7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextContainer: { flex: 1 },
  detailTitle: { color: COLORS.navy, fontSize: 12, fontWeight: '800' },
  detailSubtitle: { color: COLORS.muted, fontSize: 10, marginTop: 4, lineHeight: 15 },
  notice: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
    backgroundColor: '#EAF8F6',
    borderRadius: 14,
    padding: 13,
    marginTop: 16,
  },
  noticeText: { flex: 1, color: COLORS.muted, fontSize: 10, lineHeight: 16 },
  bookButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 16,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  bookButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '900' },
});
