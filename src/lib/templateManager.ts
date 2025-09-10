// Enhanced Template Schema
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  muted: string;
}

export interface TypographySettings {
  heading: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
  };
  body: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
  };
  small: {
    fontSize: string;
    fontWeight: string;
  };
}

export interface SpacingSettings {
  sectionGap: string;
  contentPadding: string;
  itemSpacing: string;
  marginTop: string;
  marginBottom: string;
}

export interface SectionStyling {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
}

export interface SectionConfig {
  type: 'header' | 'experience' | 'education' | 'skills' | 'summary' | 'projects' | 'certifications';
  position: { row: number; column?: number };
  variant: string; // 'timeline' | 'list' | 'grid' | 'compact' | 'detailed'
  styling?: SectionStyling;
  isRequired: boolean;
  isVisible: boolean;
}

export interface ValidationRules {
  requiredSections: string[];
  maxSections: number;
  allowCustomSections: boolean;
}

export interface TemplateStructure {
  layout: 'single-column' | 'two-column' | 'sidebar-left' | 'sidebar-right';
  sections: SectionConfig[];
  maxWidth: string;
  pageMargins: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  type: 'professional' | 'academic' | 'creative' | 'ats-optimized';
  isPremium: boolean;
  structure: TemplateStructure;
  styling: {
    colors: ColorScheme;
    typography: TypographySettings;
    spacing: SpacingSettings;
  };
  rules: ValidationRules;
  createdAt: string;
  updatedAt: string;
}

