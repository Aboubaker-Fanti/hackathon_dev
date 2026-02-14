/**
 * Bottom Tab Navigator — Premium 2026 Design
 * Clean, floating-feel tab bar with refined icons and subtle interactions.
 * Each tab manages its own sub-screens via state.
 * 5 tabs: Home, Autopalpation, Chat, Education, Profile
 */

import React, { useState } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { SelfCheckScreen } from '../screens/SelfCheck/SelfCheckScreen';
import { ChatScreen } from '../screens/Chat/ChatScreen';
import { EducationScreen } from '../screens/Education/EducationScreen';
import { ArticleDetailScreen } from '../screens/ArticleDetail/ArticleDetailScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { ScreeningCentersScreen } from '../screens/ScreeningCenters/ScreeningCentersScreen';
import { NearbySearchScreen } from '../screens/NearbySearch/NearbySearchScreen';
import { useLanguageStore } from '../../application/store/languageStore';
import { useSelfCheckStore } from '../../application/store/selfCheckStore';
import { MIN_TOUCH_TARGET } from '../theme/spacing';

export type TabParamList = {
  Home: undefined;
  Autopalpation: undefined;
  Chat: undefined;
  Education: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof TabParamList, { focused: IoniconsName; unfocused: IoniconsName }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Autopalpation: { focused: 'heart', unfocused: 'heart-outline' },
  Chat: { focused: 'chatbubble', unfocused: 'chatbubble-outline' },
  Education: { focused: 'book', unfocused: 'book-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

/**
 * Wrapper for Education tab to handle article navigation
 */
const EducationTabScreen: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  if (selectedArticleId) {
    return (
      <ArticleDetailScreen
        articleId={selectedArticleId}
        onBack={() => setSelectedArticleId(null)}
        onArticlePress={setSelectedArticleId}
      />
    );
  }

  return <EducationScreen onArticlePress={setSelectedArticleId} />;
};

/**
 * Wrapper for Profile tab to handle sub-navigation
 */
const ProfileTabScreen: React.FC = () => {
  const [subScreen, setSubScreen] = useState<'profile' | 'centers' | 'nearby'>('profile');

  if (subScreen === 'nearby') {
    return <NearbySearchScreen onBack={() => setSubScreen('profile')} />;
  }

  if (subScreen === 'centers') {
    return <ScreeningCentersScreen onBack={() => setSubScreen('profile')} />;
  }

  return <ProfileScreen onNavigateToCenters={() => setSubScreen('centers')} />;
};

/**
 * Wrapper for Autopalpation tab — hides the bottom tab bar
 * when the self-check flow is active (instructions, chat, or results).
 */
const AutopalpationTabWrapper: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isActive, result } = useSelfCheckStore();
  const isInFlow = isActive || !!result;

  React.useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isInFlow
        ? { display: 'none' as const }
        : styles.tabBar,
    });
  }, [isInFlow, navigation]);

  return <SelfCheckScreen />;
};

/**
 * Wrapper for Home tab with navigation props
 */
const HomeTabWrapper: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [showNearby, setShowNearby] = useState(false);

  if (showNearby) {
    return <NearbySearchScreen onBack={() => setShowNearby(false)} />;
  }

  return (
    <HomeScreen
      onNavigateToExam={() => navigation.navigate('Autopalpation')}
      onNavigateToChat={() => navigation.navigate('Chat')}
      onNavigateToCenters={() => setShowNearby(true)}
    />
  );
};

export const TabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguageStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          const iconName = focused ? icons.focused : icons.unfocused;

          if (focused) {
            return (
              <View style={styles.activeIconWrap}>
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E8467A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeTabWrapper}
        options={{ tabBarLabel: t('tabs.home') }}
      />
      <Tab.Screen
        name="Autopalpation"
        component={AutopalpationTabWrapper}
        options={{ tabBarLabel: t('tabs.autopalpation') }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: t('tabs.chat') }}
      />
      <Tab.Screen
        name="Education"
        component={EducationTabScreen}
        options={{ tabBarLabel: t('tabs.education') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTabScreen}
        options={{ tabBarLabel: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.06)',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  tabBarItem: {
    minHeight: MIN_TOUCH_TARGET,
  },
  activeIconWrap: {
    backgroundColor: '#FDE8EF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
