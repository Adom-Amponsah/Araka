import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {userApi, servicesApi, transactionsApi, payApi, authApi} from '@shared/services/api';

// Auth hooks
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: ({phone}: {phone: string}) => authApi.requestOtp(phone),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({phone, otp}: {phone: string; otp: string}) => 
      authApi.verifyOtp(phone, otp),
  });
};

// User hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
    enabled: false, // Only fetch when authenticated
  });
};

// Services hooks
export const useRecentServices = () => {
  return useQuery({
    queryKey: ['services', 'recent'],
    queryFn: () => servicesApi.getRecent(),
  });
};

export const useAllServices = () => {
  return useQuery({
    queryKey: ['services', 'all'],
    queryFn: () => servicesApi.getAll(),
  });
};

// Transactions hooks
export const useTransactions = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['transactions', page],
    queryFn: () => transactionsApi.getTransactions(page, limit),
    placeholderData: (previousData) => previousData,
  });
};

// Payment hooks
export const useBuyAirtime = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => payApi.buyAirtime(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};

export const useSendMoney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => payApi.sendMoney(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};
