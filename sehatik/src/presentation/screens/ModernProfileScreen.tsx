/**
 * ModernProfileScreen - User profile and settings
 * Features: Profile info, menu items, settings options
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Card } from '../components/common/Card';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightContent?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightContent,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuItem,
      pressed && styles.menuItemPressed,
    ]}
  >
    <View style={styles.menuIconContainer}>
      <Text style={styles.menuIcon}>{icon}</Text>
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {rightContent}
    {showChevron && <Text style={styles.chevron}>›</Text>}
  </Pressable>
);

export const ModernProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <Pressable style={styles.editAvatarButton}>
                <Text style={styles.editAvatarIcon}>📷</Text>
              </Pressable>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Jane Doe</Text>
              <Text style={styles.profileEmail}>jane.doe@example.com</Text>
            </View>
            <Pressable style={styles.editProfileButton}>
              <Text style={styles.editProfileIcon}>✏️</Text>
            </Pressable>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Self-Checks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Diagnoses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Days Streak</Text>
            </View>
          </View>
        </Card>

        {/* Health Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health</Text>
          <Card variant="outlined" style={styles.menuCard}>
            <MenuItem
              icon="📋"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => {}}
            />
            <MenuItem
              icon="🩺"
              title="Past Self-Check"
              subtitle="View your self-examination history"
              onPress={() => {}}
            />
            <MenuItem
              icon="🔄"
              title="Change Password"
              subtitle="Update your security credentials"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card variant="outlined" style={styles.menuCard}>
            <MenuItem
              icon="🌍"
              title="Application Language"
              subtitle="English"
              onPress={() => {}}
            />
            <MenuItem
              icon="🎨"
              title="Change Theme"
              subtitle="Light mode"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <Card variant="outlined" style={styles.menuCard}>
            <MenuItem
              icon="🏥"
              title="Units and Centers"
              subtitle="Find nearby healthcare facilities"
              onPress={() => {}}
            />
            <MenuItem
              icon="❓"
              title="FAQs"
              subtitle="Frequently asked questions"
              onPress={() => {}}
            />
            <MenuItem
              icon="💯"
              title="100 Million Health"
              subtitle="National health initiative"
              onPress={() => {}}
            />
            <MenuItem
              icon="💰"
              title="Donate"
              subtitle="Support breast cancer awareness"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Card variant="outlined" style={styles.menuCard}>
            <MenuItem
              icon="ℹ️"
              title="About Us"
              subtitle="Learn about Sehatik"
              onPress={() => {}}
            />
            <MenuItem
              icon="⚙️"
              title="Reset"
              subtitle="Reset app settings"
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={() => {}}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={() => {}}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
            <Text style={styles.deleteText}>Delete Account</Text>
          </Pressable>
        </View>

        {/* App Version */}
        <Text style={styles.appVersion}>Version 1.0.0</Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  
  // Header
  header: {
    marginBottom: spacing.lg,
  },
  screenTitle: {
    ...typography.header1Semibold,
    color: colors.text,
  },
  
  // Profile Card
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.title1Medium,
    color: colors.textOnPrimary,
    fontSize: 32,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  editAvatarIcon: {
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileIcon: {
    fontSize: 20,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.title1Medium,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.subBodyRegular,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
  
  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  // Menu Card
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemPressed: {
    backgroundColor: colors.backgroundPink,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...typography.title2Medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    ...typography.subBodyRegular,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 24,
    color: colors.textLight,
  },
  
  // Logout & Delete Buttons
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  logoutButtonPressed: {
    backgroundColor: colors.backgroundPink,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    ...typography.title2Medium,
    color: colors.text,
  },
  
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonPressed: {
    backgroundColor: colors.error + '10',
  },
  deleteIcon: {
    fontSize: 20,
  },
  deleteText: {
    ...typography.title2Medium,
    color: colors.error,
  },
  
  // Footer
  appVersion: {
    ...typography.subBodyRegular,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  
  bottomSpacer: {
    height: spacing.xl,
  },
});
