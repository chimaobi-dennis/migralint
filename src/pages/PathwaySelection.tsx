
import { Button } from "@/components/ui/button";
import { Calendar, Home, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const PathwaySelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/applications" className="flex items-center space-x-2 text-blue-600 font-medium">
              <Calendar className="h-4 w-4" />
              <span>Applications</span>
            </NavLink>
            <NavLink to="/analytics" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </NavLink>
            <NavLink to="/settings" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 lg:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How would you like to continue?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your desired pathway for completing your study abroad journey
            </p>
          </div>

          {/* Pathway Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Self Directed Card */}
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Self Directed</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our friendly interface allows you to navigate the application process on your 
                    own, with video tutorials and support from us
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-48 h-32 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Find an Adviser Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Find an adviser</h2>
                  <p className="text-gray-700 leading-relaxed">
                    A consult will be assigned to handle your application process, and fees paid 
                    based on service offered.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-48 h-32 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-gray-500 pb-8">
        <p>
          Uniplanr, an education consultancy firm, dedicated to helping students find the best programs and guidance through application process.
        </p>
      </footer>
    </div>
  );
};

export default PathwaySelection;
