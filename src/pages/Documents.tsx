import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Upload,
  FileText,
  Plus,
  Download,
  Play,
  X,
  HelpCircle,
  FileCheck,
  Edit,
  ArrowRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

const Documents = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [steps, setSteps] = useState([
    {
      id: 'step1',
      title: 'Review Requirements',
      description: 'Understand the document requirements and guidelines.',
      status: 'incomplete',
      action: 'start'
    },
    {
      id: 'step2',
      title: 'Upload Documents',
      description: 'Upload necessary documents for AI processing.',
      status: 'incomplete',
      action: 'upload'
    },
    {
      id: 'step3',
      title: 'Generate Document',
      description: 'Generate the document using AI based on uploaded data.',
      status: 'incomplete',
      action: 'generate'
    },
    {
      id: 'step4',
      title: 'Review & Edit',
      description: 'Review the generated document and make necessary edits.',
      status: 'incomplete',
      action: 'review'
    },
    {
      id: 'step5',
      title: 'Finalize & Download',
      description: 'Finalize the document and download it.',
      status: 'incomplete',
      action: 'complete'
    }
  ]);

  const [aiServices, setAiServices] = useState([
    {
      id: 'service1',
      name: 'AI Document Generator',
      description: 'AI-powered document generation service.',
      icon: 'ai-icon'
    },
    {
      id: 'service2',
      name: 'AI Proofreader',
      description: 'AI-based proofreading and editing service.',
      icon: 'proofread-icon'
    },
    {
      id: 'service3',
      name: 'AI Summarizer',
      description: 'AI-driven document summarization service.',
      icon: 'summarize-icon'
    }
  ]);

  const [documentTypes, setDocumentTypes] = useState([
    'Resume',
    'Cover Letter',
    'Statement of Purpose',
    'Letter of Recommendation'
  ]);

  const handleStepAction = (stepId: string, actionType: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    switch (actionType) {
      case 'start':
        toast.info(`Starting ${step.title}...`);
        break;
      case 'upload':
        toast.info('Opening file upload...');
        break;
      case 'generate':
        toast.success(`${step.title} generated successfully!`);
        break;
      case 'review':
        toast.info(`Opening ${step.title} for review...`);
        break;
      case 'complete':
        toast.success(`${step.title} marked as completed!`);
        break;
      default:
        toast.info('Action performed');
    }
    
    console.log(`Action: ${actionType} for step: ${stepId}`);
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = aiServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(serviceId);
      toast.success(`Selected ${service.name} service`);
    }
  };

  const handleDocumentTypeSelect = (type: string) => {
    setSelectedDocumentType(type);
    toast.info(`Selected ${type} document type`);
  };

  const handleCreateDocument = () => {
    if (!selectedService || !selectedDocumentType) {
      toast.error('Please select both a service and document type');
      return;
    }

    const service = aiServices.find(s => s.id === selectedService);
    toast.success(`Creating ${selectedDocumentType} with ${service?.name}...`);
    
    // Simulate document creation process
    setTimeout(() => {
      toast.success('Document created successfully!');
    }, 2000);
  };

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Service Selection</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {aiServices.map(service => (
            <Button
              key={service.id}
              variant={selectedService === service.id ? "default" : "outline"}
              className="w-full"
              onClick={() => handleServiceSelect(service.id)}
            >
              {service.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Type Selection</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {documentTypes.map(type => (
            <Button
              key={type}
              variant={selectedDocumentType === type ? "default" : "outline"}
              className="w-full"
              onClick={() => handleDocumentTypeSelect(type)}
            >
              {type}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleCreateDocument} disabled={!selectedService || !selectedDocumentType}>
          Create Document
        </Button>
      </div>
    </div>
  );

  const renderMyDocumentsTab = () => (
    <Card>
      <CardContent>
        <p>Your generated documents will appear here.</p>
      </CardContent>
    </Card>
  );

  const renderStepsTab = () => (
    <div className="space-y-4">
      {steps.map(step => (
        <Card key={step.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {step.title}
              <Badge variant="secondary">{step.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{step.description}</p>
            <Button onClick={() => handleStepAction(step.id, step.action)} className="mt-4">
              {step.action}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Documents</h1>
          <Badge variant="outline">3 AI Services</Badge>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="my-documents">My Documents</TabsTrigger>
            <TabsTrigger value="steps">Steps</TabsTrigger>
          </TabsList>
          <TabsContent value="templates">
            {renderTemplatesTab()}
          </TabsContent>
          <TabsContent value="my-documents">
            {renderMyDocumentsTab()}
          </TabsContent>
          <TabsContent value="steps">
            {renderStepsTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documents;
