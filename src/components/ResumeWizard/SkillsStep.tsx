import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Code, Languages, Award, Wrench } from 'lucide-react';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillsData {
  technicalSkills: Skill[];
  softSkills: string[];
  languages: Skill[];
  certifications: string[];
}

interface SkillsStepProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}

const commonTechnicalSkills = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB',
  'Git', 'Docker', 'AWS', 'Azure', 'Kubernetes', 'HTML/CSS', 'TypeScript',
  'Angular', 'Vue.js', 'Spring Boot', 'Django', 'Express.js', 'PostgreSQL',
  'Redis', 'GraphQL', 'REST APIs', 'Microservices', 'Machine Learning',
  'Data Analysis', 'Tableau', 'Excel', 'Photoshop', 'Figma', 'Sketch'
];

const commonSoftSkills = [
  'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management',
  'Critical Thinking', 'Adaptability', 'Project Management', 'Analytical Thinking',
  'Creativity', 'Attention to Detail', 'Customer Service', 'Negotiation',
  'Public Speaking', 'Conflict Resolution', 'Mentoring', 'Strategic Planning'
];

const commonLanguages = [
  'English', 'Spanish', 'French', 'German', 'Chinese (Mandarin)', 'Japanese',
  'Korean', 'Portuguese', 'Italian', 'Dutch', 'Russian', 'Arabic', 'Hindi'
];

export const SkillsStep: React.FC<SkillsStepProps> = ({ data, onChange }) => {
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const addTechnicalSkill = () => {
    if (newTechnicalSkill && !data.technicalSkills.find(s => s.name === newTechnicalSkill)) {
      onChange({
        ...data,
        technicalSkills: [...data.technicalSkills, { name: newTechnicalSkill, level: 'Intermediate' }]
      });
      setNewTechnicalSkill('');
    }
  };

  const removeTechnicalSkill = (skillName: string) => {
    onChange({
      ...data,
      technicalSkills: data.technicalSkills.filter(s => s.name !== skillName)
    });
  };

  const updateTechnicalSkillLevel = (skillName: string, level: Skill['level']) => {
    onChange({
      ...data,
      technicalSkills: data.technicalSkills.map(s => 
        s.name === skillName ? { ...s, level } : s
      )
    });
  };

  const addSoftSkill = () => {
    if (newSoftSkill && !data.softSkills.includes(newSoftSkill)) {
      onChange({
        ...data,
        softSkills: [...data.softSkills, newSoftSkill]
      });
      setNewSoftSkill('');
    }
  };

  const removeSoftSkill = (skill: string) => {
    onChange({
      ...data,
      softSkills: data.softSkills.filter(s => s !== skill)
    });
  };

  const addLanguage = () => {
    if (newLanguage && !data.languages.find(l => l.name === newLanguage)) {
      onChange({
        ...data,
        languages: [...data.languages, { name: newLanguage, level: 'Intermediate' }]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageName: string) => {
    onChange({
      ...data,
      languages: data.languages.filter(l => l.name !== languageName)
    });
  };

  const updateLanguageLevel = (languageName: string, level: Skill['level']) => {
    onChange({
      ...data,
      languages: data.languages.map(l => 
        l.name === languageName ? { ...l, level } : l
      )
    });
  };

  const addCertification = () => {
    if (newCertification && !data.certifications.includes(newCertification)) {
      onChange({
        ...data,
        certifications: [...data.certifications, newCertification]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter(c => c !== certification)
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-red-100 text-red-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-green-100 text-green-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Skills & Certifications</h2>
        <p className="text-muted-foreground">
          Showcase your technical skills, soft skills, languages, and certifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={newTechnicalSkill} onValueChange={setNewTechnicalSkill}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select or type a skill" />
                </SelectTrigger>
                <SelectContent>
                  {commonTechnicalSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addTechnicalSkill} disabled={!newTechnicalSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Input
              value={newTechnicalSkill}
              onChange={(e) => setNewTechnicalSkill(e.target.value)}
              placeholder="Or type a custom skill"
              onKeyPress={(e) => e.key === 'Enter' && addTechnicalSkill()}
            />

            <div className="space-y-2">
              {data.technicalSkills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between gap-2 p-2 border rounded">
                  <span className="font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={skill.level} 
                      onValueChange={(level) => updateTechnicalSkillLevel(skill.name, level as Skill['level'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={getLevelColor(skill.level)}>
                      {skill.level}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTechnicalSkill(skill.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Soft Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={newSoftSkill} onValueChange={setNewSoftSkill}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a soft skill" />
                </SelectTrigger>
                <SelectContent>
                  {commonSoftSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addSoftSkill} disabled={!newSoftSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Input
              value={newSoftSkill}
              onChange={(e) => setNewSoftSkill(e.target.value)}
              placeholder="Or type a custom soft skill"
              onKeyPress={(e) => e.key === 'Enter' && addSoftSkill()}
            />

            <div className="flex flex-wrap gap-2">
              {data.softSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSoftSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={newLanguage} onValueChange={setNewLanguage}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {commonLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addLanguage} disabled={!newLanguage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Or type a custom language"
              onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
            />

            <div className="space-y-2">
              {data.languages.map((language) => (
                <div key={language.name} className="flex items-center justify-between gap-2 p-2 border rounded">
                  <span className="font-medium">{language.name}</span>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={language.level} 
                      onValueChange={(level) => updateLanguageLevel(language.name, level as Skill['level'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Native</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={getLevelColor(language.level)}>
                      {language.level === 'Expert' ? 'Native' : language.level}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(language.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="e.g., AWS Certified Solutions Architect"
                onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                className="flex-1"
              />
              <Button onClick={addCertification} disabled={!newCertification}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {data.certifications.map((certification) => (
                <div key={certification} className="flex items-center justify-between gap-2 p-2 border rounded">
                  <span className="font-medium">{certification}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(certification)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};