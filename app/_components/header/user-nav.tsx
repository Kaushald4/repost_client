import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginModal } from "@/components/auth/login-modal";
import { SignupModal } from "@/components/auth/signup-modal";
import { ProfileService } from "@/services/profile/profile.server";
import { cookies, headers } from "next/headers";

export default async function UserNav() {
  // const { data: currentUser } = useUserSuspense();
  // const currentUser = await ProfileService.getProfile();

  // const h = await headers();
  // const cookieStore = await cookies();

  // const protocol = h.get("x-forwarded-proto") ?? "http";
  // const host = h.get("x-forwarded-host") ?? h.get("host");

  // const origin = `${protocol}://${host}`;

  // const res = await fetch(`${origin}/api/proxy/user/user-info`, {
  //   cache: "no-store",
  //   credentials: "include",
  //   headers: {
  //     cookie: h.get("cookie") ?? "",
  //     Authorization: `Bearer ${cookieStore.get("access_token")?.value ?? ""}`,
  //   },
  // });
  // // console.log(res.ok);
  // const userData = await res.json();
  // console.log(userData, "userdata");

  if (true) {
    return (
      <div className="flex items-center gap-2">
        <LoginModal />
        <SignupModal />
      </div>
    );
  }

  return (
    <DropdownMenu>
      {/* <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>
              {currentUser.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <p className="font-medium">{currentUser.displayName}</p>
            <p className="text-xs text-muted-foreground">
              @{currentUser.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/u/${currentUser.username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/saved">Saved Posts</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
