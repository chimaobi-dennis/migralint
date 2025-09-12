import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ArrowRight, Check, Zap, Globe, Search } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  degree: string;
  field_of_study: string;
  area_of_study: string;
  desired_fields: string[];
  origin_country: string;
  university_country: string;
  language: string;
  language_test_type: string;
  language_test_score: number | null;
  language_test_year: number | null;
  has_language_test: number;
  study_envs: string[];
  interest_keywords: string[];
  work_experience: string;
  fee_preference: string;
}

const studyFields = [
  "Computer Science", "Business Administration", "Engineering", "Medicine", "Law", 
  "Psychology", "Economics", "Biology", "Mathematics", "Physics", "Chemistry",
  "Applied Biostatistics", "Data Science", "Marketing", "Finance", "Architecture",
  "Design", "Education", "Environmental Science", "International Relations"
];

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "Sweden",
  "Netherlands", "France", "Switzerland", "Denmark", "Norway", "Finland",
  "Japan", "South Korea", "Singapore", "New Zealand", "Italy", "Spain"
];

const languageTests = ["IELTS", "TOEFL", "Cambridge English", "PTE", "Duolingo"];

const studyEnvironments = [
  "Large Research Universities", "Small Liberal Arts Colleges", "Urban Campus",
  "Rural Campus", "International Environment", "Co-op Programs", "Online Learning"
];

const interestTopics = [
  "Business Innovation", "Entrepreneurial", "Sustainability", "Technology", 
  "Healthcare", "Finance", "Research", "Social Impact", "Creative Arts",
  "International Business", "Data Analytics", "Artificial Intelligence"
];

