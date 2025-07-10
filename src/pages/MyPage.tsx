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
  Download
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

interface StepField {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'date' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
}

interface StepButton {
  id: string;
  label: string;
  url?: string;
  variant?: 'default' | 'outline' | 'secondary';
}

interface ApplicationStep {
  id: string;
  stepNumber: number;
  title: string;
  type: 'form' | 'document' | 'information' | 'verification';
  status: 'completed' | 'current' | 'pending' | 'overdue';
  deadline?: string;
  instructions: {
    header?: string;
    paragraphs?: string[];
    bulletPoints?: string[];
    footer?: string;
  };
  buttons: StepButton[];
  formFields?: StepField[];
  documents?: {
    required: string[];
    uploaded: string[];
  };
  alerts?: {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
  }[];
  adminMessage?: string;
}

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("application");
  const [selectedStep, setSelectedStep] = useState<string>("1");

  // Mock data - in real app this would come from database
  const applicationSteps: ApplicationStep[] = [
    {
      id: "1",
      stepNumber: 1,
      title: "Create account in the admissions portal",
      type: "verification",
      status: "completed",
      deadline: "2024-01-30",
      instructions: {
        header: "Account Creation Required",
        paragraphs: [
          "Go to the University Admissions website, the central admission processing unit for all Swedish universities."
        ],
        bulletPoints: [
          "Visit the official admissions portal",
          "Complete your personal information",
          "Verify your email address",
          "Set up your login credentials"
        ]
      },
      buttons: [
        { id: "create", label: "Create Account", url: "#", variant: "default" },
        { id: "help", label: "Need Help?", url: "#", variant: "outline" }
      ],
      alerts: [
        {
          type: "success",
          message: "Account successfully created and verified!"
        }
      ]
    },
    {
      id: "2",
      stepNumber: 2,
      title: "Add programs to your application",
      type: "form",
      status: "current",
      deadline: "2024-02-15",
      instructions: {
        header: "Program Selection Guidelines",
        paragraphs: [
          "NextStep has simplified the program selection process by suggesting programs that you are most eligible for."
        ],
        bulletPoints: [
          "Review the programs carefully tailored to your academic background",
          "Select up to 8 programs from the recommendations or choose additional ones",
          "Rank your selections by preference",
          "Click 'Add to Application' to finalize your selection"
        ]
      },
      buttons: [
        { id: "add", label: "Add Programs", url: "#", variant: "default" },
        { id: "guidelines", label: "Read Guidelines", url: "#", variant: "outline" }
      ],
      formFields: [
        {
          id: "preferred_program",
          type: "text",
          label: "Preferred Program",
          placeholder: "Enter your preferred program",
          required: true
        },
        {
          id: "backup_programs",
          type: "textarea",
          label: "Backup Programs",
          placeholder: "List your backup program choices",
          required: false
        }
      ],
      alerts: [
        {
          type: "warning",
          message: "Deadline approaching in 15 days. Complete this step soon!"
        }
      ]
    },
    {
      id: "3",
      stepNumber: 3,
      title: "Upload all required documents",
      type: "document",
      status: "pending",
      deadline: "2024-02-28",
      instructions: {
        header: "Document Upload Requirements",
        paragraphs: [
          "Go to your dashboard and submit all required documents. You can make use of NextStep's document writing services to prepare documents that SOP ML, Cover letter etc."
        ],
        bulletPoints: [
          "Ensure all documents are in PDF format",
          "Maximum file size: 10MB per document",
          "Documents must be in English or officially translated"
        ],
        footer: "All documents will be reviewed within 3-5 business days."
      },
      buttons: [
        { id: "upload", label: "Upload Documents", url: "#", variant: "default" },
        { id: "services", label: "Document Services", url: "#", variant: "secondary" }
      ],
      documents: {
        required: [
          "Academic Transcripts",
          "Statement of Purpose",
          "Letters of Recommendation",
          "Language Proficiency Certificate",
          "CV/Resume"
        ],
        uploaded: [
          "Academic Transcripts",
          "CV/Resume"
        ]
      },
      alerts: [
        {
          type: "info",
          message: "Document writing services available to help you create professional documents."
        }
      ]
    }
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
                </CardHeader>
              </Card>

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
                      >
                        {button.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
    </div>
  );
};

export default MyPage;