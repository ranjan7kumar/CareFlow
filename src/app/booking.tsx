
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@careflow_appointments';

const COLORS = {
  background: '#F5F8FC',
  navy: '#142B4A',
  teal: '#0E9F91',
  muted: '#718096',
  white: '#FFFFFF',
  border: '#E5EAF2',
};

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

function getDateOptions() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    return {
      value,
      day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
    };
  });
}

type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  fee: string;
  date: string;
  time: string;
  status: 'Confirmed';
  createdAt: string;
};

export default function BookingScreen() {
  const { doctorId, doctorName, specialty, fee } =
    useLocalSearchParams<{
      doctorId?: string;
      doctorName?: string;
      specialty?: string;
      fee?: string;
    }>();

  const [selectedDate, setSelectedDate] = useState(
    () => getDateOptions()[0].value
  );
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [confirmedDate, setConfirmedDate] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('');
  const [saving, setSaving] = useState(false);

  const dates = getDateOptions();

  const formatDate = (value: string) => {
    if (!value) return '';

    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const confirmAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert(
        'Select appointment details',
        'Please select a date and time before continuing.'
      );
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: Appointment[] = saved ? JSON.parse(saved) : [];

      const id = `CF${Date.now().toString().slice(-8)}`;

      const appointment: Appointment = {
        id,
        doctorId: doctorId ? String(doctorId) : '',
        doctorName: doctorName ? String(doctorName) : 'Doctor not selected',
        specialty: specialty
          ? String(specialty)
          : 'General Consultation',
        fee: fee ? String(fee) : '',
        date: selectedDate,
        time: selectedTime,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...existing, appointment])
      );

      setBookingId(id);
      setConfirmedDate(selectedDate);
      setConfirmedTime(selectedTime);
    } catch (error) {
      console.error('Appointment save error:', error);

      Alert.alert(
        'Booking could not be saved',
        'Please check your storage setup and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        {!bookingId ? (
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={23} color={COLORS.navy} />
          </Pressable>
        ) : (
          <View style={styles.backButton}>
            <Ionicons name="checkmark" size={23} color={COLORS.teal} />
          </View>
        )}

        <Text style={styles.topTitle}>
          {bookingId ? 'Appointment Confirmed' : 'Book Appointment'}
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!bookingId ? (
          <>
            <View style={styles.intro}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="calendar-outline"
                  size={34}
                  color={COLORS.teal}
                />
              </View>

              <Text style={styles.title}>Schedule your visit</Text>
              <Text style={styles.subtitle}>
                Choose a date and a convenient time for your consultation.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.doctorRow}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person" size={28} color={COLORS.teal} />
                </View>

                <View style={styles.doctorInfo}>
                  <Text style={styles.label}>YOUR DOCTOR</Text>
                  <Text style={styles.doctorName}>
                    {doctorName || 'Doctor not selected'}
                  </Text>
                  <Text style={styles.specialty}>
                    {specialty || 'General Consultation'}
                  </Text>

                  {doctorId ? (
                    <Text style={styles.doctorId}>
                      Doctor ID: {doctorId}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.feeRow}>
                <Text style={styles.label}>Consultation fee</Text>
                <Text style={styles.fee}>
                  {fee ? `₹${fee}` : 'To be confirmed'}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Select appointment date
            </Text>

            <View style={styles.dateList}>
              {dates.map((item) => {
                const active = selectedDate === item.value;

                return (
                  <Pressable
                    key={item.value}
                    style={[
                      styles.dateItem,
                      active && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedDate(item.value)}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        active && styles.selectedText,
                      ]}
                    >
                      {item.day}
                    </Text>

                    <Text
                      style={[
                        styles.dateNumber,
                        active && styles.selectedText,
                      ]}
                    >
                      {item.date}
                    </Text>

                    <Text
                      style={[
                        styles.dateMonth,
                        active && styles.selectedText,
                      ]}
                    >
                      {item.month}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Available time slots</Text>

            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((time) => {
                const active = selectedTime === time;

                return (
                  <Pressable
                    key={time}
                    style={[
                      styles.timeItem,
                      active && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={active ? COLORS.white : COLORS.teal}
                    />

                    <Text
                      style={[
                        styles.timeText,
                        active && styles.selectedText,
                      ]}
                    >
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.confirmButton,
                (!selectedDate || !selectedTime || saving) &&
                  styles.disabledButton,
              ]}
              disabled={!selectedDate || !selectedTime || saving}
              onPress={confirmAppointment}
            >
              {saving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.confirmText}>
                    Confirm Appointment
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={19}
                    color={COLORS.white}
                  />
                </>
              )}
            </Pressable>

            <Text style={styles.note}>
              Your booking will be saved on this device.
            </Text>
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark-circle"
                size={76}
                color={COLORS.teal}
              />
            </View>

            <Text style={styles.successTitle}>Booking successful!</Text>

            <Text style={styles.successSubtitle}>
              Your appointment has been saved. Keep your booking ID for
              reference.
            </Text>

            <View style={styles.confirmationCard}>
              <Text style={styles.label}>BOOKING ID</Text>
              <Text style={styles.bookingId}>{bookingId}</Text>

              <View style={styles.divider} />

              <Text style={styles.label}>DOCTOR</Text>
              <Text style={styles.detailValue}>
                {doctorName || 'Doctor not selected'}
              </Text>
              <Text style={styles.specialty}>
                {specialty || 'General Consultation'}
              </Text>

              <View style={styles.detailRow}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.teal}
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.label}>APPOINTMENT DATE</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(confirmedDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={COLORS.teal}
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.label}>APPOINTMENT TIME</Text>
                  <Text style={styles.detailValue}>{confirmedTime}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  color={COLORS.teal}
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.label}>CONSULTATION FEE</Text>
                  <Text style={styles.detailValue}>
                    {fee ? `₹${fee}` : 'To be confirmed'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.teal}
                />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.label}>STATUS</Text>
                  <Text style={styles.detailValue}>Confirmed (Demo)</Text>
                </View>
              </View>
            </View>

            <View style={styles.notice}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={COLORS.teal}
              />
              <Text style={styles.noticeText}>
                Saved locally on this device. This demo does not verify
                doctor availability or create a hospital-side appointment.
              </Text>
            </View>

            <Pressable
              style={styles.confirmButton}
              onPress={() => router.replace('/my-bookings')}
            >
              <Text style={styles.confirmText}>View My Bookings</Text>
              <Ionicons
                name="calendar-outline"
                size={19}
                color={COLORS.white}
              />
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.secondaryText}>Back to Home</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.replace('/doctors')}
            >
              <Text style={styles.secondaryText}>
                Book another appointment
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    minHeight: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  intro: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 22,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#DDF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: COLORS.navy,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 20,
    marginBottom: 25,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  doctorAvatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#DDF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    flex: 1,
  },
  label: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  doctorName: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '800',
  },
  specialty: {
    color: COLORS.teal,
    fontSize: 12,
    marginTop: 5,
  },
  doctorId: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 17,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fee: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 13,
  },
  dateList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
    marginBottom: 26,
  },
  dateItem: {
    flex: 1,
    minHeight: 88,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
  },
  selectedItem: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  dateDay: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  dateNumber: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 4,
  },
  dateMonth: {
    color: COLORS.muted,
    fontSize: 10,
  },
  selectedText: {
    color: COLORS.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  timeItem: {
    width: '48%',
    flexGrow: 1,
    minHeight: 47,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 8,
  },
  timeText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  confirmButton: {
    minHeight: 54,
    backgroundColor: COLORS.teal,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.45,
  },
  confirmText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  note: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 12,
  },
  successContainer: {
    paddingTop: 20,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 15,
  },
  successTitle: {
    color: COLORS.navy,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  successSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 25,
  },
  confirmationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  bookingId: {
    color: COLORS.teal,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 19,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailValue: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#E8F8F5',
    padding: 13,
    borderRadius: 13,
    marginBottom: 20,
  },
  noticeText: {
    color: COLORS.navy,
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
  },
  secondaryButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryText: {
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: '800',
  },
});
