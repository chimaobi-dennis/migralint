import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Plus, Trash2, GripVertical } from 'lucide-react';
import { Template, SectionConfig } from '@/lib/templateManager';

interface LiveTemplatePreviewProps {
  template: Template;
  onSectionClick: (sectionType: string, index: number) => void;
  onAddSection: (sectionType: string, afterIndex?: number) => void;
  onDeleteSection: (index: number) => void;
  dummyData: any;
}

const dummyContent = {
  profile: {
    name: 'John Smith',
    title: 'Senior Software Engineer',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnsmith',
    website: 'johnsmith.dev'
  },
  summary: 'Experienced software engineer with 8+ years developing scalable web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact solutions.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: 'Present',
      description: 'Led development of microservices architecture serving 10M+ users. Mentored junior developers and improved deployment pipeline efficiency by 40%.'
    },
    {
      title: 'Software Engineer',
      company: 'StartupCo',
      location: 'Remote',
      startDate: '2019',
      endDate: '2021',
      description: 'Built full-stack applications using React and Node.js. Collaborated with product team to define technical requirements and deliver features.'
    }
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      school: 'Stanford University',
      location: 'Stanford, CA',
      graduationYear: '2019',
      gpa: '3.8'
    },
    {
      degree: 'Bachelor of Science in Computer Engineering',
      school: 'UC Berkeley',
      location: 'Berkeley, CA',
      graduationYear: '2017',
      gpa: '3.6'
    }
  ],
  skills: {
    technical: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB'],
    soft: ['Leadership', 'Team Management', 'Agile Methodologies', 'Technical Writing']
  },
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Spanish', level: 'Conversational' },
    { name: 'Mandarin', level: 'Basic' }
  ],
  awards: [
    { name: 'Employee of the Year', organization: 'Tech Corp', year: '2023' },
    { name: 'Innovation Award', organization: 'StartupCo', year: '2020' }
  ],
  certifications: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
    { name: 'React Developer Certification', issuer: 'Meta', year: '2022' }
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      description: 'Built scalable e-commerce platform handling 100K+ daily transactions',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      url: 'github.com/johnsmith/ecommerce'
    }
  ],
  publications: [
    {
      title: 'Microservices Architecture Best Practices',
      journal: 'Tech Journal',
      year: '2023',
      url: 'techjournal.com/microservices-best-practices'
    }
  ],
  volunteering: [
    {
      role: 'Coding Mentor',
      organization: 'Code for All',
      period: '2020 - Present',
      description: 'Mentor underprivileged students in programming fundamentals'
    }
  ],
  interests: ['Open Source Development', 'Machine Learning', 'Rock Climbing', 'Photography']
};

