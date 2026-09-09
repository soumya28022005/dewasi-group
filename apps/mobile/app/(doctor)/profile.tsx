import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth-context';
import {
  useDoctorReceivedRequests,
  useDoctorSentRequests,
} from '../../hooks/useDoctor';
import {
  GradientCard,
  Icon,
} from '../../components';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../theme';

export default function DoctorProfileScreen() {
  const router = useRouter();
  const { user, logout, refetchUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // Queries for practice associations
  const {
    data: receivedRequests = [],
    isLoading: loadingReceived,
    refetch: refetchReceived,
    isRefetching: isRefetchingReceived,
  } = useDoctorReceivedRequests();

  const {
    data: sentRequests = [],
    isLoading: loadingSent,
    refetch: refetchSent,
    isRefetching: isRefetchingSent,
  } = useDoctorSentRequests();

  const isRefreshing = isRefetchingReceived || isRefetchingSent;

  // Derived metrics
  const { activeClinicsCount, acceptedCount, pendingCount, clinicsList } =
    useMemo(() => {
      const all = [...receivedRequests, ...sentRequests];
      const accepted = all.filter((r) => r.status === 'ACCEPTED');
      const pending = all.filter((r) => r.status === 'PENDING');

      const clinics = new Map<string, string>();
      accepted.forEach((r) => {
        const cId = r.clinicId || r.clinic?.id;
        const cName = r.clinic?.clinicName || 'Clinic Practice';
        if (cId) clinics.set(cId, cName);
      });

      return {
        activeClinicsCount: clinics.size,
        acceptedCount: accepted.length,
        pendingCount: pending.length,
        clinicsList: Array.from(clinics.values()),
      };
    }, [receivedRequests, sentRequests]);

  const handleRefreshAll = () => {
    refetchUser();
    refetchReceived();
    refetchSent();
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Sign Out',
      'Are you sure you want to sign out of your doctor portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshAll}
            tintColor={Colors.light.primary}
            colors={[Colors.light.primary]}
          />
        }
      >
        {/* 1. Identity Hero Banner */}
        <GradientCard variant="blue" style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.avatarLargeBox}>
              <Text style={styles.avatarLargeText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </Text>
            </View>

            <View style={styles.identityDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.doctorNameTitle}>Dr. {user?.name}</Text>
                <View style={styles.verifiedChip}>
                  <Icon name="check-circle" size={12} color="#16A34A" />
                  <Text style={styles.verifiedChipText}>Verified</Text>
                </View>
              </View>

              <Text style={styles.doctorRoleSub}>Licensed Medical Practitioner</Text>
              <Text style={styles.doctorEmailText}>{user?.email}</Text>
            </View>
          </View>
        </GradientCard>

        {/* 2. Practice Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Icon name="building" size={16} color={Colors.light.primary} />
            </View>
            <Text style={styles.statNumber}>{activeClinicsCount}</Text>
            <Text style={styles.statLabel}>Active Clinics</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Icon name="check-circle" size={16} color="#16A34A" />
            </View>
            <Text style={styles.statNumber}>{acceptedCount}</Text>
            <Text style={styles.statLabel}>Associations</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="inbox" size={16} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Requests</Text>
          </View>
        </View>

        {/* 3. Account Information */}
        <GradientCard variant="purple" style={styles.sectionCard}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconBox}>
                <Icon name="user" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.sectionTitle}>Practitioner Credentials</Text>
            </View>

            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>Dr. {user?.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>System Role</Text>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{user?.role || 'DOCTOR'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <View style={styles.statusActiveTag}>
                  <View style={styles.activeDot} />
                  <Text style={styles.statusActiveTagText}>Active & Verified</Text>
                </View>
              </View>
            </View>
          </View>
        </GradientCard>

        {/* 4. Affiliated Clinics */}
        <GradientCard variant="green" style={styles.sectionCard}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBox, { backgroundColor: '#10B981' }]}>
                <Icon name="building" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.sectionTitle}>Affiliated Practice Centers</Text>
            </View>

            {clinicsList.length === 0 ? (
              <Text style={styles.noClinicsText}>
                No affiliated clinics currently connected.
              </Text>
            ) : (
              <View style={styles.clinicsListContainer}>
                {clinicsList.map((clinicName, idx) => (
                  <View key={`clinic-${idx}`} style={styles.clinicAffiliationRow}>
                    <Icon name="building" size={14} color={Colors.light.primary} />
                    <Text style={styles.clinicAffiliationName}>{clinicName}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </GradientCard>

        {/* 5. Practice Tools Menu */}
        <GradientCard variant="blue" style={styles.sectionCard}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconBox}>
                <Icon name="sliders" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.sectionTitle}>Practice Management Tools</Text>
            </View>

            <View style={styles.toolsMenu}>
              <TouchableOpacity
                style={styles.toolRow}
                onPress={() => router.push('/(doctor)/earnings')}
                activeOpacity={0.7}
              >
                <View style={styles.toolLeft}>
                  <Icon name="trending-up" size={16} color="#16A34A" />
                  <Text style={styles.toolTitle}>Practice Earnings & Analytics</Text>
                </View>
                <Icon name="chevron-right" size={16} color={Colors.light.ink400} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolRow}
                onPress={() => router.push('/(doctor)/prescriptions')}
                activeOpacity={0.7}
              >
                <View style={styles.toolLeft}>
                  <Icon name="file-text" size={16} color="#7C3AED" />
                  <Text style={styles.toolTitle}>Digital Prescriptions</Text>
                </View>
                <Icon name="chevron-right" size={16} color={Colors.light.ink400} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolRow}
                onPress={() => router.push('/(doctor)/referrals')}
                activeOpacity={0.7}
              >
                <View style={styles.toolLeft}>
                  <Icon name="activity" size={16} color="#E11D48" />
                  <Text style={styles.toolTitle}>Diagnostic Requisitions & Referrals</Text>
                </View>
                <Icon name="chevron-right" size={16} color={Colors.light.ink400} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolRow}
                onPress={() => router.push('/(doctor)/requests')}
                activeOpacity={0.7}
              >
                <View style={styles.toolLeft}>
                  <Icon name="inbox" size={16} color="#D97706" />
                  <Text style={styles.toolTitle}>Clinic Connection Requests</Text>
                </View>
                <Icon name="chevron-right" size={16} color={Colors.light.ink400} />
              </TouchableOpacity>
            </View>
          </View>
        </GradientCard>

        {/* 6. Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.85}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <>
              <Icon name="log-out" size={18} color="#DC2626" />
              <Text style={styles.logoutBtnText}>Sign Out of Doctor Portal</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSoft,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  heroCard: {
    marginBottom: 0,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  avatarLargeBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  avatarLargeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  identityDetails: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doctorNameTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.light.ink900,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  doctorRoleSub: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  doctorEmailText: {
    fontSize: 11,
    color: Colors.light.ink500,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.light.surfaceWhite,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.surface200,
    gap: 3,
    ...Shadows.sm,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  statNumber: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.light.ink900,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.ink500,
    textTransform: 'uppercase',
  },
  sectionCard: {
    marginBottom: 0,
  },
  sectionContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.surface200,
    paddingBottom: Spacing.two,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.ink900,
  },
  infoList: {
    gap: Spacing.two,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.surface100,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.light.ink500,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.ink900,
  },
  roleTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  statusActiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusActiveTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  noClinicsText: {
    fontSize: 12,
    color: Colors.light.ink500,
    fontStyle: 'italic',
    paddingVertical: Spacing.two,
  },
  clinicsListContainer: {
    gap: Spacing.two,
  },
  clinicAffiliationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface50,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.surface200,
  },
  clinicAffiliationName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.ink900,
  },
  toolsMenu: {
    gap: Spacing.two,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface50,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.surface200,
  },
  toolLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.ink900,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    borderRadius: Radius.lg,
    marginTop: Spacing.two,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
