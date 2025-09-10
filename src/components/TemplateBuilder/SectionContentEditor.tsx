import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Wand2, RefreshCw } from 'lucide-react';
import { SectionConfig, SectionContent } from '@/lib/templateManager';

interface SectionContentEditorProps {
  section: SectionConfig;
  onUpdateSection: (updates: Partial<SectionConfig>) => void;
}

// Dummy data templates for each section type
const DUMMY_DATA: Record<string, SectionContent> = {
  profile: {
    header: 'John Smith',
    content: 'Senior Software Engineer',
    items: [{
      title: 'John Smith',
      subtitle: 'Senior Software Engineer',
      description: 'Passionate full-stack developer with 8+ years of experience building scalable web applications',
      date: '',
      location: 'San Francisco, CA',
      tags: ['JavaScript', 'React', 'Node.js']
    }]
  },
  summary: {
    header: 'Professional Summary',
    content: 'Results-driven software engineer with 8+ years of experience in full-stack development. Proven track record of leading cross-functional teams and delivering high-quality solutions that drive business growth. Expertise in React, Node.js, and cloud technologies.',
    items: []
  },
  experience: {
    header: 'Work Experience',
    content: '',
    items: [
      {
        title: 'Senior Software Engineer',
        subtitle: 'TechCorp Inc.',
        description: '• Led development of microservices architecture serving 1M+ users\n• Mentored team of 5 junior developers\n• Improved application performance by 40%',
        date: '2022 - Present',
        location: 'San Francisco, CA',
        tags: ['React', 'Node.js', 'AWS']
      },
      {
        title: 'Software Engineer',
        subtitle: 'StartupXYZ',
        description: '• Built responsive web applications using React and TypeScript\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Collaborated with UX team to improve user experience',
        date: '2020 - 2022',
        location: 'New York, NY',
        tags: ['TypeScript', 'Docker', 'PostgreSQL']
      }
    ]
  },
  education: {
    header: 'Education',
    content: '',
    items: [
      {
        title: 'Bachelor of Science in Computer Science',
        subtitle: 'Stanford University',
        description: 'Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems',
        date: '2016 - 2020',
        location: 'Stanford, CA',
        tags: ['GPA: 3.8/4.0']
      }
    ]
  },
  skills: {
    header: 'Skills & Competencies',
    content: '',
    items: [
      {
        title: 'Programming Languages',
        subtitle: '',
        description: 'JavaScript, TypeScript, Python, Java, Go',
        date: '',
        location: '',
        tags: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go']
      },
      {
        title: 'Frameworks & Libraries',
        subtitle: '',
        description: 'React, Node.js, Express, Next.js, Vue.js',
        date: '',
        location: '',
        tags: ['React', 'Node.js', 'Express', 'Next.js', 'Vue.js']
      },
      {
        title: 'Tools & Technologies',
        subtitle: '',
        description: 'AWS, Docker, Kubernetes, Git, PostgreSQL, MongoDB',
        date: '',
        location: '',
        tags: ['AWS', 'Docker', 'Kubernetes', 'Git', 'PostgreSQL']
      }
    ]
  },
  languages: {
    header: 'Languages',
    content: '',
    items: [
      {
        title: 'English',
        subtitle: 'Native',
        description: 'Native proficiency in speaking, reading, and writing',
        date: '',
        location: '',
        tags: ['Native']
      },
      {
        title: 'Spanish',
        subtitle: 'Conversational',
        description: 'Conversational level with good comprehension',
        date: '',
        location: '',
        tags: ['Conversational']
      }
    ]
  },
  awards: {
    header: 'Awards & Recognition',
    content: '',
    items: [
      {
        title: 'Employee of the Year',
        subtitle: 'TechCorp Inc.',
        description: 'Recognized for outstanding performance and leadership in Q4 2023',
        date: '2023',
        location: 'San Francisco, CA',
        tags: ['Leadership', 'Performance']
      },
      {
        title: 'Hackathon Winner',
        subtitle: 'CodeFest 2022',
        description: 'First place for innovative AI-powered solution',
        date: '2022',
        location: 'Silicon Valley',
        tags: ['Innovation', 'AI']
      }
    ]
  },
  certifications: {
    header: 'Certifications',
    content: '',
    items: [
      {
        title: 'AWS Certified Solutions Architect',
        subtitle: 'Amazon Web Services',
        description: 'Professional level certification for cloud architecture',
        date: '2023',
        location: '',
        tags: ['AWS', 'Cloud', 'Architecture']
      },
      {
        title: 'Certified Kubernetes Administrator',
        subtitle: 'Cloud Native Computing Foundation',
        description: 'Expertise in Kubernetes cluster administration',
        date: '2022',
        location: '',
        tags: ['Kubernetes', 'DevOps']
      }
    ]
  },
  interests: {
    header: 'Interests & Hobbies',
    content: '',
    items: [
      {
        title: 'Technology',
        subtitle: '',
        description: 'Open source contributions, tech meetups, staying updated with latest frameworks',
        date: '',
        location: '',
        tags: ['Open Source', 'Tech Meetups']
      },
      {
        title: 'Sports & Fitness',
        subtitle: '',
        description: 'Rock climbing, marathon running, yoga',
        date: '',
        location: '',
        tags: ['Rock Climbing', 'Running', 'Yoga']
      }
    ]
  },
  projects: {
    header: 'Projects & Portfolio',
    content: '',
    items: [
      {
        title: 'E-commerce Platform',
        subtitle: 'Full-stack web application',
        description: 'Built scalable e-commerce platform using React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
        date: '2023',
        location: 'GitHub',
        tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe']
      },
      {
        title: 'Task Management App',
        subtitle: 'Mobile & Web Application',
        description: 'Cross-platform task management solution with real-time collaboration features using React Native and Firebase.',
        date: '2022',
        location: 'App Store',
        tags: ['React Native', 'Firebase', 'Real-time']
      }
    ]
  },
  publications: {
    header: 'Publications',
    content: '',
    items: [
      {
        title: 'Scalable Microservices Architecture',
        subtitle: 'IEEE Software Engineering Journal',
        description: 'Published paper on best practices for designing and implementing microservices at scale.',
        date: '2023',
        location: 'IEEE Digital Library',
        tags: ['Microservices', 'Architecture', 'Research']
      }
    ]
  },
  volunteering: {
    header: 'Volunteer Experience',
    content: '',
    items: [
      {
        title: 'Coding Mentor',
        subtitle: 'Code.org',
        description: 'Volunteer mentor teaching programming fundamentals to underserved youth in local schools.',
        date: '2021 - Present',
        location: 'San Francisco, CA',
        tags: ['Education', 'Mentoring', 'Community Service']
      }
    ]
  },
  custom: {
    header: 'Custom Section',
    content: 'Add your custom content here...',
    items: [
      {
        title: 'Custom Item',
        subtitle: 'Subtitle',
        description: 'Description of your custom item...',
        date: '',
        location: '',
        tags: []
      }
    ]
  }
};

