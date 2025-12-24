"use client";
import { logoutAction } from "@/services/auth/auth.action";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const LogoutButton = () => {
  return (
    <>
      <DropdownMenuItem onClick={logoutAction}>Log out</DropdownMenuItem>
    </>
  );
};

export default LogoutButton;
