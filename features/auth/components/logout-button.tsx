"use client";
import { logoutAction } from "@/features/auth/services/auth.action";
import { DropdownMenuItem } from "../../../components/ui/dropdown-menu";

const LogoutButton = () => {
  return (
    <>
      <DropdownMenuItem onClick={logoutAction}>Log out</DropdownMenuItem>
    </>
  );
};

export default LogoutButton;
