import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { PortfolioListScreen } from '../screens/portfolio/PortfolioListScreen';
import { CreateProjectScreen } from '../screens/portfolio/CreateProjectScreen';
import { ProjectDetailScreen } from '../screens/portfolio/ProjectDetailScreen';
import { ProfileViewScreen } from '../screens/profile/ProfileViewScreen';
import { ProfileSetupScreen } from '../screens/profile/ProfileSetupScreen';
import { colors } from '../theme/colors';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const PortfolioStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function PortfolioNavigator() {
  return (
    <PortfolioStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <PortfolioStack.Screen
        name="PortfolioList"
        component={PortfolioListScreen}
        options={{ title: 'My Portfolio' }}
      />
      <PortfolioStack.Screen
        name="CreateProject"
        component={CreateProjectScreen}
        options={{ title: 'New Project' }}
      />
      <PortfolioStack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={{ title: 'Project' }}
      />
    </PortfolioStack.Navigator>
  );
}

interface ProfileNavigatorProps {
  onSignOut: () => void;
}

function ProfileNavigator({ onSignOut }: ProfileNavigatorProps) {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <ProfileStack.Screen name="ProfileView" options={{ title: 'Profile' }}>
        {(props) => <ProfileViewScreen {...props} onSignOut={onSignOut} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ title: 'Edit Profile' }}
      />
    </ProfileStack.Navigator>
  );
}

interface MainNavigatorProps {
  onSignOut: () => void;
}

export function MainNavigator({ onSignOut }: MainNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>H</Text>,
        }}
      />
      <Tab.Screen
        name="PortfolioTab"
        component={PortfolioNavigator}
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>P</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>U</Text>,
        }}
      >
        {() => <ProfileNavigator onSignOut={onSignOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
