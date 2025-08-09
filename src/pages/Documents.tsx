import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  User,
  Briefcase,
  Brain,
  CreditCard,
  Wand2,
  BookOpen,
  GraduationCap,
  Target,
  Award
} from 'lucide-react';
import { ResumeBuilder } from '@/components/ResumeWizard/ResumeBuilder';
import { DocumentTypeStep } from '@/components/OtherDocumentService/DocumentTypeStep';
import { TemplateStep } from '@/components/OtherDocumentService/TemplateStep';
import { FormStep } from '@/components/OtherDocumentService/FormStep';
import { EditorStep } from '@/components/OtherDocumentService/EditorStep';
import { ReviewStep } from '@/components/OtherDocumentService/ReviewStep';
import { useAdmissionSteps } from '@/hooks/useAdmissionSteps';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [activeTab, setActiveTab] = useState('resume');
  
  // Other Document Service State
  const [otherDocCurrentStep, setOtherDocCurrentStep] = useState(1);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [documentFormData, setDocumentFormData] = useState({
    writingFor: '', // 'program' or 'general'
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const [ShowAIService, setShowAIService] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    if (currentStep === 3) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAIServiceBack = () => {
    if (currentStep === 3 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const questions = [
    { key: 'currentDegree', label: 'Current Degree', placeholder: 'e.g., Bachelor\'s in Computer Science', type: 'text' },
    { key: 'gpa', label: 'GPA/Grades', placeholder: 'e.g., 3.8/4.0 or First Class Honours', type: 'text' },
    { key: 'workExperience', label: 'Work Experience', placeholder: 'Describe relevant work experience, internships, or part-time jobs...', type: 'textarea' },
    { key: 'researchExperience', label: 'Research Experience', placeholder: 'Any research projects, publications, or academic work...', type: 'textarea' },
    { key: 'careerGoals', label: 'Career Goals', placeholder: 'What are your long-term career aspirations?', type: 'textarea' },
    { key: 'whyThisProgram', label: 'Why This Program?', placeholder: 'What draws you to this specific program?', type: 'textarea' },
    { key: 'achievements', label: 'Key Achievements', placeholder: 'Academic achievements, awards, leadership roles...', type: 'textarea' },
    { key: 'challenges', label: 'Challenges Overcome', placeholder: 'Significant challenges you\'ve faced and how you overcame them...', type: 'textarea' }
  ];

  const generateAISuggestions = async (inputValue: string, questionKey: string) => {
    if (inputValue.length < 3) {
      setShowSuggestions(false);
      return;
    }

    // Mock AI suggestions - in a real app, this would call an AI API
    const mockSuggestions = {
      currentDegree: [
        "Bachelor's degree in Computer Science with focus on AI and Machine Learning",
        "Bachelor's in Engineering with specialization in Software Development",
        "Bachelor's in Information Technology with honors"
      ],
      gpa: [
        "3.8/4.0 GPA with Dean's List recognition for 3 consecutive semesters",
        "First Class Honours (85% average) in Computer Science program",
        "3.9/4.0 cumulative GPA, ranked top 10% of graduating class"
      ],
      workExperience: [
        "Software Developer Intern at Tech Startup - Developed mobile applications using React Native and contributed to core product features",
        "Research Assistant at University Lab - Collaborated on machine learning research projects and co-authored 2 published papers",
        "Part-time Web Developer - Built responsive websites for local businesses while maintaining full academic workload"
      ],
      researchExperience: [
        "Conducted independent research on natural language processing, resulting in a thesis that received departmental recognition",
        "Collaborated with faculty on AI ethics research, contributing to 2 peer-reviewed publications",
        "Led undergraduate research team investigating sustainable computing solutions, presented findings at national conference"
      ],
      careerGoals: [
        "To become a leading researcher in artificial intelligence and contribute to breakthrough innovations",
        "To work in product management at a tech company, bridging technology and business strategy",
        "To pursue a career in data science and help organizations make data-driven decisions"
      ],
      whyThisProgram: [
        "The program's emphasis on practical application and industry collaboration aligns with my career goals",
        "The opportunity to work with renowned faculty in cutting-edge research areas",
        "The program's international perspective and diverse student body will broaden my worldview"
      ],
      achievements: [
        "Recipient of Academic Excellence Scholarship for maintaining top 5% GPA throughout undergraduate studies",
        "Founded and led university's AI club, organizing workshops and hackathons for 200+ students",
        "Won first place in national programming competition and published mobile app with 10,000+ downloads"
      ],
      challenges: [
        "Overcame financial hardship by working part-time while maintaining academic excellence, developing strong time management skills",
        "Successfully transitioned from non-technical background to computer science, demonstrating adaptability and determination",
        "Led team through complex group project despite initial conflicts, improving collaborative leadership abilities"
      ]
    };

    setTimeout(() => {
      setAiSuggestions(mockSuggestions[questionKey] || []);
      setShowSuggestions(true);
    }, 300);
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
              <h3 className="text-lg font-semibold mb-2">What are you writing for?</h3>
              <p className="text-muted-foreground">Choose whether you're writing for a specific program or general use</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant={aiFormData.writingFor === 'program' ? 'default' : 'outline'}
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => setAiFormData({...aiFormData, writingFor: 'program'})}
              >
                <GraduationCap className="h-6 w-6 mb-2" />
                <span className="font-medium">Program Application</span>
                <span className="text-sm text-muted-foreground">Writing for a specific university program</span>
              </Button>
              <Button
                variant={aiFormData.writingFor === 'general' ? 'default' : 'outline'}
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => setAiFormData({...aiFormData, writingFor: 'general'})}
              >
                <FileText className="h-6 w-6 mb-2" />
                <span className="font-medium">General Document</span>
                <span className="text-sm text-muted-foreground">Writing for general academic purposes</span>
              </Button>
            </div>
          </div>
        );
      case 2:
        if (aiFormData.writingFor === 'program') {
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
                {aiFormData.program && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Required Documents for this Program:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Statement of Purpose', 'CV/Resume', 'Motivation Letter', 'Recommendation Letters'].map((doc) => (
                        <div key={doc} className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                 <div>
                   <label className="block text-sm font-medium mb-2">Document Type</label>
                   <div className="grid grid-cols-2 gap-3">
                     {[
                       { type: 'Statement of Purpose', icon: <Target className="h-4 w-4" /> },
                       { type: 'Motivation Letter', icon: <Award className="h-4 w-4" /> },
                       { type: 'Personal Statement', icon: <User className="h-4 w-4" /> },
                       { type: 'Cover Letter', icon: <Briefcase className="h-4 w-4" /> }
                     ].map(({ type, icon }) => (
                       <Button
                         key={type}
                         variant={aiFormData.documentType === type ? 'default' : 'outline'}
                         className="h-12 flex items-center justify-start space-x-2"
                         onClick={() => setAiFormData({...aiFormData, documentType: type})}
                       >
                         {icon}
                         <span className="text-sm">{type}</span>
                       </Button>
                     ))}
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium mb-2">Tone</label>
                     <Select value={aiFormData.tone} onValueChange={(value) => setAiFormData({...aiFormData, tone: value})}>
                       <SelectTrigger className="w-full">
                         <SelectValue placeholder="Select tone" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="professional">Professional</SelectItem>
                         <SelectItem value="casual">Casual</SelectItem>
                         <SelectItem value="technical">Technical</SelectItem>
                         <SelectItem value="academic">Academic</SelectItem>
                         <SelectItem value="creative">Creative</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-2">Page Count</label>
                     <Input
                       type="number"
                       placeholder="e.g., 5"
                       value={aiFormData.pages}
                       onChange={(e) => setAiFormData({...aiFormData, pages: e.target.value})}
                     />
                   </div>
                 </div>
              </div>
            </div>
          );
        } else {
          // General document writing
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">What type of document do you need?</h3>
                <p className="text-muted-foreground">Select the type of academic document you want to create</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'Essay', icon: <FileText className="h-5 w-5" /> },
                  { type: 'Research Proposal', icon: <BookOpen className="h-5 w-5" /> },
                  { type: 'Report', icon: <FileCheck className="h-5 w-5" /> },
                  { type: 'Thesis Chapter', icon: <GraduationCap className="h-5 w-5" /> },
                  { type: 'Literature Review', icon: <BookOpen className="h-5 w-5" /> },
                  { type: 'Case Study', icon: <Target className="h-5 w-5" /> }
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <Select value={aiFormData.tone} onValueChange={(value) => setAiFormData({...aiFormData, tone: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Page Count</label>
                  <Input
                    type="number"
                    placeholder="e.g., 5-10 pages"
                    value={aiFormData.pages}
                    onChange={(e) => setAiFormData({...aiFormData, pages: e.target.value})}
                  />
                </div>
              </div>
            </div>
          );
        }
      case 3:
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Tell us about yourself</h3>
              <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            
            {/* Progress dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentQuestionIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{currentQuestion.label}</label>
                <div className="relative">
                  {currentQuestion.type === 'textarea' ? (
                    <textarea
                      className="w-full p-3 border rounded-md h-24 resize-none"
                      placeholder={currentQuestion.placeholder}
                      value={aiFormData[currentQuestion.key]}
                      onChange={(e) => {
                        setAiFormData({...aiFormData, [currentQuestion.key]: e.target.value});
                        generateAISuggestions(e.target.value, currentQuestion.key);
                      }}
                    />
                  ) : (
                    <Input
                      placeholder={currentQuestion.placeholder}
                      value={aiFormData[currentQuestion.key]}
                      onChange={(e) => {
                        setAiFormData({...aiFormData, [currentQuestion.key]: e.target.value});
                        generateAISuggestions(e.target.value, currentQuestion.key);
                      }}
                    />
                  )}
                  
                  {/* AI Suggestions */}
                  {showSuggestions && aiSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                      <div className="p-2 border-b bg-blue-50">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
                        </div>
                      </div>
                      {aiSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 text-sm"
                          onClick={() => {
                            setAiFormData({...aiFormData, [currentQuestion.key]: suggestion});
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                      <button
                        className="w-full text-center p-2 text-xs text-gray-500 hover:bg-gray-50"
                        onClick={() => setShowSuggestions(false)}
                      >
                        Close suggestions
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review & Generate</h3>
              <p className="text-muted-foreground">Confirm your details and start generating your document</p>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-3 max-h-64 overflow-y-auto">
              <div className="flex justify-between"><span className="font-medium">Document Type:</span><span>{aiFormData.documentType}</span></div>
              <div className="flex justify-between"><span className="font-medium">Program:</span><span className="text-right">{getAllPrograms().find(p => p.id === aiFormData.program)?.name || 'Not selected'}</span></div>
              <div className="flex justify-between"><span className="font-medium">Tone:</span><span>{aiFormData.tone}</span></div>
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5" />
                <span>AI Document Service</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((step) => (
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
                  {currentStep < 4 ? (
                    <Button 
                      onClick={handleAIServiceNext}
                      disabled={
                        (currentStep === 1 && !aiFormData.writingFor) ||
                        (currentStep === 2 && !aiFormData.documentType) ||
                        (currentStep === 2 && aiFormData.writingFor === 'program' && !aiFormData.program) ||
                        (currentStep === 2 && aiFormData.writingFor === 'general' && !aiFormData.tone)
                      }
                    >
                      {currentStep === 3 && currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Next'}
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={() => {
                        // Generate document logic here
                        setShowAIService(false);
                        setCurrentStep(1);
                        setAiFormData({
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
