import * as React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {getSystemFont} from '@styles/typography';

const TITLES: Record<string, string> = {
  QRCode: 'QR Code',
  Invoices: 'Invoices',
  RateApp: 'Rate the App',
  FAQ: 'FAQ',
  ContactProxyPay: 'Contact ProxyPay',
  ShareApp: 'Share the App',
  Fees: 'Fees for all services',
};

export function MenuPlaceholderScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const title = TITLES[route.name] || route.name;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#FFFFFF'},
  content: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24},
  title: {
    color: '#0D131A',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 8,
  },
  subtitle: {
    color: '#8A94A6',
    fontSize: 14,
    fontFamily: getSystemFont(),
  },
});
