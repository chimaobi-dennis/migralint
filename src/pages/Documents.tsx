import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Target
} from 'lucide-react';

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
    subject: '',
    level: '',
    deadline: '',
    requirements: '',
    tone: '',
    pages: ''
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAIServiceBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
              {['Essay', 'Research Paper', 'Report', 'Thesis', 'Assignment', 'Other'].map((type) => (
                <Button
                  key={type}
                  variant={aiFormData.documentType === type ? 'default' : 'outline'}
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => setAiFormData({...aiFormData, documentType: type})}
                >
                  {getDocumentIcon(type.toLowerCase())}
                  <span className="mt-2">{type}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Tell us about your assignment</h3>
              <p className="text-muted-foreground">Provide details to help us create the perfect document</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject/Topic</label>
                <Input
                  placeholder="e.g., Environmental Science, Business Management"
                  value={aiFormData.subject}
                  onChange={(e) => setAiFormData({...aiFormData, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Academic Level</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={aiFormData.level}
                  onChange={(e) => setAiFormData({...aiFormData, level: e.target.value})}
                >
                  <option value="">Select level</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="phd">PhD</option>
                </select>
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
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Additional Requirements</h3>
              <p className="text-muted-foreground">Help us understand your specific needs</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <Input
                  type="date"
                  value={aiFormData.deadline}
                  onChange={(e) => setAiFormData({...aiFormData, deadline: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Writing Tone</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={aiFormData.tone}
                  onChange={(e) => setAiFormData({...aiFormData, tone: e.target.value})}
                >
                  <option value="">Select tone</option>
                  <option value="academic">Academic</option>
                  <option value="formal">Formal</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="analytical">Analytical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Specific Requirements</label>
                <textarea
                  className="w-full p-2 border rounded-md h-24"
                  placeholder="Any specific instructions, citation style, or requirements..."
                  value={aiFormData.requirements}
                  onChange={(e) => setAiFormData({...aiFormData, requirements: e.target.value})}
                />
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
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between"><span className="font-medium">Document Type:</span><span>{aiFormData.documentType}</span></div>
              <div className="flex justify-between"><span className="font-medium">Subject:</span><span>{aiFormData.subject}</span></div>
              <div className="flex justify-between"><span className="font-medium">Level:</span><span>{aiFormData.level}</span></div>
              <div className="flex justify-between"><span className="font-medium">Pages:</span><span>{aiFormData.pages}</span></div>
              <div className="flex justify-between"><span className="font-medium">Tone:</span><span>{aiFormData.tone}</span></div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Credits Required: 25</span>
              </div>
              <p className="text-sm text-muted-foreground">This will create a comprehensive document based on your requirements.</p>
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
                    <Button onClick={handleAIServiceNext}>
                      Next
                    </Button>
                  ) : (
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
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