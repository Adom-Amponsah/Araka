import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK  = '#1A2535';
const OFF   = '#F4F6FA';
const GREEN = '#10B981';
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const SANS  = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';
const CARD_RADIUS = 36;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type TxnType     = 'out' | 'in';
type TxnCategory = 'airtime' | 'electricity' | 'data' | 'tv' | 'transfer' | 'credit' | 'money';
type FilterPeriod = 'today' | 'week' | 'month' | 'last_month' | 'all';

interface Transaction {
  id: string;
  label: string;
  provider: string;
  category: TxnCategory;
  type: TxnType;
  amount: number;
  currency: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  note?: string;
}

// ─────────────────────────────────────────────
// DUMMY DATA
// ─────────────────────────────────────────────
const ALL_TRANSACTIONS: Transaction[] = [
  {id:'t01',label:'MTN Airtime',provider:'MTN Mobile',category:'airtime',type:'out',amount:20.00,currency:'GHS',
    date:new Date('2026-04-28T09:14:00'),status:'completed',reference:'ARK-20260428-0014',
    icon:'phone-portrait-outline',iconBg:'#FFF8E6',iconColor:'#F59E0B'},
  {id:'t02',label:'SNEL Token',provider:'Société Nationale',category:'electricity',type:'out',amount:45.00,currency:'GHS',
    date:new Date('2026-04-28T07:02:00'),status:'completed',reference:'ARK-20260428-0009',
    icon:'flash-outline',iconBg:'#FEF3E2',iconColor:'#D97706',note:'Meter: 0041 2278 3456'},
  {id:'t03',label:'Wallet Top-up',provider:'Bank Transfer',category:'credit',type:'in',amount:500.00,currency:'GHS',
    date:new Date('2026-04-27T16:45:00'),status:'completed',reference:'ARK-20260427-0031',
    icon:'arrow-down-outline',iconBg:'#EDFBF4',iconColor:GREEN},
  {id:'t04',label:'Airtel Data Bundle',provider:'Airtel',category:'data',type:'out',amount:15.00,currency:'GHS',
    date:new Date('2026-04-27T11:30:00'),status:'completed',reference:'ARK-20260427-0018',
    icon:'wifi-outline',iconBg:'#FEE8DF',iconColor:'#C0392B'},
  {id:'t05',label:'Canal+ Renewal',provider:'Canal Plus',category:'tv',type:'out',amount:80.00,currency:'GHS',
    date:new Date('2026-04-26T14:00:00'),status:'completed',reference:'ARK-20260426-0022',
    icon:'tv-outline',iconBg:'#1A1A2E',iconColor:'#FFFFFF',note:'Subscriber ID 3457843'},
  {id:'t06',label:'Send to Kwame',provider:'M-Pesa',category:'money',type:'out',amount:120.00,currency:'GHS',
    date:new Date('2026-04-26T09:55:00'),status:'completed',reference:'ARK-20260426-0011',
    icon:'paper-plane-outline',iconBg:'#EDFBF4',iconColor:GREEN},
  {id:'t07',label:'GOtv Subscription',provider:'GOtv',category:'tv',type:'out',amount:35.00,currency:'GHS',
    date:new Date('2026-04-25T20:10:00'),status:'pending',reference:'ARK-20260425-0045',
    icon:'tv-outline',iconBg:'#FFF8E6',iconColor:'#F59E0B'},
  {id:'t08',label:'Vodacom Airtime',provider:'Vodacom',category:'airtime',type:'out',amount:10.00,currency:'GHS',
    date:new Date('2026-04-25T13:20:00'),status:'completed',reference:'ARK-20260425-0034',
    icon:'phone-portrait-outline',iconBg:'#FEE8DF',iconColor:'#E53E3E'},
  {id:'t09',label:'Salary Credit',provider:'Employer Ltd',category:'credit',type:'in',amount:2800.00,currency:'GHS',
    date:new Date('2026-04-24T08:00:00'),status:'completed',reference:'ARK-20260424-0003',
    icon:'arrow-down-outline',iconBg:'#EDFBF4',iconColor:GREEN},
  {id:'t10',label:'Spectranet Internet',provider:'Spectranet',category:'data',type:'out',amount:60.00,currency:'GHS',
    date:new Date('2026-04-23T16:00:00'),status:'failed',reference:'ARK-20260423-0028',
    icon:'globe-outline',iconBg:'#E8F4FD',iconColor:'#2980B9'},
  {id:'t11',label:'EKEDC Token',provider:'Eko Electricity',category:'electricity',type:'out',amount:55.00,currency:'GHS',
    date:new Date('2026-04-22T10:45:00'),status:'completed',reference:'ARK-20260422-0019',
    icon:'flash-outline',iconBg:'#FEF3E2',iconColor:'#D97706',note:'Meter: 0041 2278 3456'},
  {id:'t12',label:'MTN Data Bundle',provider:'MTN',category:'data',type:'out',amount:25.00,currency:'GHS',
    date:new Date('2026-04-21T08:30:00'),status:'completed',reference:'ARK-20260421-0007',
    icon:'wifi-outline',iconBg:'#FFF8E6',iconColor:'#F59E0B'},
  {id:'t13',label:'Orange Money',provider:'Orange',category:'money',type:'in',amount:150.00,currency:'GHS',
    date:new Date('2026-04-20T14:10:00'),status:'completed',reference:'ARK-20260420-0015',
    icon:'paper-plane-outline',iconBg:'#FEF3E2',iconColor:'#D97706'},
  {id:'t14',label:'Glo Airtime',provider:'Glo Mobile',category:'airtime',type:'out',amount:5.00,currency:'GHS',
    date:new Date('2026-04-19T09:00:00'),status:'completed',reference:'ARK-20260419-0002',
    icon:'phone-portrait-outline',iconBg:'#EDFBF4',iconColor:'#10B981'},
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

function dayLabel(date: Date): string {
  const now       = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate()-1);
  if(date.toDateString()===now.toDateString())       return 'Today';
  if(date.toDateString()===yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'});
}

function applyPeriodFilter(txns: Transaction[], period: FilterPeriod): Transaction[] {
  const now   = new Date();
  const start = new Date();
  if(period==='today'){
    start.setHours(0,0,0,0);
    return txns.filter(t=>t.date>=start);
  }
  if(period==='week'){
    start.setDate(now.getDate()-7);
    return txns.filter(t=>t.date>=start);
  }
  if(period==='month'){
    start.setDate(1); start.setHours(0,0,0,0);
    return txns.filter(t=>t.date>=start);
  }
  if(period==='last_month'){
    const s = new Date(now.getFullYear(),now.getMonth()-1,1);
    const e = new Date(now.getFullYear(),now.getMonth(),1);
    return txns.filter(t=>t.date>=s && t.date<e);
  }
  return txns;
}

function groupByDay(txns: Transaction[]): {label:string;data:Transaction[]}[] {
  const map = new Map<string,Transaction[]>();
  txns.forEach(t=>{
    const key = t.date.toDateString();
    if(!map.has(key)) map.set(key,[]);
    map.get(key)!.push(t);
  });
  return Array.from(map.entries()).map(([,data])=>({
    label: dayLabel(data[0].date),
    data,
  }));
}

// ─────────────────────────────────────────────
// FILTER BOTTOM SHEET
// ─────────────────────────────────────────────
const PERIOD_OPTIONS: {key:FilterPeriod;label:string;sub:string;icon:string}[] = [
  {key:'today',      label:'Today',       sub:'Transactions from today',        icon:'sunny-outline'},
  {key:'week',       label:'This Week',   sub:'Last 7 days',                    icon:'calendar-outline'},
  {key:'month',      label:'This Month',  sub:'From the 1st of this month',     icon:'calendar-clear-outline'},
  {key:'last_month', label:'Last Month',  sub:'Previous full month',            icon:'time-outline'},
  {key:'all',        label:'All Time',    sub:'Every transaction',              icon:'layers-outline'},
];

function FilterSheet({
  visible, current, onSelect, onClose,
}: {
  visible:boolean; current:FilterPeriod;
  onSelect:(p:FilterPeriod)=>void; onClose:()=>void;
}) {
  const slideAnim   = React.useRef(new Animated.Value(400)).current;
  const backdropAnim= React.useRef(new Animated.Value(0)).current;
  const insets      = useSafeAreaInsets();

  React.useEffect(()=>{
    if(visible){
      Animated.parallel([
        Animated.spring(slideAnim,{toValue:0,useNativeDriver:true,damping:22,stiffness:260}),
        Animated.timing(backdropAnim,{toValue:1,duration:260,useNativeDriver:true}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim,{toValue:400,duration:240,easing:Easing.in(Easing.cubic),useNativeDriver:true}),
        Animated.timing(backdropAnim,{toValue:0,duration:200,useNativeDriver:true}),
      ]).start();
    }
  },[visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[fs.backdrop,{opacity:backdropAnim}]}/>
      </TouchableWithoutFeedback>
      <Animated.View style={[fs.sheet,{transform:[{translateY:slideAnim}],paddingBottom:Math.max(insets.bottom,24)}]}>
        <View style={fs.handle}/>
        <Text style={fs.title}>Filter by period</Text>
        <Text style={fs.subtitle}>Choose a time range to view</Text>

        <View style={fs.options}>
          {PERIOD_OPTIONS.map(opt=>{
            const isActive = current===opt.key;
            return(
              <Pressable
                key={opt.key}
                onPress={()=>{onSelect(opt.key); onClose();}}
                style={[fs.option, isActive && fs.optionActive]}>
                <View style={[fs.optionIcon,{backgroundColor: isActive ? CORAL+'20' : OFF}]}>
                  <Ionicons name={opt.icon as any} size={18} color={isActive ? CORAL : '#9CA3AF'}/>
                </View>
                <View style={fs.optionInfo}>
                  <Text style={[fs.optionLabel, isActive && {color:DARK}]}>{opt.label}</Text>
                  <Text style={fs.optionSub}>{opt.sub}</Text>
                </View>
                {isActive && (
                  <View style={fs.checkWrap}>
                    <Ionicons name="checkmark" size={16} color={CORAL}/>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </Modal>
  );
}

const fs = StyleSheet.create({
  backdrop:{
    position:'absolute',top:0,left:0,right:0,bottom:0,
    backgroundColor:'rgba(26,37,53,0.55)',
    zIndex:9999,
  },
  sheet:{
    position:'absolute',bottom:0,left:0,right:0,
    backgroundColor:'#FFFFFF',
    borderTopLeftRadius:CARD_RADIUS,borderTopRightRadius:CARD_RADIUS,
    paddingHorizontal:24,paddingTop:14,
    shadowColor:'#000',shadowOffset:{width:0,height:-12},
    shadowOpacity:0.18,shadowRadius:28,elevation:24,
    zIndex:10000,
  },
  handle:{
    width:40,height:4,borderRadius:2,
    backgroundColor:'#D1D9E0',
    alignSelf:'center',marginBottom:24,
  },
  title:{
    color:DARK,fontSize:22,fontWeight:'700',
    fontFamily:SERIF,letterSpacing:-0.5,marginBottom:4,
  },
  subtitle:{
    color:'#9CA3AF',fontSize:13,fontFamily:SANS,
    letterSpacing:0.2,marginBottom:24,
  },
  options:{gap:8},
  option:{
    flexDirection:'row',alignItems:'center',
    padding:14,borderRadius:16,
    backgroundColor:OFF,gap:14,
    borderWidth:1.5,borderColor:'transparent',
  },
  optionActive:{
    backgroundColor:'#FFFFFF',
    borderColor:CORAL+'40',
    shadowColor:CORAL,shadowOffset:{width:0,height:3},
    shadowOpacity:0.12,shadowRadius:8,elevation:3,
  },
  optionIcon:{
    width:40,height:40,borderRadius:12,
    alignItems:'center',justifyContent:'center',
  },
  optionInfo:{flex:1},
  optionLabel:{color:'#6B7280',fontSize:15,fontWeight:'600',fontFamily:SANS,letterSpacing:0.1,marginBottom:2},
  optionSub:  {color:'#9CA3AF',fontSize:12,fontFamily:SANS,letterSpacing:0.1},
  checkWrap:  {width:28,height:28,borderRadius:8,backgroundColor:CORAL+'15',alignItems:'center',justifyContent:'center'},
});

// ─────────────────────────────────────────────
// TRANSACTION DETAIL BOTTOM SHEET
// ─────────────────────────────────────────────
function DetailSheet({
  txn, visible, onClose,
}: {txn:Transaction|null;visible:boolean;onClose:()=>void}) {
  const slideAnim   = React.useRef(new Animated.Value(height)).current;
  const backdropAnim= React.useRef(new Animated.Value(0)).current;
  const insets      = useSafeAreaInsets();

  React.useEffect(()=>{
    if(visible){
      Animated.parallel([
        Animated.spring(slideAnim,{toValue:0,useNativeDriver:true,damping:22,stiffness:260}),
        Animated.timing(backdropAnim,{toValue:1,duration:280,useNativeDriver:true}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim,{toValue:height,duration:260,easing:Easing.in(Easing.cubic),useNativeDriver:true}),
        Animated.timing(backdropAnim,{toValue:0,duration:220,useNativeDriver:true}),
      ]).start();
    }
  },[visible]);

  if(!txn) return null;

  const isOut = txn.type==='out';
  const statusCfg = {
    completed:{label:'Completed',color:GREEN,    bg:'#EDFBF4',icon:'checkmark-circle'},
    pending:  {label:'Pending',  color:'#F59E0B',bg:'#FFFBEB',icon:'time-outline'},
    failed:   {label:'Failed',   color:'#EF4444',bg:'#FEF2F2',icon:'close-circle'},
  }[txn.status];

  const Row=({label,value,mono}:{label:string;value:string;mono?:boolean})=>(
    <View style={det.row}>
      <Text style={det.rowLabel}>{label}</Text>
      <Text style={[det.rowValue, mono && det.mono]} numberOfLines={1}>{value}</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[det.backdrop,{opacity:backdropAnim}]}/>
      </TouchableWithoutFeedback>

      <Animated.View style={[det.sheet,{transform:[{translateY:slideAnim}],paddingBottom:Math.max(insets.bottom,24)}]}>
        <View style={det.handle}/>

        {/* Amount hero */}
        <View style={det.hero}>
          <View style={[det.bigIcon,{backgroundColor:txn.iconBg}]}>
            <Ionicons name={txn.icon as any} size={28} color={txn.iconColor}/>
          </View>
          <Text style={det.providerLabel}>{txn.provider}</Text>
          <Text style={[det.amount,{color: isOut ? DARK : GREEN}]}>
            {isOut?'−':'+'}GHS {txn.amount.toFixed(2)}
          </Text>
          <Text style={det.txnName}>{txn.label}</Text>
          <View style={[det.statusBadge,{backgroundColor:statusCfg.bg}]}>
            <Ionicons name={statusCfg.icon as any} size={13} color={statusCfg.color}/>
            <Text style={[det.statusText,{color:statusCfg.color}]}>{statusCfg.label}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={det.divider}>
          <View style={det.dividerLine}/>
          <Text style={det.dividerLabel}>DETAILS</Text>
          <View style={det.dividerLine}/>
        </View>

        {/* Info rows */}
        <View style={det.rows}>
          <Row label="Date"      value={formatFullDate(txn.date)}/>
          <Row label="Time"      value={formatTime(txn.date)}/>
          <Row label="Category"  value={txn.category.charAt(0).toUpperCase()+txn.category.slice(1)}/>
          <Row label="Reference" value={txn.reference} mono/>
          {txn.note && <Row label="Note" value={txn.note}/>}
        </View>

        {/* Actions */}
        {isOut && txn.status==='completed' && (
          <Pressable style={det.repeatBtn}>
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF"/>
            <Text style={det.repeatBtnText}>Repeat this transaction</Text>
          </Pressable>
        )}
        <Pressable onPress={onClose} style={det.closeBtn}>
          <Text style={det.closeBtnText}>Close</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const det = StyleSheet.create({
  backdrop:{
    position:'absolute',top:0,left:0,right:0,bottom:0,
    backgroundColor:'rgba(26,37,53,0.55)',
    zIndex:9999,
  },
  sheet:{
    position:'absolute',bottom:0,left:0,right:0,
    backgroundColor:'#FFFFFF',
    borderTopLeftRadius:CARD_RADIUS,borderTopRightRadius:CARD_RADIUS,
    paddingHorizontal:24,paddingTop:14,
    shadowColor:'#000',shadowOffset:{width:0,height:-12},
    shadowOpacity:0.20,shadowRadius:28,elevation:24,
    zIndex:10000,
  },
  handle:{
    width:40,height:4,borderRadius:2,
    backgroundColor:'#D1D9E0',
    alignSelf:'center',marginBottom:20,
  },
  hero:{alignItems:'center',gap:6,marginBottom:20},
  bigIcon:{
    width:60,height:60,borderRadius:18,
    alignItems:'center',justifyContent:'center',
    marginBottom:6,
    shadowColor:DARK,shadowOffset:{width:0,height:5},
    shadowOpacity:0.09,shadowRadius:12,elevation:4,
  },
  providerLabel:{color:'#9CA3AF',fontSize:11,fontFamily:SANS,letterSpacing:1.5,textTransform:'uppercase'},
  amount:{fontSize:38,fontWeight:'700',fontFamily:SERIF,letterSpacing:-1.5,lineHeight:42},
  txnName:{color:SLATE,fontSize:14,fontFamily:SANS,letterSpacing:0.2},
  statusBadge:{flexDirection:'row',alignItems:'center',gap:5,borderRadius:20,paddingHorizontal:12,paddingVertical:5,marginTop:2},
  statusText:{fontSize:12,fontWeight:'700',fontFamily:SANS},

  divider:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:14},
  dividerLine:{flex:1,height:1,backgroundColor:'#F0F3F7'},
  dividerLabel:{color:'#C4CDD8',fontSize:10,fontFamily:SANS,fontWeight:'700',letterSpacing:2},

  rows:{gap:0,marginBottom:20},
  row:{
    flexDirection:'row',justifyContent:'space-between',alignItems:'center',
    paddingVertical:11,
    borderBottomWidth:1,borderBottomColor:'#F4F6FA',
  },
  rowLabel:{color:'#9CA3AF',fontSize:13,fontFamily:SANS},
  rowValue:{color:DARK,fontSize:13,fontWeight:'600',fontFamily:SANS,maxWidth:'58%',textAlign:'right'},
  mono:{fontFamily:Platform.OS==='ios'?'Courier New':'monospace',fontSize:11},

  repeatBtn:{
    backgroundColor:DARK,borderRadius:14,paddingVertical:15,
    flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,
    marginBottom:10,
    shadowColor:DARK,shadowOffset:{width:0,height:5},shadowOpacity:0.20,shadowRadius:12,elevation:6,
  },
  repeatBtnText:{color:'#FFFFFF',fontSize:15,fontWeight:'700',fontFamily:SANS,letterSpacing:0.3},
  closeBtn:{paddingVertical:13,alignItems:'center'},
  closeBtnText:{color:'#9CA3AF',fontSize:14,fontFamily:SANS,fontWeight:'600'},
});

// ─────────────────────────────────────────────
// TRANSACTION ROW
// ─────────────────────────────────────────────
function TxnRow({txn, onPress, index}: {txn:Transaction;onPress:()=>void;index:number}) {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideX = React.useRef(new Animated.Value(16)).current;
  const scale  = React.useRef(new Animated.Value(1)).current;

  React.useEffect(()=>{
    setTimeout(()=>{
      Animated.parallel([
        Animated.timing(fadeIn,{toValue:1,duration:240,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
        Animated.timing(slideX,{toValue:0,duration:240,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      ]).start();
    }, Math.min(index*40, 280));
  },[]);

  const pressIn  = ()=>Animated.spring(scale,{toValue:0.97,useNativeDriver:true,damping:15,stiffness:300}).start();
  const pressOut = ()=>Animated.spring(scale,{toValue:1,   useNativeDriver:true,damping:10,stiffness:200}).start();

  const isOut = txn.type==='out';

  return (
    <Animated.View style={{opacity:fadeIn,transform:[{translateX:slideX},{scale}]}}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={tw.row}>
        {/* Icon + optional status dot */}
        <View style={[tw.iconBadge,{backgroundColor:txn.iconBg}]}>
          <Ionicons name={txn.icon as any} size={19} color={txn.iconColor}/>
          {txn.status==='pending' && <View style={[tw.dot,{backgroundColor:'#F59E0B'}]}/>}
          {txn.status==='failed'  && <View style={[tw.dot,{backgroundColor:'#EF4444'}]}/>}
        </View>
        {/* Info */}
        <View style={tw.info}>
          <Text style={tw.label} numberOfLines={1}>{txn.label}</Text>
          <Text style={tw.sub}>{txn.provider} · {formatTime(txn.date)}</Text>
        </View>
        {/* Amount */}
        <View style={tw.right}>
          <Text style={[tw.amount,{color: isOut ? DARK : GREEN}]}>
            {isOut?'−':'+'}GHS {txn.amount.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const tw = StyleSheet.create({
  row:{
    flexDirection:'row',alignItems:'center',
    backgroundColor:'#FFFFFF',borderRadius:16,
    padding:14,marginBottom:8,gap:12,
    shadowColor:DARK,shadowOffset:{width:0,height:3},
    shadowOpacity:0.055,shadowRadius:8,elevation:2,
  },
  iconBadge:{
    width:44,height:44,borderRadius:13,
    alignItems:'center',justifyContent:'center',
    flexShrink:0,position:'relative',
  },
  dot:{
    position:'absolute',top:1,right:1,
    width:8,height:8,borderRadius:4,
    borderWidth:1.5,borderColor:'#FFFFFF',
  },
  info:{flex:1},
  label:{color:DARK,fontSize:14,fontWeight:'600',fontFamily:SANS,letterSpacing:0.1,marginBottom:3},
  sub:  {color:'#9CA3AF',fontSize:11,fontFamily:SANS},
  right:{alignItems:'flex-end',gap:4},
  amount:{fontSize:14,fontWeight:'700',fontFamily:SANS,letterSpacing:0.1},
});

// ─────────────────────────────────────────────
// DAY GROUP HEADER
// ─────────────────────────────────────────────
function DayHeader({label}: {label:string}) {
  return(
    <View style={dh.row}>
      <Text style={dh.label}>{label}</Text>
      <View style={dh.line}/>
    </View>
  );
}
const dh = StyleSheet.create({
  row:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:10,marginTop:6},
  label:{color:SLATE,fontSize:12,fontWeight:'700',fontFamily:SANS,letterSpacing:0.5},
  line: {flex:1,height:1,backgroundColor:'#E8EDF2'},
});

// ─────────────────────────────────────────────
// ACTIVE FILTER BADGE — shown in header
// ─────────────────────────────────────────────
function ActiveBadge({period,onClear}:{period:FilterPeriod;onClear:()=>void}) {
  if(period==='all') return null;
  const label = PERIOD_OPTIONS.find(p=>p.key===period)?.label ?? '';
  return(
    <Pressable onPress={onClear} style={ab.badge}>
      <Text style={ab.label}>{label}</Text>
      <Ionicons name="close" size={11} color={CORAL}/>
    </Pressable>
  );
}
const ab = StyleSheet.create({
  badge:{
    flexDirection:'row',alignItems:'center',gap:5,
    borderWidth:1,borderColor:CORAL+'40',
    borderRadius:20,paddingHorizontal:10,paddingVertical:5,
    backgroundColor:CORAL+'10',
  },
  label:{color:CORAL,fontSize:11,fontFamily:SANS,fontWeight:'700',letterSpacing:0.3},
});

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export function TransactionsScreen() {
  const insets = useSafeAreaInsets();

  const [period,        setPeriod]        = React.useState<FilterPeriod>('all');
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [selectedTxn,   setSelectedTxn]   = React.useState<Transaction|null>(null);
  const [detailVisible, setDetailVisible] = React.useState(false);

  // Entrance animations
  const heroFade  = React.useRef(new Animated.Value(0)).current;
  const heroY     = React.useRef(new Animated.Value(-12)).current;
  const cardSlide = React.useRef(new Animated.Value(48)).current;
  const cardFade  = React.useRef(new Animated.Value(0)).current;

  React.useEffect(()=>{
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, {toValue:1,duration:400,useNativeDriver:true}),
        Animated.timing(heroY,    {toValue:0,duration:400,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      ]),
      Animated.parallel([
        Animated.timing(cardSlide,{toValue:0,duration:420,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
        Animated.timing(cardFade, {toValue:1,duration:380,useNativeDriver:true}),
      ]),
    ]).start();
  },[]);

  const openTxn = (txn:Transaction) => {
    setSelectedTxn(txn);
    setDetailVisible(true);
  };

  const filtered = applyPeriodFilter(ALL_TRANSACTIONS, period);
  const groups   = groupByDay(filtered);

  // running index for stagger animation
  let globalIndex = 0;

  const filterHasValue = period !== 'all';

  return(
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        bounces>

        {/* ═══════════ HERO ═══════════ */}
        <View style={[s.hero,{paddingTop:Math.max(insets.top,20)+8}]}>
          <View style={s.ringOuter}/>
          <View style={s.ringInner}/>

          <Animated.View style={[s.topBar,{opacity:heroFade,transform:[{translateY:heroY}]}]}>
            {/* Wordmark */}
            <View style={s.wordRow}>
              <View style={s.wordDot}/>
              <Text style={s.wordmark}>ARAKA</Text>
            </View>
            {/* Filter button */}
            <Pressable onPress={()=>setFilterVisible(true)} style={s.filterBtn}>
              <Ionicons name="options-outline" size={18} color="rgba(255,255,255,0.85)"/>
              {filterHasValue && <View style={s.filterDot}/>}
            </Pressable>
          </Animated.View>

          <Animated.View style={{opacity:heroFade,transform:[{translateY:heroY}]}}>
            <Text style={s.greetSub}>Your payment history</Text>
            <Text style={s.greetName}>Activity.</Text>
            <View style={s.ruleRow}>
              <View style={s.greetRule}/>
              {/* Active period badge */}
              <ActiveBadge period={period} onClear={()=>setPeriod('all')}/>
            </View>
          </Animated.View>
        </View>

        {/* Curve shadow */}
        <Animated.View style={[s.curveShadow,{opacity:cardFade}]}/>

        {/* ═══════════ CARD ═══════════ */}
        <Animated.View style={[s.card,{transform:[{translateY:cardSlide}],opacity:cardFade}]}>
          <View style={s.handle}/>

          <View style={s.listWrap}>
            {groups.length===0 ? (
              <View style={s.empty}>
                <View style={s.emptyIcon}>
                  <Ionicons name="receipt-outline" size={28} color="#C4CDD8"/>
                </View>
                <Text style={s.emptyTitle}>No transactions found</Text>
                <Text style={s.emptySub}>Try a different time period</Text>
                <Pressable onPress={()=>setPeriod('all')} style={s.emptyBtn}>
                  <Text style={s.emptyBtnText}>Show all transactions</Text>
                </Pressable>
              </View>
            ) : (
              groups.map((group,gi)=>(
                <View key={gi}>
                  <DayHeader label={group.label}/>
                  {group.data.map(txn=>{
                    const idx = globalIndex++;
                    return(
                      <TxnRow
                        key={txn.id}
                        txn={txn}
                        onPress={()=>openTxn(txn)}
                        index={idx}
                      />
                    );
                  })}
                </View>
              ))
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* ═══════════ FILTER SHEET ═══════════ */}
      <FilterSheet
        visible={filterVisible}
        current={period}
        onSelect={setPeriod}
        onClose={()=>setFilterVisible(false)}
      />

      {/* ═══════════ DETAIL SHEET ═══════════ */}
      <DetailSheet
        txn={selectedTxn}
        visible={detailVisible}
        onClose={()=>setDetailVisible(false)}
      />
    </View>
  );
}

// ─────────────────────────────────────────────
const s = StyleSheet.create({
  root:  {flex:1,backgroundColor:SLATE},
  scroll:{flex:1},

  hero:{
    backgroundColor:SLATE,
    paddingHorizontal:24,paddingBottom:56,
  },
  ringOuter:{
    position:'absolute',top:-28,right:-48,
    width:190,height:190,borderRadius:95,
    borderWidth:32,borderColor:'rgba(242,118,73,0.10)',
  },
  ringInner:{
    position:'absolute',top:22,right:12,
    width:96,height:96,borderRadius:48,
    borderWidth:1.5,borderColor:'rgba(242,118,73,0.22)',
  },
  topBar:{
    flexDirection:'row',alignItems:'center',
    justifyContent:'space-between',marginBottom:28,
  },
  wordRow:  {flexDirection:'row',alignItems:'center',gap:7},
  wordDot:  {width:8,height:8,borderRadius:4,backgroundColor:CORAL},
  wordmark: {color:'#FFFFFF',fontSize:14,fontWeight:'800',letterSpacing:4,fontFamily:SANS},

  filterBtn:{
    width:38,height:38,borderRadius:12,
    borderWidth:1,borderColor:'rgba(255,255,255,0.2)',
    alignItems:'center',justifyContent:'center',
    position:'relative',
  },
  filterDot:{
    position:'absolute',top:7,right:7,
    width:7,height:7,borderRadius:4,
    backgroundColor:CORAL,
    borderWidth:1.5,borderColor:SLATE,
  },

  greetSub: {color:'rgba(255,255,255,0.42)',fontSize:14,fontFamily:SANS,letterSpacing:0.4,marginBottom:4},
  greetName:{color:'#FFFFFF',fontSize:40,fontWeight:'700',fontFamily:SERIF,letterSpacing:-1,lineHeight:44},
  ruleRow:  {flexDirection:'row',alignItems:'center',gap:12,marginTop:12},
  greetRule:{width:36,height:3,backgroundColor:CORAL,borderRadius:2},

  curveShadow:{
    position:'absolute',bottom:0,left:0,right:0,height:120,
    borderTopLeftRadius:CARD_RADIUS,borderTopRightRadius:CARD_RADIUS,
    backgroundColor:'#FFFFFF',
    shadowColor:'#000',shadowOffset:{width:0,height:-14},
    shadowOpacity:0.20,shadowRadius:28,elevation:22,
  },
  card:{
    flex:1,
    backgroundColor:OFF,
    borderTopLeftRadius:CARD_RADIUS,borderTopRightRadius:CARD_RADIUS,
    marginTop:-CARD_RADIUS,paddingTop:16,
    paddingBottom:32,
    minHeight:height * 0.7,
  },
  handle:{
    width:40,height:4,borderRadius:2,
    backgroundColor:'#D1D9E0',
    alignSelf:'center',marginBottom:16,
  },

  listWrap:{paddingHorizontal:16,paddingTop:4},

  empty:{alignItems:'center',paddingVertical:56,gap:10},
  emptyIcon:{
    width:64,height:64,borderRadius:20,
    backgroundColor:'#FFFFFF',
    alignItems:'center',justifyContent:'center',
    shadowColor:DARK,shadowOffset:{width:0,height:4},
    shadowOpacity:0.06,shadowRadius:10,elevation:3,
    marginBottom:4,
  },
  emptyTitle:{color:DARK,fontSize:16,fontWeight:'700',fontFamily:SERIF},
  emptySub:  {color:'#9CA3AF',fontSize:13,fontFamily:SANS,textAlign:'center'},
  emptyBtn:  {
    marginTop:8,borderWidth:1,borderColor:CORAL,
    borderRadius:20,paddingHorizontal:20,paddingVertical:9,
  },
  emptyBtnText:{color:CORAL,fontSize:13,fontWeight:'700',fontFamily:SANS},
});