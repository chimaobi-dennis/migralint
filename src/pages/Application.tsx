import { useState, useEffect } from "react";
import { Filter, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApplicationCard } from "@/components/ApplicationCard";
import { StatsOverview } from "@/components/StatsOverview";
import { DeadlineAlert } from "@/components/DeadlineAlert";
import { ApplicationProfile } from "@/components/ApplicationProfile";
import NewApplicationModal from "@/components/NewApplicationModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SupabaseApplication {
  id: number;
  user_id: number | null;
  status: string | null;
  progress: number | null;
  degree: string | null;
  studyField: string | null;
  university: string | null;
  study_destination: string | null;
  created_at: string | null;
  updated_at: string | null;
  selected_programs: string | null;
  recommended: string | null;
  accepted_admission: string | null;
  rejected_admission: string | null;
  type: string | null;
}

const Index = () => {
  const [applications, setApplications] = useState<SupabaseApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<SupabaseApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<SupabaseApplication | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [errorLoadingApplications, setErrorLoadingApplications] = useState<string | null>(null);
  const userId = 1; // Development user ID
  

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoadingApplications(true);

        // Fetch from Supabase (using 'as any' to bypass types until DB types are synced)
        const { data, error } = await (supabase as any)
          .from('applications')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;

        const apps: SupabaseApplication[] = (data || []).map((row: any) => ({
          id: row.id,
          user_id: row.user_id,
          status: row.status,
          progress: row.progress,
          degree: row.degree,
          studyField: row.studyField,
          university: row.university,
          study_destination: row.study_destination,
          created_at: row.created_at,
          updated_at: row.updated_at,
          selected_programs: row.selected_programs,
          recommended: row.recommended,
          accepted_admission: row.accepted_admission,
          rejected_admission: row.rejected_admission,
          type: row.type,
        }));

        setApplications(apps);
        setFilteredApplications(apps);
        setErrorLoadingApplications(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        // Fallback: minimal mock to keep UI working in dev
        const mockApplications: SupabaseApplication[] = [
          {
            id: 1,
            user_id: 1,
            status: 'In Progress',
            progress: 65,
            degree: 'Master',
            studyField: 'Computer Science',
            university: 'Stockholm University',
            study_destination: 'Sweden',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            selected_programs: 'AI and Machine Learning',
            recommended: 'Yes',
            accepted_admission: null,
            rejected_admission: null,
            type: 'Regular'
          }
        ];
        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
        setErrorLoadingApplications(null);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, [userId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => 
        (app.degree?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.studyField?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.university?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  const handleProgramClick = (program: any) => {
    setSelectedProgram(program);
    setSelectedApplication(null);
  };

  const handleApplicationClick = (application: SupabaseApplication) => {
    setSelectedApplication(application);
    setSelectedProgram(null);

    if (window.innerWidth < 1280) {
      toast("Scroll down to view step details ↓", {
        duration: 2000,
        position: "top-center",
      });

      setTimeout(() => {
        const detailsSection = document.querySelector('.xl\\:col-span-1');
        if (detailsSection) {
          detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSaveNewApplication = (data: any) => {
    console.log('New application data:', data);
    // TODO: Implement API call to save new application
  };

 

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsOverview applications={applications} />

      {/* Deadline Alerts */}
      <DeadlineAlert applications={applications} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">My Application</h2>
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
              {errorLoadingApplications ? (
                <div className="p-4 text-center">
                  <p className="text-red-500 font-medium">Error loading applications</p>
                  <p className="text-sm text-gray-500 mt-1">{errorLoadingApplications}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : loadingApplications ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mt-4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                filteredApplications.map((application) => {
                  const cardApp = {
                    id: application.id,
                    university: application.university || 'Unknown University',
                    program: application.studyField || 'Program',
                    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    status: application.status || 'In Progress',
                    progress: application.progress ?? 0,
                    requirements: [] as string[],
                    completed: [] as string[],
                    isGroup: false,
                  };
                  return (
                    <ApplicationCard
                      key={application.id}
                      application={cardApp}
                      onClick={() => handleApplicationClick(application)}
                      onProgramClick={handleProgramClick}
                      isSelected={selectedApplication?.id === application.id}
                      selectedProgramId={(selectedProgram as any)?.id}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Application Profile Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6 h-[calc(100vh-2rem)] flex flex-col">
            <ApplicationProfile
              onAddNew={() => setShowNewAppModal(true)}
              onStartApplication={(id) => {
                // Handle start application logic here
                console.log('Start application for profile:', id);
              }}
            />
          </div>
        </div>
      </div>

      {/* New Application Modal */}
      <NewApplicationModal
        isOpen={showNewApplicationModal}
        onClose={() => setShowNewApplicationModal(false)}
        onSave={handleSaveNewApplication}
      />
    </div>
  );
};

export default Index;
