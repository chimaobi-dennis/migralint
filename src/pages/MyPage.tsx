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
  HelpCircle
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
import ChatbotModal from "@/components/ChatbotModal";
import VideoModal from "@/components/VideoModal";
import { useStepsData, ApplicationStep } from "@/hooks/useStepsData";

// Interfaces moved to useStepsData hook

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("application");
  const [selectedStep, setSelectedStep] = useState<string>("1");
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  
  const { steps: applicationSteps, updateStep } = useStepsData();

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
    }
  };

  const openVideoModal = (videoUrl: string, title: string) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentVideoTitle(title);
    setVideoModalOpen(true);
  };

  // Legacy mock data structure - replaced with dynamic data
  const legacySteps: ApplicationStep[] = [
    // Legacy data - now using dynamic data from useStepsData
  ];

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

  const currentStep = applicationSteps.find(step => step.id === selectedStep);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Masters Program in Sweden - Autumn [2024/2025]
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your application progress and complete required steps
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <Button variant="default" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Update Profile
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setChatbotOpen(true)}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Get Help
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Application Progress</h3>
              <p className="text-sm text-muted-foreground">
                {applicationSteps.filter(s => s.status === 'completed').length} of {applicationSteps.length} steps completed
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {Math.round(getProgressValue())}% Complete
            </Badge>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Steps Sidebar */}
        <div className="xl:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Application Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {applicationSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedStep === step.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getStepStatusIcon(step.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {step.stepNumber}. {step.title}
                        </p>
                        {step.deadline && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(step.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Details */}
        <div className="xl:col-span-3">
          {currentStep && (
            <div className="space-y-6">
              {/* Step Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {getStepStatusIcon(currentStep.status)}
                      <div>
                        <CardTitle className="text-xl">
                          Step {currentStep.stepNumber}: {currentStep.title}
                        </CardTitle>
                        {currentStep.deadline && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Deadline: {new Date(currentStep.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {currentStep.videoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openVideoModal(currentStep.videoUrl!, currentStep.title)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Video
                        </Button>
                      )}
                      <Badge 
                        variant={currentStep.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          currentStep.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : currentStep.status === 'current'
                            ? 'bg-blue-100 text-blue-700'
                            : currentStep.status === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {currentStep.status.charAt(0).toUpperCase() + currentStep.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Video Placeholder */}
              {currentStep.videoUrl && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <div 
                      className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => openVideoModal(currentStep.videoUrl!, currentStep.title)}
                    >
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                        <div className="bg-white/20 p-4 rounded-full group-hover:bg-white/30 transition-colors">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-semibold">Video Tutorial</h4>
                        <p className="text-sm opacity-90">Click to watch step-by-step guide</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Alerts */}
              {currentStep.alerts && currentStep.alerts.length > 0 && (
                <div className="space-y-3">
                  {currentStep.alerts.map((alert, index) => (
                    <Alert key={index} className={
                      alert.type === 'error' ? 'border-red-200 bg-red-50' :
                      alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      alert.type === 'success' ? 'border-green-200 bg-green-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStep.instructions.header && (
                    <h4 className="font-semibold text-gray-900">
                      {currentStep.instructions.header}
                    </h4>
                  )}
                  
                  {currentStep.instructions.paragraphs && (
                    <div className="space-y-3">
                      {currentStep.instructions.paragraphs.map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {currentStep.instructions.bulletPoints && (
                    <ul className="space-y-2">
                      {currentStep.instructions.bulletPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {currentStep.instructions.footer && (
                    <p className="text-sm text-muted-foreground pt-2 border-t">
                      {currentStep.instructions.footer}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {currentStep.buttons.map((button) => (
                      <Button
                        key={button.id}
                        variant={button.variant || 'default'}
                        className="flex items-center gap-2"
                        onClick={() => {
                          if (button.id === 'help') {
                            setChatbotOpen(true);
                          }
                        }}
                      >
                        {button.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* External Account Integration */}
              {currentStep.type === 'verification' && currentStep.externalAccount && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      External Portal Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter your portal username"
                          defaultValue={currentStep.externalAccount.username}
                          onChange={(e) => {
                            if (currentStep.externalAccount) {
                              saveExternalAccount(currentStep.id, e.target.value, currentStep.externalAccount.password || '');
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your portal password"
                          defaultValue={currentStep.externalAccount.password}
                          onChange={(e) => {
                            if (currentStep.externalAccount) {
                              saveExternalAccount(currentStep.id, currentStep.externalAccount.username || '', e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Portal URL: {currentStep.externalAccount.portalUrl}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Program Selection */}
              {currentStep.type === 'program' && currentStep.programSettings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Selected Programs ({currentStep.programSettings.selectedPrograms.length}/{currentStep.programSettings.maxPrograms})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentStep.programSettings.selectedPrograms.length > 0 ? (
                      <div className="space-y-2">
                        {currentStep.programSettings.selectedPrograms.map((program, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                            <span className="font-medium text-blue-900">{program}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProgram(currentStep.id, program)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No programs selected yet.</p>
                    )}
                    
                    {currentStep.programSettings.selectedPrograms.length < currentStep.programSettings.maxPrograms && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You can select up to {currentStep.programSettings.maxPrograms - currentStep.programSettings.selectedPrograms.length} more programs.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Form Fields */}
              {currentStep.formFields && currentStep.formFields.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Required Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentStep.formFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            placeholder={field.placeholder}
                            defaultValue={field.value}
                            className="resize-none"
                            rows={3}
                          />
                        ) : field.type === 'file' ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                          </div>
                        ) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            defaultValue={field.value}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Document Upload */}
              {currentStep.documents && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentStep.documents.required.map((doc) => {
                      const isUploaded = currentStep.documents!.uploaded.includes(doc);
                      return (
                        <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {isUploaded ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-400" />
                            )}
                            <span className={isUploaded ? 'text-gray-700' : 'text-gray-900 font-medium'}>
                              {doc}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {isUploaded ? (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Admin Message */}
              {currentStep.adminMessage && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Message from Admin
                        </h4>
                        <p className="text-blue-800 text-sm">
                          {currentStep.adminMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ChatbotModal isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      <VideoModal 
        isOpen={videoModalOpen} 
        onClose={() => setVideoModalOpen(false)}
        videoUrl={currentVideoUrl}
        title={currentVideoTitle}
      />
    </div>
  );
};

export default MyPage;