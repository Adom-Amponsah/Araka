import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CameraView, BarcodeScanner} from '@pushpendersingh/react-native-scanner';
import {getSystemFont} from '@styles/typography';
import {
  useQrPaymentStore,
  selectQrPaymentFee,
  selectQrPaymentTotal,
} from '@features/pay/store/qrPaymentStore';

const {width, height} = Dimensions.get('window');
const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#6B7280';
const LIGHT = '#F4F6FA';
const SANS = getSystemFont();

export function QrScanScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const step = useQrPaymentStore((s) => s.step);
  const setStep = useQrPaymentStore((s) => s.setStep);
  const setRecipient = useQrPaymentStore((s) => s.setRecipient);
  const [hasPermission, setHasPermission] = React.useState(Platform.OS === 'ios');
  const [flashEnabled, setFlashEnabled] = React.useState(false);
  const scanningRef = React.useRef(false);

  React.useEffect(() => {
    const request = async () => {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Araka needs camera access to scan QR codes.',
            buttonPositive: 'Allow',
          },
        );
        setHasPermission(result === PermissionsAndroid.RESULTS.GRANTED);
      }
    };
    request();
  }, []);

  React.useEffect(() => {
    if (!hasPermission || step !== 'scan' || scanningRef.current) return;

    scanningRef.current = true;
    BarcodeScanner.startScanning((barcodes) => {
      if (step !== 'scan' || !barcodes.length) return;
      BarcodeScanner.stopScanning();
      scanningRef.current = false;
      const data = barcodes[0]?.data || 'Mia Smith';
      setRecipient({id: 'qr-scanned', name: data});
      setStep('amount');
    });

    return () => {
      BarcodeScanner.stopScanning();
      scanningRef.current = false;
    };
  }, [hasPermission, step, setRecipient, setStep]);

  const toggleFlash = async () => {
    try {
      if (flashEnabled) {
        await BarcodeScanner.disableFlashlight();
        setFlashEnabled(false);
      } else {
        await BarcodeScanner.enableFlashlight();
        setFlashEnabled(true);
      }
    } catch {
      // flashlight not available on all devices
    }
  };

  const handlePasteLink = () => {
    BarcodeScanner.stopScanning();
    scanningRef.current = false;
    setRecipient({id: 'mia-smith', name: 'Mia Smith'});
    setStep('amount');
  };

  return (
    <View style={styles.root}>
      {hasPermission && (step === 'scan') ? (
        <CameraView style={StyleSheet.absoluteFill} />
      ) : (
        <View style={styles.permissionWrap}>
          {hasPermission ? (
            <View style={styles.darkOverlay} />
          ) : (
            <>
              <Text style={styles.permissionText}>
                Camera permission is required to scan QR codes.
              </Text>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </>
          )}
        </View>
      )}

      <View style={[styles.overlay, {paddingTop: insets.top}]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="information-circle-outline" size={26} color="#FFFFFF" />
            </Pressable>
            <Pressable onPress={toggleFlash} style={styles.iconBtn}>
              <Ionicons
                name={flashEnabled ? 'flash' : 'flash-outline'}
                size={26}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Scan QR Code</Text>
          <Text style={styles.subtitle}>Align the QR Code within the frame.</Text>
        </View>

        <View style={styles.frameWrap}>
          <View style={styles.frameOuter}>
            <View style={styles.frameInner}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>
        </View>

        <Pressable onPress={handlePasteLink} style={styles.pasteBtn}>
          <Text style={styles.pasteText}>Paste Payment Link</Text>
        </Pressable>
      </View>

      <AmountSheet visible={step === 'amount'} />
      <ConfirmSheet visible={step === 'confirm'} />
    </View>
  );
}

