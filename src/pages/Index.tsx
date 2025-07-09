
import { useState } from "react";
import { Plus, Search, Filter, Bell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApplicationCard } from "@/components/ApplicationCard";
import { StatsOverview } from "@/components/StatsOverview";
import { DeadlineAlert } from "@/components/DeadlineAlert";
import { ApplicationSteps } from "@/components/ApplicationSteps";

const Index = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const applications = [
    {
      id: 1,
      university: "Stanford University",
      program: "Computer Science",
      deadline: "2024-01-15",
      status: "In Progress",
      progress: 65,
      requirements: ["Personal Statement", "Transcripts", "Letters of Rec", "Test Scores"],
      completed: ["Transcripts", "Test Scores"]
    },
    {
      id: 2,
      university: "MIT",
      program: "Electrical Engineering",
      deadline: "2024-01-01",
      status: "Submitted",
      progress: 100,
      requirements: ["Personal Statement", "Transcripts", "Letters of Rec", "Portfolio"],
      completed: ["Personal Statement", "Transcripts", "Letters of Rec", "Portfolio"]
    },
    {
      id: 3,
      university: "UC Berkeley",
      program: "Data Science",
      deadline: "2024-02-01",
      status: "Not Started",
      progress: 0,
      requirements: ["Personal Statement", "Transcripts", "Letters of Rec"],
      completed: []
    },
    {
      id: 4,
      university: "Harvard University",
      program: "Business Administration",
      deadline: "2024-01-10",
      status: "Under Review",
      progress: 100,
      requirements: ["Personal Statement", "Transcripts", "Letters of Rec", "Interview"],
      completed: ["Personal Statement", "Transcripts", "Letters of Rec", "Interview"]
    }
  ];

  const filteredApplications = applications.filter(app =>
    app.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  UniTracker
                </h1>
                <p className="text-sm text-gray-600">Smart Application Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview applications={applications} />

        {/* Deadline Alerts */}
        <DeadlineAlert applications={applications} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search universities or programs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onClick={() => setSelectedApplication(application)}
                    isSelected={selectedApplication?.id === application.id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Application Steps Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <ApplicationSteps 
                application={selectedApplication || applications[0]} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
