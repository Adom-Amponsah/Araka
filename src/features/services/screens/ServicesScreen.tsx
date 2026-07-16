import * as React from 'react';

import {

  View,

  Text,

  ScrollView,

  Pressable,

  TextInput,

  StyleSheet,

  Animated,

  Easing,

  Dimensions,

  Modal,

  TouchableWithoutFeedback,

} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {getSystemFont} from '@styles/typography';

import {SERVICE_CATEGORIES, ServiceProviderConfig} from '../registry/serviceRegistry';

import {useServiceSessionStore} from '../store/serviceSessionStore';

import {useAirtimeTopupFlowStore} from '../store/airtimeTopupFlowStore';

import {useTransferFlowStore} from '../store/transferFlowStore';

import {VodacomAirtimeFlow} from '../flows/VodacomAirtimeFlow';



const {width} = Dimensions.get('window');



const CORAL = '#F27649';

const SLATE = '#3D4A5C';

const DARK  = '#1A2535';

const OFF   = '#F4F6FA';

const SERIF = getSystemFont('medium');

const SANS = getSystemFont();



// ─────────────────────────────────────────────

// DATA — categories → providers

// ─────────────────────────────────────────────

interface Provider {

  id: string;

  name: string;

  sub: string;

  icon: string;

  iconBg: string;

  iconColor: string;

  action: string;

}



interface Category {

  id: string;

  label: string;

  providers: Provider[];

}



const CATEGORIES: Category[] = [

  {

    id: 'electricity',

    label: 'Electricity',

    providers: [

      {id:'e1', name:'SNEL',    sub:'Buy prepaid electricity tokens',  icon:'flash-outline', iconBg:'#EAF2FF', iconColor:'#2563EB', action:'Buy'},

      {id:'e2', name:'Socodee', sub:'Recharge your electricity meter', icon:'bulb-outline',  iconBg:'#EDFBF4', iconColor:'#10B981', action:'Buy'},

    ],

  },

  {

    id: 'airtime',

    label: 'Airtime',

    providers: [

      {id:'a1', name:'Vodacom',  sub:'Mobile credit top-up', icon:'phone-portrait-outline', iconBg:'#FEE8DF', iconColor:'#E53E3E', action:'Top Up'},

      {id:'a2', name:'MTN',      sub:'All networks',          icon:'phone-portrait-outline', iconBg:'#FFF8E6', iconColor:'#F59E0B', action:'Top Up'},

      {id:'a3', name:'Airtel',   sub:'All amounts',           icon:'phone-portrait-outline', iconBg:'#FEE8DF', iconColor:'#C0392B', action:'Top Up'},

    ],

  },

  {

    id: 'internet',

    label: 'Internet',

    providers: [

      {id:'i1', name:'Liquid', sub:'High-speed internet', icon:'globe-outline', iconBg:'#EAF2FF', iconColor:'#2563EB', action:'Renew'},

    ],

  },

];



const FILTER_CHIPS = [

  {id: 'all', label: 'All Categories'},

  ...CATEGORIES.map(c => ({id: c.id, label: c.label})),

];



// ─────────────────────────────────────────────

// Provider Row

// ─────────────────────────────────────────────

