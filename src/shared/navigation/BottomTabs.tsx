import * as React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {HomeScreen}         from '@features/home/screens/HomeScreen';
import {ServicesScreen}     from '@features/services/screens/ServicesScreen';
import {PayScreen}          from '@features/pay/screens/PayScreen';
import {TransactionsScreen} from '@/features/transactions/screens/TransactionsScreen';
import {MoreScreen}         from '@features/more/screens/MoreScreen';

const {width} = Dimensions.get('window');

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK  = '#1A2535';

// ─────────────────────────────────────────────
// Tab config
// ─────────────────────────────────────────────
const TABS = [
  {name: 'Home',         icon: 'home-outline',         iconActive: 'home'},
  {name: 'Services',     icon: 'albums-outline',        iconActive: 'albums'},
  {name: 'Pay',          icon: 'arrow-up-outline',      iconActive: 'arrow-up', isFab: true},
  {name: 'Transactions', icon: 'bar-chart-outline',     iconActive: 'bar-chart'},
  {name: 'More',         icon: 'ellipsis-horizontal-outline', iconActive: 'ellipsis-horizontal'},
];

// ─────────────────────────────────────────────
// Single tab button
// ─────────────────────────────────────────────
function TabButton({
  tab,
  isActive,
  onPress,
}: {
  tab: typeof TABS[0];
  isActive: boolean;
  onPress: () => void;
}) {
  // Icon scale spring on press
  const scale = React.useRef(new Animated.Value(1)).current;
  // Dot opacity + scale for active indicator
  const dotScale   = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const dotOpacity = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
  // Icon color interpolation (we animate a separate opacity layer)
  const activeOpacity = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(dotScale, {
        toValue: isActive ? 1 : 0,
        useNativeDriver: true,
        damping: 14,
        stiffness: 180,
      }),
      Animated.timing(dotOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(activeOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.82,
      useNativeDriver: true,
      damping: 12,
      stiffness: 260,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 10,
      stiffness: 200,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={tb.wrap}
      accessibilityRole="button"
      accessibilityLabel={tab.name}>

      <Animated.View style={[tb.iconWrap, {transform: [{scale}]}]}>
        {/* Ghost (inactive) icon */}
        <Animated.View style={[StyleSheet.absoluteFill, tb.center, {opacity: Animated.subtract(1, activeOpacity)}]}>
          <Ionicons name={tab.icon as any} size={22} color="#B0BAC8" />
        </Animated.View>
        {/* Active icon */}
        <Animated.View style={[StyleSheet.absoluteFill, tb.center, {opacity: activeOpacity}]}>
          <Ionicons name={tab.iconActive as any} size={22} color={DARK} />
        </Animated.View>
      </Animated.View>

      {/* Active dot indicator */}
      <Animated.View
        style={[
          tb.dot,
          {
            opacity: dotOpacity,
            transform: [{scale: dotScale}],
          },
        ]}
      />
    </Pressable>
  );
}

const tb = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 5,
  },
  iconWrap: {
    width: 28,
    height: 28,
    position: 'relative',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: CORAL,
  },
});

// ─────────────────────────────────────────────
// FAB — center Pay button
// ─────────────────────────────────────────────
function FabButton({onPress, isActive}: {onPress: () => void; isActive: boolean}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const glow  = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(glow, {
      toValue: isActive ? 1 : 0.6,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      damping: 12,
      stiffness: 280,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 8,
      stiffness: 180,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={fab.touch}
      accessibilityRole="button"
      accessibilityLabel="Pay">
      <Animated.View
        style={[
          fab.btn,
          {transform: [{scale}]},
        ]}>
        {/* Outer glow ring */}
        <Animated.View />
        {/* The button itself */}
        <View style={fab.inner}>
          {/* Diagonal arrow — same language as onboarding CTA */}
          <View style={fab.arrowWrap}>
            <View style={fab.arrowShaft} />
            <View style={fab.arrowHead} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const FAB_SIZE = 56;

const fab = StyleSheet.create({
  touch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Pull the FAB upward out of the bar
    marginTop: -(FAB_SIZE / 2 + 8),
  },
  btn: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: FAB_SIZE + 14,
    height: FAB_SIZE + 14,
    borderRadius: (FAB_SIZE + 14) / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(242,118,73,0.35)',
  },
  inner: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: CORAL,
    // shadowOffset: {width: 0, height: 6},
    // shadowOpacity: 0.50,
    // shadowRadius: 14,
    // elevation: 10,
  },
  // Diagonal arrow (↗) — same hand-drawn approach as onboarding
  arrowWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '-45deg'}],
  },
  arrowShaft: {
    position: 'absolute',
    left: 0,
    right: 6,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    top: 10,
  },
  arrowHead: {
    position: 'absolute',
    right: 0,
    width: 9,
    height: 9,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{rotate: '45deg'}],
    top: 4,
  },
});

// ─────────────────────────────────────────────
// Custom Tab Bar
// ─────────────────────────────────────────────
function CustomTabBar({state, descriptors, navigation}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[bar.root, {paddingBottom: Math.max(insets.bottom, 8)}]}>
      {/* Top shadow line — barely visible, just depth */}
      <View style={bar.shadowLine} />

      <View style={bar.row}>
        {state.routes.map((route, index) => {
          if (route.name === 'Pay') {
            return null;
          }

          const tab = TABS[index];
          const isActive = state.index === index;
          const isFab = tab.isFab;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isFab) {
            return (
              <FabButton key={route.key} onPress={onPress} isActive={isActive} />
            );
          }

          return (
            <TabButton
              key={route.key}
              tab={tab}
              isActive={isActive}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const bar = StyleSheet.create({
  root: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden', // Clip to show border radius
    shadowColor: '#1A2535',
    shadowOffset: {width: 0, height: -6},
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 20,
  },
  shadowLine: {
    position: 'absolute',
    top: 0,
    left: 32,
    right: 32,
    height: 1,
    backgroundColor: '#F0F3F7',
    borderRadius: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
});

// ─────────────────────────────────────────────
// Navigator
// ─────────────────────────────────────────────
const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}>
      <Tab.Screen name="Home"         component={HomeScreen} />
      <Tab.Screen name="Services"     component={ServicesScreen} />
      <Tab.Screen name="Pay"          component={PayScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="More"         component={MoreScreen} />
    </Tab.Navigator>
  );
}