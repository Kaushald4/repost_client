import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { cookieHelper } from "@/lib/cookieHelper";
import { TLoginRequest, TSignupRequest } from "@/types/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: (data: TSignupRequest) => authService.register(data),
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: TLoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, refreshTokenId, userId } =
        response.data;
      cookieHelper.set("access_token", accessToken);
      cookieHelper.set("refresh_token", refreshToken);
      cookieHelper.set("refresh_token_id", refreshTokenId);
      cookieHelper.setUserData({ userId, refreshTokenId });

      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const useUser = () => {
    return useQuery({
      queryKey: ["user"],
      queryFn: () => authService.verify(),
      retry: false,
      refetchOnWindowFocus: false,
    });
  };

  const useUserSuspense = () => {
    return useSuspenseQuery({
      queryKey: ["user"],
      queryFn: () => authService.verify(),
      retry: false,
    });
  };

  const logout = () => {
    cookieHelper.remove("access_token");
    cookieHelper.remove("refresh_token");
    cookieHelper.remove("refresh_token_id");
    cookieHelper.remove("user_data");
    queryClient.setQueryData(["user"], null);
    router.push("/login");
  };

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    user: useUser().data,
    isLoadingUser: useUser().isLoading,
    useUserSuspense,
    logout,
  };
};
