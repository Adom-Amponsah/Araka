import * as React from 'react';
import {MenuAccordionScreen} from './MenuAccordionScreen';

export function HelpCenterScreen() {
  return (
    <MenuAccordionScreen
      title="Help Center"
      subtitle="Quick answers for the things people actually need help with: transfers, failed payments, airtime topups, and account safety."
      icon="help-buoy-outline"
      showHeroIcon={false}
      items={[
        {
          title: 'Why did my transfer fail?',
          body: 'Check that the recipient details, amount, and payment prompt were completed. If money was debited, keep the transaction time and amount ready before contacting support.',
          icon: 'paper-plane-outline',
        },
        {
          title: 'Airtime topup not received',
          body: 'Confirm the phone number and network first. Airtime can take a few minutes to arrive. If it still does not show, report it with the amount, network, and time.',
          icon: 'phone-portrait-outline',
        },
        {
          title: 'How refunds are handled',
          body: 'Failed payments should be reviewed from the transaction status. If the provider confirms failure, the reversal path depends on the payment method used.',
          icon: 'refresh-circle-outline',
        },
        {
          title: 'Keeping your account secure',
          body: 'Keep app lock enabled, do not share OTPs or PINs, and report any payment you do not recognize as soon as possible.',
          icon: 'shield-checkmark-outline',
        },
      ]}
      footer="If the answer does not solve it, contact Araka Support with the transaction amount and time."
    />
  );
}
