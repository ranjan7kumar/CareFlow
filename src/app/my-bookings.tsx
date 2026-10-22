
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
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
  red: '#D64545',
};

type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  fee: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
};

export default function MyBookingsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: Appointment[] = saved ? JSON.parse(saved) : [];

      setAppointments(
        parsed.sort(
          (a, b) =>
            new Date(`${b.date}T00:00:00`).getTime() -
            new Date(`${a.date}T00:00:00`).getTime()
        )
      );
    } catch (error) {
      console.error('Could not load appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

  const cancelAppointment = async (id: string) => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Appointment[] = saved ? JSON.parse(saved) : [];

      const updated = current.map((item) =>
        item.id === id ? { ...item, status: 'Cancelled' as const } : item
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await loadAppointments();
    } catch (error) {
      console.error('Could not cancel appointment:', error);
    }
  };

  const formatDate = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const cancelled = item.status === 'Cancelled';

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.doctorIcon}>
            <Ionicons name="person" size={25} color={COLORS.teal} />
          </View>

          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {item.doctorName || 'Doctor'}
            </Text>
            <Text style={styles.specialty}>
              {item.specialty || 'General Consultation'}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              cancelled && styles.cancelledBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                cancelled && styles.cancelledText,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={19}
            color={COLORS.teal}
          />
          <Text style={styles.detailText}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={19} color={COLORS.teal} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="wallet-outline" size={19} color={COLORS.teal} />
          <Text style={styles.detailText}>
            {item.fee ? `₹${item.fee}` : 'Fee to be confirmed'}
          </Text>
        </View>

        <Text style={styles.bookingId}>Booking ID: {item.id}</Text>

        {!cancelled && (
          <Pressable
            style={styles.cancelButton}
            onPress={() => cancelAppointment(item.id)}
          >
            <Ionicons
              name="close-circle-outline"
              size={18}
              color={COLORS.red}
            />
            <Text style={styles.cancelButtonText}>Cancel appointment</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>
            Your appointments in one place
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="calendar" size={22} color={COLORS.teal} />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.teal} />
          <Text style={styles.emptySubtitle}>Loading appointments...</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          contentContainerStyle={[
            styles.listContent,
            appointments.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadAppointments();
              }}
              tintColor={COLORS.teal}
            />
          }
          ListHeaderComponent={
            appointments.length > 0 ? (
              <Text style={styles.countText}>
                {appointments.length}{' '}
                {appointments.length === 1 ? 'appointment' : 'appointments'}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={42}
                  color={COLORS.teal}
                />
              </View>
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptySubtitle}>
                Your confirmed appointments will appear here.
              </Text>
              <Pressable
                style={styles.bookButton}
                onPress={() => router.push('/doctors')}
              >
                <Text style={styles.bookButtonText}>Find a Doctor</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={COLORS.white}
                />
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
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
  title: {
    color: COLORS.navy,
    fontSize: 23,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#DDF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  countText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  doctorIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#DDF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
  },
  specialty: {
    color: COLORS.teal,
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#DDF7F2',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cancelledBadge: {
    backgroundColor: '#FDECEC',
  },
  statusText: {
    color: COLORS.teal,
    fontSize: 10,
    fontWeight: '800',
  },
  cancelledText: {
    color: COLORS.red,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 11,
  },
  detailText: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '600',
  },
  bookingId: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  cancelButtonText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: '#DDF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  bookButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 14,
    minHeight: 49,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 22,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
});
