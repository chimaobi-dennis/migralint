import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Search, 
  Download, 
  Edit3, 
  Sparkles, 
  Upload,
  Calendar,
  Clock,
  FileCheck,
  PlusCircle,
  Brain,
  CreditCard
} from 'lucide-react';
import { ResumeBuilder } from '@/components/ResumeWizard/ResumeBuilder';
import { DocumentTypeStep } from '@/components/OtherDocumentService/DocumentTypeStep';
import { TemplateStep } from '@/components/OtherDocumentService/TemplateStep';
import { FormStep } from '@/components/OtherDocumentService/FormStep';
import { EditorStep } from '@/components/OtherDocumentService/EditorStep';
import { ReviewStep } from '@/components/OtherDocumentService/ReviewStep';

interface Document {
  id: string;
  name: string;
  type: 'essay' | 'research' | 'report' | 'thesis' | 'assignment' | 'uploaded' | 'resume' | 'sop' | 'cover_letter';
  dateCreated: string;
  lastModified: string;
  wordCount: number;
  status: 'draft' | 'completed' | 'enhanced' | 'uploaded';
  aiEnhanced: boolean;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('resume');
  
  // Other Document Service State
  const [otherDocCurrentStep, setOtherDocCurrentStep] = useState(1);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [documentFormData, setDocumentFormData] = useState({
    writingFor: '',
    documentType: '',
    program: '',
    programBackground: '',
    requiredDocuments: [],
    subject: '',
    level: '',
    deadline: '',
    requirements: '',
    tone: '',
    pages: '',
    currentDegree: '',
    gpa: '',
    workExperience: '',
    researchExperience: '',
    careerGoals: '',
    whyThisProgram: '',
    achievements: '',
    challenges: ''
  });

  // Mock data
  const userStats = {
    creditsLeft: 150,
    totalCredits: 200,
    documentsCreated: 12,
    wordsGenerated: 45000
  };

