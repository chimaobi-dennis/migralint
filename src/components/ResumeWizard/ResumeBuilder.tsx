import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Edit3, Share2, FileText, Plus } from 'lucide-react';
import { TemplateSelection } from './TemplateSelection';
import { ProgramSelection } from './ProgramSelection';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ExperienceStep } from './ExperienceStep';
import { EducationStep } from './EducationStep';
import { SkillsStep } from './SkillsStep';
import { EditableResumePreview } from './EditableResumePreview';

interface ResumeData {
  template: any;
  targetProgram: any;
  resumeType: 'job' | 'program' | 'general';
  personalInfo: any;
  experiences: any[];
  educations: any[];
  skills: any;
}

export const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState<ResumeData>({
    template: null,
    targetProgram: null,
    resumeType: 'general',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    experiences: [],
    educations: [],
    skills: {
      technicalSkills: [],
      softSkills: [],
      languages: [],
      certifications: []
    }
  });

  const steps = [
    { id: 1, title: 'Template', description: 'Choose your design' },
    { id: 2, title: 'Target', description: 'Job or program focus' },
    { id: 3, title: 'Personal Info', description: 'Contact details' },
    { id: 4, title: 'Experience', description: 'Work history' },
    { id: 5, title: 'Education', description: 'Academic background' },
    { id: 6, title: 'Skills', description: 'Abilities & certifications' },
    { id: 7, title: 'Review', description: 'Final preview' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return resumeData.template !== null;
      case 2: return resumeData.targetProgram !== null;
      case 3: return resumeData.personalInfo.firstName && resumeData.personalInfo.lastName && resumeData.personalInfo.email;
      case 4: return true; // Optional step
      case 5: return true; // Optional step
      case 6: return true; // Optional step
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateSelection
            selectedTemplate={resumeData.template}
            onTemplateSelect={(template) => setResumeData({ ...resumeData, template })}
          />
        );
      case 2:
        return (
          <ProgramSelection
            selectedProgram={resumeData.targetProgram}
            onProgramSelect={(program) => setResumeData({ ...resumeData, targetProgram: program })}
            resumeType={resumeData.resumeType}
            onResumeTypeChange={(type) => setResumeData({ ...resumeData, resumeType: type })}
          />
        );
      case 3:
        return (
          <PersonalInfoStep
            data={resumeData.personalInfo}
            onChange={(personalInfo) => setResumeData({ ...resumeData, personalInfo })}
          />
        );
      case 4:
        return (
          <ExperienceStep
            experiences={resumeData.experiences}
            onChange={(experiences) => setResumeData({ ...resumeData, experiences })}
          />
        );
      case 5:
        return (
          <EducationStep
            educations={resumeData.educations}
            onChange={(educations) => setResumeData({ ...resumeData, educations })}
          />
        );
      case 6:
        return (
          <SkillsStep
            data={resumeData.skills}
            onChange={(skills) => setResumeData({ ...resumeData, skills })}
          />
        );
      case 7:
        return (
          <EditableResumePreview
            resumeData={resumeData}
            onUpdateData={setResumeData}
            onStepChange={setCurrentStep}
          />
        );
      default:
        return null;
    }
  };

  // Full-page layout for step 7 (Review)
  if (currentStep === 7) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with title and actions */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="h-8 w-8 p-0"
              >
                ←
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Resume Builder</h1>
                <p className="text-sm text-muted-foreground">Review and finalize your resume</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                AI Review
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Main content layout */}
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
            {/* Left side - Resume Actions (scrollable) */}
            <div className="space-y-6 overflow-y-auto pr-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Customize Your Resume</h2>
                <p className="text-muted-foreground mb-6">
                  Click on any section in the preview to edit, or use the quick actions below.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentStep(3)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Personal Information
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentStep(4)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Work Experience
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentStep(5)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentStep(6)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Skills
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Template:</span>
                      <p className="font-medium">{resumeData.template?.name || 'None Selected'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <p className="font-medium">
                        {resumeData.resumeType === 'job' ? 'Job Application' : 
                         resumeData.resumeType === 'program' ? 'Program Application' : 'General'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sections:</span>
                      <p className="font-medium">
                        {2 + resumeData.experiences.length + resumeData.educations.length} sections
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completion:</span>
                      <p className="font-medium">
                        {Math.round(((resumeData.personalInfo.firstName ? 1 : 0) + 
                                     (resumeData.experiences.length > 0 ? 1 : 0) + 
                                     (resumeData.educations.length > 0 ? 1 : 0) + 
                                     (resumeData.skills.technicalSkills?.length > 0 ? 1 : 0)) / 4 * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full" size="lg">
                      <Download className="h-4 w-4 mr-2" />
                      Download as PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Resume Link
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export to Word
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Create Another Version
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Resume Preview (sticky) */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <Badge variant="secondary">Click sections to edit</Badge>
                </CardHeader>
                <CardContent>
                  <EditableResumePreview
                    resumeData={resumeData}
                    onUpdateData={setResumeData}
                    onStepChange={setCurrentStep}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted-foreground/20 text-muted-foreground'
              }`}
            >
              {step.id}
            </div>
            <div className="ml-3 hidden md:block">
              <div className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/20'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-96">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed() || currentStep === steps.length}
        >
          {currentStep === steps.length ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};