export default function SectionContentEditor({ 
  section, 
  onUpdateSection
}: SectionContentEditorProps) {
  const [sectionContent, setSectionContent] = useState<SectionContent>(
    section.content || { header: '', content: '', items: [] }
  );

  // Initialize with dummy data if content is empty
  useEffect(() => {
    if (!section.content || (!section.content.header && !section.content.content && (!section.content.items || section.content.items.length === 0))) {
      const dummyContent = DUMMY_DATA[section.type] || DUMMY_DATA.custom;
      setSectionContent(dummyContent);
      onUpdateSection({ content: dummyContent });
    }
  }, [section.type, section.content, onUpdateSection]);

  const updateContent = (updates: Partial<SectionContent>) => {
    const newContent = { ...sectionContent, ...updates };
    setSectionContent(newContent);
    onUpdateSection({ content: newContent });
  };

  const addDummyData = () => {
    const dummyContent = DUMMY_DATA[section.type] || DUMMY_DATA.custom;
    setSectionContent(dummyContent);
    onUpdateSection({ content: dummyContent });
  };

  const addNewItem = () => {
    const sectionTypeDefaults: Record<string, any> = {
      experience: { title: 'Job Title', subtitle: 'Company Name', description: '• Key achievement or responsibility\n• Another important accomplishment', date: '2023 - Present', location: 'City, State' },
      education: { title: 'Degree Title', subtitle: 'University Name', description: 'Relevant coursework or achievements', date: '2020 - 2024', location: 'City, State' },
      skills: { title: 'Skill Category', subtitle: '', description: 'List of related skills', date: '', location: '' },
      projects: { title: 'Project Name', subtitle: 'Project Type', description: 'Brief description of the project and technologies used', date: '2023', location: 'GitHub' },
      certifications: { title: 'Certification Name', subtitle: 'Issuing Organization', description: 'Brief description of certification', date: '2023', location: '' },
      awards: { title: 'Award Name', subtitle: 'Issuing Organization', description: 'Description of achievement', date: '2023', location: '' },
      languages: { title: 'Language Name', subtitle: 'Proficiency Level', description: 'Description of proficiency', date: '', location: '' },
      interests: { title: 'Interest Category', subtitle: '', description: 'Description of interests and activities', date: '', location: '' },
      publications: { title: 'Publication Title', subtitle: 'Journal/Conference', description: 'Brief description of publication', date: '2023', location: '' },
      volunteering: { title: 'Role Title', subtitle: 'Organization', description: 'Description of volunteer work and impact', date: '2023 - Present', location: 'City, State' }
    };

    const defaultItem = sectionTypeDefaults[section.type] || { title: '', subtitle: '', description: '', date: '', location: '' };
    const newItems = [...(sectionContent.items || []), { ...defaultItem, tags: [] }];
    updateContent({ items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...(sectionContent.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    updateContent({ items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = (sectionContent.items || []).filter((_, i) => i !== index);
    updateContent({ items: newItems });
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      title: section.type === 'profile' ? 'Full Name' : 
             section.type === 'experience' ? 'Job Title' :
             section.type === 'education' ? 'Degree/Program' :
             section.type === 'projects' ? 'Project Name' :
             section.type === 'skills' ? 'Skill Category' : 'Title',
      subtitle: section.type === 'profile' ? 'Job Title/Role' :
                section.type === 'experience' ? 'Company' :
                section.type === 'education' ? 'Institution' :
                section.type === 'projects' ? 'Project Type' :
                section.type === 'certifications' ? 'Issuing Organization' :
                section.type === 'awards' ? 'Organization' : 'Subtitle',
      description: section.type === 'experience' ? 'Key Responsibilities & Achievements' :
                   section.type === 'education' ? 'Relevant Coursework/Achievements' :
                   section.type === 'projects' ? 'Project Description & Technologies' :
                   section.type === 'skills' ? 'Skills List' : 'Description',
      date: section.type === 'experience' ? 'Employment Period' :
            section.type === 'education' ? 'Study Period' :
            section.type === 'projects' ? 'Project Year' : 'Date',
      location: section.type === 'experience' ? 'Work Location' :
                section.type === 'education' ? 'Campus Location' : 'Location'
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const getFieldPlaceholder = (field: string): string => {
    const placeholders: Record<string, string> = {
      title: section.type === 'profile' ? 'John Smith' :
             section.type === 'experience' ? 'Senior Software Engineer' :
             section.type === 'education' ? 'Bachelor of Science in Computer Science' :
             'Enter title',
      subtitle: section.type === 'experience' ? 'TechCorp Inc.' :
                section.type === 'education' ? 'Stanford University' :
                'Enter subtitle',
      description: section.type === 'experience' ? '• Led development of key features\n• Mentored junior developers\n• Improved system performance by 40%' :
                   'Enter description',
      date: section.type === 'experience' ? '2022 - Present' :
            section.type === 'education' ? '2020 - 2024' :
            'Enter date',
      location: 'San Francisco, CA'
    };
    return placeholders[field] || `Enter ${field}`;
  };

  const shouldShowField = (field: string): boolean => {
    if (section.type === 'profile') {
      return ['title', 'subtitle', 'description', 'location'].includes(field);
    }
    if (section.type === 'summary') {
      return false; // Summary only uses main content, not items
    }
    if (section.type === 'skills') {
      return ['title', 'description'].includes(field);
    }
    if (section.type === 'interests') {
      return ['title', 'description'].includes(field);
    }
    return true; // Show all fields for other section types
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Section Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section-header">Section Header</Label>
            <Input
              id="section-header"
              value={sectionContent.header || ''}
              onChange={(e) => updateContent({ header: e.target.value })}
              placeholder={`Enter ${section.type} section header`}
            />
          </div>
          
          {(section.type === 'summary' || section.type === 'profile') && (
            <div>
              <Label htmlFor="section-content">Content</Label>
              <Textarea
                id="section-content"
                value={sectionContent.content || ''}
                onChange={(e) => updateContent({ content: e.target.value })}
                placeholder="Enter section content"
                rows={section.type === 'summary' ? 6 : 3}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addDummyData}>
              <Wand2 className="h-4 w-4 mr-2" />
              Use Dummy Data
            </Button>
            <Button variant="outline" size="sm" onClick={() => updateContent({ header: '', content: '', items: [] })}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Items */}
      {section.type !== 'summary' && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Section Items</CardTitle>
              <Badge variant="secondary">
                {(sectionContent.items || []).length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(sectionContent.items || []).map((item, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Item {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shouldShowField('title') && (
                    <div>
                      <Label>{getFieldLabel('title')}</Label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                        placeholder={getFieldPlaceholder('title')}
                      />
                    </div>
                  )}
                  
                  {shouldShowField('subtitle') && (
                    <div>
                      <Label>{getFieldLabel('subtitle')}</Label>
                      <Input
                        value={item.subtitle || ''}
                        onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                        placeholder={getFieldPlaceholder('subtitle')}
                      />
                    </div>
                  )}
                  
                  {shouldShowField('description') && (
                    <div>
                      <Label>{getFieldLabel('description')}</Label>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder={getFieldPlaceholder('description')}
                        rows={section.type === 'experience' ? 4 : 2}
                      />
                    </div>
                  )}
                  
                  {(shouldShowField('date') || shouldShowField('location')) && (
                    <div className="grid grid-cols-2 gap-3">
                      {shouldShowField('date') && (
                        <div>
                          <Label>{getFieldLabel('date')}</Label>
                          <Input
                            value={item.date || ''}
                            onChange={(e) => updateItem(index, 'date', e.target.value)}
                            placeholder={getFieldPlaceholder('date')}
                          />
                        </div>
                      )}
                      
                      {shouldShowField('location') && (
                        <div>
                          <Label>{getFieldLabel('location')}</Label>
                          <Input
                            value={item.location || ''}
                            onChange={(e) => updateItem(index, 'location', e.target.value)}
                            placeholder={getFieldPlaceholder('location')}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <Button
              variant="outline"
              onClick={addNewItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}