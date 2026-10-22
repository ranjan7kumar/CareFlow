import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
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
  border: '#E5EAF1',
  lightTeal: '#E7F7F5',
  green: '#16845B',
};

const SPECIALTIES = [
  'All',
  'Cardiology',
  'Neurology',
  'Dental',
  'Orthopedic',
  'Dermatology',
];

const DOCTORS = [
  {
    id: 'DOC001',
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiology',
    experience: 12,
    rating: 4.9,
    fee: 800,
    availability: 'Available today',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    about:
      'Experienced cardiologist focused on heart health, preventive care, and cardiovascular consultations.',
  },
  {
    id: 'DOC002',
    name: 'Dr. Rahul Verma',
    specialty: 'Neurology',
    experience: 10,
    rating: 4.8,
    fee: 1000,
    availability: 'Available today',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80',
    about:
      'Neurology specialist providing consultations for neurological conditions and patient follow-up.',
  },
  {
    id: 'DOC003',
    name: 'Dr. Priya Mehta',
    specialty: 'Dental',
    experience: 8,
    rating: 4.7,
    fee: 600,
    availability: 'Available tomorrow',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=80',
    about:
      'Dental care professional focused on oral health, preventive dentistry, and routine dental consultations.',
  },
  {
    id: 'DOC004',
    name: 'Dr. Arjun Singh',
    specialty: 'Orthopedic',
    experience: 15,
    rating: 4.9,
    fee: 1200,
    availability: 'Available today',
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
    about:
      'Orthopedic specialist focused on bone, joint, mobility, and musculoskeletal health consultations.',
  },
  {
    id: 'DOC005',
    name: 'Dr. Neha Kapoor',
    specialty: 'Dermatology',
    experience: 9,
    rating: 4.8,
    fee: 700,
    availability: 'Available tomorrow',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80',
    about:
      'Dermatology specialist providing consultations for skin health and common dermatological concerns.',
  },
];

type Doctor = (typeof DOCTORS)[number];

export default function DoctorsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return DOCTORS.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.id.toLowerCase().includes(query);

      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        doctor.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [search, selectedSpecialty]);

  const openProfile = (doctor: Doctor) => {
    router.push({
      pathname: '/doctor-profile',
      params: {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        fee: String(doctor.fee),
        image: doctor.image,
        experience: String(doctor.experience),
        rating: String(doctor.rating),
      },
    });
  };

  const renderDoctor = ({ item }: { item: Doctor }) => {
    const imageFailed = failedImages.includes(item.id);

    return (
      <Pressable
        style={styles.doctorCard}
        onPress={() => openProfile(item)}
        accessibilityRole="button"
        accessibilityLabel={`View profile of ${item.name}`}
      >
        <View style={styles.imageContainer}>
          {!imageFailed ? (
            <Image
              source={{ uri: item.image }}
              style={styles.doctorImage}
              resizeMode="cover"
              onError={() =>
                setFailedImages((previous) =>
                  previous.includes(item.id)
                    ? previous
                    : [...previous, item.id],
                )
              }
            />
          ) : (
            <View style={styles.imageFallback}>
              <Ionicons
                name="person"
                size={38}
                color={COLORS.teal}
              />
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#E9A23B" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.doctorInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.doctorName} numberOfLines={1}>
              {item.name}
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={17}
              color={COLORS.teal}
            />
          </View>

          <Text style={styles.specialtyText}>{item.specialty}</Text>

          <View style={styles.experienceRow}>
            <Ionicons
              name="briefcase-outline"
              size={14}
              color={COLORS.muted}
            />
            <Text style={styles.experienceText}>
              {item.experience} years experience
            </Text>
          </View>

          <View style={styles.availabilityRow}>
            <View style={styles.availabilityDot} />
            <Text style={styles.availabilityText}>
              {item.availability}
            </Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.feeLabel}>Consultation fee</Text>
              <Text style={styles.feeValue}>₹{item.fee}</Text>
            </View>

            <View style={styles.profileButton}>
              <Text style={styles.profileButtonText}>View Profile</Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color={COLORS.white}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>CARE THAT CONNECTS</Text>
          <Text style={styles.pageTitle}>Find Your Doctor</Text>
          <Text style={styles.pageSubtitle}>
            Find the right specialist for your health.
          </Text>
        </View>

        <Pressable
          style={styles.headerIcon}
          onPress={() => router.push('/my-bookings')}
          accessibilityRole="button"
          accessibilityLabel="My appointments"
        >
          <Ionicons
            name="calendar-outline"
            size={23}
            color={COLORS.navy}
          />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={21}
          color={COLORS.muted}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search doctor or specialty..."
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
          returnKeyType="search"
          accessibilityLabel="Search doctors"
        />
        {search.length > 0 && (
          <Pressable
            onPress={() => setSearch('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.muted}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.filterHeading}>
        <Text style={styles.sectionTitle}>Specialties</Text>
        <Text style={styles.resultCount}>
          {filteredDoctors.length} doctors
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {SPECIALTIES.map((specialty) => {
          const selected = selectedSpecialty === specialty;

          return (
            <Pressable
              key={specialty}
              onPress={() => setSelectedSpecialty(specialty)}
              style={[
                styles.filterChip,
                selected && styles.filterChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.filterTextSelected,
                ]}
              >
                {specialty}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Available Specialists</Text>
            <Text style={styles.listSubtitle}>
              Choose a doctor to view their profile and appointment options.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="search-outline"
                size={32}
                color={COLORS.teal}
              />
            </View>
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptyText}>
              Try another name or select a different specialty.
            </Text>
            <Pressable
              style={styles.resetButton}
              onPress={() => {
                setSearch('');
                setSelectedSpecialty('All');
              }}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={17}
              color={COLORS.muted}
            />
            <Text style={styles.disclaimerText}>
              Demo directory: doctor profiles, fees, ratings and availability
              are sample information and should not be treated as real
              hospital listings.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: COLORS.teal,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 7,
  },
  pageTitle: {
    color: COLORS.navy,
    fontSize: 27,
    fontWeight: '800',
  },
  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 5,
  },
  headerIcon: {
    height: 46,
    width: 46,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 54,
    gap: 11,
  },
  searchInput: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 14,
    height: '100%',
  },
  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: '800',
  },
  resultCount: {
    color: COLORS.teal,
    fontSize: 12,
    fontWeight: '700',
  },
  filterScroll: {
    flexGrow: 0,
    maxHeight: 44,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 9,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipSelected: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextSelected: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  listHeader: {
    marginBottom: 16,
  },
  listSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  doctorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    height: 180,
    backgroundColor: COLORS.lightTeal,
    position: 'relative',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  doctorInfo: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  doctorName: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: '800',
    flexShrink: 1,
  },
  specialtyText: {
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 7,
  },
  experienceText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 7,
  },
  availabilityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  availabilityText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  feeLabel: {
    color: COLORS.muted,
    fontSize: 11,
  },
  feeValue: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 3,
  },
  profileButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  profileButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 45,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: COLORS.lightTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
  },
  resetButton: {
    marginTop: 18,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EDF1F6',
    padding: 13,
    borderRadius: 13,
    marginTop: 4,
  },
  disclaimerText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    flex: 1,
  },
});
