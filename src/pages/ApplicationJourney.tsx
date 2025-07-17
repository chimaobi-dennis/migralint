
import { useState } from "react";
import { CheckCircle, Clock, Star, GraduationCap, FileText, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationFormModal } from "@/components/ApplicationFormModal";

const ApplicationJourney = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const navigate = useNavigate();

  const journeySteps = [
    {
      id: 1,
      title: "Choose study destination",
      subtitle: "Sweden ✓",
      icon: MapPin,
      status: "completed",
      color: "bg-amber-500",
      description: "Congratulations! You've chosen Sweden as your study destination."
    },
    {
      id: 2,
      title: "Academic Background",
      subtitle: "61 personalized program recommendations",
      icon: GraduationCap,
      status: "in-progress",
      color: "bg-teal-500",
      description: "Get personalized recommendations based on your academic background."
    },
    {
      id: 3,
      title: "Apply for Programs",
      subtitle: "Not started",
      icon: FileText,
      status: "pending",
      color: "bg-red-500",
      description: "Submit your applications to selected programs."
    },
    {
      id: 4,
      title: "Study Visa Application",
      subtitle: "Not started",
      icon: Calendar,
      status: "pending",
      color: "bg-purple-500",
      description: "Complete your visa application process."
    }
  ];

  const handleStepClick = (stepId: number) => {
    if (stepId <= Math.max(...completedSteps) + 1) {
      // Allow interaction with current or next step
      console.log(`Clicked step ${stepId}`);
    }
  };

  const getStepStatus = (step: any) => {
    if (completedSteps.includes(step.id)) {
      return "completed";
    } else if (step.id === Math.max(...completedSteps) + 1) {
      return "current";
    } else {
      return "pending";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  UniTracker
                </h1>
                <p className="text-sm text-muted-foreground">Application Journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Call us now:</span>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6">
            <Star className="h-5 w-5 mr-2" />
            <span className="font-semibold">Unlock the door to an amazing adventure in Sweden!</span>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's make your dream education journey as fun as sipping your favorite latte!
          </p>
        </div>

        {/* Main Question */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Where are you in your big Adventure?
          </h2>
          <p className="text-lg text-gray-700">
            Sweden isn't just about top-notch education, it's about living the dream!
          </p>
        </div>

        {/* Journey Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const status = getStepStatus(step);
              const isClickable = step.id <= Math.max(...completedSteps) + 1;
              
              return (
                <Card
                  key={step.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    status === "completed" 
                      ? "border-green-200 bg-green-50" 
                      : status === "current"
                      ? "border-blue-200 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!isClickable ? "opacity-60" : ""}`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`${step.color} p-3 rounded-lg flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{step.title}</h3>
                          {status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {status === "current" && (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{step.subtitle}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                        {status === "current" && (
                          <div className="mt-3">
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              Current Step
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              onClick={() => setShowApplicationForm(true)}
            >
              Start Application
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>↵</span>
              <span>study destinations</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              UniPlanr - Your Education Journey Partner
            </h3>
            <p className="text-gray-600">
              Uniplanr, an education consultancy firm, dedicated to helping students find the best programs and guidance through application process.
            </p>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      <ApplicationFormModal 
        open={showApplicationForm} 
        onOpenChange={setShowApplicationForm} 
      />
    </div>
  );
};

export default ApplicationJourney;
