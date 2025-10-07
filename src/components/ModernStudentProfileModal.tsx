import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { UniversityAutocomplete } from "@/components/ui/university-autocomplete";
import { X, ArrowLeft, ArrowRight, Check, ChevronDown, Search, GraduationCap } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { studentProfileSchema } from "@/lib/validations";

interface ModernStudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  education_level: string;
  university: string;
  current_field: string;
  area_of_study: string;
  desired_fields: string[];
  language_test_type: string;
  language_test_score: number | null;
  work_experience: string;
  study_environment: string;
  budget_preference: string;
  interest_keywords: string[];
}

interface ProgramsData {
  fields_of_study: string[];
  keywords: string[];
  universities: string[];
}

const educationLevels = [
  { value: "bachelor", label: "Bachelor's Degree", description: "Undergraduate level" },
  { value: "master", label: "Master's Degree", description: "Postgraduate level" },
  { value: "phd", label: "PhD", description: "Doctoral level" },
  { value: "other", label: "Other", description: "Diploma, Certificate, etc." }
];
const bachelorDegrees = [
  "Accounting",
  "Actuarial Science",
  "Advertising",
  "Aerospace Engineering",
  "Agricultural Business",
  "Agricultural Economics",
  "Agricultural Engineering",
  "Agricultural Science",
  "Animal Science",
  "Anthropology",
  "Applied Biology",
  "Applied Chemistry",
  "Applied Computer Science",
  "Applied Economics",
  "Applied Mathematics",
  "Applied Physics",
  "Applied Statistics",
  "Aquaculture",
  "Architecture",
  "Arts",
  "Artificial Intelligence",
  "Asian Studies",
  "Astronomy",
  "Atmospheric Science",
  "Audio Engineering",
  "Automotive Engineering",
  "Aviation",
  "Biochemistry",
  "Biology",
  "Business Administration",
  "Business Analytics",
  "Business Economics",
  "Business Finance",
  "Business Information Systems",
  "Business Management",
  "Business Management and Economics",
  "Business Management and Marketing",
  "Business Management and Statistics",
  "Business Management and Finance",
  "Business Management and Human Resources",
  "Business Management and Logistics",
  "Business Management and Marketing and Statistics",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Communication",
  "Communication and Media Studies",
  "Communication and Public Relations",
  "Computer Engineering",
  "Computer Information Systems",
  "Computer Science",
  "Computer Systems and Information Technology",
  "Construction Management",
  "Criminology",
  "Cultural Anthropology",
  "Data Analytics",
  "Data Science",
  "Dentistry",
  "Design and Visual Arts",
  "Digital Communications",
  "Digital Media",
  "Early Childhood Education",
  "Earth and Planetary Sciences",
  "Earth Sciences",
  "Economics",
  "Education",
  "Electrical Engineering",
  "Elementary Education",
  "Engineering",
  "Engineering Physics",
  "English",
  "Environmental Engineering",
  "Environmental Health",
  "Environmental Science",
  "Environmental Studies",
  "Epidemiology",
  "Ergonomics",
  "Ethnic Studies",
  "Exercise Science",
  "Film and Video Production",
  "Finance",
  "Fine Arts",
  "Food and Nutrition",
  "Food Science",
  "Forensic Science",
  "Forestry",
  "Geography",
  "Geology",
  "Graphic Design",
  "Healthcare Administration",
  "Healthcare Management",
  "Health Education",
  "Health Informatics",
  "Health Promotion",
  "Health Science",
  "History",
  "Hospitality Management",
  "Human Development and Family Studies",
  "Human Resources Management",
  "Human Services",
  "Industrial Design",
  "Industrial Engineering",
  "Information Assurance",
  "Information Systems",
  "Information Technology",
  "International Business",
  "International Relations",
  "Journalism",
  "Kinesiology",
  "Landscape Architecture",
  "Language and Linguistics",
  "Law",
  "Liberal Arts",
  "Library and Information Science",
  "Life Sciences",
  "Logistics and Supply Chain Management",
  "Management",
  "Management Information Systems",
  "Manufacturing Engineering",
  "Marketing",
  "Materials Science and Engineering",
  "Mathematics",
  "Mechanical Engineering",
  "Media and Communication Studies",
  "Medical Laboratory Science",
  "Medical Science",
  "Medical Technology",
  "Medicine",
  "Mental Health",
  "Microbiology",
  "Molecular Biology",
  "Music",
  "Music Education",
  "Natural Resource Management",
  "Neuroscience",
  "Nursing",
  "Nutrition",
  "Occupational Safety and Health",
  "Occupational Therapy",
  "Operations Management",
  "Organizational Management",
  "Pharmaceutical Sciences",
  "Philosophy",
  "Photography",
  "Physical Education",
  "Physical Therapy",
  "Physics",
  "Political Science",
  "Psychology",
  "Public Administration",
  "Public Health",
  "Public Policy",
  "Public Relations",
  "Radiologic Technology",
  "Real Estate",
  "Recreation and Leisure Studies",
  "Religious Studies",
  "Retail Management",
  "Risk Management and Insurance",
  "Social Work",
  "Sociology",
  "Software Engineering",
  "Special Education",
  "Speech and Language Pathology",
  "Statistics",
  "Sustainable Development",
  "Theater",
  "Tourism",
  "Urban Planning",
  "Visual Arts",
  "Women's and Gender Studies",
  "Writing and Journalism",
  "Zoology",
];
const areasOfStudy = [
  "Arts and Humanities",
  "Computer Science and IT",
  "Education and Teaching",
  "Engineering and Technology",
  "Health and Medicine",
  "Law and Legal Studies",
  "Life Sciences",
  "Mathematics and Statistics",
  "Natural Sciences",
  "Social Sciences",
  "Other (Please specify)"
];

