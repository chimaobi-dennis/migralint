
import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";

const PathwaySelection = () => {
  return (
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
