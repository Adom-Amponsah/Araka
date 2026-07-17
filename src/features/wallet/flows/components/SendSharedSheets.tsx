import * as React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet, Animated} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {BottomSheet} from './BottomSheet';
import {useSendFlowStore} from '../../store/sendFlowStore';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const GREEN = '#10B981';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// Review Sheet
// ─────────────────────────────────────────────
export function ReviewSheet({
  visible,
  onClose,
  onBack,
  recipientLabel,
  recipientDetail,
  amount,
  fee,
  onConfirm,
  onEdit,
  fullName,
  bankAccount,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  recipientLabel: string;
  recipientDetail: string;
  amount: string;
  fee: string;
  onConfirm: () => void;
  onEdit: () => void;
  fullName?: string;
  bankAccount?: string;
}) {
  const total = (Number(amount) + Number(fee)).toFixed(2);
  const isIntl = fullName !== undefined;

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <Text style={rv.title}>Confirm your Send Money</Text>
      <Text style={rv.sub}>Please verify the information before confirming</Text>

      <View style={rv.summaryCard}>
        <View style={rv.summaryRow}>
          <Text style={rv.summaryLabel}>To</Text>
          <Text style={rv.summaryValue}>{recipientLabel}</Text>
        </View>
        <View style={rv.divider} />
        {isIntl ? (
          <>
            <View style={rv.summaryRow}>
              <Text style={rv.summaryLabel}>Full Name</Text>
              <Text style={rv.summaryValue}>{fullName}</Text>
            </View>
            <View style={rv.divider} />
            <View style={rv.summaryRow}>
              <Text style={rv.summaryLabel}>Bank Account</Text>
              <Text style={rv.summaryValue}>{bankAccount || '—'}</Text>
            </View>
            <View style={rv.divider} />
          </>
        ) : (
          <>
            <View style={rv.summaryRow}>
              <Text style={rv.summaryLabel}>Phone number</Text>
              <Text style={rv.summaryValue}>{recipientDetail}</Text>
            </View>
            <View style={rv.divider} />
          </>
        )}
        <View style={rv.summaryRow}>
          <Text style={rv.summaryLabel}>Amount</Text>
          <Text style={rv.summaryValue}>${amount || '0.00'} USD</Text>
        </View>
        <View style={rv.divider} />
        <View style={rv.summaryRow}>
          <Text style={rv.summaryLabel}>Fee</Text>
          <Text style={rv.summaryValue}>${fee} USD</Text>
        </View>
        <View style={rv.divider} />
        <View style={[rv.summaryRow, rv.totalRow]}>
          <Text style={rv.totalLabel}>Total</Text>
          <Text style={rv.totalValue}>${total} USD</Text>
        </View>
      </View>

      <Pressable onPress={onEdit} style={rv.editBtn}>
        <Text style={rv.editText}>Edit</Text>
      </Pressable>

      <Pressable onPress={onConfirm} style={rv.btn}>
        <Text style={rv.btnText}>Confirm</Text>
      </Pressable>
    </BottomSheet>
  );
}

const rv = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24},
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: SANS,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: BOLD,
    color: DARK,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EDF2',
  },
  totalRow: {
    paddingTop: 14,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: BOLD,
    color: CORAL,
  },
  btn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  editBtn: {
    backgroundColor: '#FFF5F2',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  editText: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: CORAL},
});

// ─────────────────────────────────────────────
// Processing Sheet
// ─────────────────────────────────────────────
export function SendProcessingSheet({
  visible,
  recipientLabel,
  recipientDetail,
  amount,
}: {
  visible: boolean;
  recipientLabel: string;
  recipientDetail: string;
  amount: string;
}) {
  const dots = React.useRef(Array.from({length: 8}, (_, i) => new Animated.Value(0))).current;

  React.useEffect(() => {
    if (visible) {
      const animations = dots.map((dot, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 100),
            Animated.timing(dot, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        )
      );
      animations.forEach((anim) => anim.start());
      return () => animations.forEach((anim) => anim.stop());
    }
  }, [visible, dots]);

  return (
    <BottomSheet visible={visible} onClose={() => {}} closable={false}>
      <View style={pr.content}>
        <View style={pr.dotsWrap}>
          {dots.map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                pr.dot,
                {
                  opacity: dot,
                  transform: [{scale: dot}],
                },
              ]}
            />
          ))}
        </View>

        <Text style={pr.title}>Processing Transfer</Text>
        <Text style={pr.sub}>Please wait while we process your transfer...</Text>

        <View style={pr.card}>
          <View style={pr.cardLeft}>
            <View style={pr.cardLogo}>
              <Ionicons name="person" size={24} color={CORAL} />
            </View>
            <View>
              <Text style={pr.cardLabel}>{recipientLabel}</Text>
              <Text style={pr.cardPhone}>{recipientDetail}</Text>
            </View>
          </View>
          <Text style={pr.cardAmount}>${amount || '10.10'}</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

