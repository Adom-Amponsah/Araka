export type ServiceCategoryId =
  | 'transfer'
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'tv'
  | 'water'
  | 'internet';

export type ServiceId =
  | 'mobile_money_transfer'
  | 'airtime_topup'
  | 'data_bundle'
  | 'electricity_token'
  | 'tv_subscription'
  | 'water_bill'
  | 'internet_subscription';

export type ServiceFlowId =
  | 'transfer'
  | 'airtimeTopup'
  | 'unsupported';

export type PaymentTelcoId = 'mpesa' | 'airtel_money' | 'vodacom' | 'orange_money';

export type ProviderCapabilities = {
  mobileMoneyTelcos: PaymentTelcoId[];
  cardPayment: boolean;
};

export type ProviderRules = {
  currency: 'USD';
  processingFee: number;
  vatRate?: number;
  minAmount: number;
  maxAmount: number;
};

export type ServiceProviderConfig = {
  id: string;
  categoryId: ServiceCategoryId;
  serviceId: ServiceId;
  flowId: ServiceFlowId;
  name: string;
  sub: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  action: string;
  providerCode: string;
  enabled: boolean;
  capabilities: ProviderCapabilities;
  rules: ProviderRules;
};

export type ServiceCategoryConfig = {
  id: ServiceCategoryId;
  label: string;
  icon: string;
  providers: ServiceProviderConfig[];
};

const defaultMoneyCapabilities: ProviderCapabilities = {
  mobileMoneyTelcos: ['mpesa', 'airtel_money', 'orange_money'],
  cardPayment: true,
};

const defaultAirtimeCapabilities: ProviderCapabilities = {
  mobileMoneyTelcos: ['mpesa', 'airtel_money', 'vodacom'],
  cardPayment: true,
};

export const PAYMENT_TELCOS: Record<PaymentTelcoId, {id: PaymentTelcoId; label: string}> = {
  mpesa: {id: 'mpesa', label: 'MPesa'},
  airtel_money: {id: 'airtel_money', label: 'Airtel Money'},
  vodacom: {id: 'vodacom', label: 'Vodacom'},
  orange_money: {id: 'orange_money', label: 'ORANGE'},
};

