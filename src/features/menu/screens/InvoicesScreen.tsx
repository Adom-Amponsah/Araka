import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {BottomSheet} from '../../wallet/flows/components/BottomSheet';

const CORAL = '#F27649';
const DARK = '#1A2535';
const SLATE = '#475569'; // Or #3D4A5C
const OFF = '#F3F4F6';
const GRAY = '#8A94A6';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

const INVOICES_TODAY = [
  {
    id: 'i1',
    name: 'Louisa Smith',
    amount: '$50.00',
    date: 'Today at 3:01 PM',
    status: 'Pending',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'i2',
    name: 'John Doe',
    amount: '$120.00',
    date: 'Today at 8:25 AM',
    status: 'Paid',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

const INVOICES_THIS_WEEK = [
  {
    id: 'i3',
    name: 'Chloe Anderson',
    amount: '$30.00',
    date: 'March 31',
    status: 'Expired',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'i4',
    name: 'Sylvia Moore',
    amount: '$45.00',
    date: 'March 30',
    status: 'Paid',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 'i5',
    name: 'Mateo Lewis',
    amount: '$130.00',
    date: 'March 29',
    status: 'Paid',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 'i6',
    name: 'Carl Simpson',
    amount: '$50.00',
    date: 'March 29',
    status: 'Pending', // Cut off in image, assume Pending
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
  },
];

function InvoiceRow({invoice, onPress}: {invoice: any; onPress: () => void}) {
  let statusColor = '#F59E0B'; // Pending (Yellow/Orange)
  let statusBg = '#FEF3C7';
  if (invoice.status === 'Paid') {
    statusColor = '#10B981'; // Green
    statusBg = '#D1FAE5';
  } else if (invoice.status === 'Expired') {
    statusColor = '#EF4444'; // Red
    statusBg = '#FEE2E2';
  }

  return (
    <Pressable style={s.card} onPress={onPress}>
      <Image source={{uri: invoice.avatar}} style={s.avatar} />
      <View style={s.cardInfo}>
        <Text style={s.cardName}>{invoice.name}</Text>
        <Text style={s.cardDate}>
          <Text style={s.cardAmount}>{invoice.amount}</Text> · {invoice.date}
        </Text>
      </View>
      <View style={[s.badge, {backgroundColor: statusBg}]}>
        <Text style={[s.badgeText, {color: statusColor}]}>{invoice.status}</Text>
      </View>
    </Pressable>
  );
}

function InvoiceDetailsSheet({visible, onClose, invoice}: {visible: boolean; onClose: () => void; invoice: any}) {
  if (!invoice) return null;

  let statusColor = '#F59E0B';
  let statusBg = '#FEF3C7';
  if (invoice.status === 'Paid') {
    statusColor = '#10B981';
    statusBg = '#D1FAE5';
  } else if (invoice.status === 'Expired') {
    statusColor = '#EF4444';
    statusBg = '#FEE2E2';
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} fullHeight>
      <Text style={ids.title}>Invoice Details</Text>
      
      <View style={ids.heroRow}>
        <View style={ids.iconBox}>
          <Ionicons name="receipt-outline" size={32} color={SLATE} />
        </View>
        <View style={ids.heroInfo}>
          <Text style={ids.heroSent}>Sent To <Text style={ids.heroName}>{invoice.name}</Text></Text>
          <Text style={ids.heroAmount}>{invoice.amount}</Text>
          <Text style={ids.heroSub}>Monday's restaurant</Text>
        </View>
      </View>

      <View style={ids.cardSection}>
        <View style={ids.row}>
          <Text style={ids.label}>Status</Text>
          <View style={[ids.badge, {backgroundColor: statusBg}]}>
            <Text style={[ids.badgeText, {color: statusColor}]}>{invoice.status}</Text>
          </View>
        </View>
        <View style={ids.divider} />
        <View style={ids.row}>
          <Text style={ids.label}>From</Text>
          <Text style={ids.val}>Oliver Bell</Text>
        </View>
        <View style={ids.divider} />
        <View style={ids.row}>
          <Text style={ids.label}>Date Created</Text>
          <Text style={ids.val}>March 30</Text>
        </View>
        <View style={ids.divider} />
        <View style={ids.row}>
          <Text style={ids.label}>Due Date</Text>
          <Text style={ids.val}>April 6</Text>
        </View>
      </View>

      <Text style={ids.sectionHead}>Payment Details</Text>
      <View style={ids.cardSection}>
        <View style={ids.row}>
          <Text style={ids.label}>Payment Date</Text>
          <Text style={ids.val}>April 1st</Text>
        </View>
        <View style={ids.divider} />
        <View style={ids.row}>
          <Text style={ids.label}>Transaction ID</Text>
          <Text style={ids.val}>#aOp732s1j</Text>
        </View>
      </View>

      <Pressable style={ids.cancelBtn} onPress={onClose}>
        <Text style={ids.cancelBtnText}>Cancel Invoice</Text>
      </Pressable>
      <Pressable style={ids.shareBtn} onPress={onClose}>
        <Text style={ids.shareBtnText}>Share Again</Text>
      </Pressable>
    </BottomSheet>
  );
}

export function InvoicesScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState('sent');
  const [search, setSearch] = React.useState('');
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);

  return (
    <View style={[s.root, {paddingTop: Math.max(insets.top, 20)}]}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
        </Pressable>
      </View>

      <Text style={s.title}>My Invoices</Text>

      <View style={s.searchRow}>
        <View style={s.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search invoices..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <Pressable style={s.filterBtn}>
          <Ionicons name="funnel-outline" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={s.tabs}>
        <Pressable
          onPress={() => setActiveTab('sent')}
          style={[s.tabItem, activeTab === 'sent' && s.tabItemActive]}>
          <Text style={[s.tabText, activeTab === 'sent' && s.tabTextActive]}>
            Invoices Sent
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('requests')}
          style={[s.tabItem, activeTab === 'requests' && s.tabItemActive]}>
          <Text style={[s.tabText, activeTab === 'requests' && s.tabTextActive]}>
            Payment Requests
          </Text>
        </Pressable>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>Today</Text>
        {INVOICES_TODAY.map((inv) => (
          <InvoiceRow key={inv.id} invoice={inv} onPress={() => setSelectedInvoice(inv)} />
        ))}

        <Text style={[s.sectionTitle, {marginTop: 12}]}>This Week</Text>
        {INVOICES_THIS_WEEK.map((inv) => (
          <InvoiceRow key={inv.id} invoice={inv} onPress={() => setSelectedInvoice(inv)} />
        ))}
      </ScrollView>

      <InvoiceDetailsSheet 
        visible={!!selectedInvoice} 
        invoice={selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
      />

      <Pressable style={[s.fab, {bottom: Math.max(insets.bottom, 24)}]} onPress={() => navigation.navigate('CreateInvoice')}>
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={s.fabText}>Create Invoice</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    paddingHorizontal: 24,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: BOLD,
    color: DARK,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 20,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: SANS,
    color: DARK,
    padding: 0,
  },
  filterBtn: {
    width: 52,
    height: 52,
    backgroundColor: CORAL,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  tabItem: {
    backgroundColor: OFF,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: SLATE,
  },
  tabText: {
    fontSize: 14,
    fontFamily: BOLD,
    fontWeight: '700',
    color: DARK,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: BOLD,
    color: DARK,
    marginBottom: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: OFF,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
  },
  cardDate: {
    fontSize: 13,
    fontFamily: SANS,
    color: GRAY,
  },
  cardAmount: {
    fontWeight: '700',
    fontFamily: BOLD,
    color: SLATE,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: BOLD,
  },
  fab: {
    position: 'absolute',
    right: 24,
    backgroundColor: SLATE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
  },
});

const ids = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 20},
  heroRow: {flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24},
  iconBox: {width: 64, height: 64, borderRadius: 16, backgroundColor: '#F7F9FC', alignItems: 'center', justifyContent: 'center'},
  heroInfo: {flex: 1, gap: 4},
  heroSent: {fontSize: 16, fontWeight: '800', fontFamily: BOLD, color: DARK},
  heroName: {color: CORAL},
  heroAmount: {fontSize: 15, fontFamily: SANS, color: SLATE},
  heroSub: {fontSize: 14, fontFamily: SANS, color: GRAY},
  cardSection: {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, marginBottom: 24},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16},
  label: {fontSize: 14, fontFamily: SANS, color: SLATE},
  val: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK},
  divider: {height: 1, backgroundColor: '#F3F4F6'},
  badge: {paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6},
  badgeText: {fontSize: 12, fontWeight: '700', fontFamily: BOLD},
  sectionHead: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: GRAY, marginBottom: 12, paddingHorizontal: 4},
  cancelBtn: {backgroundColor: '#E5E7EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12},
  cancelBtnText: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: SLATE},
  shareBtn: {backgroundColor: CORAL, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12},
  shareBtnText: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: '#FFFFFF'},
});
