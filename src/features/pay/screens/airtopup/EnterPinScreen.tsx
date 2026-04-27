import * as React from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '@/components/ui/button';
import {useAirtimeStore} from '../../store/airtimeStore';
import {useBuyAirtime} from '@/shared/hooks/useQuery';
import {AirtimeTopupStackParamList} from '../../navigation/AirtimeTopupNavigator';

type NavigationProp = StackNavigationProp<AirtimeTopupStackParamList>;

export function EnterPinScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {pin, setPin, phoneNumber, amount, networkProvider, resetFlow} = 
    useAirtimeStore();
  const buyAirtime = useBuyAirtime();

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert('Error', 'Please enter 4-digit PIN');
      return;
    }

    try {
      const result = await buyAirtime.mutateAsync({
        phoneNumber,
        amount: parseFloat(amount),
        networkProvider,
        pin,
      });

      resetFlow();
      navigation.navigate('Success', {
        transactionId: result.data?.transactionId || 'TXN123456',
      });
    } catch (error) {
      Alert.alert('Error', 'Transaction failed. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-semibold mb-2">Enter transaction PIN</Text>
      <Text className="text-sm text-gray-500 mb-6">
        You're buying ₦{amount} airtime for {phoneNumber}
      </Text>

      <TextInput
        value={pin}
        onChangeText={(text) => {
          if (text.length <= 4) setPin(text);
        }}
        placeholder="••••"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        className="text-3xl text-center tracking-[20px] border-b-2 border-gray-300 py-4 mb-6"
      />

      <Button
        onPress={handleSubmit}
        disabled={pin.length !== 4 || buyAirtime.isPending}
        className="mt-auto">
        {buyAirtime.isPending ? 'Processing...' : 'Confirm'}
      </Button>
    </View>
  );
}