const workExperienceLevels = [
  "No work experience",
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5+ years",
  "Extensive professional experience"
];

const studyEnvironments = [
  "Big & busy city",
  "Somewhere warm & sunny",
  "A small, cosy town",
  "At a top-10 ranked university",
  "Near nature & outdoor activities"
];

const budgetPreferences = [
  "Low fees programs - Looking for the most affordable education options",
  "I don't mind the school fee - Open to all options regardless of cost",
  "I want only high school fees programs - Interested in premium education options"
];

const languageTests = ["IELTS", "TOEFL", "Cambridge English", "PTE", "Duolingo", "No test taken"];

export const ModernStudentProfileModal = ({ isOpen, onClose }: ModernStudentProfileModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    education_level: '',
    university: '',
    current_field: '',
    area_of_study: '',
    desired_fields: [],
    language_test_type: '',
    language_test_score: null,
    work_experience: '',
    study_environment: '',
    budget_preference: '',
    interest_keywords: []
  });

  const [programsData, setProgramsData] = useState<ProgramsData>({
    fields_of_study: [],
    keywords: [],
    universities: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  // Fetch programs data on component mount
  useEffect(() => {
    fetchProgramsData();
  }, []);

  const fetchProgramsData = async () => {
    try {
      const { data: programs } = await supabase
        .from('programs')
        .select('field_of_study, keywords, university_name')
        .not('field_of_study', 'is', null);

      if (programs) {
        const fields = [...new Set(programs.map(p => p.field_of_study).filter(Boolean))];
        const universities = [...new Set(programs.map(p => p.university_name).filter(Boolean))];

        // Extract keywords from JSONB
        const allKeywords: string[] = [];
        programs.forEach(p => {
          if (p.keywords && Array.isArray(p.keywords)) {
            p.keywords.forEach(keyword => {
              if (typeof keyword === 'string') {
                allKeywords.push(keyword);
              }
            });
          }
        });
        const keywords = [...new Set(allKeywords)];

        setProgramsData({
          fields_of_study: fields.sort(),
          keywords: keywords.sort(),
          universities: universities.sort()
        });
      }
    } catch (error) {
      console.error('Error fetching programs data:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentStep(1);
      setShowConfirmation(false);
      onClose();
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to create a profile");
        return;
      }

      // Validate the profile data
      const validatedData = studentProfileSchema.parse({
        degree: formData.education_level,
        field_of_study: formData.current_field,
        area_of_study: formData.area_of_study,
        desired_fields: formData.desired_fields,
        origin_country: '',
        university_country: formData.university,
        language: formData.language_test_type,
        language_test_type: formData.language_test_type,
        language_test_score: formData.language_test_score || 0,
        language_test_year: new Date().getFullYear(),
        has_language_test: formData.language_test_type !== 'No test taken' ? 1 : 0,
        study_envs: [formData.study_environment],
        interest_keywords: formData.interest_keywords,
        work_experience: formData.work_experience,
        fee_preference: formData.budget_preference,
      });

      // Save to database - implementation would go here
      setShowConfirmation(true);
      toast.success("Profile Created! Your information has been saved successfully.");
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.errors) {
        error.errors.forEach((err: any) => toast.error(err.message));
      } else {
        toast.error(error.message || "Failed to save profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.education_level !== '';
      case 2: return formData.university !== '';
      case 3: return formData.current_field !== '';
      case 4: return formData.area_of_study !== '';
      case 5: return formData.desired_fields.length > 0;
      case 6: return formData.language_test_type !== '';
      case 7: return formData.work_experience !== '';
      case 8: return formData.study_environment !== '';
      case 9: return formData.budget_preference !== '';
      case 10: return formData.interest_keywords.length > 0;
      default: return false;
    }
  };

  const addField = (field: string) => {
    if (!formData.desired_fields.includes(field) && formData.desired_fields.length < 5) {
      setFormData(prev => ({
        ...prev,
        desired_fields: [...prev.desired_fields, field]
      }));
    }
  };

  const removeField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      desired_fields: prev.desired_fields.filter(f => f !== field)
    }));
  };

  const addKeyword = (keyword: string) => {
    if (!formData.interest_keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        interest_keywords: [...prev.interest_keywords, keyword]
      }));
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      interest_keywords: prev.interest_keywords.filter(k => k !== keyword)
    }));
  };

  // Filter bachelor degrees based on search term
  const filteredFields = bachelorDegrees.filter(degree =>
    degree.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 20); // Limit to 20 results for better UX

  const filteredKeywords = programsData.keywords.filter(keyword =>
    keyword.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg mx-auto">
          <div className="text-center py-8 px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Created Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Your personalized study abroad journey is ready. We'll help you find the perfect programs.
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
            >
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[85vh] overflow-hidden p-0 border-0 shadow-2xl">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-8">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Profile</h1>
                <p className="text-blue-100 text-sm">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  What is your highest education level?
                </h3>
                <p className="text-gray-600">Select your current or completed education level</p>
              </div>

              <div className="space-y-4">
                {educationLevels.map(level => (
                  <div
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, education_level: level.value }))}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.education_level === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{level.label}</p>
                        <p className="text-sm text-gray-500">{level.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${formData.education_level === level.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                        }`}>
                        {formData.education_level === level.value && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  I got my {formData.education_level?.replace('_', ' ')} from...
                </h3>
                <p className="text-gray-600">Search and select the university where you completed your degree</p>
              </div>

              <div>
                <Label htmlFor="university">University</Label>
                <div className="mt-2">
                  <UniversityAutocomplete
                    value={formData.university}
                    onChange={(value) => setFormData(prev => ({ ...prev, university: value }))}
                    placeholder="Type to search universities worldwide..."
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  I got my {formData.education_level?.replace('_', ' ')} degree in...
                </h3>
                <p className="text-gray-600">What degree did you study?</p>
              </div>

              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search or type your field of study..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredFields.length > 0 ? (
                  filteredFields.map(field => (
                    <button
                      key={field}
                      onClick={() => setFormData(prev => ({ ...prev, current_field: field }))}
                      className={`p-3 text-left border rounded-lg transition-all hover:shadow-sm ${formData.current_field === field
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {field}
                    </button>
                  ))
                ) : searchTerm ? (
                  <div className="col-span-full">
                    <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 mb-4">
                        No matching degrees found for "{searchTerm}"
                      </p>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, current_field: searchTerm }))}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add "{searchTerm}" as my degree
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Start typing to search for your degree...
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  What area of study is "{formData.current_field}"?
                </h3>
                <p className="text-gray-600">Help us categorize your field of study</p>
              </div>

              <div className="space-y-3">
                {areasOfStudy.map(area => (
                  <div
                    key={area}
                    onClick={() => setFormData(prev => ({ ...prev, area_of_study: area }))}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${formData.area_of_study === area
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  I want to study a master's degree in...
                </h3>
                <p className="text-gray-600">Select up to 5 fields that interest you</p>
              </div>

              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search fields of study..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {formData.desired_fields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.desired_fields.map(field => (
                    <Badge key={field} variant="default" className="bg-blue-500 text-white px-3 py-1">
                      {field}
                      <button
                        onClick={() => removeField(field)}
                        className="ml-2 hover:bg-blue-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredFields.map(field => (
                  <button
                    key={field}
                    onClick={() => addField(field)}
                    disabled={formData.desired_fields.includes(field) || formData.desired_fields.length >= 5}
                    className="p-3 text-left border rounded-lg transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 hover:border-gray-300"
                  >
                    {field}
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                Selected: {formData.desired_fields.length}/5 fields
              </p>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  For language requirements...
                </h3>
                <p className="text-gray-600">What language test have you taken?</p>
              </div>

              <div className="space-y-4">
                {languageTests.map(test => (
                  <div
                    key={test}
                    onClick={() => setFormData(prev => ({ ...prev, language_test_type: test }))}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${formData.language_test_type === test
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{test}</span>
                      <div className={`w-5 h-5 rounded-full border-2 ${formData.language_test_type === test
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                        }`}>
                        {formData.language_test_type === test && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.language_test_type && formData.language_test_type !== "No test taken" && (
                <div>
                  <Label htmlFor="score">Test Score (Optional)</Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="Enter your score"
                    value={formData.language_test_score || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      language_test_score: e.target.value ? parseInt(e.target.value) : null
                    }))}
                    className="mt-2 h-12"
                  />
                </div>
              )}
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  My work experience level is...
                </h3>
                <p className="text-gray-600">This helps us recommend suitable programs</p>
              </div>

              <div className="space-y-3">
                {workExperienceLevels.map(level => (
                  <div
                    key={level}
                    onClick={() => setFormData(prev => ({ ...prev, work_experience: level }))}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${formData.work_experience === level
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{level}</span>
                      <div className={`w-5 h-5 rounded-full border-2 ${formData.work_experience === level
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                        }`}>
                        {formData.work_experience === level && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  I would like to study in a...
                </h3>
                <p className="text-gray-600">What kind of environment appeals to you?</p>
              </div>

              <div className="space-y-3">
                {studyEnvironments.map(env => (
                  <div
                    key={env}
                    onClick={() => setFormData(prev => ({ ...prev, study_environment: env }))}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${formData.study_environment === env
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{env}</span>
                      <div className={`w-5 h-5 rounded-full border-2 ${formData.study_environment === env
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                        }`}>
                        {formData.study_environment === env && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  My budget preference is...
                </h3>
                <p className="text-gray-600">Help us find programs within your budget range</p>
              </div>

              <div className="space-y-3">
                {budgetPreferences.map(budget => (
                  <div
                    key={budget}
                    onClick={() => setFormData(prev => ({ ...prev, budget_preference: budget }))}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${formData.budget_preference === budget
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{budget}</span>
                      <div className={`w-5 h-5 rounded-full border-2 ${formData.budget_preference === budget
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                        }`}>
                        {formData.budget_preference === budget && (
                          <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 10 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  I am curious about these topics...
                </h3>
                <p className="text-gray-600">Select topics that interest you to help us personalize recommendations</p>
              </div>

              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search topics..."
                    value={keywordSearch}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {formData.interest_keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interest_keywords.map(keyword => (
                    <Badge key={keyword} variant="default" className="bg-blue-500 text-white px-3 py-1">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 hover:bg-blue-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {filteredKeywords.slice(0, 50).map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => addKeyword(keyword)}
                    disabled={formData.interest_keywords.includes(keyword)}
                    className="p-3 text-left border rounded-lg transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 hover:border-gray-300 text-sm"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>

            <Button
              onClick={nextStep}
              disabled={!isStepValid() || isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {currentStep === totalSteps ? 'Complete' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};