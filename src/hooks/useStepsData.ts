import { useState, useEffect } from 'react';

export interface StepField {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'date' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  jsId?: string;
  wireModel?: string;
}

export interface StepButton {
  id: string;
  label: string;
  url?: string;
  variant?: 'default' | 'outline' | 'secondary';
  jsId?: string;
  wireClick?: string;
  icon?: string;
}

export interface ApplicationStep {
  id: string;
  stepNumber: number;
  title: string;
  type: 'form' | 'document' | 'information' | 'verification' | 'program';
  status: 'completed' | 'current' | 'pending' | 'overdue';
  deadline?: string;
  videoUrl?: string;
  instructions: {
    header?: string;
    paragraphs?: string[];
    bulletPoints?: string[];
    footer?: string;
  };
  buttons: StepButton[];
  formFields?: StepField[];
  documents?: {
    required: string[];
    uploaded: string[];
  };
  alerts?: {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
  }[];
  adminMessage?: string;
  programSettings?: {
    maxPrograms: number;
    selectedPrograms: string[];
  };
  externalAccount?: {
    username?: string;
    password?: string;
    portalUrl?: string;
  };
}

// Simulated database with localStorage
const STORAGE_KEY = 'application_steps';

const defaultSteps: ApplicationStep[] = [
  {
    id: "1",
    stepNumber: 1,
    title: "Create account in the admissions portal",
    type: "verification",
    status: "completed",
    deadline: "2024-01-30",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    instructions: {
      header: "Account Creation Required",
      paragraphs: [
        "Go to the University Admissions website, the central admission processing unit for all Swedish universities."
      ],
      bulletPoints: [
        "Visit the official admissions portal",
        "Complete your personal information", 
        "Verify your email address",
        "Set up your login credentials"
      ]
    },
    buttons: [
      { id: "create", label: "Create Account", url: "#", variant: "default" },
      { id: "help", label: "Need Help?", url: "#", variant: "outline" }
    ],
    alerts: [
      {
        type: "success",
        message: "Account successfully created and verified!"
      }
    ],
    externalAccount: {
      username: "",
      password: "",
      portalUrl: "https://admissions.se"
    }
  },
  {
    id: "2",
    stepNumber: 2,
    title: "Add programs to your application",
    type: "program",
    status: "current",
    deadline: "2024-02-15",
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    instructions: {
      header: "Program Selection Guidelines",
      paragraphs: [
        "NextStep has simplified the program selection process by suggesting programs that you are most eligible for."
      ],
      bulletPoints: [
        "Review the programs carefully tailored to your academic background",
        "Select up to 8 programs from the recommendations or choose additional ones",
        "Rank your selections by preference",
        "Click 'Add to Application' to finalize your selection"
      ]
    },
    buttons: [
      { id: "add", label: "Add Programs", url: "#", variant: "default" },
      { id: "guidelines", label: "Read Guidelines", url: "#", variant: "outline" }
    ],
    programSettings: {
      maxPrograms: 8,
      selectedPrograms: ["Computer Science - KTH", "Data Science - Uppsala"]
    },
    alerts: [
      {
        type: "warning", 
        message: "Deadline approaching in 15 days. Complete this step soon!"
      }
    ]
  },
  {
    id: "3",
    stepNumber: 3,
    title: "Upload all required documents",
    type: "document",
    status: "pending",
    deadline: "2024-02-28",
    videoUrl: "https://www.youtube.com/watch?v=Me3-r5rsUSI",
    instructions: {
      header: "Document Upload Requirements",
      paragraphs: [
        "Go to your dashboard and submit all required documents. You can make use of NextStep's document writing services to prepare documents that SOP ML, Cover letter etc."
      ],
      bulletPoints: [
        "Ensure all documents are in PDF format",
        "Maximum file size: 10MB per document",
        "Documents must be in English or officially translated"
      ],
      footer: "All documents will be reviewed within 3-5 business days."
    },
    buttons: [
      { id: "upload", label: "Upload Documents", url: "#", variant: "default" },
      { id: "services", label: "Document Services", url: "#", variant: "secondary" }
    ],
    documents: {
      required: [
        "Academic Transcripts",
        "Statement of Purpose",
        "Letters of Recommendation",
        "Language Proficiency Certificate",
        "CV/Resume"
      ],
      uploaded: [
        "Academic Transcripts",
        "CV/Resume"
      ]
    },
    alerts: [
      {
        type: "info",
        message: "Document writing services available to help you create professional documents."
      }
    ]
  }
];

export const useStepsData = () => {
  const [steps, setSteps] = useState<ApplicationStep[]>([]);

  useEffect(() => {
    const savedSteps = localStorage.getItem(STORAGE_KEY);
    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    } else {
      setSteps(defaultSteps);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSteps));
    }
  }, []);

  const updateSteps = (newSteps: ApplicationStep[]) => {
    setSteps(newSteps);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSteps));
  };

  const updateStep = (stepId: string, updates: Partial<ApplicationStep>) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    updateSteps(updatedSteps);
  };

  const addStep = (newStep: ApplicationStep) => {
    const updatedSteps = [...steps, newStep];
    updateSteps(updatedSteps);
  };

  const deleteStep = (stepId: string) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    updateSteps(updatedSteps);
  };

  return {
    steps,
    updateSteps,
    updateStep,
    addStep,
    deleteStep
  };
};