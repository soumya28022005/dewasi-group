import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/auth-context';
import {
  useDoctorReceivedRequests,
  useDoctorSentRequests,
  useDoctorQueue,
} from '../../hooks/useDoctor';
import { useAppointmentRealtime } from '../../hooks/useAppointmentRealtime';
import {
  GradientCard,
  DoctorCurrentPatientCard,
  DoctorQueueActions,
  DoctorQueueList,
  Icon,
} from '../../components';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../theme';

export default function DoctorQueueScreen() {
  const { user } = useAuth();
  const { isConnected } = useAppointmentRealtime();

  // Today's Date YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');

  // Fetch clinic associations
  const {
    data: receivedRequests = [],
    isLoading: loadingReceived,
    refetch: refetchReceived,
  } = useDoctorReceivedRequests();

  const {
    data: sentRequests = [],
    isLoading: loadingSent,
    refetch: refetchSent,
  } = useDoctorSentRequests();

  // Compute accepted clinics
  const clinicsInfo = useMemo(() => {
    const accepted = [...receivedRequests, ...sentRequests].filter(
      (r) => r.status === 'ACCEPTED'
    );

    const map = new Map<
      string,
      { id: string; name: string; address?: string | null; doctorId: string }
    >();

    accepted.forEach((req) => {
      const cId = req.clinicId || req.clinic?.id;
      const dId = req.doctorId || req.doctor?.id || user?.id || '';
      if (cId && !map.has(cId)) {
        map.set(cId, {
          id: cId,
          name: req.clinic?.clinicName || 'Clinic Center',
          address: req.clinic?.address || req.clinic?.city || null,
          doctorId: dId,
        });
      }
    });

    return Array.from(map.values());
  }, [receivedRequests, sentRequests, user?.id]);

  // Set initial clinic
  useEffect(() => {
    if (clinicsInfo.length > 0 && !selectedClinicId) {
      setSelectedClinicId(clinicsInfo[0].id);
    }
  }, [clinicsInfo, selectedClinicId]);

  const activeClinic = clinicsInfo.find((c) => c.id === selectedClinicId);
  const doctorId = activeClinic?.doctorId || user?.id || '';

  // Fetch Queue Data
  const {
    data: queue,
    isLoading: loadingQueue,
    isError: isErrorQueue,
    error: queueError,
    refetch: refetchQueue,
    isRefetching: fetchingQueue,
  } = useDoctorQueue(doctorId, selectedClinicId, selectedDate);

  const handleRefreshAll = () => {
    refetchReceived();
    refetchSent();
    if (doctorId && selectedClinicId) {
      refetchQueue();
    }
  };

  const isInitialLoading =
    (loadingReceived || loadingSent) && clinicsInfo.length === 0;

  const currentPatientToken = queue?.tokens?.find(
    (t) => t.token === queue.currentToken
  );

  const waitingTokens = (queue?.tokens ?? []).filter(
    (t) => t.status === 'WAITING' || t.status === 'CHECKED_IN'
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={fetchingQueue}
            onRefresh={handleRefreshAll}
            tintColor={Colors.light.primary}
            colors={[Colors.light.primary]}
          />
        }
      >
        {/* 1. Header Card */}
        <GradientCard variant="blue" style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerTitles}>
                <Text style={styles.headerTitle}>Live Queue Management</Text>
                <Text style={styles.headerSubtitle}>
                  Realtime token control & patient call terminal
                </Text>
              </View>

              <View style={styles.realtimePill}>
                <View
                  style={[
                    styles.realtimeDot,
                    { backgroundColor: isConnected ? '#10B981' : '#F59E0B' },
                  ]}
                />
                <Text style={styles.realtimePillText}>
                  {isConnected ? 'Realtime' : 'Reconnecting'}
                </Text>
              </View>
            </View>

            {/* Clinic Selection Tabs */}
            {clinicsInfo.length > 0 && (
              <View style={styles.clinicSelectWrapper}>
                <Text style={styles.selectorLabel}>Select Practice Clinic</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.clinicTabsRow}
                >
                  {clinicsInfo.map((clinic) => {
                    const isSelected = clinic.id === selectedClinicId;
                    return (
                      <TouchableOpacity
                        key={clinic.id}
                        style={[
                          styles.clinicTab,
                          isSelected && styles.clinicTabSelected,
                        ]}
                        onPress={() => setSelectedClinicId(clinic.id)}
                        activeOpacity={0.8}
                      >
                        <Icon
                          name="building"
                          size={13}
                          color={isSelected ? '#FFFFFF' : Colors.light.ink600}
                        />
                        <Text
                          style={[
                            styles.clinicTabText,
                            isSelected && styles.clinicTabTextSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {clinic.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </GradientCard>

        {/* Loading State */}
        {isInitialLoading && (
          <View style={styles.stateCenter}>
            <ActivityIndicator size="small" color={Colors.light.primary} />
            <Text style={styles.stateText}>Loading practice queues...</Text>
          </View>
        )}

        {/* No Associated Clinics */}
        {!isInitialLoading && clinicsInfo.length === 0 && (
          <View style={styles.emptyClinicsCard}>
            <Icon name="building" size={36} color={Colors.light.ink400} />
            <Text style={styles.emptyClinicsTitle}>No Associated Clinics</Text>
            <Text style={styles.emptyClinicsSubtitle}>
              You do not have any active accepted clinic associations yet. Connect with clinics to manage live patient queues.
            </Text>
          </View>
        )}

        {/* Error Loading Queue */}
        {!isInitialLoading && isErrorQueue && (
          <View style={styles.errorCard}>
            <Icon name="alert-circle" size={24} color={Colors.light.danger} />
            <Text style={styles.errorTitle}>Unable to load clinic queue</Text>
            <Text style={styles.errorSubtitle}>
              {queueError instanceof Error ? queueError.message : 'Please check network connection.'}
            </Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => refetchQueue()}
              activeOpacity={0.8}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Queue Content */}
        {!isInitialLoading && clinicsInfo.length > 0 && (
          <>
            {/* 2. Key Queue Metrics Row */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Current Serving</Text>
                <Text style={styles.kpiValue}>
                  {queue?.currentToken ? `#${queue.currentToken}` : '--'}
                </Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Last Issued</Text>
                <Text style={styles.kpiValue}>
                  {queue?.lastTokenIssued ? `#${queue.lastTokenIssued}` : '--'}
                </Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Waiting</Text>
                <Text style={[styles.kpiValue, { color: '#D97706' }]}>
                  {waitingTokens.length}
                </Text>
              </View>
            </View>

            {/* 3. Current Patient Serving Card */}
            <DoctorCurrentPatientCard
              currentPatientToken={currentPatientToken}
              currentTokenNumber={queue?.currentToken}
              queueStatus={queue?.status}
            />

            {/* 4. Queue Control Action Buttons */}
            <DoctorQueueActions
              doctorId={doctorId}
              clinicId={selectedClinicId}
              date={selectedDate}
              queueStatus={queue?.status}
              waitingTokens={waitingTokens}
            />

            {/* 5. Complete Sequence List */}
            <DoctorQueueList
              tokens={queue?.tokens}
              currentTokenNumber={queue?.currentToken}
            />
          </>
        )}
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
    gap: Spacing.three,
  },
  headerCard: {
    marginBottom: 0,
  },
  headerContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.light.ink900,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.light.ink500,
    marginTop: 2,
  },
  realtimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  realtimeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  realtimePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.ink700,
  },
  clinicSelectWrapper: {
    gap: 6,
  },
  selectorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.ink500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clinicTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  clinicTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.surface50,
    borderWidth: 1,
    borderColor: Colors.light.surface200,
  },
  clinicTabSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  clinicTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.ink800,
  },
  clinicTabTextSelected: {
    color: '#FFFFFF',
  },
  stateCenter: {
    alignItems: 'center',
    padding: Spacing.six,
    gap: Spacing.two,
  },
  stateText: {
    fontSize: 13,
    color: Colors.light.ink500,
  },
  emptyClinicsCard: {
    backgroundColor: Colors.light.surfaceWhite,
    borderRadius: Radius.xl,
    padding: Spacing.six,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.surface200,
    gap: Spacing.two,
  },
  emptyClinicsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.ink900,
  },
  emptyClinicsSubtitle: {
    fontSize: 12,
    color: Colors.light.ink500,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: Radius.xl,
    padding: Spacing.five,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: Spacing.one,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.danger,
  },
  errorSubtitle: {
    fontSize: 12,
    color: '#991B1B',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: Colors.light.danger,
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    marginTop: Spacing.two,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.light.surfaceWhite,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.surface200,
    gap: 2,
    ...Shadows.sm,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.ink500,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.light.ink900,
  },
});
