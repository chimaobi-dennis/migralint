import { useState } from "react";
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
  BarChart3
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
import ChatbotModal from "@/components/ChatbotModal";
import VideoModal from "@/components/VideoModal";
import FileManagerModal from "@/components/FileManagerModal";
import ProgramSelectionModal from "@/components/ProgramSelectionModal";
import { useStepsData, ApplicationStep } from "@/hooks/useStepsData";
import { useActivityLogger, ActivityLog } from "@/components/ActivityLogger";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("application");
  const [selectedStep, setSelectedStep] = useState<string>("1");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [programSelectionOpen, setProgramSelectionOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string>("");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  const { steps: applicationSteps, updateStep } = useStepsData();
  const { activities, logActivity } = useActivityLogger();

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
      
      logActivity({
        action: 'save_account',
        description: 'Saved external account credentials',
        stepId,
        stepTitle: step.title,
        type: 'account'
      });
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
  };

  // Handle program selection
  const handleProgramSelection = (stepId: string) => {
    setCurrentStepId(stepId);
    setProgramSelectionOpen(true);
  };

  const openVideoModal = (videoUrl: string, title: string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentVideoTitle(title);
    setVideoModalOpen(true);
    
    logActivity({
      action: 'view_video',
      description: `Watched video: "${title}"`,
      type: 'other'
    });
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
      {/* Floating Navigation Button */}
      <Button
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 rounded-full h-12 w-12 p-0 shadow-lg"
        variant="default"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Expandable Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transform transition-all duration-300 z-40 ${
        sidebarExpanded ? 'translate-x-0 w-80' : '-translate-x-full w-0'
      }`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Quick Settings</h3>
            <Button variant="ghost" size="sm" onClick={() => setSidebarExpanded(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          {/* Progress Overview */}
          <div className="space-y-3">
            <Label>Application Progress</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getProgressValue())}%</span>
              </div>
              <Progress value={getProgressValue()} className="h-2" />
              <p className="text-xs text-gray-500">
                {applicationSteps.filter(s => s.status === 'completed').length} of {applicationSteps.length} steps completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">My Application</h1>
            <p className="text-gray-600 mt-1">Track your study abroad journey</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className="flex items-center gap-2"
            >
              {emailNotifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {emailNotifications ? 'Notifications On' : 'Notifications Off'}
              </span>
            </Button>
            <Badge variant="outline" className="text-sm">
              {applicationSteps.filter(s => s.status === 'completed').length}/{applicationSteps.length} Complete
            </Badge>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <div className="bg-white rounded-lg border shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-6">
              <TabsList className="h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="application" 
                  className="flex-1 sm:flex-none px-6 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Program Application</span>
                  <span className="sm:hidden">Application</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="scholarships" 
                  className="flex-1 sm:flex-none px-6 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Scholarships</span>
                  <span className="sm:hidden">Scholarships</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="admission" 
                  className="flex-1 sm:flex-none px-6 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Admission Status</span>
                  <span className="sm:hidden">Status</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="visa" 
                  className="flex-1 sm:flex-none px-6 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Visa Application</span>
                  <span className="sm:hidden">Visa</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="flex-1 sm:flex-none px-6 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Activity Log</span>
                  <span className="sm:hidden">Activity</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Program Application Tab */}
            <TabsContent value="application" className="p-6 space-y-6">
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
                      onClick={() => setSelectedStep(step.id)}
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
                            {currentStep.type === 'verification' && currentStep.externalAccount && (
                              <div className="space-y-4 border-t pt-4">
                                <Label>Save External Account Details</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Username</Label>
                                    <Input
                                      placeholder="Enter username"
                                      defaultValue={currentStep.externalAccount.username}
                                      onBlur={(e) => saveExternalAccount(currentStep.id, e.target.value, currentStep.externalAccount?.password || '')}
                                    />
                                  </div>
                                  <div>
                                    <Label>Password</Label>
                                    <Input
                                      type="password"
                                      placeholder="Enter password"
                                      defaultValue={currentStep.externalAccount.password}
                                      onBlur={(e) => saveExternalAccount(currentStep.id, currentStep.externalAccount?.username || '', e.target.value)}
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
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Scholarships Tab */}
            <TabsContent value="scholarships" className="p-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Scholarship Information</h3>
                  <p className="text-gray-600">Scholarship application steps will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admission Status Tab */}
            <TabsContent value="admission" className="p-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Admission Status</h3>
                  <p className="text-gray-600">Your admission status and updates will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visa Application Tab */}
            <TabsContent value="visa" className="p-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <UserCheck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Visa Application</h3>
                  <p className="text-gray-600">Visa application process will be guided here.</p>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default MyPage;