function ProviderRow({

  provider,

  index,

  onPress,

}: {

  provider: Provider;

  index: number;

  onPress: () => void;

}) {

  const fadeIn = React.useRef(new Animated.Value(0)).current;

  const slideX = React.useRef(new Animated.Value(14)).current;

  const scale  = React.useRef(new Animated.Value(1)).current;



  React.useEffect(() => {

    fadeIn.setValue(0);

    slideX.setValue(14);

    setTimeout(() => {

      Animated.parallel([

        Animated.timing(fadeIn, {

          toValue: 1, duration: 260,

          easing: Easing.out(Easing.cubic),

          useNativeDriver: true,

        }),

        Animated.timing(slideX, {

          toValue: 0, duration: 260,

          easing: Easing.out(Easing.cubic),

          useNativeDriver: true,

        }),

      ]).start();

    }, index * 60);

  }, [provider.id]);



  const pressIn  = () => Animated.spring(scale, {toValue: 0.98, useNativeDriver: true, damping: 20, stiffness: 300}).start();

  const pressOut = () => Animated.spring(scale, {toValue: 1,    useNativeDriver: true, damping: 12, stiffness: 200}).start();



  return (

    <Animated.View

      style={[

        pr.wrap,

        {opacity: fadeIn, transform: [{translateX: slideX}, {scale}]},

      ]}>

      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={pr.row}>

        <View style={[pr.iconBadge, {backgroundColor: provider.iconBg}]}>

          <Ionicons name={provider.icon as any} size={20} color={provider.iconColor} />

        </View>



        <View style={pr.info}>

          <Text style={pr.name} numberOfLines={1}>{provider.name}</Text>

          <Text style={pr.sub}  numberOfLines={1}>{provider.sub}</Text>

        </View>



        <Ionicons name="chevron-forward" size={18} color="#C4CDD8" />

      </Pressable>

    </Animated.View>

  );

}



const pr = StyleSheet.create({

  wrap: {marginBottom: 10},

  row: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    padding: 14,

    gap: 14,

    borderWidth: 1,

    borderColor: '#EDF0F4',

  },

  iconBadge: {

    width: 44,

    height: 44,

    borderRadius: 12,

    alignItems: 'center',

    justifyContent: 'center',

  },

  info: {flex: 1, gap: 3},

  name: {

    color: DARK,

    fontSize: 15,

    fontWeight: '700',

    fontFamily: SERIF,

    letterSpacing: -0.2,

  },

  sub: {

    color: '#8A94A6',

    fontSize: 12,

    fontFamily: SANS,

  },

});



// ─────────────────────────────────────────────

// Filter Pill

// ─────────────────────────────────────────────

function FilterPill({

  label,

  isActive,

  onPress,

}: {

  label: string;

  isActive: boolean;

  onPress: () => void;

}) {

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const pressIn  = () => Animated.spring(scaleAnim, {toValue: 0.92, useNativeDriver: true, damping: 15, stiffness: 300}).start();

  const pressOut = () => Animated.spring(scaleAnim, {toValue: 1,    useNativeDriver: true, damping: 10, stiffness: 200}).start();



  return (

    <Animated.View style={{transform: [{scale: scaleAnim}]}}>

      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>

        <View style={[fp.pill, isActive && fp.pillActive]}>

          <Text style={[fp.label, isActive && fp.labelActive]}>{label}</Text>

        </View>

      </Pressable>

    </Animated.View>

  );

}



const fp = StyleSheet.create({

  pill: {

    paddingHorizontal: 16,

    paddingVertical: 9,

    borderRadius: 22,

    borderWidth: 1,

    borderColor: '#E8EDF2',

    backgroundColor: '#FFFFFF',

  },

  pillActive: {

    backgroundColor: DARK,

    borderColor: DARK,

  },

  label: {

    fontSize: 13,

    fontWeight: '600',

    fontFamily: SANS,

    color: SLATE,

    letterSpacing: 0.1,

  },

  labelActive: {

    color: '#FFFFFF',

  },

});



// ─────────────────────────────────────────────

// Search bar

// ─────────────────────────────────────────────

function SearchBar() {

  const [value, setValue] = React.useState('');

  const borderAnim = React.useRef(new Animated.Value(0)).current;



  const handleFocus = () => {

    Animated.timing(borderAnim, {toValue: 1, duration: 180, useNativeDriver: false}).start();

  };

  const handleBlur = () => {

    Animated.timing(borderAnim, {toValue: 0, duration: 180, useNativeDriver: false}).start();

  };



  const borderColor = borderAnim.interpolate({

    inputRange: [0, 1],

    outputRange: ['#E8EDF2', CORAL],

  });



  return (

    <View style={sb.row}>

      <Animated.View style={[sb.wrap, {borderColor}]}>

        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={sb.icon} />

        <TextInput

          value={value}

          onChangeText={setValue}

          placeholder="Search services or partners..."

          placeholderTextColor="#9CA3AF"

          onFocus={handleFocus}

          onBlur={handleBlur}

          style={sb.input}

          selectionColor={CORAL}

        />

      </Animated.View>

      <Pressable style={sb.filterBtn}>

        <Ionicons name="funnel-outline" size={18} color="#FFFFFF" />

      </Pressable>

    </View>

  );

}



