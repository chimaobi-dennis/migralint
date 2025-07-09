
import { useState } from "react";
import { Filter, Search } from "lucide-react";
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
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsOverview applications={applications} />

      {/* Deadline Alerts */}
      <DeadlineAlert applications={applications} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
                <Button variant="outline" size="sm" className="sm:self-end">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="relative lg:hidden">
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
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <ApplicationSteps 
              application={selectedApplication || applications[0]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
