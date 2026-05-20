import * as React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const CORAL = '#F27649';
const DARK = '#1A2535';
const SANS = getSystemFont();

type AccordionItem = {
  title: string;
  body: string;
  icon: string;
};

type MenuAccordionScreenProps = {
  title: string;
  subtitle: string;
  icon: string;
  showHeroIcon?: boolean;
  items: AccordionItem[];
  footer?: string;
};

export function MenuAccordionScreen({
  title,
  subtitle,
  icon,
  showHeroIcon = true,
  items,
  footer,
}: MenuAccordionScreenProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = React.useState(0);

  return (
    <View style={[styles.root, {paddingTop: Math.max(insets.top, 20) + 8}]}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={23} color={DARK} />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {showHeroIcon ? (
          <View style={styles.heroIcon}>
            <Ionicons name={icon as any} size={28} color={CORAL} />
          </View>
        ) : null}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.card}>
          {items.map((item, index) => {
            const open = index === openIndex;

            return (
              <View key={item.title}>
                <Pressable
                  onPress={() => setOpenIndex(open ? -1 : index)}
                  style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Ionicons name={item.icon as any} size={16} color={CORAL} />
                  </View>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={17}
                    color="#9AA5B3"
                  />
                </Pressable>
                {open ? <Text style={styles.body}>{item.body}</Text> : null}
                {index < items.length - 1 && <View style={styles.separator} />}
              </View>
            );
          })}
        </View>

        {footer ? <Text style={styles.footer}>{footer}</Text> : null}
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
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#FFF1EA',
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
  card: {
    borderWidth: 1,
    borderColor: '#E7ECF2',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  row: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FFF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  body: {
    color: '#516174',
    fontSize: 12,
    fontFamily: SANS,
    lineHeight: 19,
    paddingLeft: 60,
    paddingRight: 16,
    paddingBottom: 16,
    marginTop: -4,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEF2F6',
    marginLeft: 60,
  },
  footer: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: SANS,
    lineHeight: 19,
    marginTop: 18,
  },
});
