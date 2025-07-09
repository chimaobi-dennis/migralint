
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Home, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const PathwaySelection = () => {
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Find a program", 
      url: "/applications",
      icon: Calendar,
    },
    {
      title: "Forum",
      url: "/forum",
      icon: BarChart3,
    },
    {
      title: "For Universities",
      url: "/universities",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-black text-white px-3 py-1 rounded text-sm font-bold">
                UniPlanr
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center space-x-1"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Avatar */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">0</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How would you like to continue?
            </h1>
            <p className="text-lg text-gray-600">
              Choose your desired pathway for completing your study abroad journey
            </p>
          </div>

          {/* Pathway Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Self Directed Card */}
            <Card className="bg-blue-50 border-blue-200 p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Self Directed
                    </h2>
                    <p className="text-gray-700 mb-8">
                      Our friendly interface allows you to navigate the application process on your own, with video tutorials and support from us
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                      onClick={() => console.log('Self Directed selected')}
                    >
                      Continue
                    </Button>
                    <div className="w-24 h-16 bg-blue-100 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Find an Adviser Card */}
            <Card className="bg-gray-50 border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Find an adviser
                    </h2>
                    <p className="text-gray-700 mb-8">
                      A consult will be assigned to handle your application process, and fees paid based on service offered.
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <Button 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2"
                      onClick={() => console.log('Find adviser selected')}
                    >
                      Continue
                    </Button>
                    <div className="w-24 h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-sm text-gray-600">
              Uniplanr, an education consultancy firm, dedicated to helping students find the best programs and guidance through application process.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>Copyright © 2025 | IGSoft Web For Uniplanr.</span>
              <div className="flex space-x-4">
                <span className="hover:text-gray-700 cursor-pointer">Terms of use</span>
                <span className="hover:text-gray-700 cursor-pointer">Privacy policy</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PathwaySelection;