const pr = StyleSheet.create({
  content: {alignItems: 'center', paddingVertical: 32},
  dotsWrap: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CORAL,
  },
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 8},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, textAlign: 'center', marginBottom: 32},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F3F7',
  },
  cardLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  cardLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2},
  cardPhone: {fontSize: 13, fontFamily: SANS, color: GRAY},
  cardAmount: {fontSize: 16, fontWeight: '800', fontFamily: BOLD, color: CORAL},
});

// ─────────────────────────────────────────────
// Success Sheet
// ─────────────────────────────────────────────
export function SendSuccessSheet({
  visible,
  onClose,
  onDone,
  onViewTransaction,
  recipientLabel,
  recipientDetail,
  amount,
}: {
  visible: boolean;
  onClose: () => void;
  onDone?: () => void;
  onViewTransaction?: () => void;
  recipientLabel: string;
  recipientDetail: string;
  amount: string;
}) {
  const scale = React.useRef(new Animated.Value(0)).current;
  const bgScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.spring(bgScale, {
          toValue: 1,
          damping: 15,
          stiffness: 180,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scale, bgScale]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={ss.content}>
        <Animated.View style={[ss.bgCircle, {transform: [{scale: bgScale}]}]} />

        <Animated.View style={[ss.iconWrap, {transform: [{scale}]}]}>
          <Ionicons name="checkmark-circle" size={64} color={GREEN} />
        </Animated.View>

        <Text style={ss.title}>Send Money Successful</Text>
        <Text style={ss.sub}>Your send money was completed successfully.</Text>

        <View style={ss.card}>
          <View style={ss.cardLeft}>
            <View style={ss.cardIcon}>
              <Ionicons name="person" size={20} color={CORAL} />
            </View>
            <View>
              <Text style={ss.cardLabel}>Sent to</Text>
              <Text style={ss.cardPhone}>{recipientDetail}</Text>
            </View>
          </View>
          <Text style={ss.cardAmount}>${amount || '10.10'}</Text>
        </View>

        <Pressable onPress={onDone || onClose} style={ss.btn}>
          <Text style={ss.btnText}>Done</Text>
        </Pressable>

        <Pressable onPress={onViewTransaction || onClose} style={ss.viewTxn}>
          <Text style={ss.viewTxnText}>View transaction</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const ss = StyleSheet.create({
  content: {alignItems: 'center', paddingVertical: 24, position: 'relative'},
  bgCircle: {
    position: 'absolute',
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    opacity: 0.5,
  },
  iconWrap: {marginBottom: 16, zIndex: 1},
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 8},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, textAlign: 'center', marginBottom: 32},
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  cardLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2},
  cardPhone: {fontSize: 13, fontFamily: SANS, color: GRAY},
  cardAmount: {fontSize: 16, fontWeight: '800', fontFamily: BOLD, color: CORAL},
  btn: {
    width: '100%',
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  viewTxn: {paddingVertical: 12},
  viewTxnText: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: CORAL},
});

