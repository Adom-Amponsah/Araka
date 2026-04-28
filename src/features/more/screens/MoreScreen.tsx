import * as React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useAppStore} from '@shared/store/appStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CORAL = '#F27649';
const SLATE = '#3D4A5C';

export function MoreScreen() {
  const logout = useAppStore((state) => state.logout);
  const previewOnboarding = useAppStore((state) => state.previewOnboarding);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
      
      <Pressable style={styles.previewButton} onPress={previewOnboarding}>
        <Ionicons name="eye-outline" size={20} color={SLATE} />
        <Text style={styles.previewText}>Preview Onboarding</Text>
      </Pressable>
      
      <Pressable style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: SLATE,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: SLATE,
  },
  previewText: {
    color: SLATE,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: CORAL,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