const sb = StyleSheet.create({

  row: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    paddingHorizontal: 20,

    marginBottom: 18,

  },

  wrap: {

    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#F7F9FC',

    borderRadius: 14,

    borderWidth: 1.5,

    paddingHorizontal: 14,

    paddingVertical: 12,

    gap: 8,

  },

  icon: {flexShrink: 0},

  input: {

    flex: 1,

    fontSize: 14,

    color: DARK,

    fontFamily: SANS,

    padding: 0,

    letterSpacing: 0.2,

  },

  filterBtn: {

    width: 46,

    height: 46,

    borderRadius: 14,

    backgroundColor: CORAL,

    alignItems: 'center',

    justifyContent: 'center',

  },

});



// ─────────────────────────────────────────────

// MAIN SCREEN

// ─────────────────────────────────────────────

const CARD_RADIUS = 36;



export function ServicesScreen() {

  const navigation = useNavigation<any>();

  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = React.useState('all');

  const [unavailableProvider, setUnavailableProvider] = React.useState<Provider | null>(null);

  const openServiceSession = useServiceSessionStore(s => s.openServiceSession);

  const startAirtimeTopup = useAirtimeTopupFlowStore(s => s.start);

  const startTransfer = useTransferFlowStore(s => s.start);



  const filteredCategories = React.useMemo(() => {

    if (activeFilter === 'all') return CATEGORIES;

    return CATEGORIES.filter(c => c.id === activeFilter);

  }, [activeFilter]);



  const resolveProviderConfig = (

    category: Category,

    provider: Provider,

  ): ServiceProviderConfig | undefined => {

    const registryCategory = SERVICE_CATEGORIES.find(c => c.id === category.id);

    return registryCategory?.providers.find(item => item.name === provider.name);

  };



  const handleProviderPress = (category: Category, provider: Provider) => {

    const providerConfig = resolveProviderConfig(category, provider);



    if (!providerConfig || !providerConfig.enabled) {

      setUnavailableProvider(provider);

      return;

    }



    const session = openServiceSession(providerConfig);



    if (session.flowId === 'airtimeTopup') {

      startAirtimeTopup(session);

      return;

    }



    if (session.flowId === 'transfer') {

      startTransfer(session);

    }



    const parentNavigation = navigation.getParent();



    if (parentNavigation) {

      parentNavigation.navigate('ServiceFlow');

      return;

    }



    navigation.navigate('ServiceFlow');

  };



  return (

    <View style={s.root}>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} bounces={false}>



        <View style={[s.header, {paddingTop: Math.max(insets.top, 20) + 8}]}>

          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={s.backBtn}>

            <Ionicons name="arrow-back" size={24} color={DARK} />

          </Pressable>

          <Text style={s.title}>Services</Text>

          <View style={s.backBtn} />

        </View>



        <SearchBar />



        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={false}

          contentContainerStyle={s.filterStrip}

          style={s.filterScroll}>

          {FILTER_CHIPS.map(chip => (

            <FilterPill

              key={chip.id}

              label={chip.label}

              isActive={activeFilter === chip.id}

              onPress={() => setActiveFilter(chip.id)}

            />

          ))}

        </ScrollView>



        <View style={s.content}>

          {filteredCategories.map(category => (

            <View key={category.id} style={s.section}>

              <Text style={s.sectionTitle}>{category.label}</Text>

              <View style={s.sectionItems}>

                {category.providers.map((provider, index) => (

                  <ProviderRow

                    key={provider.id}

                    provider={provider}

                    index={index}

                    onPress={() => handleProviderPress(category, provider)}

                  />

                ))}

              </View>

            </View>

          ))}

        </View>



      </ScrollView>



      <UnavailableServiceSheet

        provider={unavailableProvider}

        onClose={() => setUnavailableProvider(null)}

      />

      <VodacomAirtimeFlow />

    </View>

  );

}



