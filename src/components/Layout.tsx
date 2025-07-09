
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          {/* Mobile Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 lg:hidden">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3 flex-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Search className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UniTracker
              </h1>
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
