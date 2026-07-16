import * as React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GRAY = '#8A94A6';

export function BottomSheet({
  visible,
  onClose,
  onBack,
  children,
  closable = true,
  fullHeight = false,
  scrollable = false,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  children: React.ReactNode;
  closable?: boolean;
  fullHeight?: boolean;
  scrollable?: boolean;
}) {
  const slideAnim = React.useRef(new Animated.Value(600)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 260,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdropAnim, slideAnim, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={closable ? onClose : undefined}>
      {closable && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, {opacity: backdropAnim}]} />
        </TouchableWithoutFeedback>
      )}
      {!closable && <Animated.View style={[styles.backdrop, {opacity: backdropAnim}]} />}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{translateY: slideAnim}],
          },
          fullHeight && styles.sheetFull,
          scrollable && styles.sheetScrollable,
        ]}>
        {fullHeight ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}>
            <View style={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 22), paddingTop: onBack ? 56 : 16}]}>
              {onBack && (
                <Pressable onPress={onBack} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color={GRAY} />
                </Pressable>
              )}
              {closable && (
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color={GRAY} />
                </Pressable>
              )}
              <View style={styles.handle} />
              {children}
            </View>
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}>
            <ScrollView
              contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(insets.bottom, 22), paddingTop: onBack ? 56 : 16}]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {onBack && (
                <Pressable onPress={onBack} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color={GRAY} />
                </Pressable>
              )}
              {closable && (
                <Pressable onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color={GRAY} />
                </Pressable>
              )}
              <View style={styles.handle} />
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26,37,53,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  sheetFull: {
    height: '100%',
    maxHeight: '100%',
  },
  sheetScrollable: {
    height: '90%',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexGrow: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
