import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useAirtimeStore} from '../../store/airtimeStore';
import {AirtimeTopupStackParamList} from '../../navigation/AirtimeTopupNavigator';

type NavigationProp = StackNavigationProp<AirtimeTopupStackParamList>;

const NETWORKS = [
  {id: 'mtn', name: 'MTN', color: 'bg-yellow-400'},
  {id: 'airtel', name: 'Airtel', color: 'bg-red-500'},
  {id: 'glo', name: 'Glo', color: 'bg-green-500'},
  {id: '9mobile', name: '9mobile', color: 'bg-green-400'},
];

export function EnterNumberScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {phoneNumber, networkProvider, setPhoneNumber, setNetworkProvider} = 
    useAirtimeStore();
  const canProceed = phoneNumber.length >= 10 && networkProvider;

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-semibold mb-4">Enter phone number</Text>
      
      <Input
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone number"
        keyboardType="phone-pad"
        className="mb-4"
      />

      <Text className="text-lg font-semibold mb-4">Select network</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {NETWORKS.map((network) => (
          <TouchableOpacity
            key={network.id}
            onPress={() => setNetworkProvider(network.id)}
            className={`px-4 py-3 rounded-lg ${networkProvider === network.id ? network.color + ' border-2 border-blue-600' : 'bg-gray-100'}`}>
            <Text className={networkProvider === network.id ? 'text-white font-semibold' : 'text-gray-800'}>
              {network.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        onPress={() => navigation.navigate('SelectAmount')}
        disabled={!canProceed}
        className="mt-auto">
        Continue
      </Button>
    </View>
  );
}