  const documents: Document[] = [
    {
      id: '1',
      name: 'Software Engineer Resume',
      type: 'resume',
      dateCreated: '2024-01-20',
      lastModified: '2024-01-22',
      wordCount: 450,
      status: 'completed',
      aiEnhanced: true
    },
    {
      id: '2',
      name: 'Statement of Purpose - KTH',
      type: 'sop',
      dateCreated: '2024-01-18',
      lastModified: '2024-01-20',
      wordCount: 850,
      status: 'enhanced',
      aiEnhanced: true
    },
    {
      id: '3',
      name: 'Cover Letter - Google',
      type: 'cover_letter',
      dateCreated: '2024-01-15',
      lastModified: '2024-01-15',
      wordCount: 320,
      status: 'draft',
      aiEnhanced: false
    },
    {
      id: '4',
      name: 'Research Paper Draft',
      type: 'research',
      dateCreated: '2024-01-10',
      lastModified: '2024-01-12',
      wordCount: 2200,
      status: 'draft',
      aiEnhanced: false
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'resume': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'sop': return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'cover_letter': return <Edit3 className="h-5 w-5 text-purple-500" />;
      case 'essay': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'research': return <FileText className="h-5 w-5 text-green-500" />;
      case 'report': return <FileCheck className="h-5 w-5 text-purple-500" />;
      case 'thesis': return <FileText className="h-5 w-5 text-orange-500" />;
      case 'assignment': return <FileText className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'enhanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'uploaded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter || doc.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOtherDocNext = () => {
    if (otherDocCurrentStep < 5) {
      setOtherDocCurrentStep(otherDocCurrentStep + 1);
    }
  };

  const handleOtherDocBack = () => {
    if (otherDocCurrentStep > 1) {
      setOtherDocCurrentStep(otherDocCurrentStep - 1);
    }
  };

  const renderOtherDocumentStep = () => {
    switch (otherDocCurrentStep) {
      case 1:
        return (
          <DocumentTypeStep
            selectedType={selectedDocType}
            onTypeSelect={setSelectedDocType}
          />
        );
      case 2:
        return (
          <TemplateStep
            documentType={selectedDocType?.id || ''}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
          />
        );
      case 3:
        return (
          <FormStep
            documentType={selectedDocType?.id || ''}
            data={{
              targetProgram: documentFormData.program,
              wordCount: documentFormData.pages,
              tone: documentFormData.tone,
              deadline: documentFormData.deadline,
              specificRequirements: documentFormData.requirements,
              background: documentFormData.workExperience,
              goals: documentFormData.careerGoals,
              achievements: documentFormData.achievements,
              challenges: documentFormData.challenges,
              whyThisProgram: documentFormData.whyThisProgram
            }}
            onChange={(data) => setDocumentFormData({
              ...documentFormData,
              program: data.targetProgram || '',
              pages: data.wordCount,
              tone: data.tone,
              deadline: data.deadline,
              requirements: data.specificRequirements,
              workExperience: data.background,
              careerGoals: data.goals,
              achievements: data.achievements,
              challenges: data.challenges,
              whyThisProgram: data.whyThisProgram
            })}
          />
        );
      case 4:
        return (
          <EditorStep
            documentType={selectedDocType?.id || ''}
            formData={documentFormData}
            template={selectedTemplate}
            onContentChange={(content) => console.log('Content changed:', content)}
            onRegenerate={() => console.log('Regenerate')}
            onEnhance={(section) => console.log('Enhance section:', section)}
          />
        );
      case 5:
        return (
          <ReviewStep
            documentType={selectedDocType?.id || ''}
            formData={documentFormData}
            template={selectedTemplate}
            generatedContent="Sample generated content for review..."
            onEdit={() => setOtherDocCurrentStep(4)}
            onSave={() => {
              console.log('Saving document...');
              setOtherDocCurrentStep(1);
              setSelectedDocType(null);
              setSelectedTemplate(null);
              setDocumentFormData({
                writingFor: '',
                documentType: '',
                program: '',
                programBackground: '',
                requiredDocuments: [],
                subject: '',
                level: '',
                deadline: '',
                requirements: '',
                tone: '',
                pages: '',
                currentDegree: '',
                gpa: '',
                workExperience: '',
                researchExperience: '',
                careerGoals: '',
                whyThisProgram: '',
                achievements: '',
                challenges: ''
              });
            }}
            onDownload={() => console.log('Downloading document...')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Document Studio
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional resumes and academic documents with AI assistance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Left</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.creditsLeft}</div>
              <Progress value={(userStats.creditsLeft / userStats.totalCredits) * 100} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Created</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.documentsCreated}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Words Generated</CardTitle>
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.wordsGenerated.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Enhanced</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(d => d.aiEnhanced).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Resume Builder</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <Edit3 className="h-4 w-4" />
              <span>Other Documents</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center space-x-2">
              <FileCheck className="h-4 w-4" />
              <span>My Documents</span>
            </TabsTrigger>
          </TabsList>

          {/* Resume Builder Tab */}
          <TabsContent value="resume" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Resume Builder</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Edit3 className="h-5 w-5" />
                    <span>Create Document</span>
                  </div>
                  {otherDocCurrentStep > 1 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Step {otherDocCurrentStep} of 5
                      </span>
                      <Progress value={(otherDocCurrentStep / 5) * 100} className="w-24" />
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderOtherDocumentStep()}
                
                {/* Navigation Buttons */}
                {otherDocCurrentStep > 1 && (
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={handleOtherDocBack}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleOtherDocNext}
                      disabled={otherDocCurrentStep === 5}
                    >
                      {otherDocCurrentStep === 5 ? 'Complete' : 'Next'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="h-5 w-5" />
                    <span>My Documents</span>
                  </div>
                  <Button size="sm" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Document</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">All Documents</option>
                    <option value="resume">Resumes</option>
                    <option value="sop">Statements of Purpose</option>
                    <option value="cover_letter">Cover Letters</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Drafts</option>
                  </select>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getDocumentIcon(doc.type)}
                            <h3 className="font-medium text-sm leading-tight">{doc.name}</h3>
                          </div>
                          {doc.aiEnhanced && (
                            <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <Badge className={getStatusColor(doc.status)} variant="secondary">
                          {doc.status}
                        </Badge>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(doc.dateCreated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(doc.lastModified).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {doc.wordCount > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {doc.wordCount} words
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No documents found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Create your first document to get started.'
                      }
                    </p>
                    <Button onClick={() => setActiveTab('resume')}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Document
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documents;
