import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationService = 'transfer' | 'airtime';
export type NotificationTone = 'success' | 'failed';
export type NotificationFilter = 'all' | 'unread' | NotificationService;

export type AppNotification = {
  id: string;
  service: NotificationService;
  tone: NotificationTone;
  title: string;
  amount?: string;
  meta: string;
  timestamp: string;
  unread: boolean;
};

type NotificationState = {
  notifications: AppNotification[];
  activeFilter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
};

const seedNotifications: AppNotification[] = [
  {
    id: 'n-transfer-01',
    service: 'transfer',
    tone: 'success',
    title: 'Transfer successful',
    amount: 'GHS 120.00',
    meta: 'Today',
    timestamp: '10:42',
    unread: true,
  },
  {
    id: 'n-airtime-01',
    service: 'airtime',
    tone: 'success',
    title: 'Airtime top-up successful',
    amount: 'GHS 20.00',
    meta: 'Today',
    timestamp: '10:26',
    unread: true,
  },
  {
    id: 'n-transfer-02',
    service: 'transfer',
    tone: 'failed',
    title: 'Transfer failed',
    amount: 'GHS 75.00',
    meta: 'Yesterday',
    timestamp: '18:04',
    unread: true,
  },
  {
    id: 'n-airtime-02',
    service: 'airtime',
    tone: 'success',
    title: 'Airtime top-up successful',
    amount: 'GHS 10.00',
    meta: 'Yesterday',
    timestamp: '09:15',
    unread: false,
  },
  {
    id: 'n-transfer-03',
    service: 'transfer',
    tone: 'success',
    title: 'Transfer successful',
    amount: 'GHS 45.00',
    meta: 'Monday',
    timestamp: '14:30',
    unread: false,
  },
  {
    id: 'n-airtime-03',
    service: 'airtime',
    tone: 'failed',
    title: 'Airtime top-up failed',
    amount: 'GHS 15.00',
    meta: 'Mar 29',
    timestamp: '08:05',
    unread: false,
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    set => ({
      notifications: seedNotifications,
      activeFilter: 'all',
      setFilter: activeFilter => set({activeFilter}),
      markAllAsRead: () =>
        set(state => ({
          notifications: state.notifications.map(item => ({...item, unread: false})),
        })),
      markAsRead: id =>
        set(state => ({
          notifications: state.notifications.map(item =>
            item.id === id ? {...item, unread: false} : item,
          ),
        })),
    }),
    {
      name: 'notification-store',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: () => ({
        notifications: seedNotifications,
        activeFilter: 'all',
      }),
      partialize: state => ({
        notifications: state.notifications,
        activeFilter: state.activeFilter,
      }),
    },
  ),
);

export const selectUnreadCount = (state: NotificationState) =>
  state.notifications.filter(item => item.unread).length;