export const StudentProfileModal = ({ isOpen, onClose }: StudentProfileModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    degree: '',
    field_of_study: '',
    area_of_study: '',
    desired_fields: [],
    origin_country: '',
    university_country: '',
    language: 'English',
    language_test_type: '',
    language_test_score: null,
    language_test_year: null,
    has_language_test: 0,
    study_envs: [],
    interest_keywords: [],
    work_experience: '',
    fee_preference: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [fieldSearch, setFieldSearch] = useState('');
  const [topicSearch, setTopicSearch] = useState('');
  
  const { toast } = useToast();

  const totalSteps = 9;
  const progress = (currentStep / totalSteps) * 100;

  // Countdown timer for confirmation page
  useEffect(() => {
    if (showConfirmation && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showConfirmation && countdown === 0) {
      onClose();
      // Redirect to application page or dashboard
    }
  }, [showConfirmation, countdown, onClose]);

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentStep(1);
      setShowConfirmation(false);
      setCountdown(5);
      onClose();
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  const addTopic = (topic: string) => {
    if (!formData.interest_keywords.includes(topic) && formData.interest_keywords.length < 10) {
      setFormData(prev => ({
        ...prev,
        interest_keywords: [...prev.interest_keywords, topic]
      }));
    }
  };

  const removeTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      interest_keywords: prev.interest_keywords.filter(t => t !== topic)
    }));
  };

  const toggleStudyEnv = (env: string) => {
    setFormData(prev => ({
      ...prev,
      study_envs: prev.study_envs.includes(env)
        ? prev.study_envs.filter(e => e !== env)
        : [...prev.study_envs, env]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your profile.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('student_profile')
        .insert([{
          user_id: user.id,
          degree: formData.degree,
          field_of_study: formData.field_of_study,
          area_of_study: formData.area_of_study,
          desired_fields: formData.desired_fields,
          origin_country: formData.origin_country,
          university_country: formData.university_country,
          language: formData.language,
          language_test_type: formData.language_test_type,
          language_test_score: formData.language_test_score,
          language_test_year: formData.language_test_year,
          has_language_test: formData.has_language_test,
          study_envs: formData.study_envs,
          interest_keywords: formData.interest_keywords,
          work_experience: formData.work_experience,
          fee_preference: formData.fee_preference
        }]);

      if (error) throw error;

      setShowConfirmation(true);
      toast({
        title: "Profile Saved!",
        description: "Your student profile has been created successfully."
      });

    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.degree !== '';
      case 2: return formData.field_of_study !== '';
      case 3: return formData.origin_country !== '';
      case 4: return formData.university_country !== '';
      case 5: return formData.has_language_test !== null;
      case 6: return formData.work_experience !== '';
      case 7: return formData.fee_preference !== '';
      case 8: return formData.study_envs.length > 0;
      case 9: return formData.interest_keywords.length > 0;
      default: return false;
    }
  };

  const filteredFields = studyFields.filter(field =>
    field.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  const filteredTopics = interestTopics.filter(topic =>
    topic.toLowerCase().includes(topicSearch.toLowerCase())
  );

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Created Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Your personalized study abroad journey is now ready. We'll help you find the perfect programs and guide you through the application process.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-blue-600 mb-2">
                Closing in {countdown} seconds...
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                onClick={() => {
                  onClose();
                  // Navigate to application dashboard
                }}
              >
                Start Your Application <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Uniplanr</h1>
              <p className="text-blue-100 text-sm">⚡ Powered by Intelligence</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Kickstart Your Global Education Journey <Globe className="h-6 w-6" />
            </h2>
            <p className="text-blue-100">
              Share your academic background. Let <span className="text-yellow-300 font-semibold">Uniplanr craft your perfect personalized</span> study abroad experience.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">What degree level are you interested in?</h3>
              <RadioGroup
                value={formData.degree}
                onValueChange={(value) => setFormData(prev => ({ ...prev, degree: value }))}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="Bachelor" id="bachelor" />
                  <Label htmlFor="bachelor" className="cursor-pointer flex-1">
                    <div>
                      <p className="font-medium">Bachelor's Degree</p>
                      <p className="text-sm text-gray-500">Undergraduate programs (3-4 years)</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="Master" id="master" />
                  <Label htmlFor="master" className="cursor-pointer flex-1">
                    <div>
                      <p className="font-medium">Master's Degree</p>
                      <p className="text-sm text-gray-500">Graduate programs (1-2 years)</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                I want to study a {formData.degree?.toLowerCase()}'s degree in...
              </h3>
              
              <div>
                <Label htmlFor="field-search">Select field</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="field-search"
                    placeholder="Search fields of study..."
                    value={fieldSearch}
                    onChange={(e) => setFieldSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.desired_fields.map(field => (
                    <Badge key={field} variant="default" className="bg-blue-500 text-white">
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
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {filteredFields.map(field => (
                    <button
                      key={field}
                      onClick={() => {
                        addField(field);
                        setFormData(prev => ({ ...prev, field_of_study: field }));
                      }}
                      disabled={formData.desired_fields.includes(field) || formData.desired_fields.length >= 5}
                      className="p-3 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {field}
                    </button>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500">
                  You can choose up to 5 fields. Selected: {formData.desired_fields.length}/5
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Where are you from?</h3>
              <div>
                <Label htmlFor="origin-country">Origin Country</Label>
                <Select
                  value={formData.origin_country}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, origin_country: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Where would you like to study?</h3>
              <div>
                <Label htmlFor="university-country">Preferred Study Destination</Label>
                <Select
                  value={formData.university_country}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, university_country: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select destination country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">For language requirement...</h3>
              
              <RadioGroup
                value={formData.has_language_test.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, has_language_test: parseInt(value) }))}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="1" id="has-test" />
                  <Label htmlFor="has-test" className="cursor-pointer">
                    I have an IELTS or other certified language certificate
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="0" id="need-assistance" />
                  <Label htmlFor="need-assistance" className="cursor-pointer">
                    I would like assistance with language certificate
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="2" id="english-degree" />
                  <Label htmlFor="english-degree" className="cursor-pointer">
                    My previous degree was taught in English
                  </Label>
                </div>
              </RadioGroup>

              {formData.has_language_test === 1 && (
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h4 className="font-medium">Language Test Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="test-type">Which test did you take?</Label>
                      <Select
                        value={formData.language_test_type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, language_test_type: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageTests.map(test => (
                            <SelectItem key={test} value={test}>{test}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="test-score">Test Score</Label>
                      <Input
                        id="test-score"
                        type="number"
                        placeholder="e.g., 7.5 or 110"
                        value={formData.language_test_score || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          language_test_score: e.target.value ? parseFloat(e.target.value) : null 
                        }))}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your overall score (e.g., 7.5 for IELTS or 110 for TOEFL)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="test-year">Test Year</Label>
                      <Select
                        value={formData.language_test_year?.toString() || ''}
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          language_test_year: parseInt(value) 
                        }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">What's your work experience level?</h3>
              <RadioGroup
                value={formData.work_experience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, work_experience: value }))}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="No experience" id="no-exp" />
                  <Label htmlFor="no-exp" className="cursor-pointer">No professional experience</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="0-2 years" id="entry" />
                  <Label htmlFor="entry" className="cursor-pointer">0-2 years (Entry level)</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="2-5 years" id="mid" />
                  <Label htmlFor="mid" className="cursor-pointer">2-5 years (Mid-level)</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="5+ years" id="senior" />
                  <Label htmlFor="senior" className="cursor-pointer">5+ years (Senior level)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">What's your budget preference?</h3>
              <RadioGroup
                value={formData.fee_preference}
                onValueChange={(value) => setFormData(prev => ({ ...prev, fee_preference: value }))}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Low cost (under $15,000/year)" id="low" />
                  <Label htmlFor="low" className="cursor-pointer">Low cost (under $15,000/year)</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Moderate ($15,000-$30,000/year)" id="moderate" />
                  <Label htmlFor="moderate" className="cursor-pointer">Moderate ($15,000-$30,000/year)</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="Premium ($30,000+/year)" id="premium" />
                  <Label htmlFor="premium" className="cursor-pointer">Premium ($30,000+/year)</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="No preference" id="no-pref" />
                  <Label htmlFor="no-pref" className="cursor-pointer">No specific preference</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">What type of study environment appeals to you?</h3>
              <p className="text-gray-600">Select all that apply</p>
              <div className="space-y-3">
                {studyEnvironments.map(env => (
                  <div key={env} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={env}
                      checked={formData.study_envs.includes(env)}
                      onCheckedChange={() => toggleStudyEnv(env)}
                    />
                    <Label htmlFor={env} className="cursor-pointer flex-1">{env}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">I am curious about these topics</h3>
              
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Start typing..."
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.interest_keywords.map(topic => (
                    <Badge key={topic} variant="default" className="bg-blue-500 text-white">
                      {topic}
                      <button
                        onClick={() => removeTopic(topic)}
                        className="ml-2 hover:bg-blue-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {filteredTopics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => addTopic(topic)}
                      disabled={formData.interest_keywords.includes(topic) || formData.interest_keywords.length >= 10}
                      className="p-3 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500">
                  Choose up to 10 keywords. Selected: {formData.interest_keywords.length}/10
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : (
                <>
                  <Check className="h-4 w-4" />
                  Save Information
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};