// ─────────────────────────────────────────────
// Save Favorite Sheet
// ─────────────────────────────────────────────
export function SaveFavoriteSheet({
  visible,
  onClose,
  recipientLabel,
  recipientDetail,
  amount,
  onReset,
  iconName = 'storefront',
}: {
  visible: boolean;
  onClose: () => void;
  recipientLabel: string;
  recipientDetail: string;
  amount: string;
  onReset?: () => void;
  iconName?: string;
}) {
  const [favoriteName, setFavoriteName] = React.useState('');
  const sendReset = useSendFlowStore((state) => state.reset);
  const reset = onReset || sendReset;

  const handleSave = () => {
    reset();
    onClose();
  };

  const handleSkip = () => {
    reset();
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={sf.content}>
        <Text style={sf.title}>Save as favorite ?</Text>
        <Text style={sf.sub}>Save these details to make future payments faster.</Text>

        <View style={sf.card}>
          <View style={sf.cardIcon}>
            <Ionicons name={iconName as any} size={28} color={CORAL} />
          </View>
          <View style={sf.cardInfo}>
            <Text style={sf.cardLabel}>{recipientLabel}</Text>
            <Text style={sf.cardPhone}>{recipientDetail}</Text>
          </View>
        </View>

        <Text style={sf.label}>Nickname <Text style={sf.labelOpt}>· Optional</Text></Text>
        <View style={sf.inputRow}>
          <Ionicons name="pricetag-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={sf.input}
            value={favoriteName}
            onChangeText={setFavoriteName}
            placeholder="Agent Coin Bandal"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <Pressable onPress={handleSave} style={sf.btn}>
          <Text style={sf.btnText}>Save</Text>
        </Pressable>

        <Pressable onPress={handleSkip} style={sf.skipBtn}>
          <Text style={sf.skipText}>Not now</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const sf = StyleSheet.create({
  content: {paddingVertical: 16},
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 8, textAlign: 'left'},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24, textAlign: 'left'},
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2},
  cardPhone: {fontSize: 13, fontFamily: SANS, color: GRAY},
  label: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  labelOpt: {
    fontWeight: '400',
    fontFamily: SANS,
    color: GRAY,
  },
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
    width: '100%',
    marginBottom: 24,
  },
  input: {flex: 1, fontSize: 15, fontFamily: SANS, color: DARK, padding: 0},
  btn: {
    width: '100%',
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  skipBtn: {paddingVertical: 12, alignItems: 'center'},
  skipText: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: CORAL},
});

// ─────────────────────────────────────────────
// View Transaction Sheet
// ─────────────────────────────────────────────
export function ViewTransactionSheet({
  visible,
  onClose,
  amount,
  fee,
  recipientName,
  recipientPhone,
}: {
  visible: boolean;
  onClose: () => void;
  amount: string;
  fee: string;
  recipientName: string;
  recipientPhone: string;
}) {
  const total = (Number(amount) + Number(fee)).toFixed(2);
  const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <BottomSheet visible={visible} onClose={onClose} scrollable>
      <View style={vt.content}>
        <View style={vt.iconCircle}>
          <Ionicons name="wallet-outline" size={40} color={CORAL} />
        </View>

        <Text style={vt.title}>Send Money</Text>
        <Text style={vt.amount}>-{total} USD</Text>
        <Text style={vt.date}>March 21 2026 · 8:32 AM</Text>

        <View style={vt.card}>
          <View style={vt.row}>
            <Text style={vt.label}>Amount</Text>
            <Text style={vt.value}>${Number(amount).toFixed(2)}</Text>
          </View>
          <View style={vt.divider} />
          <View style={vt.row}>
            <Text style={vt.label}>Fee</Text>
            <Text style={vt.value}>${Number(fee).toFixed(2)}</Text>
          </View>
          <View style={vt.divider} />
          <View style={vt.row}>
            <Text style={vt.label}>Total</Text>
            <Text style={vt.totalValue}>${total}</Text>
          </View>
        </View>

        <View style={vt.card}>
          <View style={vt.row}>
            <Text style={vt.label}>Name</Text>
            <Text style={vt.value}>{recipientName}</Text>
          </View>
          <View style={vt.divider} />
          <View style={vt.row}>
            <Text style={vt.label}>Phone Number</Text>
            <Text style={vt.value}>{recipientPhone}</Text>
          </View>
          <View style={vt.divider} />
          <View style={vt.row}>
            <Text style={vt.label}>Transaction ID</Text>
            <Text style={vt.value}>{transactionId}</Text>
          </View>
        </View>

        <Pressable onPress={onClose} style={vt.btn}>
          <Text style={vt.btnText}>Download Receipt</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const vt = StyleSheet.create({
  content: {alignItems: 'center', paddingTop: 16, paddingBottom: 40},
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: '#4B5563', marginBottom: 8},
  amount: {fontSize: 28, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 8},
  date: {fontSize: 13, fontFamily: SANS, color: GRAY, marginBottom: 24},
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {fontSize: 14, fontFamily: SANS, color: GRAY},
  value: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: DARK},
  totalValue: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: CORAL},
  divider: {height: 1, backgroundColor: '#F3F4F6', marginVertical: 12},
  btn: {
    width: '100%',
    backgroundColor: '#FFF5F2',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingBottom: 8,
  },
  btnText: {color: CORAL, fontSize: 15, fontWeight: '700', fontFamily: BOLD},
});
