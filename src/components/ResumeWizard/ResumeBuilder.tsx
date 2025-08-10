import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Edit3, Share2, FileText } from 'lucide-react';
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