export const SERVICE_CATEGORIES: ServiceCategoryConfig[] = [
  {
    id: 'transfer',
    label: 'Transfer',
    icon: 'paper-plane-outline',
    providers: [
      {
        id: 'mpesa-transfer',
        categoryId: 'transfer',
        serviceId: 'mobile_money_transfer',
        flowId: 'transfer',
        name: 'M-Pesa',
        sub: 'Safaricom',
        icon: 'paper-plane-outline',
        iconBg: '#EDFBF4',
        iconColor: '#10B981',
        action: 'Send',
        providerCode: 'MPESA_TRANSFER',
        enabled: true,
        capabilities: defaultMoneyCapabilities,
        rules: {currency: 'USD', processingFee: 0.5, vatRate: 0.05, minAmount: 1, maxAmount: 5000},
      },
      {
        id: 'orange-transfer',
        categoryId: 'transfer',
        serviceId: 'mobile_money_transfer',
        flowId: 'transfer',
        name: 'Orange Money',
        sub: 'Orange',
        icon: 'paper-plane-outline',
        iconBg: '#FEF3E2',
        iconColor: '#D97706',
        action: 'Send',
        providerCode: 'ORANGE_TRANSFER',
        enabled: true,
        capabilities: defaultMoneyCapabilities,
        rules: {currency: 'USD', processingFee: 0.5, vatRate: 0.05, minAmount: 1, maxAmount: 5000},
      },
      {
        id: 'airtel-transfer',
        categoryId: 'transfer',
        serviceId: 'mobile_money_transfer',
        flowId: 'transfer',
        name: 'Airtel Money',
        sub: 'Airtel',
        icon: 'paper-plane-outline',
        iconBg: '#FEE8DF',
        iconColor: '#C0392B',
        action: 'Send',
        providerCode: 'AIRTEL_TRANSFER',
        enabled: true,
        capabilities: defaultMoneyCapabilities,
        rules: {currency: 'USD', processingFee: 0.5, vatRate: 0.05, minAmount: 1, maxAmount: 5000},
      },
    ],
  },
  {
    id: 'airtime',
    label: 'Airtime',
    icon: 'phone-portrait-outline',
    providers: [
      {
        id: 'mtn-airtime',
        categoryId: 'airtime',
        serviceId: 'airtime_topup',
        flowId: 'airtimeTopup',
        name: 'MTN',
        sub: 'All networks',
        icon: 'phone-portrait-outline',
        iconBg: '#FFF8E6',
        iconColor: '#F59E0B',
        action: 'Top Up',
        providerCode: 'MTN_AIRTIME',
        enabled: true,
        capabilities: defaultAirtimeCapabilities,
        rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 1000},
      },
      {
        id: 'vodacom-airtime',
        categoryId: 'airtime',
        serviceId: 'airtime_topup',
        flowId: 'airtimeTopup',
        name: 'Vodacom',
        sub: 'Instant recharge',
        icon: 'phone-portrait-outline',
        iconBg: '#FEE8DF',
        iconColor: '#E53E3E',
        action: 'Top Up',
        providerCode: 'VODACOM_AIRTIME',
        enabled: true,
        capabilities: defaultAirtimeCapabilities,
        rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 1000},
      },
      {
        id: 'airtel-airtime',
        categoryId: 'airtime',
        serviceId: 'airtime_topup',
        flowId: 'airtimeTopup',
        name: 'Airtel',
        sub: 'All amounts',
        icon: 'phone-portrait-outline',
        iconBg: '#FEE8DF',
        iconColor: '#C0392B',
        action: 'Top Up',
        providerCode: 'AIRTEL_AIRTIME',
        enabled: true,
        capabilities: defaultAirtimeCapabilities,
        rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 1000},
      },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    icon: 'wifi-outline',
    providers: [
      {id: 'mtn-data', categoryId: 'data', serviceId: 'data_bundle', flowId: 'unsupported', name: 'MTN Data', sub: 'Data bundles', icon: 'wifi-outline', iconBg: '#FFF8E6', iconColor: '#F59E0B', action: 'Buy', providerCode: 'MTN_DATA', enabled: false, capabilities: defaultAirtimeCapabilities, rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 1000}},
      {id: 'airtel-data', categoryId: 'data', serviceId: 'data_bundle', flowId: 'unsupported', name: 'Airtel Data', sub: 'All plans', icon: 'wifi-outline', iconBg: '#FEE8DF', iconColor: '#C0392B', action: 'Buy', providerCode: 'AIRTEL_DATA', enabled: false, capabilities: defaultAirtimeCapabilities, rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 1000}},
    ],
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: 'flash-outline',
    providers: [
      {id: 'snel-electricity', categoryId: 'electricity', serviceId: 'electricity_token', flowId: 'unsupported', name: 'SNEL', sub: 'Societe Nationale', icon: 'flash-outline', iconBg: '#FFF8E6', iconColor: '#F59E0B', action: 'Buy Token', providerCode: 'SNEL', enabled: false, capabilities: defaultMoneyCapabilities, rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 5000}},
    ],
  },
  {
    id: 'tv',
    label: 'Cable TV',
    icon: 'tv-outline',
    providers: [
      {id: 'dstv-tv', categoryId: 'tv', serviceId: 'tv_subscription', flowId: 'unsupported', name: 'DSTV', sub: 'Multichoice', icon: 'tv-outline', iconBg: '#E8F4FD', iconColor: '#2980B9', action: 'Renew', providerCode: 'DSTV', enabled: false, capabilities: defaultMoneyCapabilities, rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 5000}},
      {id: 'gotv-tv', categoryId: 'tv', serviceId: 'tv_subscription', flowId: 'unsupported', name: 'GOtv', sub: 'Multichoice', icon: 'tv-outline', iconBg: '#FFF8E6', iconColor: '#F59E0B', action: 'Renew', providerCode: 'GOTV', enabled: false, capabilities: defaultMoneyCapabilities, rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 5000}},
    ],
  },
  {
    id: 'water',
    label: 'Water',
    icon: 'water-outline',
    providers: [
      {id: 'ruwasa-water', categoryId: 'water', serviceId: 'water_bill', flowId: 'unsupported', name: 'RUWASA', sub: 'Rural Water', icon: 'water-outline', iconBg: '#E8F8FF', iconColor: '#0EA5E9', action: 'Pay', providerCode: 'RUWASA', enabled: false, capabilities: defaultMoneyCapabilities, rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 5000}},
    ],
  },
  {
    id: 'internet',
    label: 'Internet',
    icon: 'globe-outline',
    providers: [
      {id: 'spectranet-internet', categoryId: 'internet', serviceId: 'internet_subscription', flowId: 'unsupported', name: 'Spectranet', sub: 'Broadband', icon: 'globe-outline', iconBg: '#E8F4FD', iconColor: '#2980B9', action: 'Renew', providerCode: 'SPECTRANET', enabled: false, capabilities: defaultMoneyCapabilities, rules: {currency: 'USD', processingFee: 0.5, minAmount: 1, maxAmount: 5000}},
    ],
  },
];

