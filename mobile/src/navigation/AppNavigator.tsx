import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerProvider } from '../contexts/DrawerContext';
import { Platform, useColorScheme, View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth.types';
import { useTheme } from '../theme';
import { Icon } from '../components/core/Icon';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import AccessDeniedScreen from '../screens/auth/AccessDeniedScreen';
import SignupStep1_UserType from '../screens/auth/SignupStep1_UserType';
import SignupStep2_Form from '../screens/auth/SignupStep2_Form';
import SignupStep2_Social from '../screens/auth/SignupStep2_Social';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import RegistrationSuccessScreen from '../screens/auth/RegistrationSuccessScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import NotificationsInboxScreen from '../screens/notifications/NotificationsInboxScreen';

// Search Screens
import PartnerSearchScreen from '../screens/search/PartnerSearchScreen';
import DealerSearchScreen from '../screens/search/DealerSearchScreen';

// Profile Screens
import PartnerProfileScreen from '../screens/profile/PartnerProfileScreen';
import DealerProfileScreenFromProfile from '../screens/profile/DealerProfileScreen';
import AccountManagementScreen from '../screens/profile/AccountManagementScreen';

// Utilities Screens
import UtilitiesHomeScreen from '../screens/utilities/UtilitiesHomeScreen';
import ChecklistsScreen from '../screens/utilities/ChecklistsScreen';
import VisualizationScreen from '../screens/utilities/VisualizationScreen';
import ShortcutsScreen from '../screens/utilities/ShortcutsScreen';
import ConvertersScreen from '../screens/utilities/ConvertersScreen';
import VideosScreen from '../screens/utilities/VideosScreen';
import VaastuScreen from '../screens/utilities/VaastuScreen';
import NotesMessagesScreen from '../screens/utilities/NotesMessagesScreen';

// Algorithms
import AlgorithmsScreen from '../screens/algorithms/AlgorithmsScreen';
import ConstructionCalculatorScreen from '../screens/calculators/ConstructionCalculatorScreen';
import BudgetEstimatorScreen from '../screens/calculators/BudgetEstimatorScreen';

// Payments
import PaymentScreen from '../screens/payments/PaymentScreen';
import PaymentHistoryScreen from '../screens/payments/PaymentHistoryScreen';

// Partner/Dealer Screens
import HomeScreen from '../screens/partner-dealer/HomeScreen';
import WorksScreen from '../screens/partner-dealer/WorksScreen';
import WorkEditorScreen from '../screens/partner-dealer/WorkEditorScreen';
import FeedScreen from '../screens/partner-dealer/FeedScreen';
import ToolsScreen from '../screens/partner-dealer/ToolsScreen';
import PartnerDealerProfileScreen from '../screens/partner-dealer/ProfileScreen';
import ProjectsScreen from '../screens/partner-dealer/ProjectsScreen';

// Dealer-Specific Screens
import DealerHomeScreen from '../screens/dealer/DealerHomeScreen';
import DealerProductsScreen from '../screens/dealer/DealerProductsScreen';
import DealerEnquiriesScreen from '../screens/dealer/DealerEnquiriesScreen';
import DealerToolsScreen from '../screens/dealer/DealerToolsScreen';
import DealerProfileScreen from '../screens/dealer/DealerProfileScreen';
import DealerDrawerContent from '../screens/dealer/DealerDrawerContent';
import DealerDashboardScreen from '../screens/dealer/DealerDashboardScreen';
import DealerManageProductsScreen from '../screens/dealer/DealerManageProductsScreen';
import DealerProductDetailsScreen from '../screens/dealer/DealerProductDetailsScreen';
import DealerEnquiryDetailScreen from '../screens/dealer/DealerEnquiryDetailScreen';
import DealerManageProfileScreen from '../screens/dealer/DealerManageProfileScreen';
import DealerViewChecklistScreen from '../screens/dealer/DealerViewChecklistScreen';
import DealerChecklistDetailScreen from '../screens/dealer/DealerChecklistDetailScreen';
import DealerShortcutsLinksScreen from '../screens/dealer/DealerShortcutsLinksScreen';
import OffersDiscountsScreen from '../screens/dealer/OffersDiscountsScreen';
import DealerConverterScreen from '../screens/dealer/DealerConverterScreen';
import DealerVideosScreen from '../screens/dealer/DealerVideosScreen';
import DealerGalleryScreen from '../screens/dealer/DealerGalleryScreen';
import DealerFeedbackScreen from '../screens/dealer/DealerFeedbackScreen';
import DealerNotesScreen from '../screens/dealer/DealerNotesScreen';
import LoyaltyPointsScreen from '../screens/dealer/LoyaltyPointsScreen';
import SteelMarketUpdatesScreen from '../screens/dealer/SteelMarketUpdatesScreen';
import LecturesScreen from '../screens/dealer/LecturesScreen';
import TradingAdvicesScreen from '../screens/dealer/TradingAdvicesScreen';
import UpcomingProjectsScreen from '../screens/dealer/UpcomingProjectsScreen';
import TendersScreen from '../screens/dealer/TendersScreen';
import QuizScreen from '../screens/dealer/QuizScreen';
import ReferralsScreen from '../screens/dealer/ReferralsScreen';
import EducationPostsScreen from '../screens/dealer/EducationPostsScreen';
import ReportsStatisticsScreen from '../screens/dealer/ReportsStatisticsScreen';
import ApplyDealershipScreen from '../screens/dealer/ApplyDealershipScreen';

// Alias for ProfileScreen to avoid naming conflict
const GeneralUserProfileScreen = ProfileScreen;

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const GeneralUserTabs = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          ...(Platform.OS === 'android' && {
            elevation: 8,
          }),
          ...(Platform.OS === 'ios' && {
            paddingBottom: 20,
            height: 88,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: 'dashboard' | 'profile' | 'notifications' = 'dashboard';
          
          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Profile') {
            iconName = 'profile';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications';
          }

          return (
            <Icon
              name={iconName}
              size={24}
              color={focused ? color : undefined}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={GeneralUserProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

const PartnerDealerTabs = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const isDealer = user?.role === UserRole.DEALER;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          ...(Platform.OS === 'android' && {
            elevation: 8,
          }),
          ...(Platform.OS === 'ios' && {
            paddingBottom: 20,
            height: 88,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: 'home' | 'work' | 'event' | 'tools' | 'profile' = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Work') iconName = 'work';
          else if (route.name === 'Feed') iconName = 'event';
          else if (route.name === 'Tools') iconName = 'tools';
          else if (route.name === 'Profile') iconName = 'profile';

          return (
            <Icon
              name={iconName}
              size={24}
              color={focused ? color : undefined}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={isDealer ? DealerHomeScreen : HomeScreen} />
      <Tab.Screen name="Work" component={isDealer ? DealerProductsScreen : WorksScreen} />
      <Tab.Screen name="Feed" component={isDealer ? DealerEnquiriesScreen : FeedScreen} />
      <Tab.Screen name="Tools" component={isDealer ? DealerToolsScreen : ToolsScreen} />
      <Tab.Screen name="Profile" component={isDealer ? DealerProfileScreen : PartnerDealerProfileScreen} />
    </Tab.Navigator>
  );
};

const DealerWithDrawer = () => {
  return (
    <DrawerProvider drawerContent={<DealerDrawerContent />}>
      <PartnerDealerTabs />
    </DrawerProvider>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const colorScheme = useColorScheme();
  const appTheme = useTheme();
  const navigationThemeObj = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

  // Customize navigation theme
  const navigationTheme = {
    ...navigationThemeObj,
    colors: {
      ...navigationThemeObj.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.card,
      text: appTheme.colors.text.primary,
      border: appTheme.colors.border,
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appTheme.colors.background }}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
        <Text style={{ marginTop: 16, color: appTheme.colors.text.secondary }}>Loading...</Text>
      </View>
    );
  }

  // Default header options for detail screens (screens with back buttons)
  const defaultHeaderOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: appTheme.colors.card,
      ...(Platform.OS === 'android' && { elevation: 0, shadowOpacity: 0 }),
      ...(Platform.OS === 'ios' && {
        borderBottomWidth: 0.5,
        borderBottomColor: appTheme.colors.border,
      }),
      ...(Platform.OS === 'web' && {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      }),
    },
    headerTintColor: appTheme.colors.text.primary,
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: appTheme.colors.text.primary,
    },
    headerBackTitleVisible: Platform.OS === 'ios' ? true : false,
    headerBackTitle: Platform.OS === 'ios' ? 'Back' : undefined,
    headerShadowVisible: Platform.OS === 'ios' ? true : false,
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Default: hide headers (tab navigators manage their own)
          ...(Platform.OS === 'ios' && TransitionPresets.SlideFromRightIOS),
          ...(Platform.OS === 'android' && TransitionPresets.FadeFromBottomAndroid),
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="OTP"
              component={OTPScreen}
              options={{
                ...(Platform.OS === 'ios' && TransitionPresets.ModalPresentationIOS),
              }}
            />
            <Stack.Screen name="SignupStep1" component={SignupStep1_UserType} />
            <Stack.Screen name="SignupStep2" component={SignupStep2_Form} />
            <Stack.Screen name="SignupStep2Social" component={SignupStep2_Social} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen 
              name="RegistrationSuccess" 
              component={RegistrationSuccessScreen}
              options={{
                headerShown: false,
                gestureEnabled: false // Prevent going back from success screen
              }}
            />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : user?.role === UserRole.GENERAL_USER ? (
          <>
            <Stack.Screen name="Main" component={GeneralUserTabs} />
            <Stack.Screen 
              name="PartnerSearch" 
              component={PartnerSearchScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Find Partners',
              }}
            />
            <Stack.Screen 
              name="DealerSearch" 
              component={DealerSearchScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Find Dealers',
              }}
            />
            <Stack.Screen 
              name="PartnerProfile" 
              component={PartnerProfileScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Partner Profile',
              }}
            />
            <Stack.Screen 
              name="DealerProfile" 
              component={DealerProfileScreenFromProfile}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Dealer Profile',
              }}
            />
            <Stack.Screen 
              name="AccountManagement" 
              component={AccountManagementScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Account Management',
              }}
            />
            <Stack.Screen 
              name="UtilitiesHome" 
              component={UtilitiesHomeScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Utilities & Knowledge',
              }}
            />
            <Stack.Screen 
              name="Checklists" 
              component={ChecklistsScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Checklists',
              }}
            />
            <Stack.Screen 
              name="Visualization" 
              component={VisualizationScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Visualization',
              }}
            />
            <Stack.Screen 
              name="Shortcuts" 
              component={ShortcutsScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Shortcuts & Links',
              }}
            />
            <Stack.Screen 
              name="Converters" 
              component={ConvertersScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Unit Converters',
              }}
            />
            <Stack.Screen 
              name="Videos" 
              component={VideosScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Videos',
              }}
            />
            <Stack.Screen 
              name="Vaastu" 
              component={VaastuScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Vaastu Services',
              }}
            />
            <Stack.Screen 
              name="NotesMessages" 
              component={NotesMessagesScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Notes & Messages',
              }}
            />
            <Stack.Screen 
              name="Algorithms" 
              component={AlgorithmsScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Algorithms',
              }}
            />
            <Stack.Screen 
              name="ConstructionCalculator" 
              component={ConstructionCalculatorScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Construction Calculator',
              }}
            />
            <Stack.Screen 
              name="BudgetEstimator" 
              component={BudgetEstimatorScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Budget Estimator',
              }}
            />
            <Stack.Screen 
              name="NotificationsInbox" 
              component={NotificationsInboxScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Notifications',
              }}
            />
            <Stack.Screen 
              name="Payment" 
              component={PaymentScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Payment',
              }}
            />
            <Stack.Screen 
              name="PaymentHistory" 
              component={PaymentHistoryScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Payment History',
              }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Reset Password',
              }}
            />
          </>
        ) : user && (user.role === UserRole.PARTNER || user.role === UserRole.DEALER) ? (
          <>
            <Stack.Screen name="Main" component={user.role === UserRole.DEALER ? DealerWithDrawer : PartnerDealerTabs} />
            {/* Partner/Dealer specific screens */}
            <Stack.Screen 
              name="AccountManagement" 
              component={AccountManagementScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Account Management',
              }}
            />
            <Stack.Screen 
              name="PaymentHistory" 
              component={PaymentHistoryScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Payment History',
              }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Reset Password',
              }}
            />
            <Stack.Screen 
              name="UtilitiesHome" 
              component={UtilitiesHomeScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Utilities & Knowledge',
              }}
            />
            {/* Utility screens - accessible from UtilitiesHome */}
            <Stack.Screen 
              name="Checklists" 
              component={ChecklistsScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Checklists',
              }}
            />
            <Stack.Screen 
              name="Visualization" 
              component={VisualizationScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Visualization',
              }}
            />
            <Stack.Screen 
              name="Shortcuts" 
              component={ShortcutsScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Shortcuts & Links',
              }}
            />
            <Stack.Screen 
              name="Converters" 
              component={ConvertersScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Unit Converters',
              }}
            />
            <Stack.Screen 
              name="Videos" 
              component={VideosScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Videos',
              }}
            />
            <Stack.Screen 
              name="Vaastu" 
              component={VaastuScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Vaastu Services',
              }}
            />
            <Stack.Screen 
              name="NotesMessages" 
              component={NotesMessagesScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Notes & Messages',
              }}
            />
            <Stack.Screen 
              name="ConstructionCalculator" 
              component={ConstructionCalculatorScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Construction Calculator',
              }}
            />
            <Stack.Screen 
              name="BudgetEstimator" 
              component={BudgetEstimatorScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Budget Estimator',
              }}
            />
            {/* Tools/Projects screens - accessible from ToolsScreen */}
            <Stack.Screen 
              name="Projects" 
              component={ProjectsScreen}
              options={{ 
                ...defaultHeaderOptions,
                title: 'Upcoming Projects',
              }}
            />
            {/* Work Editor - accessible from WorksScreen */}
            <Stack.Screen 
              name="WorkEditor" 
              component={WorkEditorScreen}
              options={({ route }) => {
                const params = route.params as { mode?: string } | undefined;
                const mode = params?.mode || 'create';
                return {
                  ...defaultHeaderOptions,
                  title: mode === 'edit' ? 'Edit Work' : 'Create Work',
                };
              }}
            />
            {/* Dealer-specific drawer screens */}
            <Stack.Screen
              name="DealerDashboard"
              component={DealerDashboardScreen}
              options={{ ...defaultHeaderOptions, title: 'Dashboard' }}
            />
            <Stack.Screen
              name="DealerManageProducts"
              component={DealerManageProductsScreen}
              options={{ ...defaultHeaderOptions, title: 'Manage Products' }}
            />
            <Stack.Screen
              name="DealerProductDetails"
              component={DealerProductDetailsScreen}
              options={{ ...defaultHeaderOptions, title: 'Product Details' }}
            />
            <Stack.Screen
              name="DealerEnquiryDetail"
              component={DealerEnquiryDetailScreen}
              options={{ ...defaultHeaderOptions, title: 'Enquiry Detail' }}
            />
            <Stack.Screen
              name="DealerViewChecklist"
              component={DealerViewChecklistScreen}
              options={{ ...defaultHeaderOptions, title: 'View Checklists' }}
            />
            <Stack.Screen
              name="DealerChecklistDetail"
              component={DealerChecklistDetailScreen}
              options={{ ...defaultHeaderOptions, title: 'Checklist Detail' }}
            />
            <Stack.Screen
              name="OffersDiscounts"
              component={OffersDiscountsScreen}
              options={{ ...defaultHeaderOptions, title: 'Offers & Discounts' }}
            />
            <Stack.Screen
              name="DealerEnquiries"
              component={DealerEnquiriesScreen}
              options={{ ...defaultHeaderOptions, title: 'Enquiries' }}
            />
            <Stack.Screen
              name="DealerShortcutsLinks"
              component={DealerShortcutsLinksScreen}
              options={{ ...defaultHeaderOptions, title: 'Shortcuts & Links' }}
            />
            <Stack.Screen
              name="DealerManageProfile"
              component={DealerManageProfileScreen}
              options={{ ...defaultHeaderOptions, title: 'Manage Profile' }}
            />
            <Stack.Screen
              name="DealerConverter"
              component={DealerConverterScreen}
              options={{ ...defaultHeaderOptions, title: 'Converter' }}
            />
            <Stack.Screen
              name="DealerVideos"
              component={DealerVideosScreen}
              options={{ ...defaultHeaderOptions, title: 'Videos' }}
            />
            <Stack.Screen
              name="DealerGallery"
              component={DealerGalleryScreen}
              options={{ ...defaultHeaderOptions, title: 'Gallery' }}
            />
            <Stack.Screen
              name="DealerFeedback"
              component={DealerFeedbackScreen}
              options={{ ...defaultHeaderOptions, title: 'Feedback' }}
            />
            <Stack.Screen
              name="DealerNotes"
              component={DealerNotesScreen}
              options={{ ...defaultHeaderOptions, title: 'Notes' }}
            />
            <Stack.Screen
              name="LoyaltyPoints"
              component={LoyaltyPointsScreen}
              options={{ ...defaultHeaderOptions, title: 'Loyalty Points' }}
            />
            <Stack.Screen
              name="SteelMarketUpdates"
              component={SteelMarketUpdatesScreen}
              options={{ ...defaultHeaderOptions, title: 'Steel Market Updates' }}
            />
            <Stack.Screen
              name="Lectures"
              component={LecturesScreen}
              options={{ ...defaultHeaderOptions, title: 'Lectures' }}
            />
            <Stack.Screen
              name="TradingAdvices"
              component={TradingAdvicesScreen}
              options={{ ...defaultHeaderOptions, title: 'Trading Advices' }}
            />
            <Stack.Screen
              name="UpcomingProjects"
              component={UpcomingProjectsScreen}
              options={{ ...defaultHeaderOptions, title: 'Upcoming Projects' }}
            />
            <Stack.Screen
              name="Tenders"
              component={TendersScreen}
              options={{ ...defaultHeaderOptions, title: 'Tenders' }}
            />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{ ...defaultHeaderOptions, title: 'Quiz' }}
            />
            <Stack.Screen
              name="Referrals"
              component={ReferralsScreen}
              options={{ ...defaultHeaderOptions, title: 'Referrals' }}
            />
            <Stack.Screen
              name="EducationPosts"
              component={EducationPostsScreen}
              options={{ ...defaultHeaderOptions, title: 'Education Posts' }}
            />
            <Stack.Screen
              name="ReportsStatistics"
              component={ReportsStatisticsScreen}
              options={{ ...defaultHeaderOptions, title: 'Reports & Statistics' }}
            />
            <Stack.Screen
              name="ApplyDealership"
              component={ApplyDealershipScreen}
              options={{ ...defaultHeaderOptions, title: 'Apply for Dealership' }}
            />
          </>
        ) : isAuthenticated ? (
          <Stack.Screen name="AccessDenied" component={AccessDeniedScreen} />
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;



