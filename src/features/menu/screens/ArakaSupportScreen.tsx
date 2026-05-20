import * as React from 'react';
import {MenuInfoScreen} from './MenuInfoScreen';

export function ArakaSupportScreen() {
  return (
    <MenuInfoScreen
      title="Araka Support"
      subtitle="Get help with a transfer, airtime topup, payment status, or anything that feels off in your account."
      icon="chatbubble-ellipses-outline"
      showHeroIcon={false}
      stats={[
        {label: 'Typical reply', value: '< 5m'},
        {label: 'Support', value: 'Online'},
      ]}
      actions={[
        {label: 'Email support', value: 'support@araka.app', icon: 'mail-outline'},
        {label: 'Call support', value: '+233 30 000 0000', icon: 'call-outline'},
        {label: 'WhatsApp support', value: '+233 55 000 0000', icon: 'logo-whatsapp'},
      ]}
      note="For transfer or airtime issues, include the amount, time, and the phone number or recipient involved."
      primaryLabel="Done"
    />
  );
}
