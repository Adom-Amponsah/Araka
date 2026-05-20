import * as React from 'react';
import {MenuAccordionScreen} from './MenuAccordionScreen';

export function ReportProblemScreen() {
  return (
    <MenuAccordionScreen
      title="Report a problem"
      subtitle="Tell us what happened so the team can trace the transaction and fix the issue faster."
      icon="alert-circle-outline"
      showHeroIcon={false}
      items={[
        {
          title: 'Transfer issue',
          body: 'Send the recipient name or number, amount, payment time, and whether the payment shows successful or failed in the app.',
          icon: 'paper-plane-outline',
        },
        {
          title: 'Airtime issue',
          body: 'Send the phone number topped up, network, amount, and payment time. Also mention if the amount was deducted from your wallet or mobile money.',
          icon: 'phone-portrait-outline',
        },
        {
          title: 'App performance issue',
          body: 'Describe the screen you were on, what you tapped, and what happened. A screenshot helps if the screen is stuck or displaying the wrong state.',
          icon: 'speedometer-outline',
        },
        {
          title: 'Something else',
          body: 'Write a short summary of the issue and include your account email or phone number so support can find the account quickly.',
          icon: 'ellipsis-horizontal-circle-outline',
        },
      ]}
      footer="For payment issues, the amount and time are the most important details to include."
    />
  );
}
