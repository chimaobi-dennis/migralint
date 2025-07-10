
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

      {/* Floating Nav Toggle Button */}
      <Button
        onClick={() => setIsNavExpanded(!isNavExpanded)}
        className="fixed bottom-3 sm:bottom-4 left-3 sm:left-4 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 hover:bg-white/95 transition-all duration-200"
        variant="ghost"
        size="icon"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </Button>

      {/* Floating Bottom Navigation */}
      <div className={`fixed bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-sm transition-all duration-300 ${
        isNavExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-1.5 sm:p-2">
          <div className="flex items-center justify-between space-x-1 sm:space-x-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-1 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" />
                <span className="text-xs font-medium hidden xs:block sm:block">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
