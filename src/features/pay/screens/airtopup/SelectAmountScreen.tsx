import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useAirtimeStore} from '../../store/airtimeStore';
import {AirtimeTopupStackParamList} from '../../navigation/AirtimeTopupNavigator';

type NavigationProp = StackNavigationProp<AirtimeTopupStackParamList>;

const QUICK_AMOUNTS = ['100', '200', '500', '1000', '2000', '5000'];

export function SelectAmountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {amount, setAmount} = useAirtimeStore();

  const canProceed = parseFloat(amount) > 0;

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-semibold mb-4">Enter amount</Text>
      
      <Input
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
        className="text-2xl mb-4"
      />

      <Text className="text-sm text-gray-500 mb-4">Quick select</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {QUICK_AMOUNTS.map((amt) => (
          <TouchableOpacity
            key={amt}
            onPress={() => setAmount(amt)}
            className={`px-4 py-3 rounded-lg ${amount === amt ? 'bg-blue-600' : 'bg-gray-100'}`}>
            <Text className={amount === amt ? 'text-white font-semibold' : 'text-gray-800'}>
              ₦{amt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        onPress={() => navigation.navigate('SelectPayment')}
        disabled={!canProceed}
        className="mt-auto">
        Continue
      </Button>
    </View>
  );
}
