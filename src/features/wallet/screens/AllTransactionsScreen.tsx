import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const CORAL = '#F27649';
const DARK = '#1A2535';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

const ALL_TXNS = [
  {
    id: 't1',
    label: 'Airtime - Vodacom',
    date: 'Feb 17',
    amount: '-5 USD',
    type: 'vodacom',
  },
  {
    id: 't2',
    label: 'To Natalia',
    date: 'Feb 20',
    amount: '-45.30 USD',
    type: 'avatar',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 't3',
    label: 'From Mathew',
    date: 'Feb 18',
    amount: '+120.00 USD',
    type: 'avatar',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 't4',
    label: 'Top up',
    date: 'Feb 17',
    amount: '+200 USD',
    type: 'topup',
  },
  {
    id: 't5',
    label: 'Top up',
    date: 'Feb 17',
    amount: '+200 USD',
    type: 'topup',
  },
  {
    id: 't6',
    label: 'To Natalia',
    date: 'Feb 20',
    amount: '-45.30 USD',
    type: 'avatar',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 't7',
    label: 'To Natalia',
    date: 'Feb 20',
    amount: '-45.30 USD',
    type: 'avatar',
    img: 'https://randomuser.me/api/portraits/men/46.jpg', // Another avatar for variety like image
  },
  {
    id: 't8',
    label: 'To Natalia',
    date: 'Feb 20',
    amount: '-45.30 USD',
    type: 'avatar',
    img: 'https://randomuser.me/api/portraits/men/86.jpg', // Another avatar for variety like image
  },
];

export function AllTransactionsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, {paddingTop: Math.max(insets.top, 20)}]}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
        </Pressable>
        <Text style={s.headerTitle}>All Transactions</Text>
      </View>

      <View style={s.filters}>
        <Pressable style={s.filterBtn}>
          <Text style={s.filterText}>Select dates</Text>
          <Ionicons name="chevron-down" size={16} color="#8A94A6" />
        </Pressable>
        <Pressable style={s.filterBtn}>
          <Text style={s.filterText}>Select Type</Text>
          <Ionicons name="chevron-down" size={16} color="#8A94A6" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {ALL_TXNS.map(txn => (
          <View key={txn.id} style={s.card}>
            <View style={s.cardLeft}>
              {txn.type === 'vodacom' && (
                <View style={s.vodaBadge}>
                  <Text style={s.vodaText}>vodacom</Text>
                </View>
              )}
              {txn.type === 'avatar' && (
                <Image source={{uri: txn.img}} style={s.avatar} />
              )}
              {txn.type === 'topup' && (
                <View style={s.topupBadge}>
                  <Ionicons name="add" size={24} color={CORAL} />
                </View>
              )}
            </View>
            <View style={s.cardMid}>
              <Text style={s.cardTitle}>{txn.label}</Text>
              <Text style={s.cardDate}>{txn.date}</Text>
            </View>
            <View style={s.cardRight}>
              <Text style={s.cardAmount}>{txn.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: BOLD,
    color: DARK,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6', // light grey background like image
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 14,
    fontFamily: SANS,
    color: '#8A94A6',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  cardLeft: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vodaBadge: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E60000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vodaText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: BOLD,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  topupBadge: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF5F2', // very light coral
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMid: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
  },
  cardDate: {
    fontSize: 13,
    fontFamily: SANS,
    color: '#8A94A6',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: BOLD,
    color: CORAL, // the image uses coral for ALL amounts!
  },
});
