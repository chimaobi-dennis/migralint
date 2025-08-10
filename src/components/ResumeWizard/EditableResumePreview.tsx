import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, 
  Eye, 
  Edit3, 
  Share2, 
  Palette, 
  FileCheck,
  Plus,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { TemplateSelection } from './TemplateSelection';

interface ResumeData {
  template: any;
  targetProgram: any;
  resumeType: 'job' | 'program' | 'general';
  personalInfo: any;
  experiences: any[];
  educations: any[];
  skills: any;
}

interface EditableResumePreviewProps {
  resumeData: ResumeData;
  onUpdateData: (data: ResumeData) => void;
  onStepChange: (step: number) => void;
}

interface EditingSection {
  type: 'personal' | 'experience' | 'education' | 'skills' | null;
  index?: number;
}

export const EditableResumePreview: React.FC<EditableResumePreviewProps> = ({
  resumeData,
  onUpdateData,
  onStepChange
}) => {
  const [editingSection, setEditingSection] = useState<EditingSection>({ type: null });
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const handleSectionClick = (type: EditingSection['type'], index?: number) => {
    setEditingSection({ type, index });
    // Navigate to the appropriate step
    switch (type) {
      case 'personal':
        onStepChange(3);
        break;
      case 'experience':
        onStepChange(4);
        break;
      case 'education':
        onStepChange(5);
        break;
      case 'skills':
        onStepChange(6);
        break;
    }
  };

  const handleTemplateChange = (template: any) => {
    onUpdateData({ ...resumeData, template });
    setTemplateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Your Resume</h2>
        <p className="text-muted-foreground">
          Click on any section to edit. Your changes will be saved automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Resume Preview */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Resume Preview
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Palette className="h-4 w-4 mr-2" />
                    Change Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Choose Template</DialogTitle>
                  </DialogHeader>
                  <TemplateSelection
                    selectedTemplate={resumeData.template}
                    onTemplateSelect={handleTemplateChange}
                  />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm">
                <FileCheck className="h-4 w-4 mr-2" />
                AI Review
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-[8.5/11] bg-white border rounded-lg p-6 text-sm overflow-hidden shadow-lg">
              {/* Header Section - Clickable */}
              <div 
                className="text-center cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors group"
                onClick={() => handleSectionClick('personal')}
              >
                <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                  <Edit3 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-600 ml-1">Click to edit</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {resumeData.personalInfo.firstName || 'Your Name'} {resumeData.personalInfo.lastName}
                </h1>
                <div className="text-gray-600 space-y-1 mt-2">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    {resumeData.personalInfo.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {resumeData.personalInfo.email}
                      </span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {resumeData.personalInfo.phone}
                      </span>
                    )}
                  </div>
                  {resumeData.personalInfo.location && (
                    <p className="flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {resumeData.personalInfo.location}
                    </p>
                  )}
                  {resumeData.personalInfo.website && (
                    <p className="flex items-center justify-center gap-1">
                      <Globe className="h-3 w-3" />
                      {resumeData.personalInfo.website}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Professional Summary - Clickable */}
              {resumeData.personalInfo.summary && (
                <div 
                  className="mt-6 cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors group"
                  onClick={() => handleSectionClick('personal')}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 flex-1">
                      Professional Summary
                    </h2>
                    <Edit3 className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                    {resumeData.personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Experience Section - Clickable */}
              <div 
                className="mt-6 cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors group"
                onClick={() => handleSectionClick('experience')}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 flex-1">
                    Experience
                  </h2>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4 text-green-600" />
                    <Edit3 className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-3 mt-3">
                  {resumeData.experiences.length > 0 ? (
                    resumeData.experiences.slice(0, 2).map((exp, index) => (
                      <div key={index} className="hover:bg-gray-50 rounded p-1 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {exp.company} • {exp.location}
                            </p>
                            {exp.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-4">
                            {exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      Click to add your work experience
                    </p>
                  )}
                </div>
              </div>

              {/* Education Section - Clickable */}
              <div 
                className="mt-6 cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors group"
                onClick={() => handleSectionClick('education')}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 flex-1">
                    Education
                  </h2>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4 text-green-600" />
                    <Edit3 className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2 mt-3">
                  {resumeData.educations.length > 0 ? (
                    resumeData.educations.slice(0, 2).map((edu, index) => (
                      <div key={index} className="hover:bg-gray-50 rounded p-1 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                            <p className="text-sm text-gray-600">{edu.school}</p>
                            {edu.fieldOfStudy && (
                              <p className="text-xs text-gray-500">{edu.fieldOfStudy}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      Click to add your education
                    </p>
                  )}
                </div>
              </div>

              {/* Skills Section - Clickable */}
              <div 
                className="mt-6 cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors group"
                onClick={() => handleSectionClick('skills')}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 flex-1">
                    Skills
                  </h2>
                  <Edit3 className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-3">
                  {resumeData.skills.technicalSkills?.length > 0 ? (
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Technical Skills</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resumeData.skills.technicalSkills.slice(0, 8).map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      Click to add your skills
                    </p>
                  )}
                </div>
              </div>

              <div className="text-center text-gray-400 text-xs mt-6 pt-4 border-t">
                Click any section above to edit • Template: {resumeData.template?.name || 'None Selected'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Actions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Resume Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </Button>
            
            <Button variant="outline" className="w-full" size="lg">
              <Edit3 className="h-4 w-4 mr-2" />
              Continue Editing
            </Button>
            
            <Button variant="outline" className="w-full" size="lg">
              <Share2 className="h-4 w-4 mr-2" />
              Share Resume
            </Button>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Resume Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Template:</span>
                  <Badge variant="secondary">{resumeData.template?.name || 'None'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <Badge variant="secondary">
                    {resumeData.resumeType === 'job' ? 'Job Application' : 
                     resumeData.resumeType === 'program' ? 'Program Application' : 'General'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sections:</span>
                  <span className="text-muted-foreground">
                    {2 + resumeData.experiences.length + resumeData.educations.length} sections
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completion:</span>
                  <Badge variant="outline">
                    {Math.round(((resumeData.personalInfo.firstName ? 1 : 0) + 
                                 (resumeData.experiences.length > 0 ? 1 : 0) + 
                                 (resumeData.educations.length > 0 ? 1 : 0) + 
                                 (resumeData.skills.technicalSkills?.length > 0 ? 1 : 0)) / 4 * 100)}%
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSectionClick('personal')}
                >
                  Edit Info
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSectionClick('experience')}
                >
                  Add Experience
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSectionClick('education')}
                >
                  Add Education
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSectionClick('skills')}
                >
                  Edit Skills
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};