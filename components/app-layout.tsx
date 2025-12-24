import { AppHeader } from "../app/_components/header/app-header";
import { Sidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto">
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 sticky top-16 h-[calc(100vh-4rem)]">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
