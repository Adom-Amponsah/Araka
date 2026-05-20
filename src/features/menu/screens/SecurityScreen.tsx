import * as React from 'react';
import {Pressable, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {AutoLockTimer, useMenuSettingsStore} from '../store/menuSettingsStore';

const CORAL = '#F27649';
const DARK = '#1A2535';
const SANS = getSystemFont();

const TIMER_LABELS: Record<AutoLockTimer, string> = {
  immediate: 'Immediately',
  '1m': 'After 1 min',
  '5m': 'After 5 min',
  '15m': 'After 15 min',
};

const TIMER_ORDER: AutoLockTimer[] = ['immediate', '1m', '5m', '15m'];

function SettingsSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{false: '#E5E7EB', true: '#F2A07F'}}
      thumbColor={value ? CORAL : '#FFFFFF'}
      ios_backgroundColor="#E5E7EB"
    />
  );
}

export function SecurityScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    faceIdUnlock,
    faceIdPayments,
    appLock,
    requirePinForTransactions,
    autoLockTimer,
    setSecurityOption,
  } = useMenuSettingsStore();

  const cycleTimer = () => {
    const currentIndex = TIMER_ORDER.indexOf(autoLockTimer);
    const nextTimer = TIMER_ORDER[(currentIndex + 1) % TIMER_ORDER.length];
    setSecurityOption('autoLockTimer', nextTimer);
  };

  return (
    <View style={[styles.root, {paddingTop: Math.max(insets.top, 20) + 8}]}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={23} color={DARK} />
      </Pressable>

      <Text style={styles.title}>Security</Text>
      <Text style={styles.subtitle}>
        Your security settings help protect your account and transactions.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Biometric Login</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowText}>Use Face ID to unlock the app</Text>
            <SettingsSwitch
              value={faceIdUnlock}
              onValueChange={value => setSecurityOption('faceIdUnlock', value)}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowText}>Use Face ID for payments</Text>
            <SettingsSwitch
              value={faceIdPayments}
              onValueChange={value => setSecurityOption('faceIdPayments', value)}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>App Lock</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowText}>Require authentication when opening the app</Text>
            <SettingsSwitch
              value={appLock}
              onValueChange={value => setSecurityOption('appLock', value)}
            />
          </View>
          <View style={styles.separator} />
          <Pressable onPress={cycleTimer} style={styles.row}>
            <Text style={styles.rowText}>Auto-lock timer</Text>
            <View style={styles.valueWrap}>
              <Text style={styles.valueText}>{TIMER_LABELS[autoLockTimer]}</Text>
              <Ionicons name="chevron-forward" size={16} color="#C4CDD8" />
            </View>
          </Pressable>
        </View>

        <View style={styles.actions}>
          {/* <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Change PIN</Text>
          </Pressable> */}
          <Pressable style={styles.saveBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>

        {/* <Text style={styles.sectionLabel}>Payment Confirmation</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowText}>Require PIN for transactions</Text>
            <SettingsSwitch
              value={requirePinForTransactions}
              onValueChange={value => setSecurityOption('requirePinForTransactions', value)}
            />
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: DARK,
    fontSize: 23,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: -0.4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: SANS,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 24,
  },
  content: {
    paddingBottom: 40,
  },
  sectionLabel: {
    color: '#7B8491',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    marginBottom: 10,
    marginTop: 8,
  },
  group: {
    borderWidth: 1,
    borderColor: '#E7ECF2',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 22,
  },
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 14,
  },
  rowText: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    fontFamily: SANS,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEF2F6',
    marginLeft: 16,
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    color: CORAL,
    fontSize: 12,
    fontFamily: SANS,
  },
  actions: {
    gap: 10,
    marginTop: 2,
  },
  secondaryBtn: {
    backgroundColor: '#FBEDE7',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryText: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  saveBtn: {
    backgroundColor: CORAL,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 5,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
});
