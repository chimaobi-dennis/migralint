
import { Home, Calendar, BarChart3, Settings, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Applications",
      url: "/applications",
      icon: Calendar,
    },
    {
      title: "My Page", 
      url: "/my-page",
      icon: BarChart3,
    },
    {
      title: "Admin Steps",
      url: "/admin/steps",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-center border-b bg-white/80 backdrop-blur-sm px-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UniTracker
            </h1>
            <p className="text-sm text-muted-foreground">Smart Application Management</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 pb-20 sm:pb-24">
        {children}
      </main>

      {/* Floating Navigation - Left Side */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 transition-all duration-300">
          <div className="flex items-center">
            {/* Nav Toggle Button */}
            <Button
              onClick={() => setIsNavExpanded(!isNavExpanded)}
              className="h-12 w-12 rounded-2xl transition-all duration-300 text-gray-600 hover:bg-gray-100 hover:scale-105 sm:h-16 sm:w-16 sm:rounded-2xl"
              variant="ghost"
              size="icon"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {/* Navigation Items - Only visible when expanded */}
            <div className={`flex items-center transition-all duration-300 ease-in-out ${
              isNavExpanded 
                ? 'opacity-100 max-w-none translate-x-0 ml-1' 
                : 'opacity-0 max-w-0 translate-x-[-10px] overflow-hidden'
            }`}>
              {navigationItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center transition-all duration-200 h-12 w-12 rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105"
                        : "text-gray-600 hover:bg-gray-100 hover:scale-105"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" />
                  <span className="text-[10px] sm:text-xs font-medium hidden sm:block">{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
