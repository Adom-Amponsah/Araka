import * as React from 'react';
import {
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  launchImageLibrary,
  launchCamera,
  type Asset,
} from 'react-native-image-picker';
import {getSystemFont} from '@styles/typography';

const CORAL = '#D96B45';

interface OptionRowProps {
  icon: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}

function OptionRow({icon, title, subtitle, selected, onPress}: OptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.optionRow,
        pressed && styles.optionRowPressed,
      ]}>
      <View style={styles.optionIconWrap}>
        <Ionicons name={icon as any} size={24} color={CORAL} />
      </View>
      <View style={styles.optionTextWrap}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <Ionicons name="checkmark" size={14} color="#FFF" />}
      </View>
    </Pressable>
  );
}

export function IdUploadScreen() {
  const insets = useSafeAreaInsets();
  const completeIdUpload = useAppStore((state) => state.completeIdUpload);
  const backToProfileSetup = useAppStore((state) => state.backToProfileSetup);
  const updateSignupData = useAppStore((state) => state.updateSignupData);
  const savedUri = useAppStore((state) => state.signupData?.idImageUri);
  const savedSource = useAppStore(
    (state) => state.signupData?.idImageSource,
  );
  const [imageUri, setImageUri] = React.useState<string | null>(
    savedUri ?? null,
  );
  const [source, setSource] = React.useState<'library' | 'camera' | null>(
    savedSource ?? (savedUri ? 'library' : null),
  );

  const handleLibrary = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
      });
      if (result.errorMessage) {
        Alert.alert('Error', result.errorMessage);
        return;
      }
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setImageUri(uri);
          setSource('library');
          updateSignupData({idImageUri: uri, idImageSource: 'library'});
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open photo library.');
    }
  };
  const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
};

  const handleCamera = async () => {
  const permission = await requestCameraPermission();

  if (!permission) {
    Alert.alert(
      'Permission Required',
      'Camera permission is needed to take a selfie.',
    );
    return;
  }

  try {
    const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: false,
      });
      if (result.errorMessage) {
        Alert.alert('Error', result.errorMessage);
        return;
      }
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setImageUri(uri);
          setSource('camera');
          updateSignupData({idImageUri: uri, idImageSource: 'camera'});
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not open camera.');
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 8,
            paddingBottom: Math.max(insets.bottom, 20) + 90,
          },
        ]}
        bounces={false}>
        <Pressable onPress={backToProfileSetup} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>

        <Text style={styles.title}>Upload a photo of your ID</Text>
        <Text style={styles.subtitle}>
          To verify your identity, please upload a valid photo of your ID.
        </Text>

        <View style={styles.previewBox}>
          {imageUri ? (
            <Image
              source={{uri: imageUri}}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <>
              <Ionicons name="image-outline" size={56} color="#CBD5E1" />
              <Text style={styles.previewText}>ID preview</Text>
            </>
          )}
        </View>

        <View style={styles.options}>
          <OptionRow
            icon="images-outline"
            title="Choose from your library"
            subtitle={source === 'library' ? 'Library selected' : 'Please grant permissions'}
            selected={source === 'library'}
            onPress={handleLibrary}
          />
          <OptionRow
            icon="camera-outline"
            title="Camera"
            subtitle={source === 'camera' ? 'Camera selected' : 'Please grant camera permission'}
            selected={source === 'camera'}
            onPress={handleCamera}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.ctaWrap,
          {paddingBottom: Math.max(insets.bottom, 16) + 8},
        ]}>
        <Pressable
          onPress={completeIdUpload}
          disabled={!imageUri}
          style={({pressed}) => [
            styles.ctaButton,
            !imageUri && styles.ctaButtonDisabled,
            pressed && !!imageUri && styles.ctaButtonPressed,
          ]}>
          <Text style={styles.ctaText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#FFFFFF'},
  content: {flexGrow: 1, paddingHorizontal: 24},
  backButton: {marginBottom: 16, paddingVertical: 4, alignSelf: 'flex-start'},
  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '700',
    fontFamily: getSystemFont('medium'),
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    fontFamily: getSystemFont(),
    lineHeight: 22,
    marginBottom: 28,
  },
  previewBox: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewText: {
    marginTop: 12,
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: getSystemFont(),
  },
  options: {gap: 12},
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  optionRowPressed: {opacity: 0.9},
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionTextWrap: {flex: 1},
  optionTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: getSystemFont('medium'),
    marginBottom: 3,
  },
  optionSubtitle: {
    color: '#6B7280',
    fontSize: 13,
    fontFamily: getSystemFont(),
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: CORAL,
    borderColor: CORAL,
  },
  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  ctaButton: {
    backgroundColor: CORAL,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  ctaButtonPressed: {
    opacity: 0.95,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: getSystemFont(),
    letterSpacing: 0.5,
  },
});
