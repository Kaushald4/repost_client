"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Log In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log In</DialogTitle>
          <DialogDescription>
            Enter your email and password to access your account.
          </DialogDescription>
        </DialogHeader>
        <LoginForm
          onSuccess={() => {
            setIsOpen(false);
            queryClient.clear();
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
