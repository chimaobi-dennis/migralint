import { useState, useEffect } from 'react';

export interface VisaStep {
  id: string;
  stepNumber: number;
  title: string;
  type: 'form' | 'document' | 'information' | 'verification' | 'appointment';
  status: 'completed' | 'current' | 'pending' | 'overdue';
  deadline?: string;
  videoUrl?: string;
  instructions: {
    header?: string;
    paragraphs?: string[];
    bulletPoints?: string[];
    footer?: string;
  };
  buttons: {
    id: string;
    label: string;
    url?: string;
    variant?: 'default' | 'outline' | 'secondary';
  }[];
  formFields?: {
    id: string;
    type: 'text' | 'textarea' | 'email' | 'number' | 'date' | 'file';
    label: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
  }[];
  documents?: {
    required: string[];
    uploaded: string[];
  };
  alerts?: {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
  }[];
  appointmentDetails?: {
    location?: string;
    date?: string;
    time?: string;
    requirements?: string[];
  };
}

const VISA_STORAGE_KEY = 'visa_steps';

const defaultVisaSteps: VisaStep[] = [
  {
    id: "visa1",
    stepNumber: 1,
    title: "Gather Required Documents",
    type: "document",
    status: "current",
    deadline: "2024-05-15",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    instructions: {
      header: "Document Collection for Sweden Student Visa",
      paragraphs: [
        "Collect all necessary documents for your student visa application to Sweden. Ensure all documents are recent and meet the embassy requirements."
      ],
      bulletPoints: [
        "Valid passport (minimum 6 months validity)",
        "Admission letter from Swedish university",
        "Proof of financial support (bank statements)",
        "Health insurance coverage",
        "Passport-sized photographs",
        "Academic transcripts and certificates"
      ],
      footer: "All documents must be original or certified copies. Check specific requirements for your country."
    },
    buttons: [
      { id: "upload", label: "Upload Documents", url: "#", variant: "default" },
      { id: "checklist", label: "Download Checklist", url: "#", variant: "outline" }
    ],
    documents: {
      required: [
        "Passport Copy",
        "Admission Letter",
        "Bank Statements",
        "Health Insurance",
        "Photographs",
        "Academic Certificates"
      ],
      uploaded: ["Passport Copy", "Admission Letter"]
    },
    alerts: [
      {
        type: "info",
        message: "Start collecting documents early as some may take time to obtain from institutions."
      }
    ]
  },
  {
    id: "visa2",
    stepNumber: 2,
    title: "Complete Online Application",
    type: "form",
    status: "pending",
    deadline: "2024-05-25",
    instructions: {
      header: "Sweden Visa Online Application",
      paragraphs: [
        "Complete the online visa application form on the Swedish Migration Agency website. Fill out all sections accurately."
      ],
      bulletPoints: [
        "Create account on Migration Agency website",
        "Fill personal information form",
        "Upload required documents",
        "Pay application fee",
        "Submit application online"
      ]
    },
    buttons: [
      { id: "apply", label: "Start Application", url: "#", variant: "default" },
      { id: "save", label: "Save Progress", url: "#", variant: "outline" }
    ],
    formFields: [
      {
        id: "application_id",
        type: "text",
        label: "Application Reference Number",
        placeholder: "Enter your application ID",
        required: true
      }
    ]
  },
  {
    id: "visa3",
    stepNumber: 3,
    title: "Schedule Embassy Appointment",
    type: "appointment",
    status: "pending",
    deadline: "2024-06-01",
    instructions: {
      header: "Embassy Appointment Booking",
      paragraphs: [
        "Schedule your visa interview appointment at the Swedish embassy or consulate in your country."
      ],
      bulletPoints: [
        "Check embassy website for available dates",
        "Book appointment online or by phone",
        "Prepare for the interview",
        "Bring all original documents"
      ]
    },
    buttons: [
      { id: "schedule", label: "Schedule Appointment", url: "#", variant: "default" },
      { id: "reschedule", label: "Reschedule", url: "#", variant: "outline" }
    ],
    appointmentDetails: {
      location: "Swedish Embassy",
      date: "2024-06-05",
      time: "10:00 AM",
      requirements: [
        "Arrive 15 minutes early",
        "Bring all original documents",
        "No electronic devices allowed"
      ]
    }
  },
  {
    id: "visa4",
    stepNumber: 4,
    title: "Attend Visa Interview",
    type: "verification",
    status: "pending",
    deadline: "2024-06-05",
    instructions: {
      header: "Visa Interview Preparation",
      paragraphs: [
        "Attend your scheduled visa interview. Be prepared to answer questions about your study plans and financial situation."
      ],
      bulletPoints: [
        "Review your application details",
        "Prepare answers about study plans",
        "Bring original documents",
        "Dress professionally",
        "Arrive on time"
      ]
    },
    buttons: [
      { id: "prepare", label: "Interview Prep Guide", url: "#", variant: "default" },
      { id: "mock", label: "Mock Interview", url: "#", variant: "secondary" }
    ],
    alerts: [
      {
        type: "warning",
        message: "Interview appointment confirmed for June 5th at 10:00 AM. Don't be late!"
      }
    ]
  }
];

export const useVisaSteps = () => {
  const [steps, setSteps] = useState<VisaStep[]>([]);

  useEffect(() => {
    const savedSteps = localStorage.getItem(VISA_STORAGE_KEY);
    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    } else {
      setSteps(defaultVisaSteps);
      localStorage.setItem(VISA_STORAGE_KEY, JSON.stringify(defaultVisaSteps));
    }
  }, []);

  const updateSteps = (newSteps: VisaStep[]) => {
    setSteps(newSteps);
    localStorage.setItem(VISA_STORAGE_KEY, JSON.stringify(newSteps));
  };

  const updateStep = (stepId: string, updates: Partial<VisaStep>) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    updateSteps(updatedSteps);
  };

  const addStep = (newStep: VisaStep) => {
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