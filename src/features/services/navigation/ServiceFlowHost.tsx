import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getSystemFont} from '@styles/typography';
import {AirtimeTopupFlow} from '../flows/AirtimeTopupFlow';
import {TransferFlow} from '../flows/TransferFlow';
import {useServiceSessionStore} from '../store/serviceSessionStore';

export function ServiceFlowHost() {
  const navigation = useNavigation<any>();
  const activeSession = useServiceSessionStore(s => s.activeSession);
  const closeServiceSession = useServiceSessionStore(s => s.closeServiceSession);

  if (!activeSession) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>No active service</Text>
        <Pressable
          onPress={() => {
            closeServiceSession();
            navigation.goBack();
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  switch (activeSession.flowId) {
    case 'airtimeTopup':
      return <AirtimeTopupFlow />;
    case 'transfer':
      return <TransferFlow />;
    default:
      return (
        <View style={styles.root}>
          <Text style={styles.title}>Service unavailable</Text>
          <Text style={styles.body}>This service flow is not available yet.</Text>
          <Pressable
            onPress={() => {
              closeServiceSession();
              navigation.goBack();
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Back to Services</Text>
          </Pressable>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F4F6FA',
    gap: 12,
  },
  title: {
    color: '#1A2535',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    textAlign: 'center',
  },
  body: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: getSystemFont(),
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#F27649',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
});
