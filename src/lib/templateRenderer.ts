import React from 'react';
import { Template, SectionConfig } from './templateManager';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }>;
}

export class TemplateRenderer {
  static generateCSS(template: Template): string {
    const { colors, typography, spacing } = template.styling;
    
    return `
      .resume-template {
        max-width: ${template.structure.maxWidth};
        margin: 0 auto;
        padding: ${template.structure.pageMargins};
        font-family: ${typography.body.fontFamily};
        font-size: ${typography.body.fontSize};
        font-weight: ${typography.body.fontWeight};
        line-height: ${typography.body.lineHeight};
        color: ${colors.text};
        background-color: ${colors.background};
      }
      
      .template-${template.structure.layout} {
        display: ${template.structure.layout.includes('column') ? 'grid' : 'flex'};
        ${template.structure.layout === 'two-column' ? 'grid-template-columns: 1fr 1fr;' : ''}
        ${template.structure.layout === 'sidebar-left' ? 'grid-template-columns: 300px 1fr;' : ''}
        ${template.structure.layout === 'sidebar-right' ? 'grid-template-columns: 1fr 300px;' : ''}
        gap: ${spacing.sectionGap};
      }
      
      .resume-section {
        margin-bottom: ${spacing.sectionGap};
      }
      
      .section-header {
        font-family: ${typography.heading.fontFamily};
        font-size: ${typography.heading.fontSize};
        font-weight: ${typography.heading.fontWeight};
        line-height: ${typography.heading.lineHeight};
        color: ${colors.primary};
        margin-bottom: ${spacing.marginBottom};
        padding-bottom: 0.5rem;
        border-bottom: 2px solid ${colors.accent};
      }
      
      .section-content {
        padding: ${spacing.contentPadding};
      }
      
      .section-item {
        margin-bottom: ${spacing.itemSpacing};
      }
      
      .section-item:last-child {
        margin-bottom: 0;
      }
      
      .item-title {
        font-weight: 600;
        color: ${colors.primary};
        margin-bottom: ${spacing.marginTop};
      }
      
      .item-subtitle {
        color: ${colors.secondary};
        font-size: ${typography.small.fontSize};
        font-weight: ${typography.small.fontWeight};
        margin-bottom: ${spacing.marginTop};
      }
      
      .item-date {
        color: ${colors.secondary};
        font-size: ${typography.small.fontSize};
        font-style: italic;
      }
      
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: ${spacing.itemSpacing};
      }
      
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .skill-tag {
        background-color: ${colors.muted};
        color: ${colors.text};
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: ${typography.small.fontSize};
        font-weight: ${typography.small.fontWeight};
      }
      
      .timeline-item {
        position: relative;
        padding-left: 2rem;
        margin-bottom: ${spacing.itemSpacing};
      }
      
      .timeline-item:before {
        content: '';
        position: absolute;
        left: 0.5rem;
        top: 0.5rem;
        width: 0.75rem;
        height: 0.75rem;
        background-color: ${colors.accent};
        border-radius: 50%;
      }
      
      .timeline-item:after {
        content: '';
        position: absolute;
        left: 0.875rem;
        top: 1.25rem;
        width: 2px;
        height: calc(100% - 1rem);
        background-color: ${colors.muted};
      }
      
      .timeline-item:last-child:after {
        display: none;
      }
      
      .header-centered {
        text-align: center;
        padding: ${spacing.contentPadding};
        border-bottom: 2px solid ${colors.muted};
        margin-bottom: ${spacing.sectionGap};
      }
      
      .header-left-aligned {
        text-align: left;
        padding: ${spacing.contentPadding};
        border-bottom: 1px solid ${colors.muted};
        margin-bottom: ${spacing.sectionGap};
      }
      
      .header-name {
        font-family: ${typography.heading.fontFamily};
        font-size: calc(${typography.heading.fontSize} * 1.5);
        font-weight: ${typography.heading.fontWeight};
        color: ${colors.primary};
        margin-bottom: 0.5rem;
      }
      
      .header-contact {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        color: ${colors.secondary};
        font-size: ${typography.small.fontSize};
      }
      
      .header-left-aligned .header-contact {
        justify-content: flex-start;
      }
      
      @media print {
        .resume-template {
          padding: 0.5in;
          font-size: 11pt;
        }
        
        .section-header {
          font-size: 14pt;
        }
        
        .header-name {
          font-size: 18pt;
        }
      }
    `;
  }

  static renderSection(sectionConfig: SectionConfig, data: ResumeData): string {
    if (!sectionConfig.isVisible) return '';

    const sectionData = this.getSectionData(sectionConfig.type, data);
    if (!sectionData) return '';

    switch (sectionConfig.type) {
      case 'header':
        return this.renderHeader(sectionConfig, data.personalInfo);
      case 'summary':
        return this.renderSummary(sectionConfig, data.summary);
      case 'experience':
        return this.renderExperience(sectionConfig, data.experience);
      case 'education':
        return this.renderEducation(sectionConfig, data.education);
      case 'skills':
        return this.renderSkills(sectionConfig, data.skills);
      case 'projects':
        return this.renderProjects(sectionConfig, data.projects);
      case 'certifications':
        return this.renderCertifications(sectionConfig, data.certifications);
      default:
        return '';
    }
  }

