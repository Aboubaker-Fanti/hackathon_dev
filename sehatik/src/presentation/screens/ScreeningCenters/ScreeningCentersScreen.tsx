/**
 * Screening Centers Screen
 * Directory of breast cancer screening centers across Morocco
 * Search, filter, and contact functionality
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguageStore } from '../../../application/store/languageStore';
import { SCREENING_CENTERS } from '../../../infrastructure/data/screeningCenters';
import type { ScreeningCenter } from '../../../domain/models/types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, MIN_TOUCH_TARGET } from '../../theme/spacing';
import { fontSizes, fontWeights } from '../../theme/typography';

import type { CenterType } from '../../../domain/models/types';

type FilterType = 'all' | CenterType;

interface Props {
  onBack?: () => void;
}

export const ScreeningCentersScreen: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const isArabicLang = currentLanguage === 'ar' || currentLanguage === 'darija';

  const filteredCenters = useMemo(() => {
    let centers = SCREENING_CENTERS;

    if (filter !== 'all') {
      centers = centers.filter((c) => c.type === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      centers = centers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameAr.includes(searchQuery) ||
          c.city.toLowerCase().includes(q) ||
          c.cityAr.includes(searchQuery),
      );
    }

    return centers;
  }, [searchQuery, filter]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleDirections = (center: ScreeningCenter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`;
    Linking.openURL(url);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'public': return t('screening.filter_public');
      case 'private': return t('screening.filter_private');
      case 'ngo': return t('screening.filter_ngo');
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return colors.accent;
      case 'private': return colors.secondary;
      case 'ngo': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const renderCenter = ({ item }: { item: ScreeningCenter }) => (
    <View style={styles.centerCard}>
      {/* Header */}
      <View style={[styles.centerHeader, isRTL && styles.rowRTL]}>
        <View style={styles.centerInfo}>
          <Text style={[styles.centerName, isRTL && styles.textRTL]} numberOfLines={2}>
            {isArabicLang ? item.nameAr : item.name}
          </Text>
          <Text style={[styles.centerCity, isRTL && styles.textRTL]}>
            📍 {isArabicLang ? item.cityAr : item.city}
          </Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '15' }]}>
          <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
            {getTypeLabel(item.type)}
          </Text>
        </View>
      </View>

      {/* Address */}
      <Text style={[styles.centerAddress, isRTL && styles.textRTL]} numberOfLines={2}>
        {isArabicLang ? item.addressAr : item.address}
      </Text>

      {/* Free mammography badge */}
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
            <Text style={styles.serviceText}>{service}</Text>
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

  const FILTERS: { key: FilterType; labelKey: string }[] = [
    { key: 'all', labelKey: 'screening.filter_all' },
    { key: 'public', labelKey: 'screening.filter_public' },
    { key: 'private', labelKey: 'screening.filter_private' },
    { key: 'ngo', labelKey: 'screening.filter_ngo' },
  ];

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
          <Text style={[styles.title, isRTL && styles.textRTL]}>{t('screening.title')}</Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>{t('screening.subtitle')}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, isRTL && styles.searchInputRTL]}
          placeholder={t('screening.search_placeholder')}
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign={isRTL ? 'right' : 'left'}
        />
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {t(f.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results count */}
      <Text style={[styles.resultsCount, isRTL && styles.textRTL]}>
        {t('screening.centers_count', { count: filteredCenters.length })}
      </Text>

      {/* Centers list */}
      <FlatList
        data={filteredCenters}
        renderItem={renderCenter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏥</Text>
            <Text style={[styles.emptyText, isRTL && styles.textRTL]}>{t('screening.no_results')}</Text>
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
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { fontSize: fontSizes.xxl, color: colors.text },
  headerText: { flex: 1 },
  title: { fontSize: fontSizes.xxl, fontWeight: fontWeights.bold, color: colors.text },
  subtitle: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  searchContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  searchInput: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSizes.md, color: colors.text,
    minHeight: MIN_TOUCH_TARGET,
  },
  searchInputRTL: { textAlign: 'right', writingDirection: 'rtl' },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.round,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: fontSizes.sm, color: colors.textSecondary, fontWeight: fontWeights.medium },
  filterTextActive: { color: colors.textOnPrimary, fontWeight: fontWeights.bold },
  resultsCount: {
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm,
    fontSize: fontSizes.sm, color: colors.textSecondary,
  },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  centerCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.md, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  centerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm,
  },
  centerInfo: { flex: 1, marginRight: spacing.sm },
  centerName: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, color: colors.text, marginBottom: 4 },
  centerCity: { fontSize: fontSizes.sm, color: colors.textSecondary },
  typeBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  typeText: { fontSize: fontSizes.xs, fontWeight: fontWeights.bold },
  centerAddress: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.sm, lineHeight: fontSizes.sm * 1.4 },
  freeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.success + '10', borderRadius: borderRadius.sm, padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  freeIcon: { fontSize: 14 },
  freeText: { fontSize: fontSizes.sm, color: colors.success, fontWeight: fontWeights.semiBold },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  serviceTag: {
    backgroundColor: colors.background, borderRadius: borderRadius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3,
  },
  serviceText: { fontSize: fontSizes.xs, color: colors.textSecondary },
  centerActions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    paddingVertical: spacing.sm, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border,
    minHeight: MIN_TOUCH_TARGET,
  },
  actionButtonPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  actionIcon: { fontSize: 16 },
  actionText: { fontSize: fontSizes.sm, fontWeight: fontWeights.medium, color: colors.text },
  actionTextPrimary: { color: colors.textOnPrimary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: fontSizes.md, color: colors.textSecondary },
});
