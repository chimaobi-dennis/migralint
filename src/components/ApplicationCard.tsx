import { Calendar, MapPin, CheckCircle, Clock, AlertCircle, Eye, ChevronDown, ChevronRight, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface Program {
  id: number;
  name: string;
  university: string;
  deadline: string;
  status: string;
  progress: number;
  requirements: string[];
  completed: string[];
}

interface ProgramGroup {
  id: number;
  groupName: string;
  university: string;
  programs: Program[];
  deadline: string; // Overall group deadline
  status: string; // Overall group status
  progress: number; // Overall group progress
}

interface Application {
  id: number;
  university: string;
  program?: string; // For single programs
  deadline: string;
  status: string;
  progress: number;
  requirements: string[];
  completed: string[];
  isGroup?: boolean;
  groupData?: ProgramGroup;
}

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
  onProgramClick?: (program: Program) => void;
  isSelected: boolean;
  selectedProgramId?: number;
}

export const ApplicationCard = ({ application, onClick, isSelected, onProgramClick, selectedProgramId }: ApplicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-green-100 text-green-800 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Under Review": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Not Started": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      case "Under Review": return <Eye className="h-4 w-4" />;
      case "Not Started": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const isUrgent = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleProgramClick = (e: React.MouseEvent, program: Program) => {
    e.stopPropagation();
    onProgramClick?.(program);
    
    // Show mobile guidance toast and auto-scroll
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

  const renderSingleProgram = () => (
    <div 
      className={`p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 ${
        isSelected ? 'bg-blue-50 border-l-blue-500' : 'border-l-transparent'
      } ${isUrgent(application.deadline) ? 'bg-red-50' : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {application.university}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {application.program}
          </div>
        </div>
        
        <Badge className={`${getStatusColor(application.status)} flex items-center gap-1 px-3 py-1`}>
          {getStatusIcon(application.status)}
          {application.status}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{application.progress}%</span>
        </div>
        <Progress value={application.progress} className="h-2" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm">
          <Calendar className={`h-4 w-4 mr-1 ${isUrgent(application.deadline) ? 'text-red-500' : 'text-gray-400'}`} />
          <span className={isUrgent(application.deadline) ? 'text-red-600 font-medium' : 'text-gray-600'}>
            {formatDeadline(application.deadline)}
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          {application.completed.length} of {application.requirements.length} completed
        </div>
      </div>

      {isUrgent(application.deadline) && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800 font-medium">
            ⚠️ Deadline approaching! Complete remaining requirements soon.
          </p>
        </div>
      )}
    </div>
  );

  const renderGroupedPrograms = () => {
    const groupData = application.groupData!;
    
    return (
      <div className={`border-l-4 ${
        isSelected ? 'bg-blue-50 border-l-blue-500' : 'border-l-transparent'
      } ${isUrgent(application.deadline) ? 'bg-red-50' : ''}`}>
        {/* Group Header */}
        <div 
          className="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer relative"
          onClick={handleCardClick}
        >
          {/* Group Indicator */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            GROUP
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {application.university}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 p-1 h-8 w-8 hover:bg-blue-100 rounded-full transition-colors"
                  onClick={handleExpandClick}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="font-medium">{groupData.groupName}</span>
                <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {groupData.programs.length} programs
                </span>
              </div>
            </div>
            
            <Badge className={`${getStatusColor(application.status)} flex items-center gap-1 px-3 py-1`}>
              {getStatusIcon(application.status)}
              {application.status}
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium text-gray-900">{application.progress}%</span>
            </div>
            <Progress value={application.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Calendar className={`h-4 w-4 mr-1 ${isUrgent(application.deadline) ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={isUrgent(application.deadline) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                {formatDeadline(application.deadline)}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              {application.completed.length} of {application.requirements.length} completed
            </div>
          </div>

          {isUrgent(application.deadline) && (
            <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800 font-medium">
                ⚠️ Deadline approaching! Complete remaining requirements soon.
              </p>
            </div>
          )}
        </div>

        {/* Expanded Programs List */}
        {isExpanded && (
          <div className="border-t-2 border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="px-6 py-3 bg-blue-100/50 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-semibold text-blue-800">Programs in this group:</span>
              </div>
            </div>
            {groupData.programs.map((program, index) => (
              <div 
                key={program.id}
                className={`relative px-8 py-4 border-b border-blue-100 last:border-b-0 hover:bg-white/70 transition-all duration-200 group cursor-pointer ${
                  selectedProgramId === program.id ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={(e) => handleProgramClick(e, program)}
              >
                {/* Connection Line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-blue-200"></div>
                <div className="absolute left-5 top-6 w-3 h-px bg-blue-300"></div>
                
                {/* Program Number Badge */}
                <div className={`absolute left-4 top-4 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  selectedProgramId === program.id ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-md font-semibold mb-1 truncate group-hover:text-blue-700 transition-colors ${
                      selectedProgramId === program.id ? 'text-blue-800' : 'text-gray-900'
                    }`}>
                      {program.name}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Building className="h-3 w-3 mr-1" />
                      <span className="font-medium">{program.university}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Deadline: {formatDeadline(program.deadline)}</span>
                    </div>
                  </div>
                  
                  <Badge className={`${getStatusColor(program.status)} flex items-center gap-1 px-3 py-1 text-xs font-medium shadow-sm`}>
                    {getStatusIcon(program.status)}
                    {program.status}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-bold text-gray-800">{program.progress}%</span>
                  </div>
                  <Progress value={program.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">{program.completed.length}</span> of <span className="font-medium">{program.requirements.length}</span> requirements completed
                  </div>
                  {program.progress === 100 && (
                    <div className="flex items-center text-xs text-green-600 font-medium">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return application.isGroup ? renderGroupedPrograms() : renderSingleProgram();
};