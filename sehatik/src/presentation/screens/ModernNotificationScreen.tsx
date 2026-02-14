/**
 * ModernNotificationScreen - Notification center
 * Features: Notification list, categories, read/unread states
 */

import React, { useState } from 'react';
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

interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'info' | 'alert' | 'success';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: '🩺',
    title: 'Regular Self-Check',
    message: 'About 1 minutes ago',
    time: '1m ago',
    read: false,
    type: 'reminder',
  },
  {
    id: '2',
    icon: '🏥',
    title: 'Stay Informed',
    message: 'About 1 minutes ago',
    time: '1m ago',
    read: false,
    type: 'info',
  },
  {
    id: '3',
    icon: '🎗️',
    title: 'Know the signs of breast cancer',
    message: 'About 1 minutes ago',
    time: '1m ago',
    read: false,
    type: 'alert',
  },
  {
    id: '4',
    icon: '📝',
    title: 'New Article',
    message: 'About 1 minutes ago',
    time: '1m ago',
    read: false,
    type: 'info',
  },
  {
    id: '5',
    icon: '⏰',
    title: "It's time for monthly self-check",
    message: 'About 1 minutes ago',
    time: '1m ago',
    read: false,
    type: 'reminder',
  },
];

export const ModernNotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return colors.primary;
      case 'info':
        return colors.accentBlue;
      case 'alert':
        return colors.warning;
      case 'success':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Notification</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllRead}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterTab,
            filter === 'all' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterTab,
            filter === 'unread' && styles.filterTabActive,
          ]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'unread' && styles.filterTabTextActive,
            ]}
          >
            Unread ({unreadCount})
          </Text>
        </Pressable>
      </View>

      {/* Notification List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyDescription}>
              {filter === 'unread'
                ? "You're all caught up!"
                : 'No notifications yet'}
            </Text>
          </View>
        ) : (
          <View style={styles.notificationList}>
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                variant="outlined"
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
                onPress={() => handleMarkAsRead(notification.id)}
              >
                <View style={styles.notificationContent}>
                  <View
                    style={[
                      styles.notificationIcon,
                      {
                        backgroundColor:
                          getNotificationColor(notification.type) + '20',
                      },
                    ]}
                  >
                    <Text style={styles.notificationIconText}>
                      {notification.icon}
                    </Text>
                  </View>
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                  </View>
                  {!notification.read && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}

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
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  screenTitle: {
    ...typography.header1Semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  unreadCount: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  markAllRead: {
    ...typography.body1Medium,
    color: colors.primary,
  },
  
  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    ...typography.body1Medium,
    color: colors.text,
  },
  filterTabTextActive: {
    color: colors.textOnPrimary,
  },
  
  // Scroll Content
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  
  // Notification List
  notificationList: {
    gap: spacing.md,
  },
  notificationCard: {
    backgroundColor: colors.surface,
  },
  notificationCardUnread: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIconText: {
    fontSize: 24,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    ...typography.title2Medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    ...typography.body1Regular,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    marginTop: spacing.xs,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.title1Medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body1Regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  bottomSpacer: {
    height: spacing.xl,
  },
});
