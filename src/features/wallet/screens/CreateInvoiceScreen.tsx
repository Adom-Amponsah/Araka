import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Share,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {BottomSheet} from '../flows/components/BottomSheet';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

const QUICK_AMOUNTS = ['10', '25', '50', '100'];

export function CreateInvoiceScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [amount, setAmount] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [phoneOrEmail, setPhoneOrEmail] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [previewVisible, setPreviewVisible] = React.useState(false);

  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  const handleGenerate = () => {
    if (!amount.trim() || !recipientName.trim() || !phoneOrEmail.trim()) {
      return;
    }
    setPreviewVisible(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Invoice ${invoiceNumber}\n\nTo: ${recipientName}\nAmount: $${amount} USD\nDescription: ${description || 'N/A'}\nDue Date: ${dueDate || 'N/A'}\n\nPay via Araka`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={DARK} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Invoice</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingHorizontal: 24, paddingBottom: 120}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.subText}>Fill in these fields to create an invoice</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Amount</Text>
          <View style={styles.inputRow}>
            <Ionicons name="cash-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
            <Text style={styles.currency}>USD</Text>
          </View>
          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map((amt) => (
              <Pressable key={amt} onPress={() => setAmount(amt)} style={styles.quickBtn}>
                <Text style={styles.quickText}>${amt}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Invoice Details</Text>

        <View style={styles.form}>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={styles.input}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Recipient name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={styles.input}
              value={phoneOrEmail}
              onChangeText={setPhoneOrEmail}
              placeholder="Phone or email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="document-text-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              multiline
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="Due date (DD/MM/YYYY)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + 12}]}>
        <Pressable onPress={handleGenerate} style={styles.generateBtn}>
          <Text style={styles.generateBtnText}>Generate Invoice</Text>
        </Pressable>
      </View>

      <InvoicePreviewSheet
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        onEdit={() => setPreviewVisible(false)}
        onShare={handleShare}
        invoiceNumber={invoiceNumber}
        amount={amount}
        recipientName={recipientName}
        phoneOrEmail={phoneOrEmail}
        description={description}
        dueDate={dueDate}
      />
    </View>
  );
}

// ─────────────────────────────────────────────
// Invoice Preview Sheet
// ─────────────────────────────────────────────
function InvoicePreviewSheet({
  visible,
  onClose,
  onEdit,
  onShare,
  invoiceNumber,
  amount,
  recipientName,
  phoneOrEmail,
  description,
  dueDate,
}: {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onShare: () => void;
  invoiceNumber: string;
  amount: string;
  recipientName: string;
  phoneOrEmail: string;
  description: string;
  dueDate: string;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={ip.title}>Invoice Preview</Text>
      <Text style={ip.sub}>Please verify the information before confirming</Text>

      <View style={ip.topCard}>
        <View style={ip.iconBox}>
          <Ionicons name="receipt-outline" size={32} color={DARK} />
        </View>
        <View style={ip.topCardInfo}>
          <Text style={ip.topCardTitle}>
            To <Text style={{color: CORAL}}>{recipientName}</Text>
          </Text>
          <Text style={ip.topCardSubtitle}>{phoneOrEmail}</Text>
          <Text style={ip.topCardSubtitle}>${amount || '0.00'}</Text>
        </View>
      </View>

      <View style={ip.table}>
        <View style={ip.tableRow}>
          <Text style={ip.tableLabel}>From</Text>
          <Text style={ip.tableValue}>{phoneOrEmail}</Text>
        </View>
        <View style={ip.tableDivider} />
        <View style={ip.tableRow}>
          <Text style={ip.tableLabel}>Description</Text>
          <Text style={ip.tableValue}>{description || 'N/A'}</Text>
        </View>
        <View style={ip.tableDivider} />
        <View style={ip.tableRow}>
          <Text style={ip.tableLabel}>Due Date</Text>
          <Text style={ip.tableValue}>{dueDate || 'N/A'}</Text>
        </View>
      </View>

      <Pressable onPress={onEdit} style={ip.editBtn}>
        <Text style={ip.editBtnText}>Edit Invoice</Text>
      </Pressable>

      <Pressable onPress={onShare} style={ip.shareBtn}>
        <Text style={ip.shareBtnText}>Share Invoice</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {fontSize: 18, fontWeight: '700', fontFamily: BOLD, color: DARK},
  scroll: {flex: 1, paddingHorizontal: 24},
  subText: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24, marginTop: 8},
  section: {marginBottom: 24},
  sectionLabel: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 8},
  sectionTitle: {fontSize: 16, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 16},
  form: {gap: 14, marginBottom: 20},
  fieldWrap: {gap: 6, marginBottom: 16},
  fieldLabel: {fontSize: 13, fontWeight: '600', fontFamily: BOLD, color: DARK},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  input: {flex: 1, fontSize: 15, fontFamily: SANS, color: DARK, padding: 0},
  currency: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: GRAY},
  quickRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12},
  quickBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: OFF,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickText: {fontSize: 13, fontWeight: '600', fontFamily: BOLD, color: CORAL},
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDF0F4',
  },
  generateBtn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  generateBtnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
});

const ip = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 20},
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 64,
    height: 64,
    backgroundColor: OFF,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topCardInfo: {
    flex: 1,
    gap: 4,
  },
  topCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
  },
  topCardSubtitle: {
    fontSize: 14,
    fontFamily: SANS,
    color: GRAY,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableLabel: {fontSize: 13, fontWeight: '600', fontFamily: BOLD, color: DARK},
  tableValue: {fontSize: 13, fontFamily: SANS, color: GRAY, textAlign: 'right', flex: 1, marginLeft: 16},
  tableDivider: {height: 1, backgroundColor: '#EDF0F4', marginVertical: 12},
  shareBtn: {
    flexDirection: 'row',
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  editBtn: {
    backgroundColor: '#FAF0EC',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  editBtnText: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: CORAL},
});
