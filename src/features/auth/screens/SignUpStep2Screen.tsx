import * as React from 'react';
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import {useForm, Controller} from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker, {Country} from 'react-native-country-picker-modal';

interface SignUpStep2FormData {
  dateOfBirth: string;
  gender: string;
  address: string;
  country: string;
  city: string;
}

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK  = '#1A2535';
const SERIF = getSystemFont('medium');
const SANS = getSystemFont();
const CARD_RADIUS = 36;
const {height} = Dimensions.get('window');

const countryCodeToFlagEmoji = (code: string) =>
  code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );

// ─────────────────────────────────────────────
// Reusable FloatingInput — same as Login/SignUp
// ─────────────────────────────────────────────
function FloatingInput({
  label, icon, value, onChange,
  keyboardType, autoCapitalize, error,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
}) {
  const [focused, setFocused] = React.useState(false);
  const labelAnim = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  const glowAnim  = React.useRef(new Animated.Value(0)).current;
  const hasContent = !!value;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(labelAnim, {
        toValue: focused || hasContent ? 1 : 0,
        duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: focused ? 1 : 0,
        duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: false,
      }),
    ]).start();
  }, [focused, glowAnim, hasContent, labelAnim]);

  const labelTop   = labelAnim.interpolate({inputRange:[0,1], outputRange:[18,6]});
  const labelSize  = labelAnim.interpolate({inputRange:[0,1], outputRange:[15,11]});
  const labelColor = labelAnim.interpolate({
    inputRange:[0,1], outputRange:['#9CA3AF', focused ? CORAL : '#9CA3AF'],
  });
  const borderColor = glowAnim.interpolate({
    inputRange:[0,1], outputRange:['#E8EDF2', CORAL],
  });

  return (
    <View style={fl.container}>
      <Animated.View style={[fl.field, {borderColor}]}>
        <View style={fl.iconWrap}>
          <Ionicons name={icon as any} size={18} color={focused ? CORAL : '#C4CDD8'}/>
        </View>
        <Animated.Text style={[fl.label, {top:labelTop, fontSize:labelSize, color:labelColor}]}>
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'sentences'}
          style={fl.input}
          selectionColor={CORAL}
        />
      </Animated.View>
      {error && (
        <View style={fl.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444"/>
          <Text style={fl.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const fl = StyleSheet.create({
  container: {marginBottom: 16},
  field: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1.5, borderRadius: 14,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#B8C4D0',
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 1,
  },
  iconWrap: {width:40, alignItems:'center', justifyContent:'center'},
  label: {
    position:'absolute', left:56, top:6,
    fontFamily: SERIF, letterSpacing:0.2,
  },
  input: {
    flex:1, fontSize:15, color:DARK,
    paddingTop:20, fontFamily:SANS, letterSpacing:0.3,
  },
  errorRow: {flexDirection:'row', alignItems:'center', marginTop:5, marginLeft:12, gap:4},
  errorText: {color:'#EF4444', fontSize:12, fontFamily:SANS},
});

// ─────────────────────────────────────────────
// Gender selector — 3 pressable chips, not a text field
// ─────────────────────────────────────────────
function GenderSelector({
  value, onChange, error,
}: {value:string; onChange:(v:string)=>void; error?:string}) {
  const OPTIONS = [
    {label: 'Male', icon: 'male'},
    {label: 'Female', icon: 'female'},
    {label: 'Other', icon: 'male-female'},
  ];

  return (
    <View style={gs.container}>
      <Text style={gs.fieldLabel}>Gender</Text>
      <View style={gs.row}>
        {OPTIONS.map(opt => {
          const isActive = value === opt.label;
          return (
            <Pressable
              key={opt.label}
              onPress={() => onChange(opt.label)}
              style={[gs.chip, isActive && gs.chipActive]}>
              <Ionicons 
                name={opt.icon as any} 
                size={18} 
                color={isActive ? '#FFFFFF' : '#9CA3AF'} 
              />
              <Text style={[gs.chipText, isActive && gs.chipTextActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error && (
        <View style={gs.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444"/>
          <Text style={gs.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const gs = StyleSheet.create({
  container: {marginBottom:16},
  fieldLabel: {
    color:'#9CA3AF', fontSize:11, fontFamily:SERIF,
    letterSpacing:0.2, marginBottom:8, marginLeft:2,
  },
  row: {flexDirection:'row', gap:10},
  chip: {
    flex:1, paddingVertical:14,
    borderRadius:14, borderWidth:1.5,
    borderColor:'#E8EDF2',
    backgroundColor:'#F7F9FC',
    alignItems:'center', justifyContent:'center',
    flexDirection:'row', gap:6,
    shadowColor:'#B8C4D0',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.10, shadowRadius:4, elevation:1,
  },
  chipActive: {
    backgroundColor:DARK,
    borderColor:DARK,
    shadowColor:DARK,
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.20, shadowRadius:10, elevation:5,
  },
  chipText:       {color:'#9CA3AF', fontSize:14, fontWeight:'600', fontFamily:getSystemFont('medium')},
  chipTextActive: {color:'#FFFFFF'},
  errorRow: {flexDirection:'row', alignItems:'center', marginTop:5, marginLeft:2, gap:4},
  errorText:{color:'#EF4444', fontSize:12, fontFamily:SANS},
});

// ─────────────────────────────────────────────
// Step dots — same as SignUp step 1
// ─────────────────────────────────────────────
function StepDots({active}: {active: number}) {
  return (
    <View style={sd.row}>
      {[0,1].map(i => (
        <View
          key={i}
          style={[
            sd.dot,
            i === active && sd.dotActive,
            i < active   && sd.dotDone,
          ]}
        />
      ))}
    </View>
  );
}
const sd = StyleSheet.create({
  row:      {flexDirection:'row', gap:6, alignItems:'center'},
  dot:      {width:7, height:7, borderRadius:4, backgroundColor:'rgba(255,255,255,0.2)'},
  dotActive:{width:22, backgroundColor:CORAL},
  dotDone:  {backgroundColor:'rgba(242,118,73,0.45)'},
});

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export function SignUpStep2Screen() {
  const startSignup = useAppStore((state) => state.startSignup);
  const startLogin = useAppStore((state) => state.startLogin);
  const insets    = useSafeAreaInsets();

  const {control, handleSubmit, formState} = useForm<SignUpStep2FormData>({mode:'onChange'});
  const {errors} = formState;

  // Date picker state
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date(2000, 0, 1));

  // Country picker state
  const [showCountryPicker, setShowCountryPicker] = React.useState(false);
  const [countryCode, setCountryCode] = React.useState<string | undefined>();
  const [countryFlag, setCountryFlag] = React.useState<string>('');

  // Entrance — same 3-beat pattern as Login/SignUp
  const heroFade  = React.useRef(new Animated.Value(0)).current;
  const cardSlide = React.useRef(new Animated.Value(60)).current;
  const cardFade  = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(heroFade, {
        toValue:1, duration:500,
        easing:Easing.out(Easing.cubic), useNativeDriver:true,
      }),
      Animated.parallel([
        Animated.timing(cardSlide, {
          toValue:0, duration:440,
          easing:Easing.out(Easing.cubic), useNativeDriver:true,
        }),
        Animated.timing(cardFade, {
          toValue:1, duration:440, useNativeDriver:true,
        }),
      ]),
    ]).start();
  }, [cardFade, cardSlide, heroFade]);

  const onSubmit = (data: SignUpStep2FormData) => {
    console.log('Profile data:', data);
    // TODO: Call API to complete profile, then return through the auth store.
    startLogin();
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={{flexGrow:1, backgroundColor:SLATE}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
        automaticallyAdjustKeyboardInsets={true}>

        {/* ════════════════════════════
            SLATE HERO
        ════════════════════════════ */}
        <View style={[s.hero, {paddingTop: Math.max(insets.top, 20) + 8}]}>
          {/* Decor rings — bottom-left, same as SignUp step 1 */}
          <View style={s.ringOuter}/>
          <View style={s.ringInner}/>

          <Animated.View style={{opacity:heroFade}}>
            {/* Back button */}
            <Pressable onPress={() => startSignup()} style={s.backBtn}>
              <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.7)"/>
              <Text style={s.backText}>Back</Text>
            </Pressable>

            {/* Step indicator */}
            <View style={s.stepRow}>
              <StepDots active={1}/>
              <Text style={s.stepLabel}>Step 2 of 2</Text>
            </View>

            <Text style={s.headline}>Your Profile.</Text>
            <Text style={s.subline}>A few more details and you're in</Text>
          </Animated.View>
        </View>

        {/* Curve shadow layer */}
        <Animated.View style={[s.curveShadow, {opacity:cardFade}]}/>

        {/* ════════════════════════════
            WHITE CARD
        ════════════════════════════ */}
        <Animated.View
          style={[
            s.card,
            {transform:[{translateY:cardSlide}], opacity:cardFade},
          ]}>

          {/* Coral rule */}
          <View style={s.cardRule}/>
          <Text style={s.cardTitle}>Personal details</Text>

          {/* Date of Birth */}
          <Controller
            control={control}
            name="dateOfBirth"
            rules={{required:'Date of birth is required'}}
            render={({field:{onChange,value}}) => (
              <View style={{marginBottom:16}}>
                <Pressable 
                  onPress={() => setShowDatePicker(true)}
                  style={picker.button}>
                  <View style={picker.iconWrap}>
                    <Ionicons name="calendar-outline" size={18} color={CORAL} />
                  </View>
                  <Text style={[picker.text, !value && picker.placeholder]}>
                    {value || 'Select Date of Birth'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#C4CDD8" />
                </Pressable>
                {errors.dateOfBirth && (
                  <View style={picker.errorRow}>
                    <Ionicons name="alert-circle-outline" size={13} color="#EF4444"/>
                    <Text style={picker.errorText}>{errors.dateOfBirth.message}</Text>
                  </View>
                )}
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={(event, date) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (date) {
                        setSelectedDate(date);
                        const formatted = date.toLocaleDateString('en-GB');
                        onChange(formatted);
                      }
                    }}
                  />
                )}
              </View>
            )}
          />

          {/* Gender — chips, not a text field */}
          <Controller
            control={control}
            name="gender"
            rules={{required:'Please select your gender'}}
            render={({field:{onChange,value}}) => (
              <GenderSelector
                value={value || ''}
                onChange={onChange}
                error={errors.gender?.message}
              />
            )}
          />

          {/* Address */}
          <Controller
            control={control}
            name="address"
            rules={{
              required:'Street address is required',
              minLength:{value:3, message:'Address must be at least 3 characters'},
            }}
            render={({field:{onChange,value}}) => (
              <FloatingInput
                label="Street address"
                icon="location-outline"
                value={value || ''}
                onChange={onChange}
                error={errors.address?.message}
              />
            )}
          />

          {/* Country + City — side by side */}
          <View style={s.row}>
            <View style={s.half}>
              <Controller
                control={control}
                name="country"
                rules={{required:'Required'}}
                render={({field:{onChange,value}}) => (
                  <View style={{marginBottom:16}}>
                    <Pressable 
                      onPress={() => setShowCountryPicker(true)}
                      style={picker.button}>
                      <View style={picker.iconWrap}>
                        {countryFlag ? (
                          <Text style={{fontSize: 20}}>{countryFlag}</Text>
                        ) : (
                          <Ionicons name="globe-outline" size={18} color={CORAL} />
                        )}
                      </View>
                      <Text style={[picker.text, !value && picker.placeholder]} numberOfLines={1}>
                        {value || 'Country'}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#C4CDD8" />
                    </Pressable>
                    {errors.country && (
                      <View style={picker.errorRow}>
                        <Ionicons name="alert-circle-outline" size={13} color="#EF4444"/>
                        <Text style={picker.errorText}>{errors.country.message}</Text>
                      </View>
                    )}
                    {showCountryPicker && (
                      <CountryPicker
                        countryCode={countryCode as any}
                        visible={showCountryPicker}
                        onClose={() => setShowCountryPicker(false)}
                        onSelect={(country: Country) => {
                          onChange(country.name);
                          setCountryCode(country.cca2);
                          setCountryFlag(countryCodeToFlagEmoji(country.cca2));
                          setShowCountryPicker(false);
                        }}
                        withFilter
                        withEmoji
                        withFlag
                        withCountryNameButton
                        withAlphaFilter
                        withCloseButton={false}
                        containerButtonStyle={{display: 'none'}}
                      />
                    )}
                  </View>
                )}
              />
            </View>
            <View style={s.half}>
              <Controller
                control={control}
                name="city"
                rules={{
                  required:'City is required',
                  minLength:{value:2, message:'City must be at least 2 characters'},
                }}
                render={({field:{onChange,value}}) => (
                  <FloatingInput
                    label="City"
                    icon="business-outline"
                    value={value || ''}
                    onChange={onChange}
                    error={errors.city?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* CTA */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!formState.isValid || Object.keys(formState.dirtyFields).length === 0}
            style={({pressed}) => [
              s.ctaButton,
              pressed && s.ctaPressed,
              (!formState.isValid || Object.keys(formState.dirtyFields).length === 0) && s.ctaDisabled,
            ]}>
            <Text style={s.ctaText}>Complete Sign Up</Text>
            {/* <View style={s.ctaArrow}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF"/>
            </View> */}
          </Pressable>

          {/* Trust note */}
          <View style={s.trustRow}>
            <Ionicons name="lock-closed-outline" size={12} color="#C4CDD8"/>
            <Text style={s.trustText}>Your data is encrypted and never shared</Text>
          </View>

          <View style={{height: Math.max(insets.bottom, 24)}}/>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─────────────────────────────────────────────
const s = StyleSheet.create({
  root:  {flex:1, backgroundColor:SLATE},
  scroll:{flex:1},

  // Hero
  hero: {
    backgroundColor:SLATE,
    paddingHorizontal:28, paddingBottom:56,
  },
  ringOuter:{
    position:'absolute', top:-28, right:-48,
    width:190, height:190, borderRadius:95,
    borderWidth:32, borderColor:'rgba(242,118,73,0.10)',
  },
  ringInner:{
    position:'absolute', top:22, right:12,
    width:96, height:96, borderRadius:48,
    borderWidth:1.5, borderColor:'rgba(242,118,73,0.22)',
  },

  backBtn:{
    flexDirection:'row', alignItems:'center',
    gap:6, marginBottom:24, alignSelf:'flex-start',
  },
  backText:{
    color:'rgba(255,255,255,0.6)', fontSize:14, fontFamily:SANS,
  },
  stepRow:{
    flexDirection:'row', alignItems:'center',
    gap:10, marginBottom:16,
  },
  stepLabel:{
    color:'rgba(255,255,255,0.35)', fontSize:11,
    letterSpacing:2, textTransform:'uppercase',
    fontFamily:getSystemFont('medium'), fontWeight:'600',
  },
  headline:{
    color:'#FFFFFF', fontSize:40, fontWeight:'700',
    fontFamily:SERIF, lineHeight:46,
    letterSpacing:-0.5, marginBottom:10,
  },
  subline:{
    color:'rgba(255,255,255,0.4)', fontSize:14,
    fontFamily:SANS, letterSpacing:0.3,
  },

  // Curve shadow
  curveShadow:{
    position:'absolute', bottom:0, left:0, right:0, height:100,
    borderTopLeftRadius:CARD_RADIUS, borderTopRightRadius:CARD_RADIUS,
    backgroundColor:'#FFFFFF',
    shadowColor:'#000000',
    shadowOffset:{width:0, height:-12},
    shadowOpacity:0.22, shadowRadius:24, elevation:20,
  },

  // White card
  card:{
    backgroundColor:'#FFFFFF',
    borderTopLeftRadius:CARD_RADIUS, borderTopRightRadius:CARD_RADIUS,
    paddingHorizontal:28, paddingTop:28,
    paddingBottom:200,
    marginTop:-CARD_RADIUS,
    minHeight:height,
    shadowColor:DARK,
    shadowOffset:{width:0, height:-8},
    shadowOpacity:0.18, shadowRadius:20, elevation:16,
  },
  cardRule:{
    width:40, height:3, backgroundColor:CORAL,
    borderRadius:2, alignSelf:'center',
    marginBottom:24, opacity:0.7,
  },
  cardTitle:{
    color:DARK, fontSize:24, fontWeight:'700',
    fontFamily:SERIF, letterSpacing:-0.3, marginBottom:24,
  },

  // Country + City side by side
  row:{flexDirection:'row', gap:10},
  half:{flex:1},

  // CTA
  ctaButton:{
    backgroundColor:CORAL,
    borderRadius:14,
    paddingVertical:18, paddingHorizontal:28,
    flexDirection:'row', alignItems:'center', justifyContent:'center',
    marginTop:8, marginBottom:16,
    shadowColor:CORAL,
    shadowOffset:{width:0, height:6},
    shadowOpacity:0.28, shadowRadius:14, elevation:8,
  },
  ctaPressed:{backgroundColor:'#D96640', shadowOpacity:0.10, elevation:2},
  ctaDisabled:{backgroundColor:'#C4CDD8', shadowOpacity:0.05, elevation:1},
  ctaText:{
    color:'#FFFFFF', fontSize:17, fontWeight:'700',
    fontFamily:SANS, letterSpacing:0.5,
    flex:1, textAlign:'center',
  },
  ctaArrow:{
    width:32, height:32, borderRadius:10,
    backgroundColor:'rgba(255,255,255,0.2)',
    justifyContent:'center', alignItems:'center',
  },

  // Trust note
  trustRow:{
    flexDirection:'row', alignItems:'center',
    justifyContent:'center', gap:5,
    marginBottom:8,
  },
  trustText:{
    color:'#C4CDD8', fontSize:11,
    fontFamily:SANS, letterSpacing:0.3,
  },
});

// ─────────────────────────────────────────────
// Picker button styles
// ─────────────────────────────────────────────
const picker = StyleSheet.create({
  button: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1.5,
    borderColor: '#E8EDF2',
    borderRadius: 14,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#B8C4D0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    fontFamily: SANS,
    letterSpacing: 0.3,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 12,
    gap: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: SANS,
  },
});

