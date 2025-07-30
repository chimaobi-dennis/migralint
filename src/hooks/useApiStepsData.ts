import { useState, useEffect } from 'react';
import { ApplicationStep } from './useStepsData';

interface ApiStepField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  jsId?: string;
  wireModel?: string;
}

interface ApiStepButton {
  id: string;
  label: string;
  url?: string;
  variant?: string;
  jsId?: string;
  wireClick?: string;
  icon?: string;
}

interface ApiApplicationStep {
  id: string;
  stepNumber: number;
  title: string;
  type: string;
  status: string;
  deadline?: string;
  videoUrl?: string;
  instructions: {
    header?: string;
    paragraphs?: string[];
    bulletPoints?: string[];
    footer?: string;
  };
  buttons: ApiStepButton[];
  formFields?: ApiStepField[];
  documents?: {
    required: string[];
    uploaded: string[];
  };
  alerts?: {
    type: string;
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

interface ApiResponse {
  status: string;
  data: Array<{
    id: number;
    name: string;
    destination: string;
    degree: string;
    deadline: string;
    status: number;
    progress: number;
    applicationSteps: ApiApplicationStep[];
    groupData?: {
      programs: Array<{
        id: number;
        name: string;
        university: string;
        city: string;
      }>;
    };
  }>;
}

const transformApiStep = (apiStep: ApiApplicationStep): ApplicationStep => {
  return {
    id: apiStep.id,
    stepNumber: apiStep.stepNumber,
    title: apiStep.title,
    type: apiStep.type as 'form' | 'document' | 'information' | 'verification' | 'program',
    status: apiStep.status as 'completed' | 'current' | 'pending' | 'overdue',
    deadline: apiStep.deadline,
    videoUrl: apiStep.videoUrl,
    instructions: apiStep.instructions,
    buttons: apiStep.buttons.map(btn => ({
      id: btn.id,
      label: btn.label,
      url: btn.url,
      variant: btn.variant as 'default' | 'outline' | 'secondary',
      jsId: btn.jsId,
      wireClick: btn.wireClick,
      icon: btn.icon,
    })),
    formFields: apiStep.formFields?.map(field => ({
      id: field.id,
      type: field.type as 'text' | 'textarea' | 'email' | 'number' | 'date' | 'file',
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      value: field.value,
      jsId: field.jsId,
      wireModel: field.wireModel,
    })),
    documents: apiStep.documents,
    alerts: apiStep.alerts?.map(alert => ({
      type: alert.type as 'info' | 'warning' | 'error' | 'success',
      message: alert.message,
    })),
    adminMessage: apiStep.adminMessage,
    programSettings: apiStep.programSettings,
    externalAccount: apiStep.externalAccount,
  };
};

export const useApiStepsData = () => {
  const [steps, setSteps] = useState<ApplicationStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    const fetchStepsData = async () => {
      try {
        setLoading(true);
        // Using CORS proxy to bypass CORS restrictions for development
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://uniplanr.com/api/v1/user-application/5/23'));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const proxyResponse = await response.json();
        const data: ApiResponse = JSON.parse(proxyResponse.contents);
        
        if (data.status === 'success' && data.data.length > 0) {
          const applicationInfo = data.data[0];
          setApplicationData(applicationInfo);
          
          if (applicationInfo.applicationSteps) {
            const transformedSteps = applicationInfo.applicationSteps.map(transformApiStep);
            setSteps(transformedSteps);
          }
        } else {
          throw new Error('No application data found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch application data');
        console.error('Error fetching application steps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStepsData();
  }, []);

  const updateStep = (stepId: string, updates: Partial<ApplicationStep>) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  };

  const updateSteps = (newSteps: ApplicationStep[]) => {
    setSteps(newSteps);
  };

  const addStep = (newStep: ApplicationStep) => {
    setSteps(prevSteps => [...prevSteps, newStep]);
  };

  const deleteStep = (stepId: string) => {
    setSteps(prevSteps => prevSteps.filter(step => step.id !== stepId));
  };

  return {
    steps,
    loading,
    error,
    applicationData,
    updateStep,
    updateSteps,
    addStep,
    deleteStep,
  };
};