import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { UniversityAutocomplete } from "@/components/ui/university-autocomplete";
import { AuthModal } from '@/components/AuthModal';
import { X, ArrowLeft, ArrowRight, Check, ChevronDown, Search, GraduationCap, Plus, BookOpen } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  custom_area_of_study: string;
  desired_degree_type: string;
  desired_fields: string[];
  language_test_type: string;
  language_test_score: number | null;
  language_test_year: number | null;
  work_experience: string;
  study_environment: string;
  budget_preference: string;
  interest_keywords: string[];
  origin_country: string;
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

const languageTests = [
  "IELTS",
  "TOEFL",
  "Cambridge English",
  "PTE",
  "Duolingo",
  "Test taken more than 5 years ago",
  "No test taken"
];

export const ModernStudentProfileModal = ({ isOpen, onClose }: ModernStudentProfileModalProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    education_level: '',
    university: '',
    current_field: '',
    area_of_study: '',
    custom_area_of_study: '',
    desired_degree_type: '',
    desired_fields: [],
    language_test_type: '',
    language_test_score: null,
    language_test_year: null,
    work_experience: '',
    study_environment: '',
    budget_preference: '',
    interest_keywords: [],
    origin_country: ''
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
  const [step5SubStep, setStep5SubStep] = useState(1); // 1: degree type, 2: topics
  const [searchedKeywords, setSearchedKeywords] = useState<string[]>([]);
  const [siteName, setSiteName] = useState<string>('');
  const [authOpen, setAuthOpen] = useState(false);

  const totalSteps = 9; // Reduced from 10 since we're removing step 10
  const progress = (currentStep / totalSteps) * 100;

  // Helper: convert a string to Initial Caps for each word
  const toTitleCase = (s: string) =>
    s
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(w => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
      .join(' ');

  // Helper: filter-out low-quality keywords like "3d", "4.0", "5g"
  const isValidKeyword = (s: string) => {
    const str = s.trim();
    if (str.length < 3) return false; // too short
    // exclude pure numbers or number-like (e.g., 4, 4.0)
    if (/^\d+(\.\d+)?$/.test(str)) return false;
    // must contain at least one letter
    if (!/[a-zA-Z]/.test(str)) return false;
    return true;
  };

  // Fetch programs data on component mount
  useEffect(() => {
    fetchProgramsData();
  }, []);

  // Fetch site name from business_details
  useEffect(() => {
    const fetchSiteName = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('business_details' as any)
          .select('siteName')
          .limit(1);
        if (!error && Array.isArray(data) && data.length > 0 && (data[0] as any)?.siteName) {
          setSiteName(String((data[0] as any).siteName));
        }
      } catch (e) {
        console.error('Error fetching site name:', e);
      }
    };
    fetchSiteName();
  }, []);

  // Handle keyword search
  useEffect(() => {
    const searchKeywords = async () => {
      if (keywordSearch.trim()) {
        const keywords = await fetchKeywords(keywordSearch);
        setSearchedKeywords(keywords);
      } else {
        setSearchedKeywords([]);
      }
    };

    const debounceTimer = setTimeout(searchKeywords, 300);
    return () => clearTimeout(debounceTimer);
  }, [keywordSearch]);

  // Auto-advance to substep 2 when degree type is selected in step 5
  useEffect(() => {
    if (currentStep === 5 && step5SubStep === 1 && formData.desired_degree_type) {
      const timer = setTimeout(() => {
        setStep5SubStep(2);
      }, 500); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, [currentStep, step5SubStep, formData.desired_degree_type]);

  const fetchProgramsData = async () => {
    try {
      const { data: programs } = await supabase
        .from('programs')
        .select('field_of_study, keywords, university_name')
        .not('field_of_study', 'is', null);

      if (programs) {
        const fields = [...new Set(programs.map(p => p.field_of_study).filter(Boolean))];
        const universities = [...new Set(programs.map(p => p.university_name).filter(Boolean))];

        // Extract keywords from JSONB, dedupe case-insensitively and Title Case
        const seen = new Set<string>(); // lowercased for dedupe
        const normalizedKeywords: string[] = [];
        programs.forEach(p => {
          if (p.keywords && Array.isArray(p.keywords)) {
            p.keywords.forEach(keyword => {
              if (typeof keyword === 'string' && isValidKeyword(keyword)) {
                const norm = toTitleCase(keyword);
                const key = norm.toLowerCase();
                if (!seen.has(key)) {
                  seen.add(key);
                  normalizedKeywords.push(norm);
                }
              }
            });
          }
        });
        const keywords = normalizedKeywords;

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

  // Fetch keywords based on search term (robust, deduped, capped)
  const fetchKeywords = async (searchTerm: string) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];

    try {
      // Fetch only keywords and cap rows for performance
      const { data: programs, error } = await supabase
        .from('programs')
        .select('keywords')
        .not('keywords', 'is', null)
        .limit(1000);

      if (error) {
        console.error('Error fetching keywords:', error);
        return [];
      }

      if (!programs) return [];

      const results: string[] = [];
      const seen = new Set<string>(); // lowercased for dedupe

      programs.forEach((p: any) => {
        if (Array.isArray(p.keywords)) {
          p.keywords.forEach((kw: unknown) => {
            if (typeof kw === 'string') {
              const raw = kw.trim();
              if (isValidKeyword(raw) && raw.toLowerCase().includes(q)) {
                const norm = toTitleCase(raw);
                const key = norm.toLowerCase();
                if (!seen.has(key)) {
                  seen.add(key);
                  results.push(norm);
                }
              }
            }
          });
        }
      });

      // Sort alphabetically and cap the list returned to the UI
      return results
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 200);
    } catch (e: any) {
      console.error('Error fetching keywords:', e?.message || e);
      return [];
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
    if (currentStep === 5 && step5SubStep === 1) {
      // Move to substep 2 within step 5
      setStep5SubStep(2);
    } else if (currentStep === 5 && step5SubStep === 2) {
      // Move to step 6 and reset substep
      setCurrentStep(currentStep + 1);
      setStep5SubStep(1);
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    // From step 5, always go back to step 4
    if (currentStep === 5) {
      setCurrentStep(4);
      setStep5SubStep(1); // reset substep
      return;
    }
    if (currentStep > 1) {
      const target = currentStep - 1;
      setCurrentStep(target);
      // If returning to step 5 from step 6, show substep 2 for continuity
      if (target === 5) {
        setStep5SubStep(2);
      }
    }
  };

  const saveProfileToDatabase = async (userId: string) => {
    try {
      // Resolve numeric user ID and fetch country from user table
      const { data: numericUserId, error: idErr } = await supabase.rpc('get_user_bigint_id', { auth_uuid: userId });
      if (idErr) throw idErr;

      let originCountry = '';
      if (numericUserId != null) {
        const { data: userRow, error: userErr } = await supabase
          .from('user')
          .select('country')
          .eq('id', numericUserId)
          .single();
        if (!userErr && userRow?.country) {
          originCountry = String(userRow.country);
        }
      }

      const finalAreaOfStudy = formData.area_of_study === "Other (Please specify)"
        ? formData.custom_area_of_study
        : formData.area_of_study;

      const validatedData = studentProfileSchema.parse({
        degree: formData.education_level,
        field_of_study: formData.current_field,
        area_of_study: finalAreaOfStudy,
        desired_degree_type: formData.desired_degree_type,
        desired_fields: formData.desired_fields,
        origin_country: originCountry,
        university_country: formData.university,
        language: formData.language_test_type,
        language_test_type: formData.language_test_type,
        language_test_score: formData.language_test_score || 0,
        language_test_year: formData.language_test_year || 0,
        has_language_test: (formData.language_test_type !== 'No test taken' && formData.language_test_type !== 'Test taken more than 5 years ago') ? 1 : 0,
        study_envs: [formData.study_environment],
        interest_keywords: formData.interest_keywords,
        work_experience: formData.work_experience,
        fee_preference: formData.budget_preference,
      });

      const { error } = await supabase.rpc('create_student_profile', {
        p_user_id: userId,
        p_degree: validatedData.degree,
        p_field_of_study: validatedData.field_of_study,
        p_area_of_study: validatedData.area_of_study,
        p_desired_fields: JSON.stringify(validatedData.desired_fields),
        p_origin_country: validatedData.origin_country,
        p_university_country: validatedData.university_country,
        p_language: validatedData.language,
        p_language_test_type: validatedData.language_test_type,
        p_language_test_score: validatedData.language_test_score,
        p_language_test_year: validatedData.language_test_year,
        p_has_language_test: validatedData.has_language_test,
        p_study_envs: JSON.stringify(validatedData.study_envs),
        p_interest_keywords: JSON.stringify(validatedData.interest_keywords),
        p_work_experience: validatedData.work_experience,
        p_fee_preference: validatedData.fee_preference,
      });

      if (error) throw error;

      setShowConfirmation(true);
      toast.success("Profile Created! Your information has been saved successfully.");
      sessionStorage.removeItem('pendingStudentProfileData');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.errors) {
        error.errors.forEach((err: any) => toast.error(err.message));
      } else {
        toast.error(error.message || "Failed to save profile. Please try again.");
      }
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Store form data in session storage
        sessionStorage.setItem('pendingStudentProfileData', JSON.stringify(formData));
        setAuthOpen(true);
        setIsSubmitting(false);
        return;
      }

      await saveProfileToDatabase(user.id);
    } catch (error: any) {
      // Error already handled in saveProfileToDatabase
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for pending profile data after authentication
  useEffect(() => {
    const checkPendingProfile = async () => {
      if (user && isOpen) {
        const pendingData = sessionStorage.getItem('pendingStudentProfileData');
        if (pendingData) {
          try {
            const parsedData = JSON.parse(pendingData);
            setFormData(parsedData);
            setIsSubmitting(true);
            await saveProfileToDatabase(user.id);
          } catch (error) {
            console.error('Error processing pending profile:', error);
            toast.error('Failed to save your profile. Please try again.');
            sessionStorage.removeItem('pendingStudentProfileData');
          } finally {
            setIsSubmitting(false);
          }
        }
      }
    };

    checkPendingProfile();
  }, [user, isOpen]);

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.education_level !== '';
      case 2: return formData.university !== '';
      case 3: return formData.current_field !== '';
      case 4: return true; // Area of study is optional
      case 5:
        if (step5SubStep === 1) {
          return formData.desired_degree_type !== '';
        } else {
          return true; // Topics are optional
        }
      case 6: {
        if (!formData.language_test_type) return false;
        if (formData.language_test_type === 'No test taken') return true;
        if (formData.language_test_type === 'Test taken more than 5 years ago') return true;
        // Recent test requires year and score
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 5;
        const y = formData.language_test_year;
        const s = formData.language_test_score;
        const yearOk = typeof y === 'number' && y >= minYear && y <= currentYear;
        const scoreOk = typeof s === 'number' && !Number.isNaN(s) && s > 0;
        return yearOk && scoreOk;
      }
      case 7: return formData.work_experience !== '';
      case 8: return formData.study_environment !== '';
      case 9: return formData.budget_preference !== '';
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
    const candidate = toTitleCase(keyword);
    const exists = formData.interest_keywords.some(k => k.toLowerCase() === candidate.toLowerCase());
    if (!exists && formData.interest_keywords.length < 10) {
      setFormData(prev => ({
        ...prev,
        interest_keywords: [...prev.interest_keywords, candidate]
      }));
      // Clear the search input and results to start a new search
      setKeywordSearch('');
      setSearchedKeywords([]);
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      interest_keywords: prev.interest_keywords.filter(k => k !== keyword)
    }));
  };

  // Filter bachelor degrees for step 3, or use program fields for other steps
  const getFilteredFields = () => {
    if (currentStep === 3) {
      return bachelorDegrees.filter(degree =>
        degree.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return programsData.fields_of_study.filter(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredFields = getFilteredFields();

  const filteredKeywords = keywordSearch.trim()
    ? searchedKeywords
    : programsData.keywords.filter(keyword =>
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
                  My highest education level is...
                </h3>
                <p className="text-gray-600">Helps {siteName || 'our platform'} understand your academic background.</p>
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
                  I completed my {formData.education_level?.replace('_', ' ')} degree at...
                </h3>
                <p className="text-gray-600">Helps {siteName || 'our platform'} understand your background and align future study options. </p>
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
                  My degree/field of study is...
                </h3>
                <p className="text-gray-600">Helps {siteName || 'our platform'} match you with relevant programs.</p>
              </div>

              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for your degree (e.g., Computer Science, Business Administration)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Show selected degree with remove option */}
              {formData.current_field && (
                <div className="mb-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-blue-700">{formData.current_field}</span>
                    </div>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, current_field: '' }))}
                      className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="Remove selection"
                    >
                      <X className="h-4 w-4 text-blue-500" />
                    </button>
                  </div>
                </div>
              )}

              {/* Show search results only when no degree is selected */}
              {!formData.current_field && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {filteredFields.map(field => (
                    <button
                      key={field}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, current_field: field }));
                        setSearchTerm('');
                      }}
                      className="p-3 text-left border rounded-lg transition-all hover:shadow-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    >
                      <span>{field}</span>
                    </button>
                  ))}
                  {searchTerm && !filteredFields.some(f => f.toLowerCase() === searchTerm.toLowerCase()) && (
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, current_field: searchTerm }));
                        setSearchTerm('');
                      }}
                      className="p-3 text-left border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-blue-500" />
                        <span>Add "{searchTerm}" as custom degree</span>
                      </div>
                    </button>
                  )}
                  {filteredFields.length === 0 && !searchTerm && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Start typing to search for your degree...</p>
                    </div>
                  )}
                  {filteredFields.length === 0 && searchTerm && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No degrees found matching "{searchTerm}"</p>
                      <p className="text-sm mt-1">Click the "Add custom degree" button above to add it</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  The area of study for {formData.current_field} is...
                </h3>
                <p className="text-gray-600">Helps {siteName || 'our platform'} categorize your academic background and improve program matches.</p>
              </div>

              <div className="space-y-3">
                {/* Skip option */}
                <div
                  onClick={() => setFormData(prev => ({ ...prev, area_of_study: '', custom_area_of_study: '' }))}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${!formData.area_of_study && !formData.custom_area_of_study
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span>Optional </span>
                  </div>
                </div>

                {/* Predefined areas */}
                {areasOfStudy.map(area => (
                  <div
                    key={area}
                    onClick={() => {
                      if (area === "Other (Please specify)") {
                        setFormData(prev => ({ ...prev, area_of_study: area, custom_area_of_study: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, area_of_study: area, custom_area_of_study: '' }));
                      }
                    }}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${formData.area_of_study === area
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{area}</span>
                      {formData.area_of_study === area && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Custom input field when "Other" is selected */}
                {formData.area_of_study === "Other (Please specify)" && (
                  <div className="mt-4">
                    <Label htmlFor="custom_area">Specify your area of study</Label>
                    <Input
                      id="custom_area"
                      placeholder="Enter your specific area of study..."
                      value={formData.custom_area_of_study}
                      onChange={(e) => setFormData(prev => ({ ...prev, custom_area_of_study: e.target.value }))}
                      className="mt-2 h-12"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8">
              {/* Substep 1: Degree Type Selection - Always visible */}
              <div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    I want to study a...
                  </h3>
                  <p className="text-gray-600">This tells {siteName || 'our platform'} your intended study level to tailor recommendations.</p>
                </div>

                <div className="space-y-3 mt-4">
                  {["Bachelor's degree", "Master's degree"].map(degreeType => (
                    <div
                      key={degreeType}
                      onClick={() => setFormData(prev => ({ ...prev, desired_degree_type: degreeType }))}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${formData.desired_degree_type === degreeType
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{degreeType}</span>
                        {formData.desired_degree_type === degreeType && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substep 2: Topics of Interest - Show when degree type is selected */}
              {step5SubStep === 2 && (
                <div className="border-t pt-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      I am curious about these topics...
                    </h3>
                    <p className="text-gray-600">{siteName || 'Our platform'} uses your interests to personalize and surface relevant programs (choose up to 10 for a wider recommendations).</p>
                  </div>

                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search topics (e.g., artificial intelligence, sustainability)..."
                        value={keywordSearch}
                        onChange={(e) => setKeywordSearch(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  {formData.interest_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
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

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto mt-4">
                    {filteredKeywords.slice(0, 50).map(keyword => (
                      <button
                        key={keyword}
                        onClick={() => addKeyword(keyword)}
                        disabled={formData.interest_keywords.includes(keyword) || formData.interest_keywords.length >= 10}
                        className="p-3 text-left border rounded-lg transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 hover:border-gray-300 text-sm"
                      >
                        {keyword}
                      </button>
                    ))}
                    {keywordSearch && !filteredKeywords.some(k => k.toLowerCase() === keywordSearch.toLowerCase()) && (
                      <button
                        onClick={() => addKeyword(keywordSearch)}
                        disabled={formData.interest_keywords.some(k => k.toLowerCase() === keywordSearch.toLowerCase()) || formData.interest_keywords.length >= 10}
                        className="p-3 text-left border border-dashed rounded-lg transition-all hover:shadow-sm border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-blue-500" />
                          <span>Add "{keywordSearch}" as custom topic</span>
                        </div>
                      </button>
                    )}
                    {filteredKeywords.length === 0 && !keywordSearch && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Start typing to search for topics...</p>
                      </div>
                    )}
                    {filteredKeywords.length === 0 && !!keywordSearch && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No topics found matching "{keywordSearch}"</p>
                        <p className="text-sm mt-1">Use the button above to add it as a custom topic</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    Selected: {formData.interest_keywords.length}/10 topics
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  I have taken this language test...
                </h3>
                <p className="text-gray-600">What language test have you taken within the past 5 years?</p>
              </div>

              {/* If no selection yet, show the list of tests */}
              {!formData.language_test_type && (
                <div className="space-y-4">
                  {languageTests.map(test => (
                    <div
                      key={test}
                      onClick={() => setFormData(prev => ({ ...prev, language_test_type: test, language_test_year: null, language_test_score: null }))}
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
              )}

              {/* If selected 'No test taken' or 'Test >5 years', show summary and a button to change */}
              {formData.language_test_type && (formData.language_test_type === 'No test taken' || formData.language_test_type === 'Test taken more than 5 years ago') && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-medium">{formData.language_test_type}</p>
                    <p className="text-sm text-gray-600 mt-1">You can continue without providing a recent test score.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, language_test_type: '', language_test_year: null, language_test_score: null }))}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Change test type
                  </button>
                </div>
              )}

              {/* If a recent test is selected, show year and score inputs */}
              {formData.language_test_type && (formData.language_test_type !== 'No test taken' && formData.language_test_type !== 'Test taken more than 5 years ago') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{formData.language_test_type}</p>
                      <p className="text-sm text-gray-600">Provide your test year and score</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, language_test_type: '', language_test_year: null, language_test_score: null }))}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back to test types
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Year dropdown: last 5 years including current */}
                    <div>
                      <Label htmlFor="test_year">Test Year</Label>
                      <select
                        id="test_year"
                        value={formData.language_test_year ?? ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, language_test_year: e.target.value ? parseInt(e.target.value) : null }))}
                        className="mt-2 h-12 w-full border border-gray-300 rounded-md px-3"
                      >
                        <option value="">Select year</option>
                        {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    {/* Score input */}
                    <div>
                      <Label htmlFor="score">Test Score</Label>
                      <Input
                        id="score"
                        type="number"
                        placeholder="Enter your score"
                        value={formData.language_test_score ?? ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          language_test_score: e.target.value ? Number(e.target.value) : null
                        }))}
                        className="mt-2 h-12"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Year must be within the last 5 years. Provide a numeric score.</p>
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
                <p className="text-gray-600">This helps {siteName || 'our platform'} recommend suitable scholarships</p>
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
                <p className="text-gray-600">This helps {siteName || 'our platform'} filter for the right campus and location experience.</p>
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
                <p className="text-gray-600">Helps {siteName || 'our platform'} find programs within your budget range</p>
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
              {currentStep === totalSteps ? 'Submit' :
                currentStep === 5 && step5SubStep === 1 ? 'Continue' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </Dialog>
  );
};