function UnavailableServiceSheet({

  provider,

  onClose,

}: {

  provider: Provider | null;

  onClose: () => void;

}) {

  const slideAnim = React.useRef(new Animated.Value(420)).current;

  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();



  React.useEffect(() => {

    if (provider) {

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

          toValue: 420,

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

  }, [backdropAnim, provider, slideAnim]);



  if (!provider) {

    return null;

  }



  return (

    <Modal visible transparent animationType="none" onRequestClose={onClose}>

      <TouchableWithoutFeedback onPress={onClose}>

        <Animated.View style={[us.backdrop, {opacity: backdropAnim}]} />

      </TouchableWithoutFeedback>

      <Animated.View

        style={[

          us.sheet,

          {

            transform: [{translateY: slideAnim}],

            paddingBottom: Math.max(insets.bottom, 22),

          },

        ]}>

        <View style={us.handle} />

        <View style={[us.iconWrap, {backgroundColor: provider.iconBg}]}>

          <Ionicons name={provider.icon as any} size={24} color={provider.iconColor} />

        </View>

        <Text style={us.title}>{provider.name} is coming soon</Text>

        <Text style={us.body}>

          We're preparing this service for a smoother payment experience. Try Airtime or Transfer for now.

        </Text>

        <Pressable onPress={onClose} style={us.button}>

          <Text style={us.buttonText}>Got it</Text>

        </Pressable>

      </Animated.View>

    </Modal>

  );

}



// ─────────────────────────────────────────────

const s = StyleSheet.create({

  root: {flex: 1, backgroundColor: '#FFFFFF'},

  scroll: {flex: 1},



  header: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 20,

    paddingBottom: 16,

  },

  backBtn: {width: 40, alignItems: 'center', justifyContent: 'center'},

  title: {

    color: DARK,

    fontSize: 18,

    fontWeight: '700',

    fontFamily: SERIF,

    letterSpacing: -0.3,

  },



  filterScroll: {marginBottom: 18},

  filterStrip: {paddingHorizontal: 20, gap: 10, paddingRight: 32},



  content: {paddingHorizontal: 20, paddingBottom: 32},

  section: {marginBottom: 24},

  sectionTitle: {

    color: DARK,

    fontSize: 17,

    fontWeight: '700',

    fontFamily: SERIF,

    letterSpacing: -0.3,

    marginBottom: 12,

  },

  sectionItems: {gap: 10},

});



const us = StyleSheet.create({

  backdrop: {

    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    backgroundColor: 'rgba(26,37,53,0.55)',

  },

  sheet: {

    position: 'absolute',

    left: 0,

    right: 0,

    bottom: 0,

    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: CARD_RADIUS,

    borderTopRightRadius: CARD_RADIUS,

    paddingHorizontal: 24,

    paddingTop: 14,

    alignItems: 'center',

    shadowColor: '#000000',

    shadowOffset: {width: 0, height: -12},

    shadowOpacity: 0.18,

    shadowRadius: 28,

    elevation: 24,

  },

  handle: {

    width: 40,

    height: 4,

    borderRadius: 2,

    backgroundColor: '#D1D9E0',

    marginBottom: 24,

  },

  iconWrap: {

    width: 64,

    height: 64,

    borderRadius: 20,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 16,

  },

  title: {

    color: DARK,

    fontSize: 22,

    fontWeight: '700',

    fontFamily: SERIF,

    textAlign: 'center',

    letterSpacing: -0.4,

    marginBottom: 8,

  },

  body: {

    color: '#8A94A6',

    fontSize: 13,

    fontFamily: SANS,

    textAlign: 'center',

    lineHeight: 20,

    marginBottom: 22,

  },

  button: {

    alignSelf: 'stretch',

    backgroundColor: CORAL,

    borderRadius: 14,

    paddingVertical: 15,

    alignItems: 'center',

    shadowColor: CORAL,

    shadowOffset: {width: 0, height: 6},

    shadowOpacity: 0.20,

    shadowRadius: 14,

    elevation: 6,

  },

  buttonText: {

    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '800',

    fontFamily: SANS,

  },

});

