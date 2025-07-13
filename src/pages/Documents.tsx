import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Edit3, 
  Sparkles, 
  CreditCard, 
  Upload,
  Brain,
  Calendar,
  Clock,
  FileCheck,
  Wand2,
  BookOpen,
  GraduationCap,
  Target,
  User,
  Briefcase,
  Award
} from 'lucide-react';
import { useAdmissionSteps } from '@/hooks/useAdmissionSteps';

interface Document {
  id: string;
  name: string;
  type: 'essay' | 'research' | 'report' | 'thesis' | 'assignment' | 'uploaded';
  dateCreated: string;
  lastModified: string;
  wordCount: number;
  status: 'draft' | 'completed' | 'enhanced' | 'uploaded';
  aiEnhanced: boolean;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAIService, setShowAIService] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [aiFormData, setAiFormData] = useState({
    documentType: '',
    program: '',
    programBackground: '',
    subject: '',
    level: '',
    deadline: '',
    requirements: '',
    tone: '',
    pages: '',
    // Academic background questions
    currentDegree: '',
    gpa: '',
    workExperience: '',
    researchExperience: '',
    careerGoals: '',
    whyThisProgram: '',
    achievements: '',
    challenges: ''
  });

  const { applications } = useAdmissionSteps();

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
      name: 'Climate Change Research Paper',
      type: 'research',
      dateCreated: '2024-01-15',
      lastModified: '2024-01-20',
      wordCount: 3500,
      status: 'completed',
      aiEnhanced: true
    },
    {
      id: '2',
      name: 'Marketing Strategy Analysis',
      type: 'assignment',
      dateCreated: '2024-01-10',
      lastModified: '2024-01-18',
      wordCount: 2200,
      status: 'enhanced',
      aiEnhanced: true
    },
    {
      id: '3',
      name: 'Literature Review Draft',
      type: 'essay',
      dateCreated: '2024-01-08',
      lastModified: '2024-01-08',
      wordCount: 1800,
      status: 'draft',
      aiEnhanced: false
    },
    {
      id: '4',
      name: 'Course Syllabus.pdf',
      type: 'uploaded',
      dateCreated: '2024-01-05',
      lastModified: '2024-01-05',
      wordCount: 0,
      status: 'uploaded',
      aiEnhanced: false
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'essay': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'research': return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'report': return <FileCheck className="h-5 w-5 text-purple-500" />;
      case 'thesis': return <GraduationCap className="h-5 w-5 text-orange-500" />;
      case 'assignment': return <Target className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'enhanced': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || doc.type === selectedFilter || doc.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAIServiceNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAIServiceBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get all available programs including those from applications
  const getAllPrograms = () => {
    const programsFromApplications = applications.map(app => ({
      id: app.id,
      name: `${app.programName} - ${app.universityName}`,
      university: app.universityName,
      program: app.programName,
      degree: app.degree,
      description: `${app.degree} program in ${app.programName} at ${app.universityName}`,
      requirements: app.requirements || [],
      isFromApplication: true
    }));

    const otherPrograms = [
      { id: 'p1', name: 'Computer Science - KTH', university: 'KTH', program: 'Computer Science', degree: "Master's", description: 'Advanced CS program focusing on AI and machine learning', requirements: ['Bachelor in CS'], isFromApplication: false },
      { id: 'p2', name: 'Business Administration - Stockholm School of Economics', university: 'SSE', program: 'Business Administration', degree: "Master's", description: 'Top-ranked business program with global perspective', requirements: ['Bachelor degree', 'GMAT/GRE'], isFromApplication: false },
      { id: 'p3', name: 'Engineering Physics - Chalmers', university: 'Chalmers', program: 'Engineering Physics', degree: "Master's", description: 'Interdisciplinary program combining physics and engineering', requirements: ['Bachelor in Physics/Engineering'], isFromApplication: false },
      { id: 'p4', name: 'Data Science - Uppsala University', university: 'Uppsala', program: 'Data Science', degree: "Master's", description: 'Comprehensive data science with ML and statistics focus', requirements: ['Bachelor in CS/Math/Statistics'], isFromApplication: false },
    ];

    // Filter out duplicates and put user's applications first
    const userApplicationPrograms = programsFromApplications.filter(app => 
      !otherPrograms.some(p => p.program === app.program && p.university === app.university)
    );

    return [...userApplicationPrograms, ...otherPrograms];
  };

  const handleProgramSelect = (programId: string) => {
    const programs = getAllPrograms();
    const selectedProgram = programs.find(p => p.id === programId);
    if (selectedProgram) {
      setAiFormData({
        ...aiFormData, 
        program: programId,
        programBackground: `Program: ${selectedProgram.program} at ${selectedProgram.university}. Description: ${selectedProgram.description}. Requirements: ${selectedProgram.requirements.join(', ')}`
      });
    }
  };

  const renderAIServiceStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">What type of document do you need?</h3>
              <p className="text-muted-foreground">Select the type of academic document you want to create</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'Statement of Purpose', icon: <Target className="h-5 w-5" /> },
                { type: 'Motivation Letter', icon: <Award className="h-5 w-5" /> },
                { type: 'Personal Statement', icon: <User className="h-5 w-5" /> },
                { type: 'Research Proposal', icon: <BookOpen className="h-5 w-5" /> },
                { type: 'Cover Letter', icon: <Briefcase className="h-5 w-5" /> },
                { type: 'Essay', icon: <FileText className="h-5 w-5" /> }
              ].map(({ type, icon }) => (
                <Button
                  key={type}
                  variant={aiFormData.documentType === type ? 'default' : 'outline'}
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => setAiFormData({...aiFormData, documentType: type})}
                >
                  {icon}
                  <span className="mt-2 text-sm">{type}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Which program are you applying to?</h3>
              <p className="text-muted-foreground">Select the program to help us tailor your document</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Program</label>
                <Select value={aiFormData.program} onValueChange={handleProgramSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50">Your Applications</div>
                        {applications.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-blue-500" />
                              <span>{app.programName} - {app.universityName}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-50">Other Programs</div>
                      </>
                    )}
                    {getAllPrograms().filter(p => !p.isFromApplication).map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        <span>{program.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Academic Level</label>
                <Select value={aiFormData.level} onValueChange={(value) => setAiFormData({...aiFormData, level: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate/Masters</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Page Count</label>
                <Input
                  type="number"
                  placeholder="e.g., 1-2 pages"
                  value={aiFormData.pages}
                  onChange={(e) => setAiFormData({...aiFormData, pages: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Tell us about your academic background</h3>
              <p className="text-muted-foreground">This helps us write a more personalized and compelling document</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Degree</label>
                <Input
                  placeholder="e.g., Bachelor's in Computer Science"
                  value={aiFormData.currentDegree}
                  onChange={(e) => setAiFormData({...aiFormData, currentDegree: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GPA/Grades</label>
                <Input
                  placeholder="e.g., 3.8/4.0 or First Class Honours"
                  value={aiFormData.gpa}
                  onChange={(e) => setAiFormData({...aiFormData, gpa: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Work Experience (if any)</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  placeholder="Describe relevant work experience, internships, or part-time jobs..."
                  value={aiFormData.workExperience}
                  onChange={(e) => setAiFormData({...aiFormData, workExperience: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Research Experience</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  placeholder="Any research projects, publications, or academic work..."
                  value={aiFormData.researchExperience}
                  onChange={(e) => setAiFormData({...aiFormData, researchExperience: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Career goals & motivation</h3>
              <p className="text-muted-foreground">Help us understand your aspirations and motivation</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Career Goals</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  placeholder="What are your long-term career goals? How does this program fit?"
                  value={aiFormData.careerGoals}
                  onChange={(e) => setAiFormData({...aiFormData, careerGoals: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Why this program?</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  placeholder="Why are you interested in this specific program and university?"
                  value={aiFormData.whyThisProgram}
                  onChange={(e) => setAiFormData({...aiFormData, whyThisProgram: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Key Achievements</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  placeholder="Academic awards, projects, leadership roles, extracurricular activities..."
                  value={aiFormData.achievements}
                  onChange={(e) => setAiFormData({...aiFormData, achievements: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Challenges overcome</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  placeholder="Any challenges you've overcome that shaped your academic journey (optional)..."
                  value={aiFormData.challenges}
                  onChange={(e) => setAiFormData({...aiFormData, challenges: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review & Generate</h3>
              <p className="text-muted-foreground">Confirm your details and start generating your document</p>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-3 max-h-64 overflow-y-auto">
              <div className="flex justify-between"><span className="font-medium">Document Type:</span><span>{aiFormData.documentType}</span></div>
              <div className="flex justify-between"><span className="font-medium">Program:</span><span className="text-right">{getAllPrograms().find(p => p.id === aiFormData.program)?.name || 'Not selected'}</span></div>
              <div className="flex justify-between"><span className="font-medium">Level:</span><span>{aiFormData.level}</span></div>
              <div className="flex justify-between"><span className="font-medium">Pages:</span><span>{aiFormData.pages}</span></div>
              <div className="flex justify-between"><span className="font-medium">Current Degree:</span><span className="text-right">{aiFormData.currentDegree}</span></div>
              <div className="flex justify-between"><span className="font-medium">GPA:</span><span>{aiFormData.gpa}</span></div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Credits Required: 35</span>
              </div>
              <p className="text-sm text-muted-foreground">This will create a comprehensive academic document tailored to your background and the selected program.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">AI Document Center</h1>
          </div>
          <p className="text-muted-foreground text-lg">Your intelligent writing companion for academic success</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">AI Credits</p>
                  <p className="text-2xl font-bold">{userStats.creditsLeft}</p>
                  <p className="text-blue-100 text-xs">of {userStats.totalCredits}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-200" />
              </div>
              <Progress value={(userStats.creditsLeft / userStats.totalCredits) * 100} className="mt-3 bg-blue-400" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Documents Created</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.documentsCreated}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Words Generated</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.wordsGenerated.toLocaleString()}</p>
                </div>
                <Edit3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <CreditCard className="h-4 w-4 mr-2" />
                Buy More Credits
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6" onClick={() => setShowAIService(true)}>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Wand2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Document Service</h3>
                  <p className="text-purple-100">Create documents with AI assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Upload Document</h3>
                  <p className="text-green-100">Upload and enhance existing documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Document Library</span>
            </CardTitle>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="uploaded">Uploaded</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getDocumentIcon(doc.type)}
                        <span className="font-medium truncate">{doc.name}</span>
                      </div>
                      {doc.aiEnhanced && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                      {doc.wordCount > 0 && (
                        <p className="text-sm text-muted-foreground">{doc.wordCount} words</p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(doc.dateCreated).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      {!doc.aiEnhanced && doc.type !== 'uploaded' && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Enhance
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Service Modal */}
        <Dialog open={showAIService} onOpenChange={setShowAIService}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5" />
                <span>AI Document Service</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              
              {renderAIServiceStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleAIServiceBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <div className="flex space-x-2">
                  {currentStep < 5 ? (
                    <Button 
                      onClick={handleAIServiceNext}
                      disabled={
                        (currentStep === 1 && !aiFormData.documentType) ||
                        (currentStep === 2 && (!aiFormData.program || !aiFormData.level))
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={() => {
                        // Generate document logic here
                        setShowAIService(false);
                        setCurrentStep(1);
                        setAiFormData({
                          documentType: '',
                          program: '',
                          programBackground: '',
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
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Document
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Documents;