// Default templates with enhanced schema
const defaultTemplates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for corporate positions',
    preview: '/resume-previews/modern-professional.jpg',
    type: 'professional',
    isPremium: false,
    structure: {
      layout: 'single-column',
      sections: [
        { type: 'header', position: { row: 1 }, variant: 'centered', isRequired: true, isVisible: true },
        { type: 'summary', position: { row: 2 }, variant: 'paragraph', isRequired: false, isVisible: true },
        { type: 'experience', position: { row: 3 }, variant: 'timeline', isRequired: true, isVisible: true },
        { type: 'education', position: { row: 4 }, variant: 'list', isRequired: true, isVisible: true },
        { type: 'skills', position: { row: 5 }, variant: 'grid', isRequired: false, isVisible: true }
      ],
      maxWidth: '800px',
      pageMargins: '40px'
    },
    styling: {
      colors: {
        primary: 'hsl(220, 14%, 20%)',
        secondary: 'hsl(220, 9%, 46%)',
        accent: 'hsl(221, 83%, 53%)',
        text: 'hsl(220, 14%, 8%)',
        background: 'hsl(0, 0%, 100%)',
        muted: 'hsl(220, 14%, 96%)'
      },
      typography: {
        heading: {
          fontFamily: 'Inter',
          fontSize: '1.5rem',
          fontWeight: '600',
          lineHeight: '1.2'
        },
        body: {
          fontFamily: 'Inter',
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.5'
        },
        small: {
          fontSize: '0.75rem',
          fontWeight: '400'
        }
      },
      spacing: {
        sectionGap: '2rem',
        contentPadding: '1rem',
        itemSpacing: '0.75rem',
        marginTop: '0.5rem',
        marginBottom: '0.5rem'
      }
    },
    rules: {
      requiredSections: ['header', 'experience'],
      maxSections: 8,
      allowCustomSections: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    description: 'Simple format that passes Applicant Tracking Systems',
    preview: '/resume-previews/ats-optimized.jpg',
    type: 'ats-optimized',
    isPremium: false,
    structure: {
      layout: 'single-column',
      sections: [
        { type: 'header', position: { row: 1 }, variant: 'simple', isRequired: true, isVisible: true },
        { type: 'experience', position: { row: 2 }, variant: 'list', isRequired: true, isVisible: true },
        { type: 'education', position: { row: 3 }, variant: 'compact', isRequired: true, isVisible: true },
        { type: 'skills', position: { row: 4 }, variant: 'list', isRequired: false, isVisible: true }
      ],
      maxWidth: '800px',
      pageMargins: '40px'
    },
    styling: {
      colors: {
        primary: 'hsl(0, 0%, 0%)',
        secondary: 'hsl(0, 0%, 40%)',
        accent: 'hsl(0, 0%, 20%)',
        text: 'hsl(0, 0%, 0%)',
        background: 'hsl(0, 0%, 100%)',
        muted: 'hsl(0, 0%, 95%)'
      },
      typography: {
        heading: {
          fontFamily: 'Arial',
          fontSize: '1.25rem',
          fontWeight: '700',
          lineHeight: '1.2'
        },
        body: {
          fontFamily: 'Arial',
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.4'
        },
        small: {
          fontSize: '0.75rem',
          fontWeight: '400'
        }
      },
      spacing: {
        sectionGap: '1.5rem',
        contentPadding: '0.75rem',
        itemSpacing: '0.5rem',
        marginTop: '0.25rem',
        marginBottom: '0.25rem'
      }
    },
    rules: {
      requiredSections: ['header', 'experience', 'education'],
      maxSections: 6,
      allowCustomSections: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
        const rawTemplates = JSON.parse(savedTemplates);
        // Migrate old templates to new structure
        customTemplates = rawTemplates.map((template: any) => this.migrateTemplate(template));
      } catch (error) {
        console.error('Failed to parse saved templates:', error);
      }
    }

    // Combine default templates with custom templates
    this.templates = [...defaultTemplates, ...customTemplates];
  }

  // Migrate old template format to new enhanced structure
  private migrateTemplate(template: any): Template {
    // If already has new structure, return as is
    if (template.structure && template.styling) {
      return template;
    }

    // Migrate from old format
    return {
      id: template.id || `template-${Date.now()}`,
      name: template.name || 'Untitled Template',
      description: template.description || '',
      preview: template.preview || '',
      type: template.type || 'professional',
      isPremium: template.isPremium || false,
      structure: {
        layout: template.layout?.columns === 2 ? 'two-column' : 'single-column',
        sections: this.migrateSections(template.layout?.sections || ['header', 'experience', 'education', 'skills']),
        maxWidth: '800px',
        pageMargins: '40px'
      },
      styling: {
        colors: {
          primary: template.colors?.primary || 'hsl(220, 14%, 20%)',
          secondary: template.colors?.secondary || 'hsl(220, 9%, 46%)',
          accent: template.colors?.accent || 'hsl(221, 83%, 53%)',
          text: template.colors?.text || 'hsl(220, 14%, 8%)',
          background: 'hsl(0, 0%, 100%)',
          muted: 'hsl(220, 14%, 96%)'
        },
        typography: {
          heading: {
            fontFamily: template.fonts?.heading || 'Inter',
            fontSize: '1.5rem',
            fontWeight: '600',
            lineHeight: '1.2'
          },
          body: {
            fontFamily: template.fonts?.body || 'Inter',
            fontSize: '0.875rem',
            fontWeight: '400',
            lineHeight: '1.5'
          },
          small: {
            fontSize: '0.75rem',
            fontWeight: '400'
          }
        },
        spacing: {
          sectionGap: template.layout?.spacing === 'compact' ? '1.5rem' : template.layout?.spacing === 'spacious' ? '2.5rem' : '2rem',
          contentPadding: '1rem',
          itemSpacing: '0.75rem',
          marginTop: '0.5rem',
          marginBottom: '0.5rem'
        }
      },
      rules: {
        requiredSections: ['header', 'experience'],
        maxSections: 8,
        allowCustomSections: false
      },
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: template.updatedAt || new Date().toISOString()
    };
  }

  private migrateSections(oldSections: string[]): SectionConfig[] {
    const sectionMap: Record<string, { type: SectionConfig['type'], variant: string }> = {
      'header': { type: 'header', variant: 'centered' },
      'personal': { type: 'header', variant: 'centered' },
      'summary': { type: 'summary', variant: 'paragraph' },
      'experience': { type: 'experience', variant: 'timeline' },
      'education': { type: 'education', variant: 'list' },
      'skills': { type: 'skills', variant: 'grid' },
      'projects': { type: 'projects', variant: 'list' },
      'certifications': { type: 'certifications', variant: 'list' }
    };

    return oldSections.map((section, index) => {
      const mapped = sectionMap[section] || { type: 'summary', variant: 'paragraph' };
      return {
        type: mapped.type,
        position: { row: index + 1 },
        variant: mapped.variant,
        isRequired: mapped.type === 'header' || mapped.type === 'experience',
        isVisible: true
      };
    });
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