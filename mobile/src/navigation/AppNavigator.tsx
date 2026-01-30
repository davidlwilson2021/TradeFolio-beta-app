import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { ProfileSetupScreen } from '../screens/profile/ProfileSetupScreen';
import { colors } from '../theme/colors';

const RootStack = createNativeStackNavigator();

interface AppNavigatorProps {
  isAuthenticated: boolean;
  onLogin: (accessToken: string, refreshToken: string, user: any) => Promise<void>;
  onSignOut: () => void;
}

export function AppNavigator({ isAuthenticated, onLogin, onSignOut }: AppNavigatorProps) {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <RootStack.Screen name="Main">
            {() => <MainNavigator onSignOut={onSignOut} />}
          </RootStack.Screen>
          <RootStack.Screen
            name="ProfileSetup"
            component={ProfileSetupScreen}
            options={{
              headerShown: true,
              title: 'Profile Setup',
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
            }}
          />
        </>
      ) : (
        <RootStack.Screen name="Auth">
          {() => <AuthNavigator onLogin={onLogin} />}
        </RootStack.Screen>
      )}
    </RootStack.Navigator>
  );
}
