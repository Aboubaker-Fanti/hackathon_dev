/**
 * Nearby Search Screen
 * Shows nearby screening centers sorted by distance from user location
 * Includes hospitals, private clinics, NGOs, and mobile caravans
 *
 * Demo mode: Uses UM6P (Benguerir) as current location
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguageStore } from '../../../application/store/languageStore';
import { useLocationStore } from '../../../application/store/locationStore';
import {
  SCREENING_CENTERS,
  getCentersSortedByDistance,
} from '../../../infrastructure/data/screeningCenters';
import type { ScreeningCenter, CenterType, ServiceType } from '../../../domain/models/types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

type FilterType = 'all' | CenterType;

interface CenterWithDistance extends ScreeningCenter {
  distance: number;
}

interface Props {
  onBack?: () => void;
}

/** Service display configuration */
const SERVICE_LABELS: Record<string, { fr: string; ar: string; icon: string }> = {
  mammography: { fr: 'Mammographie', ar: 'ماموغرافيا', icon: '🔬' },
  ultrasound: { fr: 'Échographie', ar: 'إيكوغرافي', icon: '📡' },
  biopsy: { fr: 'Biopsie', ar: 'خزعة', icon: '🔍' },
  consultation: { fr: 'Consultation', ar: 'استشارة', icon: '👩‍⚕️' },
  chemotherapy: { fr: 'Chimiothérapie', ar: 'علاج كيميائي', icon: '💊' },
  radiotherapy: { fr: 'Radiothérapie', ar: 'علاج إشعاعي', icon: '☢️' },
  surgery: { fr: 'Chirurgie', ar: 'جراحة', icon: '🏥' },
  support_groups: { fr: 'Groupes de soutien', ar: 'مجموعات دعم', icon: '🤝' },
  awareness: { fr: 'Sensibilisation', ar: 'توعية', icon: '📢' },
  clinical_exam: { fr: 'Examen clinique', ar: 'فحص سريري', icon: '🩺' },
  self_exam_training: { fr: 'Formation auto-examen', ar: 'تدريب على الفحص الذاتي', icon: '📋' },
};

/** Format distance for display */
const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

/** Get icon and color for center type */
const getTypeConfig = (type: CenterType) => {
  switch (type) {
    case 'public':
      return { icon: '🏥', color: colors.accent, bgColor: colors.accent + '12' };
    case 'private':
      return { icon: '🏨', color: colors.secondary, bgColor: colors.secondary + '12' };
    case 'ngo':
      return { icon: '💗', color: colors.success, bgColor: colors.success + '12' };
    case 'caravan':
      return { icon: '🚐', color: '#E67E22', bgColor: '#E67E2212' };
    default:
      return { icon: '📍', color: colors.textSecondary, bgColor: colors.background };
  }
};

/** Check if a caravan date range is currently active */
const isCaravanActive = (center: ScreeningCenter): boolean => {
  if (!center.availableDates) return false;
  const now = new Date();
  const start = new Date(center.availableDates.start);
  const end = new Date(center.availableDates.end);
  return now >= start && now <= end;
};

