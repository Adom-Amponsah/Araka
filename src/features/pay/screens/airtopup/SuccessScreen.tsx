import * as React from 'react';
import {View, Text} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {Button} from '@/components/ui/button';
import {AirtimeTopupStackParamList} from '../../navigation/AirtimeTopupNavigator';

type SuccessScreenRouteProp = RouteProp<AirtimeTopupStackParamList, 'Success'>;

export function SuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute<SuccessScreenRouteProp>();
  const {transactionId} = route.params;

  return (
    <View className="flex-1 bg-white p-4 justify-center items-center">
      <View className="w-20 h-20 rounded-full bg-green-100 justify-center items-center mb-6">
        <Text className="text-4xl text-green-600">✓</Text>
      </View>

      <Text className="text-2xl font-bold mb-2">Success!</Text>
      <Text className="text-gray-500 text-center mb-6">
        Your airtime topup has been processed successfully.
      </Text>

      <View className="bg-gray-50 p-4 rounded-lg w-full mb-6">
        <Text className="text-sm text-gray-500">Transaction ID</Text>
        <Text className="font-mono text-lg">{transactionId}</Text>
      </View>

      <Button
        onPress={() => navigation.navigate('Home' as never)}
        className="w-full">
        Back to Home
      </Button>
    </View>
  );
}
