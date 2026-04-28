// import * as React from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {Button} from '@/components/ui/button';
// import {useAirtimeStore} from '../../store/airtimeStore';
// import {AirtimeTopupStackParamList} from '../../navigation/AirtimeTopupNavigator';
// import {useAppStore} from '@shared/store/appStore';

// type NavigationProp = StackNavigationProp<AirtimeTopupStackParamList>;

// const PAYMENT_METHODS = [
//   {id: 'wallet', name: 'Wallet Balance', icon: 'wallet'},
//   {id: 'card', name: 'Debit Card', icon: 'credit-card'},
//   {id: 'bank', name: 'Bank Transfer', icon: 'landmark'},
// ];

// export function SelectPaymentScreen() {
//   const navigation = useNavigation<NavigationProp>();
//   const {paymentMethod, setPaymentMethod} = useAirtimeStore();
//   const user = useAppStore((state) => state.user);

//   return (
//     <View className="flex-1 bg-white p-4">
//       <Text className="text-lg font-semibold mb-4">Select payment method</Text>
      
//       <View className="gap-3 mb-6">
//         {PAYMENT_METHODS.map((method) => (
//           <TouchableOpacity
//             key={method.id}
//             onPress={() => setPaymentMethod(method.id)}
//             className={`p-4 rounded-lg border-2 flex-row items-center ${
//               paymentMethod === method.id 
//                 ? 'border-blue-600 bg-blue-50' 
//                 : 'border-gray-200'
//             }`}>
//             <View className="flex-1">
//               <Text className="font-semibold">{method.name}</Text>
//               {method.id === 'wallet' && user?.balance !== undefined && (
//                 <Text className="text-sm text-gray-500">
//                   Balance: ₦{user.balance.toLocaleString()}
//                 </Text>
//               )}
//             </View>
//             {paymentMethod === method.id && (
//               <View className="w-5 h-5 rounded-full bg-blue-600" />
//             )}
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Button
//         onPress={() => navigation.navigate('EnterPin')}
//         disabled={!paymentMethod}
//         className="mt-auto">
//         Continue
//       </Button>
//     </View>
//   );
// }
