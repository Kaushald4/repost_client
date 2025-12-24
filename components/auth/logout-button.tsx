"use client";
import { logout } from "@/services/auth/auth.action";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const LogoutButton = () => {
  return (
    <>
      <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
    </>
  );
};

export default LogoutButton;
