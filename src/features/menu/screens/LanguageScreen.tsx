import * as React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {AppLanguage, useMenuSettingsStore} from '../store/menuSettingsStore';

const CORAL = '#F27649';
const DARK = '#1A2535';
const OFF = '#F4F6FA';
const SANS = getSystemFont();

const LANGUAGES: Array<{
  id: AppLanguage;
  label: string;
  flag: string;
  recommended?: boolean;
}> = [
  {id: 'en', label: 'English', flag: '🇬🇧', recommended: true},
  {id: 'fr', label: 'Français', flag: '🇫🇷'},
  {id: 'sw', label: 'Swahili', flag: '🇨🇩'},
  {id: 'ln', label: 'Lingala', flag: '🇨🇩'},
];

export function LanguageScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const language = useMenuSettingsStore(state => state.language);
  const setLanguage = useMenuSettingsStore(state => state.setLanguage);

  return (
    <View style={[styles.root, {paddingTop: Math.max(insets.top, 20) + 8}]}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={23} color={DARK} />
      </Pressable>

      <Text style={styles.title}>Select your language</Text>
      <Text style={styles.subtitle}>Choose the language you prefer to use in the app.</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {LANGUAGES.map(item => {
          const active = item.id === language;

          return (
            <Pressable
              key={item.id}
              onPress={() => setLanguage(item.id)}
              style={[styles.languageRow, active && styles.languageRowActive]}>
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={styles.languageLabel}>{item.label}</Text>
              <View style={styles.languageSpacer}>
                {item.recommended && <Text style={styles.recommended}>Recommended</Text>}
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
              </View>
            </Pressable>
          );
        })}
        <Pressable style={styles.applyBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.applyText}>Apply Language</Text>
        </Pressable>
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
    marginTop: 6,
    marginBottom: 24,
  },
  list: {
    gap: 14,
    paddingBottom: 40,
  },
  languageRow: {
    minHeight: 58,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7ECF2',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  languageRowActive: {
    borderColor: CORAL,
    backgroundColor: '#FFF7F3',
  },
  flag: {
    fontSize: 15,
  },
  languageLabel: {
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  recommended: {
    color: CORAL,
    backgroundColor: '#FEEDE6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  languageSpacer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D8DEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: CORAL,
    borderColor: CORAL,
  },
  applyBtn: {
    backgroundColor: CORAL,
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 5,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
});
