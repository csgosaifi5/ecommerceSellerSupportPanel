import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../axios/user-API";
import { toast } from "sonner";
import { useAuthStore } from "@/context/auth-context";
import { AxiosError } from "axios";

export const useAuthLogin = () => {
  const { setUser, userDetails } = useAuthStore();
  return useMutation({
    mutationFn: userAPI.login,
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      localStorage.setItem("token", data.data.token);
      setUser(data.data.result);
    },
    onError: (error: any) => {
      toast.error(error.response.data.error ?? "Error logging in");
    },
  });
};

export const useAuthLoginWithOTP = () => {
  return useMutation({
    mutationFn: userAPI.loginWithOtp,
    onSuccess: (data) => {
      toast.success("OTP sent successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.error ?? "Error sending OTP");
    },
  });
};

export const useAuthVerifyLoginOTP = (saveData: boolean = true) => {
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: userAPI.verifyOtp,
    onSuccess: (data) => {
      toast.success("OTP verified successfully");
      localStorage.setItem("token", data.data.token);
      if (saveData)
        setTimeout(() => {
          setUser(data.data.result);
        }, 100);
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.error ?? "Error verifying OTP");
    },
  });
};
export const useAuthVerifySignUpOTP = () => {
  return useMutation({
    mutationFn: userAPI.verifyOtp,
    onSuccess: (data) => {
      toast.success("OTP verified successfully");
      localStorage.setItem("token", data.data.token);
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.error ?? "Error verifying OTP");
    },
  });
};

export const useAuthRegister = () => {
  return useMutation({
    mutationFn: userAPI.register,
    onSuccess: () => {
      toast.success("Registered successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.error ?? "Error registering");
    },
  });
};

export const useUpdateUserData = () => {
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: userAPI.updateUser,
    onSuccess: (data) => {
      toast.success("User data Saved successfully");
      setUser(data.data.result);
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.error ?? "Error updating user data");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      localStorage.clear();
      setUser(null);
      return userAPI.logout();
    },
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out successfully");
    },
    onError: (error: any) => {
      toast.error(error.response.data.error.message ?? "Error logging out");
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    retry: 1,
    queryKey: ["user", "current-user"],
    queryFn: userAPI.getUser,
  });
};

export const useAdminAddress = () => {
  return useQuery({
    retry: 1,
    queryKey: ["user", "admin-address"],
    queryFn: userAPI.getAdminAddress,
  });
};

export const useDashboardData = (filter: any) => {
  return useQuery({
    retry: 1,
    queryKey: ["user", "dashboard", filter],
    queryFn: () => userAPI.getDashboardData(filter),
  });
};

export const useGetActionItems = () => {
  return useQuery({
    queryKey: ["user", "action-items"],
    queryFn: userAPI.getActionItems,
  });
};

export const useGetNotifications = (filter: any) => {
  return useQuery({
    queryKey: ["user", "notifications"],
    queryFn: () => userAPI.getNotifications(filter),
    staleTime: 1000 * 60 * 3,
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userAPI.updateNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "user" && query.queryKey[1] === "notifications",
      });
      toast.success("Notification updated successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.error ?? "Error updating notification");
    },
  });
};

export const useGetEstimation = () => {
  return useMutation({
    mutationFn: userAPI.getEstimate,
  });
};

export const useGetFAQs = () => {
  return useQuery({
    queryKey: ["user", "faqs"],
    queryFn: userAPI.getFaqs,
  });
};

