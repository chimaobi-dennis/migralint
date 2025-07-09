
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PathwaySelection = () => {
  const navigate = useNavigate();

  const handleSelfDirected = () => {
    // Navigate to self-directed path
    console.log("Self-directed path selected");
  };

  const handleFindAdviser = () => {
    // Navigate to adviser path
    console.log("Find adviser path selected");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-center px-4">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-4 lg:px-6 pb-20 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How would you like to continue?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your desired pathway for completing your study abroad journey
          </p>
        </div>

        {/* Pathway Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Self Directed Card */}
          <Card className="relative overflow-hidden bg-blue-50/50 border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Self Directed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base text-gray-700 leading-relaxed">
                Our friendly interface allows you to navigate the application process on your own, 
                with video tutorials and support from us
              </CardDescription>
              <div className="pt-4">
                <Button 
                  onClick={handleSelfDirected}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg transition-colors"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Find an Adviser Card */}
          <Card className="relative overflow-hidden bg-yellow-50/50 border-yellow-200 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Find an adviser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base text-gray-700 leading-relaxed">
                A consultant will be assigned to handle your application process, and fees paid 
                based on service offered.
              </CardDescription>
              <div className="pt-4">
                <Button 
                  onClick={handleFindAdviser}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-2 rounded-lg transition-colors"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-2">
              Uniplanr, an education consultancy firm, dedicated to helping students find the best programs and guidance through application process.
            </p>
            <p className="text-sm text-gray-500">
              Copyright © 2025 | UniTracker For Uniplanr.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwaySelection;
