import * as React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const CORAL = '#F27649';
const DARK = '#1A2535';
const SANS = getSystemFont();

type Action = {
  label: string;
  value?: string;
  icon: string;
};

type MenuInfoScreenProps = {
  title: string;
  subtitle: string;
  icon: string;
  showHeroIcon?: boolean;
  tone?: 'coral' | 'dark';
  stats?: Array<{label: string; value: string}>;
  actions?: Action[];
  note?: string;
  primaryLabel?: string;
};

export function MenuInfoScreen({
  title,
  subtitle,
  icon,
  showHeroIcon = true,
  tone = 'coral',
  stats = [],
  actions = [],
  note,
  primaryLabel,
}: MenuInfoScreenProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const accent = tone === 'dark' ? DARK : CORAL;

  return (
    <View style={[styles.root, {paddingTop: Math.max(insets.top, 20) + 8}]}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={23} color={DARK} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {showHeroIcon ? (
          <View
            style={[styles.heroIcon, {backgroundColor: tone === 'dark' ? '#EEF2F6' : '#FFF1EA'}]}>
            <Ionicons name={icon as any} size={28} color={accent} />
          </View>
        ) : null}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {stats.length > 0 && (
          <View style={styles.stats}>
            {stats.map(stat => (
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        {actions.length > 0 && (
          <View style={styles.card}>
            {actions.map((action, index) => (
              <View key={action.label}>
                <Pressable style={styles.actionRow}>
                  <View style={styles.actionIcon}>
                    <Ionicons name={action.icon as any} size={16} color={CORAL} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  {action.value ? <Text style={styles.actionValue}>{action.value}</Text> : null}
                  <Ionicons name="chevron-forward" size={16} color="#C4CDD8" />
                </Pressable>
                {index < actions.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        )}

        {note ? <Text style={styles.note}>{note}</Text> : null}

        {primaryLabel ? (
          <Pressable style={styles.primaryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </Pressable>
        ) : null}
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
  content: {
    paddingBottom: 28,
  },
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    color: DARK,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: -0.4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: SANS,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E7ECF2',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  statValue: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  statLabel: {
    color: '#7B8491',
    fontSize: 11,
    fontFamily: SANS,
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E7ECF2',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  actionRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FFF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  actionValue: {
    color: '#7B8491',
    fontSize: 12,
    fontFamily: SANS,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEF2F6',
    marginLeft: 60,
  },
  note: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: SANS,
    lineHeight: 19,
    marginTop: 18,
  },
  primaryBtn: {
    backgroundColor: CORAL,
    borderRadius: 12,
    marginTop: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
});