export default function LiveTemplatePreview({ 
  template, 
  onSectionClick, 
  onAddSection, 
  onDeleteSection,
  dummyData 
}: LiveTemplatePreviewProps) {
  const renderSectionContent = (section: SectionConfig, index: number) => {
    const sectionStyle = {
      color: template.styling.colors.text,
      fontFamily: template.styling.typography.body.fontFamily
    };

    const headingStyle = {
      color: template.styling.colors.primary,
      fontFamily: template.styling.typography.heading.fontFamily,
      fontSize: template.styling.typography.heading.fontSize,
      fontWeight: template.styling.typography.heading.fontWeight
    };

    switch (section.type) {
      case 'header':
      case 'profile':
        return (
          <div className="text-center space-y-4" style={sectionStyle}>
            <h1 style={headingStyle} className="text-3xl font-bold">
              {dummyContent.profile.name}
            </h1>
            <p className="text-xl" style={{ color: template.styling.colors.secondary }}>
              {dummyContent.profile.title}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span>{dummyContent.profile.email}</span>
              <span>{dummyContent.profile.phone}</span>
              <span>{dummyContent.profile.location}</span>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-3 border-b pb-2">
              Professional Summary
            </h2>
            <p className="leading-relaxed">{dummyContent.summary}</p>
          </div>
        );

      case 'experience':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Work Experience
            </h2>
            <div className="space-y-4">
              {dummyContent.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 pl-4" style={{ borderColor: template.styling.colors.accent }}>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p style={{ color: template.styling.colors.secondary }} className="text-sm">
                    {exp.company} • {exp.location} • {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="mt-2 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Education
            </h2>
            <div className="space-y-3">
              {dummyContent.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p style={{ color: template.styling.colors.secondary }} className="text-sm">
                      {edu.school} • {edu.location}
                    </p>
                  </div>
                  <span className="text-sm">{edu.graduationYear}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Skills
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {dummyContent.skills.technical.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" style={{ backgroundColor: template.styling.colors.muted }}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {dummyContent.skills.soft.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'languages':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {dummyContent.languages.map((lang: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="text-sm" style={{ color: template.styling.colors.secondary }}>
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'awards':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Awards & Recognition
            </h2>
            <div className="space-y-2">
              {dummyContent.awards.map((award: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{award.name}</h3>
                    <p className="text-sm" style={{ color: template.styling.colors.secondary }}>
                      {award.organization}
                    </p>
                  </div>
                  <span className="text-sm">{award.year}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Certifications
            </h2>
            <div className="space-y-2">
              {dummyContent.certifications.map((cert: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-sm" style={{ color: template.styling.colors.secondary }}>
                      {cert.issuer}
                    </p>
                  </div>
                  <span className="text-sm">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Projects
            </h2>
            <div className="space-y-4">
              {dummyContent.projects.map((project: any, idx: number) => (
                <div key={idx}>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech: string, techIdx: number) => (
                      <Badge key={techIdx} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'publications':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Publications
            </h2>
            <div className="space-y-3">
              {dummyContent.publications.map((pub: any, idx: number) => (
                <div key={idx}>
                  <h3 className="font-medium">{pub.title}</h3>
                  <p className="text-sm" style={{ color: template.styling.colors.secondary }}>
                    {pub.journal} • {pub.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteering':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Volunteer Experience
            </h2>
            <div className="space-y-3">
              {dummyContent.volunteering.map((vol: any, idx: number) => (
                <div key={idx}>
                  <h3 className="font-semibold">{vol.role}</h3>
                  <p className="text-sm" style={{ color: template.styling.colors.secondary }}>
                    {vol.organization} • {vol.period}
                  </p>
                  <p className="text-sm mt-1">{vol.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'interests':
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {dummyContent.interests.map((interest: string, idx: number) => (
                <Badge key={idx} variant="secondary" style={{ backgroundColor: template.styling.colors.muted }}>
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div style={sectionStyle}>
            <h2 style={headingStyle} className="text-xl font-semibold mb-4 border-b pb-2">
              Custom Section
            </h2>
            <p>This is a custom section. Click to configure its content.</p>
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full h-full bg-white rounded-lg shadow-lg overflow-auto p-8 text-sm"
      style={{ 
        backgroundColor: template.styling.colors.background,
        maxWidth: template.structure.maxWidth,
        padding: template.structure.pageMargins
      }}
    >
      <div className="space-y-6" style={{ gap: template.styling.spacing.sectionGap }}>
        {template.structure.sections
          .filter(section => section.isVisible)
          .map((section, index) => (
            <div
              key={`${section.type}-${index}`}
              className="group relative cursor-pointer hover:bg-blue-50/30 rounded-lg p-4 transition-all duration-200 border border-transparent hover:border-blue-200"
              onClick={() => onSectionClick(section.type, index)}
            >
              {/* Section Controls */}
              <div className="absolute -left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-white shadow-sm border"
                >
                  <GripVertical className="h-3 w-3" />
                </Button>
              </div>

              <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-white shadow-sm border"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSection('custom', index);
                  }}
                >
                  <Plus className="h-3 w-3 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-white shadow-sm border"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSectionClick(section.type, index);
                  }}
                >
                  <Edit3 className="h-3 w-3 text-blue-600" />
                </Button>
                {!section.isRequired && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 bg-white shadow-sm border"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(index);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                )}
              </div>

              {/* Section Content */}
              <div style={{ padding: template.styling.spacing.contentPadding }}>
                {renderSectionContent(section, index)}
              </div>

              {/* Section Label */}
              <div className="absolute -top-2 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant="secondary" className="text-xs bg-white shadow-sm">
                  {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                </Badge>
              </div>
            </div>
          ))}
      </div>

      {/* Add Section at End */}
      <div className="mt-8 pt-4 border-t border-dashed border-gray-300">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onAddSection('custom', template.structure.sections.length)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>
    </div>
  );
}