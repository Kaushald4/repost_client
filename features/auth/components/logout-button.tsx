"use client";
import { logoutAction } from "@/features/auth/services/auth.action";
import { DropdownMenuItem } from "../../../components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const LogoutButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return (
    <>
      <DropdownMenuItem
        onClick={async () => {
          await logoutAction();
          queryClient.clear();
          router.refresh();
        }}
      >
        Log out
      </DropdownMenuItem>
    </>
  );
};

export default LogoutButton;
