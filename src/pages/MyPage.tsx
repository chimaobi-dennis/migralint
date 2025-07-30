import { useState, useEffect, useRef } from "react";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Upload, 
  Eye, 
  Edit,
  User,
  ChevronRight,
  Calendar,
  FileText,
  MessageSquare,
  Plus,
  Download,
  Play,
  X,
  HelpCircle,
  Menu,
  Bell,
  BellOff,
  Settings,
  Activity,
  GraduationCap,
  FileCheck,
  UserCheck,
  BarChart3,
  Youtube,
  Check,
  Save,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ChatbotModal from "@/components/ChatbotModal";
import VideoModal from "@/components/VideoModal";
import FileManagerModal from "@/components/FileManagerModal";
import ProgramSelectionModal from "@/components/ProgramSelectionModal";
import { useApiStepsData } from "@/hooks/useApiStepsData";
import { ApplicationStep } from "@/hooks/useStepsData";
import { useScholarshipSteps, ScholarshipStep } from "@/hooks/useScholarshipSteps";
import { useAdmissionSteps } from "@/hooks/useAdmissionSteps";
import { useVisaSteps } from "@/hooks/useVisaSteps";
import VisaInfoModal from "@/components/VisaInfoModal";
import { useActivityLogger, ActivityLog } from "@/components/ActivityLogger";
import { toast } from 'sonner';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("application");
  const [selectedStep, setSelectedStep] = useState<string>("1");
  const [selectedScholarshipStep, setSelectedScholarshipStep] = useState<string>("sch1");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [programSelectionOpen, setProgramSelectionOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string>("");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [externalAccountData, setExternalAccountData] = useState<{[key: string]: {username: string, password: string}}>({});
  const [showSaveButton, setShowSaveButton] = useState<{[key: string]: boolean}>({});
  
  const { steps: applicationSteps, updateStep, loading, error, applicationData, refetch: refetchApplicationData } = useApiStepsData();
  const { steps: scholarshipSteps, updateStep: updateScholarshipStep } = useScholarshipSteps();
  const { applications, acceptAdmission, declineAdmission } = useAdmissionSteps();
  const { steps: visaSteps, updateStep: updateVisaStep } = useVisaSteps();
  
  const [showVisaInfoModal, setShowVisaInfoModal] = useState(false);
  const { activities, logActivity } = useActivityLogger();

  // Mobile UX improvements
  const detailsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1280); // xl breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Update lastUpdated when application data is loaded
  useEffect(() => {
    if (applicationData && !loading) {
      setLastUpdated(new Date());
    }
  }, [applicationData, loading]);

  // Handle step selection with mobile UX improvements
  const handleStepSelection = (stepId: string) => {
    setSelectedStep(stepId);
    
    if (isMobile) {
      // Show toast notification for mobile users
      toast.info('Scroll down to view step details ↓', {
        duration: 3000,
      });
      
      // Auto-scroll to details section after a short delay
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 500);
    }
    
    const step = applicationSteps.find(s => s.id === stepId);
    if (step) {
      logActivity({
        action: 'view_step',
        description: `Viewed step: "${step.title}"`,
        stepId,
        stepTitle: step.title,
        type: 'other'
      });
    }
  };

  // Handle program removal
  const removeProgram = (stepId: string, programToRemove: string) => {
    const step = applicationSteps.find(s => s.id === stepId);
    if (step?.programSettings) {
      const updatedPrograms = step.programSettings.selectedPrograms.filter(p => p !== programToRemove);
      updateStep(stepId, {
        programSettings: {
          ...step.programSettings,
          selectedPrograms: updatedPrograms
        }
      });
      
      toast.success(`Removed "${programToRemove}" from program selection`);
      
      logActivity({
        action: 'remove_program',
        description: `Removed "${programToRemove}" from program selection`,
        stepId,
        stepTitle: step.title,
        type: 'program'
      });
    }
  };

  // Handle external account save
  const saveExternalAccount = (stepId: string, username: string, password: string) => {
    const step = applicationSteps.find(s => s.id === stepId);
    if (step?.externalAccount) {
      updateStep(stepId, {
        externalAccount: {
          ...step.externalAccount,
          username,
          password
        }
      });
      
      toast.success('External account credentials saved successfully');
      
      logActivity({
        action: 'save_account',
        description: 'Saved external account credentials',
        stepId,
        stepTitle: step.title,
        type: 'account'
      });
      
      // Hide save button and clear temp data
      setShowSaveButton(prev => ({ ...prev, [stepId]: false }));
      setExternalAccountData(prev => ({ ...prev, [stepId]: { username: '', password: '' } }));
    }
  };

  // Handle input change for external account
  const handleExternalAccountChange = (stepId: string, field: 'username' | 'password', value: string) => {
    setExternalAccountData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [field]: value
      }
    }));
    
    // Show save button when user starts typing
    if (value.trim() !== '') {
      setShowSaveButton(prev => ({ ...prev, [stepId]: true }));
    }
  };

  // Handle save and continue
  const handleSaveAndContinue = async (stepId: string) => {
    const accountData = externalAccountData[stepId];
    if (!accountData || !applicationData) return;

    try {
      const response = await fetch(`https://uniplanr.com/api/v1/update-application/23`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_login: accountData.username || '',
          application_password: accountData.password || '',
          stage: 2
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        saveExternalAccount(stepId, accountData.username || '', accountData.password || '');
        
        // Mark step as completed and move to next step
        updateStep(stepId, { status: 'completed' });
        
        // Find next step and mark as current
        const currentStepIndex = applicationSteps.findIndex(s => s.id === stepId);
        if (currentStepIndex < applicationSteps.length - 1) {
          const nextStep = applicationSteps[currentStepIndex + 1];
          updateStep(nextStep.id, { status: 'current' });
          setSelectedStep(nextStep.id);
        }

        toast.success(result.message || 'Portal details saved! Moving to next step.');
      } else {
        toast.error(result.message || 'Failed to save portal details.');
      }
    } catch (error) {
      console.error('Error saving external account details:', error);
      toast.error('Failed to save portal details. Please try again.', error);
    }
  };

  // Handle program addition
  const addProgram = (stepId: string, program: any) => {
    const step = applicationSteps.find(s => s.id === stepId);
    if (step?.programSettings) {
      const updatedPrograms = [...step.programSettings.selectedPrograms, program.name];
      updateStep(stepId, {
        programSettings: {
          ...step.programSettings,
          selectedPrograms: updatedPrograms
        }
      });
      
      toast.success(`Added "${program.name}" to program selection`);
      
      logActivity({
        action: 'add_program',
        description: `Added "${program.name}" to program selection`,
        stepId,
        stepTitle: step.title,
        type: 'program'
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (stepId: string) => {
    setCurrentStepId(stepId);
    setFileManagerOpen(true);
    toast.info('Opening file manager...');
  };

  // Handle program selection
  const handleProgramSelection = (stepId: string) => {
    setCurrentStepId(stepId);
    setProgramSelectionOpen(true);
    toast.info('Opening program selection...');
  };

  const openVideoModal = (videoUrl: string, title: string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentVideoTitle(title);
    setVideoModalOpen(true);
    
    toast.success(`Opening video: "${title}"`);
    
    logActivity({
      action: 'view_video',
      description: `Watched video: "${title}"`,
      type: 'other'
    });
  };

  // Handle notification toggle
  const toggleNotifications = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
  };

  // Handle admission actions
  const handleAcceptAdmission = (appId: string) => {
    acceptAdmission(appId);
    toast.success('Admission accepted successfully!');
  };

  const handleDeclineAdmission = (appId: string) => {
    declineAdmission(appId);
    toast.info('Admission declined');
  };

  // Handle step completion
  const handleStepCompletion = (stepId: string) => {
    const step = applicationSteps.find(s => s.id === stepId);
    if (step) {
      updateStep(stepId, { status: 'completed' });
      toast.success(`Step "${step.title}" marked as completed!`);
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getProgressValue = () => {
    const completed = applicationSteps.filter(step => step.status === 'completed').length;
    return (completed / applicationSteps.length) * 100;
  };

  // Activity log grouped by date
  const groupedActivities = activities.reduce((groups: { [key: string]: ActivityLog[] }, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(activity);
    return groups;
  }, {});

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'program': return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case 'document': return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'form': return <Edit className="h-4 w-4 text-orange-500" />;
      case 'account': return <UserCheck className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">My Application</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your study abroad journey</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleNotifications}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              {emailNotifications ? <Bell className="h-3 w-3 sm:h-4 sm:w-4" /> : <BellOff className="h-3 w-3 sm:h-4 sm:w-4" />}
              <span className="hidden sm:inline">
                {emailNotifications ? 'Notifications On' : 'Notifications Off'}
              </span>
              <span className="sm:hidden">
                {emailNotifications ? 'On' : 'Off'}
              </span>
            </Button>
            <Badge variant="outline" className="text-xs sm:text-sm">
              {applicationSteps.filter(s => s.status === 'completed').length}/{applicationSteps.length} Complete
            </Badge>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <div className="bg-white rounded-lg border shadow-sm">
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            if (value === 'application') {
              refetchApplicationData();
              setLastUpdated(new Date());
            }
          }} className="w-full">
            <div className="border-b border-gray-200 overflow-x-auto">
              <TabsList className="h-auto p-0 bg-transparent w-full min-w-max">
                <TabsTrigger 
                  value="application" 
                  className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Application</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="scholarships" 
                  className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm"
                >
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Scholarships</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="admission" 
                  className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Status</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="visa" 
                  className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm"
                >
                  <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Visa</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm"
                >
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Activity</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Program Application Tab */}
            <TabsContent value="application" className="p-6 space-y-6">
              {/* Update Timestamp */}
              {lastUpdated && !loading && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>
                    Updated {(() => {
                      const now = new Date();
                      const diffInMs = now.getTime() - lastUpdated.getTime();
                      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                      const diffInHours = Math.floor(diffInMinutes / 60);
                      
                      if (diffInMinutes < 1) return 'just now';
                      if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
                      if (diffInHours < 24) {
                        const remainingMinutes = diffInMinutes % 60;
                        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}${remainingMinutes > 0 ? ` ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}` : ''} ago`;
                      }
                      return lastUpdated.toLocaleDateString();
                    })()}
                  </span>
                </div>
              )}
              
              {/* Loading State */}
              {loading && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Loading application data...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error State */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load application data: {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Application Info from API */}
              {applicationData && !loading && (
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Application</h4>
                        <p className="text-sm text-gray-600">{applicationData.name}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Destination</h4>
                        <p className="text-sm text-gray-600">{applicationData.destination}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Degree</h4>
                        <p className="text-sm text-gray-600">{applicationData.degree}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Deadline</h4>
                        <p className="text-sm text-gray-600">{new Date(applicationData.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

               {!loading && !error && (
                 <div className="space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Application Progress</h3>
                      <p className="text-gray-600">
                        {applicationSteps.filter(s => s.status === 'completed').length} of {applicationSteps.length} steps completed
                      </p>
                    </div>
                    <div className="w-full lg:w-64">
                      <Progress value={getProgressValue()} className="h-3" />
                      <p className="text-right text-sm text-gray-500 mt-1">
                        {Math.round(getProgressValue())}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Steps */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Steps List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Application Steps</h3>
                  {applicationSteps.map((step, index) => (
                    <Card 
                      key={step.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedStep === step.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleStepSelection(step.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStepStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{step.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    Step {step.stepNumber}
                                  </Badge>
                                  <Badge 
                                    variant={step.status === 'completed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {step.status}
                                  </Badge>
                                </div>
                                {step.deadline && (
                                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    Due: {step.deadline}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Step Details */}
                <div className="space-y-4" ref={detailsRef}>
                  {applicationSteps.find(step => step.id === selectedStep) ? (
                    (() => {
                      const currentStep = applicationSteps.find(step => step.id === selectedStep)!;
                      return (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              {getStepStatusIcon(currentStep.status)}
                              {currentStep.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Video */}
                            {currentStep.videoUrl && (
                              <div className="space-y-2">
                                <Label>Step Video</Label>
                                <div 
                                  className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                  onClick={() => openVideoModal(currentStep.videoUrl!, currentStep.title)}
                                >
                                  <div className="text-center">
                                    <Play className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                                    <p className="text-sm text-gray-600">Click to watch video</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Instructions */}
                            <div className="space-y-4">
                              {currentStep.instructions.header && (
                                <div>
                                  <h4 className="font-medium mb-2">{currentStep.instructions.header}</h4>
                                </div>
                              )}

                              {currentStep.instructions.paragraphs?.map((paragraph, index) => (
                                <p key={index} className="text-gray-600">{paragraph}</p>
                              ))}

                              {currentStep.instructions.bulletPoints && (
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  {currentStep.instructions.bulletPoints.map((point, index) => (
                                    <li key={index}>{point}</li>
                                  ))}
                                </ul>
                              )}

                              {currentStep.instructions.footer && (
                                <p className="text-sm text-gray-500 border-t pt-3">
                                  {currentStep.instructions.footer}
                                </p>
                              )}
                            </div>

                            {/* Alerts */}
                            {currentStep.alerts?.map((alert, index) => (
                              <Alert key={index} className={`
                                ${alert.type === 'error' ? 'border-red-200 bg-red-50' : ''}
                                ${alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
                                ${alert.type === 'success' ? 'border-green-200 bg-green-50' : ''}
                                ${alert.type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
                              `}>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{alert.message}</AlertDescription>
                              </Alert>
                            ))}

                            {/* External Account Form */}
                            {currentStep.type === 'registration' && currentStep.externalAccount && (
                              <div className="space-y-4 border-t pt-4">
                                <Label>Save External Account Details</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Username</Label>
                                    <Input
                                      placeholder="Enter username"
                                      defaultValue={currentStep.externalAccount.username}
                                      onChange={(e) => handleExternalAccountChange(currentStep.id, 'username', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Password</Label>
                                    <Input
                                      type="password"
                                      placeholder="Enter password"
                                      defaultValue={currentStep.externalAccount.password}
                                      onChange={(e) => handleExternalAccountChange(currentStep.id, 'password', e.target.value)}
                                    />
                                  </div>
                                </div>
                                {currentStep.externalAccount.portalUrl && (
                                  <div className="text-sm text-gray-600">
                                    Portal: <a href={currentStep.externalAccount.portalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                      {currentStep.externalAccount.portalUrl}
                                    </a>
                                  </div>
                                )}
                                
                                {/* Save and Continue Button */}
                                {showSaveButton[currentStep.id] && (
                                  <div className="flex items-center gap-2 pt-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            onClick={() => handleSaveAndContinue(currentStep.id)}
                                            className="flex items-center gap-2"
                                            size="sm"
                                          >
                                            <Save className="h-4 w-4" />
                                            Save and Continue
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Click to save portal detail and proceed to next step</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Program Selection */}
                            {currentStep.type === 'program' && currentStep.programSettings && (
                              <div className="space-y-4 border-t pt-4">
                                <div className="flex items-center justify-between">
                                  <Label>Selected Programs ({currentStep.programSettings.selectedPrograms.length}/{currentStep.programSettings.maxPrograms})</Label>
                                </div>
                                
                                <div className="space-y-2">
                                  {currentStep.programSettings.selectedPrograms.map((program, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <span className="text-sm font-medium">{program}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeProgram(currentStep.id, program)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  
                                  {currentStep.programSettings.selectedPrograms.length < currentStep.programSettings.maxPrograms && (
                                    <Button
                                      variant="outline"
                                      onClick={() => handleProgramSelection(currentStep.id)}
                                      className="w-full"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Program
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Document Upload */}
                            {currentStep.type === 'document' && currentStep.documents && (
                              <div className="space-y-4 border-t pt-4">
                                <Label>Required Documents</Label>
                                <div className="space-y-3">
                                  {currentStep.documents.required.map((doc, index) => {
                                    const isUploaded = currentStep.documents?.uploaded.includes(doc);
                                    return (
                                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                          {isUploaded ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                          ) : (
                                            <Clock className="h-5 w-5 text-gray-400" />
                                          )}
                                          <span className="text-sm">{doc}</span>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant={isUploaded ? "outline" : "default"}
                                          onClick={() => handleFileUpload(currentStep.id)}
                                        >
                                          <Upload className="h-4 w-4 mr-2" />
                                          {isUploaded ? 'Replace' : 'Upload'}
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Form Fields */}
                            {currentStep.formFields && currentStep.formFields.length > 0 && (
                              <div className="space-y-4 border-t pt-4">
                                <Label>Form Information</Label>
                                <div className="space-y-4">
                                  {currentStep.formFields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                      <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                                      {field.type === 'textarea' ? (
                                        <Textarea placeholder={field.placeholder} />
                                      ) : (
                                        <Input type={field.type} placeholder={field.placeholder} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 border-t pt-4">
                              {currentStep.buttons.map((button) => (
                                <Button
                                  key={button.id}
                                  variant={button.variant || 'default'}
                                  size="sm"
                                >
                                  {button.icon && (
                                    <span className="mr-2">
                                      {/* Icon would be rendered here based on button.icon */}
                                    </span>
                                  )}
                                  {button.label}
                                </Button>
                              ))}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setChatbotOpen(true)}
                              >
                                <HelpCircle className="h-4 w-4 mr-2" />
                                Need Help?
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4" />
                        <p>Select a step to view details</p>
                        {isMobile && (
                          <p className="text-sm mt-2">Tap any step above to see details here</p>
                        )}
                      </div>
                    </Card>
                  )}
                 </div>
               </div>
                 </div>
               )}
             </TabsContent>

            {/* Scholarships Tab */}
            <TabsContent value="scholarships" className="p-6 space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Scholarship Progress</h3>
                      <p className="text-gray-600">
                        {scholarshipSteps.filter(s => s.status === 'completed').length} of {scholarshipSteps.length} steps completed
                      </p>
                    </div>
                    <div className="w-full lg:w-64">
                      <Progress value={(scholarshipSteps.filter(s => s.status === 'completed').length / scholarshipSteps.length) * 100} className="h-3" />
                      <p className="text-right text-sm text-gray-500 mt-1">
                        {Math.round((scholarshipSteps.filter(s => s.status === 'completed').length / scholarshipSteps.length) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scholarship Steps */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Steps List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Scholarship Steps</h3>
                  {scholarshipSteps.map((step, index) => (
                    <Card 
                      key={step.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedScholarshipStep === step.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedScholarshipStep(step.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStepStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{step.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    Step {step.stepNumber}
                                  </Badge>
                                  <Badge 
                                    variant={step.status === 'completed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {step.status}
                                  </Badge>
                                </div>
                                {step.deadline && (
                                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    Due: {step.deadline}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Step Details */}
                <div className="space-y-4">
                  {scholarshipSteps.find(step => step.id === selectedScholarshipStep) ? (
                    (() => {
                      const currentStep = scholarshipSteps.find(step => step.id === selectedScholarshipStep)!;
                      return (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              {getStepStatusIcon(currentStep.status)}
                              {currentStep.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Video */}
                            {currentStep.videoUrl && (
                              <div className="space-y-2">
                                <Label>Step Video</Label>
                                <div 
                                  className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                  onClick={() => openVideoModal(currentStep.videoUrl!, currentStep.title)}
                                >
                                  <div className="text-center">
                                    <Play className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                                    <p className="text-sm text-gray-600">Click to watch video</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Instructions */}
                            <div className="space-y-4">
                              {currentStep.instructions.header && (
                                <div>
                                  <h4 className="font-medium mb-2">{currentStep.instructions.header}</h4>
                                </div>
                              )}

                              {currentStep.instructions.paragraphs?.map((paragraph, index) => (
                                <p key={index} className="text-gray-600">{paragraph}</p>
                              ))}

                              {currentStep.instructions.bulletPoints && (
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  {currentStep.instructions.bulletPoints.map((point, index) => (
                                    <li key={index}>{point}</li>
                                  ))}
                                </ul>
                              )}

                              {currentStep.instructions.footer && (
                                <p className="text-sm text-gray-500 border-t pt-3">
                                  {currentStep.instructions.footer}
                                </p>
                              )}
                            </div>

                            {/* Alerts */}
                            {currentStep.alerts?.map((alert, index) => (
                              <Alert key={index} className={`
                                ${alert.type === 'error' ? 'border-red-200 bg-red-50' : ''}
                                ${alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
                                ${alert.type === 'success' ? 'border-green-200 bg-green-50' : ''}
                                ${alert.type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
                              `}>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{alert.message}</AlertDescription>
                              </Alert>
                            ))}

                            {/* Document Upload */}
                            {currentStep.type === 'document' && currentStep.documents && (
                              <div className="space-y-4 border-t pt-4">
                                <Label>Required Documents</Label>
                                <div className="space-y-3">
                                  {currentStep.documents.required.map((doc, index) => {
                                    const isUploaded = currentStep.documents?.uploaded.includes(doc);
                                    return (
                                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                          {isUploaded ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                          ) : (
                                            <Clock className="h-5 w-5 text-gray-400" />
                                          )}
                                          <span className="text-sm">{doc}</span>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant={isUploaded ? "outline" : "default"}
                                          onClick={() => handleFileUpload(currentStep.id)}
                                        >
                                          <Upload className="h-4 w-4 mr-2" />
                                          {isUploaded ? 'Replace' : 'Upload'}
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 border-t pt-4">
                              {currentStep.buttons.map((button) => (
                                <Button
                                  key={button.id}
                                  variant={button.variant || 'default'}
                                  size="sm"
                                >
                                  {button.label}
                                </Button>
                              ))}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setChatbotOpen(true)}
                              >
                                <HelpCircle className="h-4 w-4 mr-2" />
                                Need Help?
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4" />
                        <p>Select a scholarship step to view details</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Admission Status Tab */}
            <TabsContent value="admission" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Admission Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{app.programName}</h3>
                          <p className="text-sm text-muted-foreground">{app.universityName}</p>
                          <p className="text-xs text-muted-foreground">{app.degree} • Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={
                          app.applicationStatus === 'admitted' ? 'default' : 
                          app.applicationStatus === 'rejected' ? 'destructive' :
                          app.applicationStatus === 'under_review' ? 'secondary' : 'outline'
                        }>
                          {app.applicationStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {app.applicationStatus === 'admitted' && (
                        <div className="space-y-3 p-3 bg-muted/50 rounded-md">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="font-medium">Start Date:</span> {app.startDate}</div>
                            <div><span className="font-medium">Tuition:</span> {app.tuitionFee}</div>
                            <div><span className="font-medium">Deadline:</span> {app.deadline}</div>
                          </div>
                          
                          {app.admissionStatus === 'pending' ? (
                            <div className="flex gap-2 mt-3">
                              <Button 
                                onClick={() => handleAcceptAdmission(app.id)}
                                size="sm"
                                className="flex-1"
                              >
                                Accept Admission
                              </Button>
                              <Button 
                                onClick={() => handleDeclineAdmission(app.id)}
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                              >
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <Badge variant={app.admissionStatus === 'accepted' ? 'default' : 'secondary'}>
                                {app.admissionStatus === 'accepted' ? 'Admission Accepted' : 'Admission Declined'}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {app.applicationStatus === 'under_review' && (
                        <div className="space-y-2">
                          <Progress value={75} className="h-2" />
                          <p className="text-xs text-muted-foreground">Application under review</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visa Application Tab */}
            <TabsContent value="visa" className="p-6">
              <div className="grid gap-6">
                {/* YouTube Video Button */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Visa Application Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => openVideoModal("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "Visa Application Guide")}
                      className="w-full flex items-center gap-2"
                      variant="outline"
                    >
                      <Youtube className="h-4 w-4 text-red-500" />
                      Watch Visa Application Guide Video
                    </Button>
                  </CardContent>
                </Card>

                {/* Visa Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visa Application Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {visaSteps.map((step) => (
                      <div key={step.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              Step {step.stepNumber}: {step.title}
                              <Badge variant={
                                step.status === 'completed' ? 'default' :
                                step.status === 'current' ? 'secondary' :
                                step.status === 'overdue' ? 'destructive' : 'outline'
                              }>
                                {step.status}
                              </Badge>
                            </h3>
                            {step.deadline && (
                              <p className="text-sm text-muted-foreground">Deadline: {step.deadline}</p>
                            )}
                          </div>
                        </div>
                        
                        {step.instructions.header && (
                          <div className="space-y-2">
                            <h4 className="font-medium">{step.instructions.header}</h4>
                            {step.instructions.paragraphs?.map((paragraph, index) => (
                              <p key={index} className="text-sm text-muted-foreground">{paragraph}</p>
                            ))}
                            {step.instructions.bulletPoints && step.instructions.bulletPoints.length > 0 && (
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {step.instructions.bulletPoints.map((point, index) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {step.documents && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Required Documents:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {step.documents.required.map((doc) => (
                                <div key={doc} className="flex items-center gap-2 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${
                                    step.documents?.uploaded.includes(doc) ? 'bg-green-500' : 'bg-gray-300'
                                  }`} />
                                  {doc}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {step.appointmentDetails && (
                          <div className="bg-muted/50 p-3 rounded-md space-y-1">
                            <p className="font-medium text-sm">Appointment Details:</p>
                            <p className="text-sm">Location: {step.appointmentDetails.location}</p>
                            <p className="text-sm">Date: {step.appointmentDetails.date}</p>
                            <p className="text-sm">Time: {step.appointmentDetails.time}</p>
                          </div>
                        )}

                        {step.alerts?.map((alert, index) => (
                          <div key={index} className={`p-2 rounded text-sm ${
                            alert.type === 'warning' ? 'bg-orange-100 text-orange-800' :
                            alert.type === 'error' ? 'bg-red-100 text-red-800' :
                            alert.type === 'success' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.message}
                          </div>
                        ))}

                         <div className="flex gap-2">
                          {step.buttons.map((button) => (
                            <Button 
                              key={button.id} 
                              variant={button.variant || 'default'}
                              size="sm"
                            >
                              {button.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Mock Visa Interview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Visa Interview Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Practice your visa interview with our AI-powered mock interview system. Get personalized feedback and improve your confidence.
                    </p>
                    <Button 
                      onClick={() => setShowVisaInfoModal(true)}
                      className="w-full flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Try Mock Visa Interview
                    </Button>
                  </CardContent>
                 </Card>
              </div>
            </TabsContent>

            {/* Activity Log Tab */}
            <TabsContent value="activity" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Activity Log</h3>
                <Badge variant="outline">{activities.length} activities</Badge>
              </div>

              {Object.keys(groupedActivities).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedActivities)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([date, dayActivities]) => (
                      <div key={date}>
                        <h4 className="font-medium text-gray-700 mb-3">{date}</h4>
                        <div className="space-y-2">
                          {dayActivities.map((activity) => (
                            <Card key={activity.id} className="p-4">
                              <div className="flex items-start gap-3">
                                {getActivityIcon(activity.type)}
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{activity.description}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {activity.action.replace('_', ' ')}
                                    </Badge>
                                    {activity.stepTitle && (
                                      <span className="text-xs text-gray-500">
                                        {activity.stepTitle}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(activity.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Activity className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
                    <p className="text-gray-600">Your activities will appear here as you progress through your application.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Floating Footer Menu */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setChatbotOpen(true)}
            className="rounded-full h-12 w-12 p-0 shadow-lg"
            variant="default"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ChatbotModal
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
      />
      
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={currentVideoUrl}
        title={currentVideoTitle}
      />

      <FileManagerModal
        isOpen={fileManagerOpen}
        onClose={() => setFileManagerOpen(false)}
        title="Upload Documents"
        onFileSelect={(file) => {
          console.log('Selected file:', file);
          setFileManagerOpen(false);
        }}
      />

      <ProgramSelectionModal
        isOpen={programSelectionOpen}
        onClose={() => setProgramSelectionOpen(false)}
        onProgramSelect={(program) => {
          addProgram(currentStepId, program);
        }}
        selectedPrograms={applicationSteps.find(s => s.id === currentStepId)?.programSettings?.selectedPrograms || []}
        maxPrograms={applicationSteps.find(s => s.id === currentStepId)?.programSettings?.maxPrograms || 8}
      />

      {/* Visa Info Modal */}
      <VisaInfoModal 
        isOpen={showVisaInfoModal} 
        onClose={() => setShowVisaInfoModal(false)} 
      />
    </div>
  );
};

export default MyPage;
