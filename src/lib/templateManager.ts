export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  type: 'professional' | 'academic' | 'creative' | 'ats-optimized';
  isPremium: boolean;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  fonts?: {
    heading: string;
    body: string;
  };
  layout?: {
    columns: number;
    spacing: 'compact' | 'normal' | 'spacious';
    sections: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

// Default templates that ship with the app
const defaultTemplates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for corporate positions',
    preview: '/resume-previews/modern-professional.jpg',
    type: 'professional',
    isPremium: false
  },
  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    description: 'Simple format that passes Applicant Tracking Systems',
    preview: '/resume-previews/ats-optimized.jpg',
    type: 'ats-optimized',
    isPremium: false
  },
  {
    id: 'academic-researcher',
    name: 'Academic CV',
    description: 'Comprehensive format for academic and research positions',
    preview: '/resume-previews/academic.jpg',
    type: 'academic',
    isPremium: true
  },
  {
    id: 'creative-designer',
    name: 'Creative Portfolio',
    description: 'Eye-catching design for creative professionals',
    preview: '/resume-previews/creative.jpg',
    type: 'creative',
    isPremium: true
  }
];

export class TemplateManager {
  private static instance: TemplateManager;
  private templates: Template[] = [];

  private constructor() {
    this.loadTemplates();
  }

  static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  private loadTemplates() {
    // Load custom templates from localStorage
    const savedTemplates = localStorage.getItem('resume-templates');
    let customTemplates: Template[] = [];
    
    if (savedTemplates) {
      try {
        customTemplates = JSON.parse(savedTemplates);
      } catch (error) {
        console.error('Failed to parse saved templates:', error);
      }
    }

    // Combine default templates with custom templates
    this.templates = [...defaultTemplates, ...customTemplates];
  }

  getAllTemplates(): Template[] {
    return this.templates;
  }

  getTemplateById(id: string): Template | undefined {
    return this.templates.find(template => template.id === id);
  }

  getTemplatesByType(type: Template['type']): Template[] {
    return this.templates.filter(template => template.type === type);
  }

  getPremiumTemplates(): Template[] {
    return this.templates.filter(template => template.isPremium);
  }

  getFreeTemplates(): Template[] {
    return this.templates.filter(template => !template.isPremium);
  }

  // Refresh templates from localStorage (useful when templates are updated in admin)
  refreshTemplates() {
    this.loadTemplates();
  }
}

export const templateManager = TemplateManager.getInstance();