function AmountSheet({visible}: {visible: boolean}) {
  const insets = useSafeAreaInsets();
  const slide = React.useRef(new Animated.Value(height)).current;
  const amount = useQrPaymentStore((s) => s.amount);
  const currency = useQrPaymentStore((s) => s.currency);
  const recipient = useQrPaymentStore((s) => s.recipient);
  const setAmount = useQrPaymentStore((s) => s.setAmount);
  const confirm = useQrPaymentStore((s) => s.confirm);
  const setStep = useQrPaymentStore((s) => s.setStep);

  React.useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [visible, slide]);

  const numericAmount = parseFloat(amount) || 0;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent navigationBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.sheet,
            {paddingBottom: Math.max(insets.bottom, 16) + 16, transform: [{translateY: slide}]},
          ]}>
          <View style={styles.dragHandle} />

          <View style={styles.sheetHeader}>
            <Pressable onPress={() => setStep('scan')} style={{padding: 8}}>
              <Ionicons name="close" size={22} color={GRAY} />
            </Pressable>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {recipient?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
          </View>

          <Text style={styles.sheetTitle}>Send money to {recipient?.name}</Text>
          <Text style={styles.sheetSub}>Only send money to people you trust.</Text>

          <View style={styles.amountRow}>
            <View style={styles.currencyBadge}>
              <Ionicons name="cash-outline" size={18} color={CORAL} />
            </View>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="Enter amount"
              placeholderTextColor="#9CA3AF"
              style={styles.amountInput}
            />
            <View style={styles.currencyPill}>
              <Text style={styles.currencyText}>{currency}</Text>
              <Ionicons name="chevron-down" size={14} color={DARK} />
            </View>
          </View>

          <Pressable
            onPress={confirm}
            disabled={numericAmount <= 0}
            style={[styles.cta, numericAmount <= 0 && styles.ctaDisabled]}>
            <Text style={styles.ctaText}>Continue</Text>
          </Pressable>

          <Pressable onPress={() => setStep('scan')} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ConfirmSheet({visible}: {visible: boolean}) {
  const insets = useSafeAreaInsets();
  const slide = React.useRef(new Animated.Value(height)).current;
  const navigation = useNavigation<any>();
  const amount = useQrPaymentStore((s) => s.amount);
  const recipient = useQrPaymentStore((s) => s.recipient);
  const fee = useQrPaymentStore(selectQrPaymentFee);
  const total = useQrPaymentStore(selectQrPaymentTotal);
  const reset = useQrPaymentStore((s) => s.reset);
  const setStep = useQrPaymentStore((s) => s.setStep);
  const submitPayment = useQrPaymentStore((s) => s.submitPayment);
  const isSubmitting = useQrPaymentStore((s) => s.isSubmitting);

  React.useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [visible, slide]);

  const handleConfirm = () => {
    submitPayment();
    setTimeout(() => {
      reset();
      navigation.navigate('Home');
    }, 800);
  };

  const amountNum = parseFloat(amount) || 0;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent navigationBarTranslucent>
      <View style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 16,
              minHeight: height * 0.85,
              transform: [{translateY: slide}],
            },
          ]}>
          <View style={styles.dragHandle} />

          <View style={{flex: 1, justifyContent: 'flex-start'}}>
            <View style={styles.sheetHeader}>
              <Text style={styles.confirmTitle}>Confirm Payment</Text>
              <Pressable onPress={() => setStep('amount')} style={{padding: 8}}>
                <Ionicons name="close" size={22} color={GRAY} />
              </Pressable>
            </View>

            <Text style={styles.confirmSub}>
              Please verify the information before confirming.
            </Text>

            <View style={styles.detailCard}>
              <DetailRow label="To" value={recipient?.name ?? '-'} />
              <DetailRow label="Amount" value={`$${amountNum.toFixed(2)}`} />
              <DetailRow label="Fee" value={`$${fee.toFixed(2)}`} />
              <View style={styles.divider} />
              <DetailRow label="Total" value={`$${total.toFixed(2)}`} isTotal />
            </View>

            <Text style={styles.feeNote}>
              ARAKA applies a fixed 1% fee to all transfers.
            </Text>
          </View>

          <Pressable
            onPress={handleConfirm}
            disabled={isSubmitting}
            style={[styles.cta, isSubmitting && styles.ctaDisabled]}>
            <Text style={styles.ctaText}>
              {isSubmitting ? 'Processing...' : 'Confirm Payment'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

function DetailRow({
  label,
  value,
  isTotal,
}: {
  label: string;
  value: string;
  isTotal?: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, isTotal && styles.detailTotalLabel]}>{label}</Text>
      <Text style={[styles.detailValue, isTotal && styles.detailTotalValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26,37,53,0.35)',
  },
  permissionWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: SANS,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
  },
  titleWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: SANS,
  },
  frameWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 120,
  },
  frameOuter: {
    width: width - 80,
    height: width - 80,
    maxHeight: height * 0.45,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frameInner: {
    width: '80%',
    height: '80%',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  pasteBtn: {
    backgroundColor: CORAL,
    marginHorizontal: 24,
    marginBottom: 80,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  pasteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: DARK,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  sheetTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    textAlign: 'center',
    marginBottom: 6,
  },
  sheetSub: {
    color: GRAY,
    fontSize: 14,
    fontFamily: SANS,
    textAlign: 'center',
    marginBottom: 28,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
    gap: 10,
  },
  currencyBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountInput: {
    flex: 1,
    color: DARK,
    fontSize: 16,
    fontFamily: getSystemFont('medium'),
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  currencyText: {
    color: DARK,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: getSystemFont('medium'),
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  ctaDisabled: {
    backgroundColor: '#E5E7EB',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    color: CORAL,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: getSystemFont('medium'),
  },
  confirmTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  confirmSub: {
    color: GRAY,
    fontSize: 14,
    fontFamily: SANS,
    marginBottom: 24,
  },
  detailCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    color: GRAY,
    fontSize: 14,
    fontFamily: SANS,
  },
  detailValue: {
    color: DARK,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: getSystemFont('medium'),
  },
  detailTotalLabel: {
    color: DARK,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  detailTotalValue: {
    color: CORAL,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  feeNote: {
    color: GRAY,
    fontSize: 12,
    fontFamily: SANS,
    marginBottom: 24,
  },
});
