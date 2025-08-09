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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Review Your Resume</h2>
              <p className="text-muted-foreground">
                Review your resume and make any final adjustments before downloading
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resume Preview */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Resume Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[8.5/11] bg-white border rounded-lg p-6 text-sm overflow-hidden">
                    {/* Mock Resume Preview */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                        </h1>
                        <div className="text-gray-600 space-y-1">
                          <p>{resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</p>
                          <p>{resumeData.personalInfo.location}</p>
                        </div>
                      </div>
                      
                      {resumeData.personalInfo.summary && (
                        <div>
                          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
                            Professional Summary
                          </h2>
                          <p className="text-gray-700 mt-2">{resumeData.personalInfo.summary}</p>
                        </div>
                      )}

                      {resumeData.experiences.length > 0 && (
                        <div>
                          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1">
                            Experience
                          </h2>
                          <div className="space-y-2 mt-2">
                            {resumeData.experiences.slice(0, 2).map((exp, index) => (
                              <div key={index}>
                                <div className="flex justify-between">
                                  <h3 className="font-medium">{exp.jobTitle}</h3>
                                  <span className="text-xs text-gray-500">
                                    {exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-center text-gray-400 text-xs">
                        [Full resume content will be generated]
                      </div>
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
                        <Badge variant="secondary">{resumeData.template?.name}</Badge>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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