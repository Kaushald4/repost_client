import Link from "next/link";
import { HeaderSearch } from "./header-search";
import { HeaderActions } from "./header-actions";
import { MobileMenu } from "./mobile-menu";
// import { ProfileService } from "@/services/profile.service";

export async function AppHeader() {
  // const profile = await ProfileService.getProfile();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-4">
          <MobileMenu />

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              R
            </div>
            <span className="hidden sm:inline-block font-bold text-xl">
              Repost
            </span>
          </Link>
        </div>

        {/* Center: Search (Desktop) */}
        <HeaderSearch />

        {/* Right: Actions */}
        <HeaderActions />
      </div>
    </header>
  );
}
