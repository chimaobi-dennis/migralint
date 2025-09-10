import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Printer, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  Undo,
  Redo,
  Copy,
  Trash2,
  AlignLeft,
  Link,
  Image as ImageIcon,
  Plus,
  Settings,
  Palette
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    headline: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    pictureUrl: string;
    linkedin: string;
    github: string;
  };
  experiences: any[];
  educations: any[];
  skills: any;
}

export default function ResumeEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const resumeData = location.state?.resumeData as ResumeData || {
    personalInfo: {
      firstName: 'chimaobi dennis',
      lastName: '',
      headline: 'Software Developer',
      email: 'igwedot@gmail.com',
      phone: '+461234567768',
      website: 'https://example.com',
      location: 'New York, NY',
      pictureUrl: 'https://example.com/photo.jpg',
      linkedin: '',
      github: ''
    },
    experiences: [],
    educations: [],
    skills: {}
  };

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [basicsOpen, setBasicsOpen] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(true);
  const [personalData, setPersonalData] = useState(resumeData.personalInfo);

  const templates = [
    { id: 1, name: 'Three Top Clean', image: '/placeholder.svg', selected: true },
    { id: 2, name: 'Modern Professional', image: '/placeholder.svg', selected: false },
    { id: 3, name: 'Black & White Clean', image: '/placeholder.svg', selected: false }
  ];

  const handlePersonalDataChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Resume Builder</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Change Template
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>←</span>
              <span>→</span>
              <span className="ml-2">Saved 19 seconds ago</span>
            </div>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className={`transition-all duration-300 ${leftSidebarOpen ? 'w-80' : 'w-0'} bg-background border-r overflow-hidden`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="text-sm text-muted-foreground mb-4">IN USE — MAIN</div>
            
            <Collapsible open={basicsOpen} onOpenChange={setBasicsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="font-medium">Basics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    </div>
                  </div>
                  {basicsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">Full Name</Label>
                    <Input 
                      id="firstName"
                      value={personalData.firstName}
                      onChange={(e) => handlePersonalDataChange('firstName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headline" className="text-sm font-medium">Headline</Label>
                    <Input 
                      id="headline"
                      value={personalData.headline}
                      onChange={(e) => handlePersonalDataChange('headline', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={personalData.email}
                      onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                    <Input 
                      id="phone"
                      value={personalData.phone}
                      onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                    <Input 
                      id="website"
                      value={personalData.website}
                      onChange={(e) => handlePersonalDataChange('website', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input 
                      id="location"
                      value={personalData.location}
                      onChange={(e) => handlePersonalDataChange('location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pictureUrl" className="text-sm font-medium">Picture URL</Label>
                  <Input 
                    id="pictureUrl"
                    value={personalData.pictureUrl}
                    onChange={(e) => handlePersonalDataChange('pictureUrl', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Social Profiles</Label>
                  <div className="mt-2 flex gap-2">
                    <Select defaultValue="linkedin">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Username/Handle" className="flex-1" />
                    <Input placeholder="Profile URL (optional)" className="flex-1" />
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add profile
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add a custom field
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 bg-muted/30 flex flex-col">
          {/* Toolbar */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                >
                  {leftSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Redo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">-</Button>
                  <span className="text-sm font-medium">30%</span>
                  <Button variant="ghost" size="sm">+</Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                >
                  {rightSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                      {personalData.firstName}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">{personalData.headline}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-center gap-6 text-muted-foreground">
                        <span>Phone</span>
                        <span>Location</span>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <span>{personalData.phone}</span>
                        <span>{personalData.location}</span>
                      </div>
                      <div className="flex items-center justify-center gap-6 text-muted-foreground mt-2">
                        <span>Email</span>
                        <span>Website</span>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <span className="text-primary">{personalData.email}</span>
                        <span className="text-primary">{personalData.website}</span>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder for additional sections */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold border-b pb-2 mb-4">Experience</h2>
                      <div className="text-muted-foreground text-center py-8">
                        Click to add your work experience
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold border-b pb-2 mb-4">Education</h2>
                      <div className="text-muted-foreground text-center py-8">
                        Click to add your education
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold border-b pb-2 mb-4">Skills</h2>
                      <div className="text-muted-foreground text-center py-8">
                        Click to add your skills
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`transition-all duration-300 ${rightSidebarOpen ? 'w-80' : 'w-0'} bg-background border-l overflow-hidden`}>
          <div className="p-4 h-full overflow-y-auto">
            <Collapsible open={templatesOpen} onOpenChange={setTemplatesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Templates</span>
                </div>
                {templatesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div 
                      key={template.id}
                      className={`relative p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors ${
                        template.selected ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <img 
                        src={template.image} 
                        alt={template.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                      <p className="text-xs font-medium text-center">{template.name}</p>
                      {template.selected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen={false} className="mt-6">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="text-lg">T</div>
                  <span className="font-medium">Typography</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </CollapsibleTrigger>
            </Collapsible>

            <Collapsible defaultOpen={false} className="mt-2">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="font-medium">Theme Colors</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}