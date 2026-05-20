import * as React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const DARK = '#1A2535';
const SANS = getSystemFont();

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or using the ARAKA app, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use the app.',
  },
  {
    title: 'Use of the Application',
    body: 'ARAKA provides services that allow users to pay bills, purchase airtime, and manage service payments through partner providers. Users agree to use the application only for lawful purposes.',
  },
  {
    title: 'Account Responsibilities',
    body: 'You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.',
  },
  {
    title: 'Payments and Transactions',
    body: 'Transactions performed through the app are processed through authorized partners. ARAKA is not responsible for service interruptions or delays caused by third-party providers.',
  },
  {
    title: 'Security',
    body: 'You agree to keep your device secure and to notify support if you believe your account has been accessed without authorization.',
  },
];

export function TermsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, {paddingTop: Math.max(insets.top, 20) + 8}]}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={23} color={DARK} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.updated}>Last updated: March 2026</Text>
        <Text style={styles.intro}>
          These Terms and Conditions govern your use of the ARAKA application and its services.
          By using the app, you agree to comply with these terms.
        </Text>

        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    marginBottom: 24,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    color: DARK,
    fontSize: 23,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: -0.4,
  },
  updated: {
    color: '#7B8491',
    fontSize: 12,
    fontFamily: SANS,
    marginTop: 6,
    marginBottom: 18,
  },
  intro: {
    color: '#3D4A5C',
    fontSize: 13,
    fontFamily: SANS,
    lineHeight: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 8,
  },
  body: {
    color: '#3D4A5C',
    fontSize: 13,
    fontFamily: SANS,
    lineHeight: 20,
  },
});