  private static getSectionData(type: string, data: ResumeData): any {
    switch (type) {
      case 'header': return data.personalInfo;
      case 'summary': return data.summary;
      case 'experience': return data.experience;
      case 'education': return data.education;
      case 'skills': return data.skills;
      case 'projects': return data.projects;
      case 'certifications': return data.certifications;
      default: return null;
    }
  }

  private static renderHeader(config: SectionConfig, personalInfo: ResumeData['personalInfo']): string {
    const { variant } = config;
    const headerClass = variant === 'centered' ? 'header-centered' : 'header-left-aligned';
    
    return `
      <div class="resume-section ${headerClass}">
        <h1 class="header-name">${personalInfo.fullName}</h1>
        <div class="header-contact">
          <span>${personalInfo.email}</span>
          <span>${personalInfo.phone}</span>
          <span>${personalInfo.location}</span>
          ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
          ${personalInfo.website ? `<span>${personalInfo.website}</span>` : ''}
        </div>
      </div>
    `;
  }

  private static renderSummary(config: SectionConfig, summary?: string): string {
    if (!summary) return '';
    
    return `
      <div class="resume-section">
        <h2 class="section-header">Professional Summary</h2>
        <div class="section-content">
          <p>${summary}</p>
        </div>
      </div>
    `;
  }

  private static renderExperience(config: SectionConfig, experience: ResumeData['experience']): string {
    if (!experience.length) return '';

    const isTimeline = config.variant === 'timeline';
    const itemClass = isTimeline ? 'timeline-item' : 'section-item';
    
    const experienceItems = experience.map(exp => `
      <div class="${itemClass}">
        <div class="item-title">${exp.title}</div>
        <div class="item-subtitle">
          ${exp.company} • ${exp.location}
          <span class="item-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
        </div>
        <p>${exp.description}</p>
      </div>
    `).join('');

    return `
      <div class="resume-section">
        <h2 class="section-header">Professional Experience</h2>
        <div class="section-content">
          ${experienceItems}
        </div>
      </div>
    `;
  }

  private static renderEducation(config: SectionConfig, education: ResumeData['education']): string {
    if (!education.length) return '';

    const educationItems = education.map(edu => `
      <div class="section-item">
        <div class="item-title">${edu.degree}</div>
        <div class="item-subtitle">
          ${edu.institution} • ${edu.location}
          <span class="item-date">${edu.graduationDate}</span>
        </div>
        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
      </div>
    `).join('');

    return `
      <div class="resume-section">
        <h2 class="section-header">Education</h2>
        <div class="section-content">
          ${educationItems}
        </div>
      </div>
    `;
  }

  private static renderSkills(config: SectionConfig, skills: ResumeData['skills']): string {
    if (!skills.length) return '';

    const isGrid = config.variant === 'grid';
    const isTags = config.variant === 'tags';
    
    let skillsContent = '';
    
    if (isTags) {
      const allSkills = skills.flatMap(category => category.items);
      skillsContent = `
        <div class="skills-list">
          ${allSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      `;
    } else {
      skillsContent = skills.map(category => `
        <div class="section-item">
          <div class="item-title">${category.category}</div>
          <div class="skills-list">
            ${category.items.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    return `
      <div class="resume-section">
        <h2 class="section-header">Skills</h2>
        <div class="section-content ${isGrid ? 'skills-grid' : ''}">
          ${skillsContent}
        </div>
      </div>
    `;
  }

  private static renderProjects(config: SectionConfig, projects?: ResumeData['projects']): string {
    if (!projects?.length) return '';

    const projectItems = projects.map(project => `
      <div class="section-item">
        <div class="item-title">${project.name}</div>
        <p>${project.description}</p>
        <div class="skills-list">
          ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
        </div>
        ${project.link ? `<p><a href="${project.link}" target="_blank">${project.link}</a></p>` : ''}
      </div>
    `).join('');

    return `
      <div class="resume-section">
        <h2 class="section-header">Projects</h2>
        <div class="section-content">
          ${projectItems}
        </div>
      </div>
    `;
  }

  private static renderCertifications(config: SectionConfig, certifications?: ResumeData['certifications']): string {
    if (!certifications?.length) return '';

    const certificationItems = certifications.map(cert => `
      <div class="section-item">
        <div class="item-title">${cert.name}</div>
        <div class="item-subtitle">
          ${cert.issuer}
          <span class="item-date">${cert.date}</span>
        </div>
        ${cert.credentialId ? `<p>Credential ID: ${cert.credentialId}</p>` : ''}
      </div>
    `).join('');

    return `
      <div class="resume-section">
        <h2 class="section-header">Certifications</h2>
        <div class="section-content">
          ${certificationItems}
        </div>
      </div>
    `;
  }

  static renderTemplate(template: Template, data: ResumeData): string {
    const css = this.generateCSS(template);
    const sections = template.structure.sections
      .sort((a, b) => a.position.row - b.position.row)
      .map(section => this.renderSection(section, data))
      .filter(section => section.length > 0)
      .join('');

    return `
      <style>${css}</style>
      <div class="resume-template template-${template.structure.layout}">
        ${sections}
      </div>
    `;
  }
}