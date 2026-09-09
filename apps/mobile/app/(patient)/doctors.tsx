import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDoctorSearch } from '../../hooks/useDoctorSearch';
import { GradientCard, Icon, EmptyState } from '../../components';
import type { Doctor } from '../../types';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../theme';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function DoctorSearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const {
    data: doctors,
    isLoading,
    isError,
    refetch,
  } = useDoctorSearch(searchQuery, selectedCity);

  const doctorList = doctors ?? [];

  const handleBookDoctor = (doctor: Doctor) => {
    router.push({
      pathname: '/(patient)/book',
      params: {
        doctorId: doctor.id,
        doctorName: doctor.user?.name || '',
        qualification: doctor.qualification || '',
        specialization: doctor.specialization || '',
        experience: String(doctor.experience ?? 0),
        clinicId: doctor.clinicId,
        clinicName: doctor.clinic?.clinicName || '',
        city: doctor.clinic?.city || '',
        fee: String(doctor.fee ?? 0),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-left" size={20} color={Colors.light.ink900} />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Find a Doctor</Text>
          <Text style={styles.headerSubtitle}>
            Book an in-clinic consultation with top specialists
          </Text>
        </View>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={18} color={Colors.light.ink400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors by name or specialty..."
            placeholderTextColor={Colors.light.ink400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={16} color={Colors.light.ink400} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Doctor Cards List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Finding available doctors...</Text>
          </View>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={24} color={Colors.light.danger} />
            <Text style={styles.errorTitle}>Unable to load doctors</Text>
            <Text style={styles.errorSubtitle}>
              Please check your network and try again.
            </Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => refetch()}
              activeOpacity={0.8}
            >
              <Text style={styles.retryBtnText}>Retry Search</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !isError && doctorList.length === 0 && (
          <EmptyState
            title="No Doctors Found"
            description="We could not find any doctors matching your search query. Try clearing filters or searching another keyword."
            actionLabel="Clear Search"
            onActionPress={() => {
              setSearchQuery('');
              setSelectedCity('');
            }}
          />
        )}

        {/* Doctor Cards */}
        {!isLoading &&
          !isError &&
          doctorList.map((doctor) => {
            const docName = doctor.user?.name || 'Healthcare Professional';
            const clinicName = doctor.clinic?.clinicName || 'Dewasi Healthcare';
            const city = doctor.clinic?.city || 'Main Branch';
            const exp = doctor.experience ?? 0;

            return (
              <GradientCard
                key={doctor.id}
                variant="blue"
                style={styles.doctorCard}
              >
                <View style={styles.cardContent}>
                  {/* Top Row: Avatar + Info */}
                  <View style={styles.doctorHeaderRow}>
                    <View style={styles.avatarBox}>
                      <Text style={styles.avatarText}>{getInitials(docName)}</Text>
                      <View style={styles.onlineBadge}>
                        <View style={styles.onlineInnerDot} />
                      </View>
                    </View>

                    <View style={styles.doctorMeta}>
                      <View style={styles.nameRow}>
                        <Text style={styles.docNameText} numberOfLines={1}>
                          {docName}
                        </Text>
                        <Icon name="check-circle" size={15} color={Colors.light.primary} />
                      </View>

                      {doctor.qualification ? (
                        <Text style={styles.qualificationText} numberOfLines={1}>
                          {doctor.qualification}
                        </Text>
                      ) : null}

                      {doctor.specialization ? (
                        <Text style={styles.specialtyText} numberOfLines={1}>
                          {doctor.specialization}
                        </Text>
                      ) : null}

                      {exp > 0 ? (
                        <View style={styles.expBadge}>
                          <Icon name="star" size={11} color="#EAB308" />
                          <Text style={styles.expText}>{exp}+ yrs exp</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {/* Clinic & Location Details */}
                  <View style={styles.clinicMetaRow}>
                    <View style={styles.clinicBadge}>
                      <Icon name="map-pin" size={13} color={Colors.light.primary} />
                      <Text style={styles.clinicText} numberOfLines={1}>
                        {city} • {clinicName}
                      </Text>
                    </View>

                    {doctor.fee != null ? (
                      <View style={styles.feeBadge}>
                        <Text style={styles.feeText}>₹{doctor.fee}</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Book CTA Action */}
                  <TouchableOpacity
                    style={styles.bookCtaButton}
                    onPress={() => handleBookDoctor(doctor)}
                    activeOpacity={0.85}
                  >
                    <Icon name="calendar" size={15} color="#FFFFFF" />
                    <Text style={styles.bookCtaText}>Book Appointment</Text>
                    <Icon name="chevron-right" size={15} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </GradientCard>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSoft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.surfaceWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.surface200,
    ...Shadows.sm,
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
  },
  searchSection: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceWhite,
    borderWidth: 1.5,
    borderColor: Colors.light.surface200,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    height: 46,
    gap: Spacing.two,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.ink900,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  loadingContainer: {
    padding: Spacing.six,
    alignItems: 'center',
    gap: Spacing.two,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.light.ink500,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.five,
    alignItems: 'center',
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
  doctorCard: {
    marginBottom: Spacing.two,
  },
  cardContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  doctorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarBox: {
    position: 'relative',
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  doctorMeta: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  docNameText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.light.ink900,
  },
  qualificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.ink700,
  },
  specialtyText: {
    fontSize: 11,
    color: Colors.light.ink500,
  },
  expBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF9C3',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  expText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#854D0E',
  },
  clinicMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Colors.light.surface200,
    paddingTop: Spacing.two,
  },
  clinicBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clinicText: {
    fontSize: 12,
    color: Colors.light.ink600,
    fontWeight: '500',
  },
  feeBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
  },
  feeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  bookCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    borderRadius: Radius.md,
    ...Shadows.md,
  },
  bookCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
