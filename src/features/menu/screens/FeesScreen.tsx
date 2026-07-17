import React from 'react';
import {View,Text,Pressable,StyleSheet,ScrollView,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SANS = getSystemFont();

const feeData = [
  {title: 'Airtime Top-Up',
    fees: [
      {name: 'Vodacom', value: '1%'},
      {name: 'Airtel', value: '1%'},
      {name: 'Orange', value: '1%'},
      {name: 'Africell', value: '1%'},
    ],
  },
  {title: 'Electricity',
    fees: [
      {name: 'SNEL', value: '1.5%'},
      {name: 'Socodee', value: '1.5%'},
    ],
  },
  {title: 'Internet Subscription',
    fees: [
      {name: 'Liquid Internet', value: '2%'},
    ],
  },
  {title: 'TV Subscription',
    fees: [
      {name: 'Canal+', value: '2%'},
    ],
  },
];

export function FeesScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, {paddingTop: Math.max(insets.top, 20) + 10}]}showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827"/>
        </Pressable>

        <Text style={styles.title}> Fees </Text>
        <Text style={styles.description}> Here is a breakdown of the fees applied to transactions. All fees are shown before confirmation.</Text>

        {
          feeData.map((category) => (
            <View key={category.title} style={styles.section}>
            <Text style={styles.sectionTitle}> {category.title}</Text>
            <View style={styles.card}>
                {
                category.fees.map((item, index) => (
                    <View key={item.name} style={[styles.row,index !== category.fees.length - 1 &&styles.borderBottom]}>
                        <Text style={styles.provider}> {item.name}</Text>
                        <Text style={styles.value}>{item.value}</Text>
                    </View>
                  ))
                }

              </View>

            </View>
          ))
        }

      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal: 16,
    backgroundColor:'#FFFFFF',
  },
  content:{
    paddingHorizontal:10,
    paddingBottom:30,
  },
  backButton:{
    marginBottom:30,
  },
  title:{
    fontSize:24,
    fontWeight:'700',
    color:'#111827',
    marginBottom:8,
  },
  description:{
    fontSize:14,
    lineHeight:22,
    color: '#3D4A5C',
    fontFamily: SANS,
    marginBottom:25,
    width:'95%',
  },
  section:{
    marginBottom:28,
  },
  sectionTitle:{
    fontSize:14,
    fontWeight:'600',
    color:'#64748B',
    marginBottom:10,
  },
  card:{
    borderWidth:1,
    borderColor:'#E5E7EB',
    borderRadius:10,
    overflow:'hidden',
  },
  row:{
    height:46,
    paddingHorizontal:16,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#FFFFFF',
  },
  borderBottom:{
    borderBottomWidth:1,
    borderBottomColor:'#E5E7EB',
  },
  provider:{
    fontSize:14,
    color:'#475569',
  },
  value:{
    fontSize:14,
    color:'#111827',
    fontWeight:'500',
  },

});