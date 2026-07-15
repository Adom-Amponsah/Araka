import * as React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppStore} from '@shared/store/appStore';
import {getSystemFont} from '@styles/typography';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

export function MyQrScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const user = useAppStore((state) => state.user);
  const displayName = user?.name || 'Oliver Bell';
  const qrData = `ARAKA:${user?.id || 'user'}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  const handleShare = () => {
    Share.share({
      message: `Send money to ${displayName} on ARAKA using this QR code: ${qrData}`,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={26} color={DARK} />
        </Pressable>
        <Text style={styles.title}>My QR Code</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="qr-code" size={22} color={CORAL} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, {paddingBottom: Math.max(insets.bottom, 16) + 16}]}>
        <View style={styles.card}>
          <Image source={{uri: qrUrl}} style={styles.qr} resizeMode="contain" />

          <Text style={styles.name}>{displayName}</Text>

          <View style={styles.tag}>
            <Ionicons name="wallet-outline" size={14} color={CORAL} />
            <Text style={styles.tagText}>ARAKA Wallet</Text>
          </View>

          <Text style={styles.description}>
            Share this code to receive money from anyone. The sender doesn't need to have an ARAKA account.
          </Text>

          <Pressable style={styles.saveLink}>
            <Text style={styles.saveText}>Save to gallery</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 16)}]}>
        <Pressable onPress={handleShare} style={styles.cta}>
          <Text style={styles.ctaText}>Share QR Code</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconBtn: {
    padding: 8,
  },
  title: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#1A2535',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  qr: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  name: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  tagText: {
    color: CORAL,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  description: {
    color: GRAY,
    fontSize: 14,
    fontFamily: SANS,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  saveLink: {
    paddingVertical: 4,
  },
  saveText: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#F7F9FC',
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});