/** Format date for display */
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export const NearbySearchScreen: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguageStore();
  const { location, hasLocation, isLoading, requestLocation } = useLocationStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);

  const isArabicLang = currentLanguage === 'ar' || currentLanguage === 'darija';

  // Request location on mount
  useEffect(() => {
    if (!hasLocation) {
      requestLocation();
    }
  }, [hasLocation, requestLocation]);

  // Centers sorted by distance with filters applied
  const sortedCenters = useMemo((): CenterWithDistance[] => {
    if (!location) return [];

    let centersWithDistance = getCentersSortedByDistance(
      location.latitude,
      location.longitude,
      SCREENING_CENTERS,
    );

    // Apply type filter
    if (filter !== 'all') {
      centersWithDistance = centersWithDistance.filter((c) => c.type === filter);
    }

    // Apply service filter
    if (serviceFilter) {
      centersWithDistance = centersWithDistance.filter((c) =>
        c.services.includes(serviceFilter as ServiceType),
      );
    }

    return centersWithDistance;
  }, [location, filter, serviceFilter]);

  // Separate caravans from fixed centers for the alert banner
  const activeCaravans = useMemo(
    () => sortedCenters.filter((c) => c.type === 'caravan' && isCaravanActive(c)),
    [sortedCenters],
  );

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleDirections = (center: ScreeningCenter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`;
    Linking.openURL(url);
  };

  const getTypeLabel = (type: CenterType) => {
    switch (type) {
      case 'public':
        return t('nearby.type_public');
      case 'private':
        return t('nearby.type_private');
      case 'ngo':
        return t('nearby.type_ngo');
      case 'caravan':
        return t('nearby.type_caravan');
      default:
        return type;
    }
  };

  const getServiceLabel = (service: string) => {
    const labels = SERVICE_LABELS[service];
    if (!labels) return service;
    return isArabicLang ? labels.ar : labels.fr;
  };

  const FILTERS: { key: FilterType; labelKey: string; icon: string }[] = [
    { key: 'all', labelKey: 'nearby.filter_all', icon: '📍' },
    { key: 'public', labelKey: 'nearby.type_public', icon: '🏥' },
    { key: 'private', labelKey: 'nearby.type_private', icon: '🏨' },
    { key: 'ngo', labelKey: 'nearby.type_ngo', icon: '💗' },
    { key: 'caravan', labelKey: 'nearby.type_caravan', icon: '🚐' },
  ];

  const SERVICE_FILTERS: { key: string; icon: string }[] = [
    { key: 'mammography', icon: '🔬' },
    { key: 'ultrasound', icon: '📡' },
    { key: 'consultation', icon: '👩‍⚕️' },
    { key: 'biopsy', icon: '🔍' },
    { key: 'clinical_exam', icon: '🩺' },
  ];

  // Render a caravan alert banner
  const renderCaravanBanner = () => {
    if (activeCaravans.length === 0) return null;

    const nearest = activeCaravans[0];
    return (
      <TouchableOpacity
        style={styles.caravanBanner}
        onPress={() => handleDirections(nearest)}
        activeOpacity={0.8}
      >
        <View style={styles.caravanBannerHeader}>
          <Text style={styles.caravanBannerIcon}>🚐</Text>
          <View style={styles.caravanBannerPulse} />
          <Text style={[styles.caravanBannerTitle, isRTL && styles.textRTL]}>
            {t('nearby.caravan_alert')}
          </Text>
        </View>
        <Text style={[styles.caravanBannerText, isRTL && styles.textRTL]}>
          {isArabicLang ? nearest.nameAr : nearest.name}
        </Text>
        <View style={[styles.caravanBannerMeta, isRTL && styles.rowRTL]}>
          <Text style={styles.caravanBannerDistance}>
            📍 {formatDistance(nearest.distance)}
          </Text>
          {nearest.availableDates && (
            <Text style={styles.caravanBannerDates}>
              📅 {formatDate(nearest.availableDates.start)} → {formatDate(nearest.availableDates.end)}
            </Text>
          )}
        </View>
        <View style={styles.caravanBannerServices}>
          {nearest.services.slice(0, 3).map((s) => (
            <View key={s} style={styles.caravanServiceTag}>
              <Text style={styles.caravanServiceText}>
                {SERVICE_LABELS[s]?.icon} {getServiceLabel(s)}
              </Text>
            </View>
          ))}
          {nearest.hasFreeMammography && (
            <View style={[styles.caravanServiceTag, styles.freeTag]}>
              <Text style={styles.freeTagText}>✨ {t('nearby.free')}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a single center card
  const renderCenter = ({ item, index }: { item: CenterWithDistance; index: number }) => {
    const typeConfig = getTypeConfig(item.type);
    const isCaravan = item.type === 'caravan';
    const isNearby = item.distance < 5;

    return (
      <View style={[styles.centerCard, isNearby && styles.centerCardNearby]}>
        {/* Distance + rank badge */}
        <View style={[styles.distanceRow, isRTL && styles.rowRTL]}>
          <View style={[styles.rankBadge, index === 0 && styles.rankBadgeFirst]}>
            <Text style={[styles.rankText, index === 0 && styles.rankTextFirst]}>
              #{index + 1}
            </Text>
          </View>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceIcon}>📍</Text>
            <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: typeConfig.bgColor }]}>
            <Text style={styles.typeIcon}>{typeConfig.icon}</Text>
            <Text style={[styles.typeText, { color: typeConfig.color }]}>
              {getTypeLabel(item.type)}
            </Text>
          </View>
        </View>

        {/* Center name and city */}
        <Text style={[styles.centerName, isRTL && styles.textRTL]} numberOfLines={2}>
          {isArabicLang ? item.nameAr : item.name}
        </Text>
        <Text style={[styles.centerAddress, isRTL && styles.textRTL]} numberOfLines={1}>
          {isArabicLang ? item.addressAr : item.address}
        </Text>

        {/* Caravan dates */}
        {isCaravan && item.availableDates && (
          <View style={styles.caravanDateRow}>
            <Text style={styles.caravanDateIcon}>📅</Text>
            <Text style={[styles.caravanDateText, isRTL && styles.textRTL]}>
              {formatDate(item.availableDates.start)} → {formatDate(item.availableDates.end)}
            </Text>
            {isCaravanActive(item) && (
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>{t('nearby.active_now')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Free mammography */}
        {item.hasFreeMammography && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeIcon}>✨</Text>
            <Text style={[styles.freeText, isRTL && styles.textRTL]}>
              {t('screening.free_mammography')}
            </Text>
          </View>
        )}

        {/* Services */}
        <View style={styles.servicesRow}>
          {item.services.slice(0, 4).map((service) => (
            <View key={service} style={styles.serviceTag}>
              <Text style={styles.serviceText}>
                {SERVICE_LABELS[service]?.icon} {getServiceLabel(service)}
              </Text>
            </View>
          ))}
          {item.services.length > 4 && (
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>+{item.services.length - 4}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={[styles.centerActions, isRTL && styles.rowRTL]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(item.phone)}
            accessibilityRole="button"
            accessibilityLabel={t('screening.call')}
          >
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>{t('screening.call')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => handleDirections(item)}
            accessibilityRole="button"
            accessibilityLabel={t('screening.directions')}
          >
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={[styles.actionText, styles.actionTextPrimary]}>
              {t('screening.directions')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../../../../assets/Dove with Pink Ribbon.json')}
            autoPlay
            loop
            speed={0.8}
            style={styles.loadingLottie}
          />
          <Text style={styles.loadingText}>{t('nearby.loading_location')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>{isRTL ? '→' : '←'}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerText}>
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t('nearby.title')}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t('nearby.subtitle')}
          </Text>
        </View>
      </View>

      {/* Current location indicator */}
      {location && (
        <View style={styles.locationBar}>
          <View style={[styles.locationContent, isRTL && styles.rowRTL]}>
            <View style={styles.locationDot}>
              <View style={styles.locationDotInner} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationLabel, isRTL && styles.textRTL]}>
                {t('nearby.your_location')}
              </Text>
              <Text style={[styles.locationName, isRTL && styles.textRTL]}>
                {isArabicLang ? location.labelAr : location.label}
              </Text>
            </View>

          </View>
        </View>
      )}

      {/* Type filter chips */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={styles.filterIcon}>{f.icon}</Text>
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {t(f.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Service filter chips */}
      <View style={styles.serviceFilterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.serviceChip,
              !serviceFilter && styles.serviceChipActive,
            ]}
            onPress={() => setServiceFilter(null)}
          >
            <Text style={[styles.serviceChipText, !serviceFilter && styles.serviceChipTextActive]}>
              {t('nearby.all_services')}
            </Text>
          </TouchableOpacity>
          {SERVICE_FILTERS.map((sf) => (
            <TouchableOpacity
              key={sf.key}
              style={[
                styles.serviceChip,
                serviceFilter === sf.key && styles.serviceChipActive,
              ]}
              onPress={() => setServiceFilter(serviceFilter === sf.key ? null : sf.key)}
            >
              <Text style={styles.serviceChipIcon}>{sf.icon}</Text>
              <Text
                style={[
                  styles.serviceChipText,
                  serviceFilter === sf.key && styles.serviceChipTextActive,
                ]}
              >
                {getServiceLabel(sf.key)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <Text style={[styles.resultsCount, isRTL && styles.textRTL]}>
        {t('screening.centers_count', { count: sortedCenters.length })}
      </Text>

      {/* Centers list */}
      <FlatList
        data={sortedCenters}
        renderItem={renderCenter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderCaravanBanner}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
              {t('screening.no_results')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
  rowRTL: { flexDirection: 'row-reverse' },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingLottie: {
    width: 200,
    height: 200,
  },
  loadingText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: { fontSize: fontSizes.xxl, color: colors.text },
  headerText: { flex: 1 },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Location bar
  locationBar: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  locationDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  locationInfo: { flex: 1 },
  locationLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  locationName: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: fontWeights.semiBold,
    marginTop: 2,
  },
  demoBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  demoText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.warning,
  },

  // Filter section
  filterSection: {
    marginTop: spacing.md,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterIcon: { fontSize: 14 },
  filterText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  filterTextActive: {
    color: colors.textOnPrimary,
    fontWeight: fontWeights.bold,
  },

  // Service filter
  serviceFilterSection: {
    marginTop: spacing.sm,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceChipActive: {
    backgroundColor: colors.secondary + '15',
    borderColor: colors.secondary,
  },
  serviceChipIcon: { fontSize: 12 },
  serviceChipText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  serviceChipTextActive: {
    color: colors.secondary,
    fontWeight: fontWeights.bold,
  },

  // Results count
  resultsCount: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },

  // List
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Caravan banner
  caravanBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: '#E67E22',
    borderStyle: 'dashed',
  },
  caravanBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  caravanBannerIcon: { fontSize: 24 },
  caravanBannerPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27AE60',
  },
  caravanBannerTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: '#E67E22',
    flex: 1,
  },
  caravanBannerText: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: fontWeights.semiBold,
    marginBottom: spacing.sm,
  },
  caravanBannerMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  caravanBannerDistance: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  caravanBannerDates: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  caravanBannerServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  caravanServiceTag: {
    backgroundColor: '#FFFFFF80',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  caravanServiceText: {
    fontSize: fontSizes.xs,
    color: colors.text,
  },
  freeTag: {
    backgroundColor: colors.success + '20',
  },
  freeTagText: {
    fontSize: fontSizes.xs,
    color: colors.success,
    fontWeight: fontWeights.bold,
  },

  // Center card
  centerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  centerCardNearby: {
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeFirst: {
    backgroundColor: colors.primary,
  },
  rankText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
  },
  rankTextFirst: {
    color: colors.textOnPrimary,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accent + '12',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  distanceIcon: { fontSize: 12 },
  distanceText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.accent,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  typeIcon: { fontSize: 12 },
  typeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  centerName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  centerAddress: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  // Caravan dates in card
  caravanDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFF3E0',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  caravanDateIcon: { fontSize: 14 },
  caravanDateText: {
    fontSize: fontSizes.sm,
    color: '#E67E22',
    fontWeight: fontWeights.medium,
    flex: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  activeText: {
    fontSize: fontSizes.xs,
    color: colors.success,
    fontWeight: fontWeights.bold,
  },

  // Free mammography
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success + '10',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  freeIcon: { fontSize: 14 },
  freeText: {
    fontSize: fontSizes.sm,
    color: colors.success,
    fontWeight: fontWeights.semiBold,
  },

  // Services
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  serviceTag: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  serviceText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },

  // Actions
  centerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: MIN_TOUCH_TARGET,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionIcon: { fontSize: 16 },
  actionText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },
  actionTextPrimary: {
    color: colors.textOnPrimary,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});
