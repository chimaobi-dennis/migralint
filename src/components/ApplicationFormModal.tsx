import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, User, Phone, Globe, Languages, Briefcase, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ApplicationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  fullName: string;
  phoneNumber: string;
  citizenship: string;
  hasEnglishTest: string;
  englishTest: string;
  testYear: string;
  testScore: string;
  workExperience: string;
  tuitionPreference: string;
  acceptTerms: boolean;
  acceptDataProcessing: boolean;
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", 
  "Chile", "China", "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", "Ghana", "Greece", "India", 
  "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Japan", "Jordan", "Kenya", "South Korea", "Malaysia", "Mexico", 
  "Netherlands", "Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia", 
  "South Africa", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Kingdom", "United States", "Vietnam"
];

const englishTests = ["IELTS", "TOEFL", "PTE Academic", "Cambridge English", "Duolingo English Test"];

export const ApplicationFormModal = ({ open, onOpenChange }: ApplicationFormModalProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "John Doe", // Mock user data
    phoneNumber: "+1234567890", // Mock user data
    citizenship: "",
    hasEnglishTest: "",
    englishTest: "",
    testYear: "",
    testScore: "",
    workExperience: "",
    tuitionPreference: "",
    acceptTerms: false,
    acceptDataProcessing: false,
  });

  const totalSteps = 7;

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = () => {
    // Save form data (would normally save to backend)
    console.log("Form submitted:", formData);
    onOpenChange(false);
    navigate("/pathway-selection");
  };

  const getStepIcon = (step: number) => {
    const icons = [User, Phone, Globe, Languages, Briefcase, DollarSign, FileText];
    const Icon = icons[step - 1];
    return <Icon className="h-5 w-5" />;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.fullName.trim() !== "";
      case 2: return formData.phoneNumber.trim() !== "";
      case 3: return formData.citizenship !== "";
      case 4: return formData.hasEnglishTest !== "";
      case 5: return formData.hasEnglishTest === "no" || (formData.englishTest && formData.testYear && formData.testScore);
      case 6: return formData.workExperience !== "";
      case 7: return formData.tuitionPreference !== "" && formData.acceptTerms && formData.acceptDataProcessing;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getStepIcon(1)}
              Personal Information
            </h3>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This information is from your profile
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getStepIcon(2)}
              Contact Information
            </h3>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  disabled
                  className="bg-gray-50 flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/my-profile")}
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click update to change your phone number in your profile
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getStepIcon(3)}
              Citizenship
            </h3>
            <div>
              <Label htmlFor="citizenship">Select your citizenship</Label>
              <Select 
                value={formData.citizenship} 
                onValueChange={(value) => updateFormData("citizenship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your country" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getStepIcon(4)}
              English Proficiency
            </h3>
            <div>
              <Label>Have you taken any English test in the past 5 years?</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  variant={formData.hasEnglishTest === "yes" ? "default" : "outline"}
                  onClick={() => updateFormData("hasEnglishTest", "yes")}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  variant={formData.hasEnglishTest === "no" ? "default" : "outline"}
                  onClick={() => updateFormData("hasEnglishTest", "no")}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        if (formData.hasEnglishTest === "no") {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {getStepIcon(4)}
                English Test Details
              </h3>
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No English test required for this step.</p>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getStepIcon(4)}
              English Test Details
            </h3>
            <div>
              <Label>Which test did you take?</Label>
              <Select 
                value={formData.englishTest} 
                onValueChange={(value) => updateFormData("englishTest", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                  {englishTests.map((test) => (
                    <SelectItem key={test} value={test}>
                      {test}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testYear">Test Year</Label>
                <Input
                  id="testYear"
                  placeholder="e.g., 2023"
                  value={formData.testYear}
                  onChange={(e) => updateFormData("testYear", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="testScore">Test Score</Label>
                <Input
                  id="testScore"
                  placeholder="e.g., 7.5"
                  value={formData.testScore}
                  onChange={(e) => updateFormData("testScore", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getStepIcon(5)}
              Work Experience
            </h3>
            <div>
              <Label>How many years of work experience do you have?</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {["0-1", "2-3", "4-6"].map((years) => (
                  <Button
                    key={years}
                    variant={formData.workExperience === years ? "default" : "outline"}
                    onClick={() => updateFormData("workExperience", years)}
                    className="h-20 flex flex-col"
                  >
                    <span className="text-lg font-bold">{years}</span>
                    <span className="text-xs">years</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getStepIcon(6)}
              Tuition Fee Preference
            </h3>
            <div>
              <Label>What is your tuition fee preference?</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <Button
                  variant={formData.tuitionPreference === "low" ? "default" : "outline"}
                  onClick={() => updateFormData("tuitionPreference", "low")}
                  className="h-20 flex flex-col"
                >
                  <DollarSign className="h-6 w-6 mb-1" />
                  <span className="text-sm">Low Cost</span>
                </Button>
                <Button
                  variant={formData.tuitionPreference === "no-matter" ? "default" : "outline"}
                  onClick={() => updateFormData("tuitionPreference", "no-matter")}
                  className="h-20 flex flex-col"
                >
                  <span className="text-lg">⚖️</span>
                  <span className="text-sm">Doesn't Matter</span>
                </Button>
                <Button
                  variant={formData.tuitionPreference === "high-quality" ? "default" : "outline"}
                  onClick={() => updateFormData("tuitionPreference", "high-quality")}
                  className="h-20 flex flex-col"
                >
                  <span className="text-lg">⭐</span>
                  <span className="text-sm">High Quality</span>
                </Button>
              </div>
            </div>

            {/* Summary Section */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Review Your Information</h4>
              <Card>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span>{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{formData.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Citizenship:</span>
                    <span>{formData.citizenship}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">English Test:</span>
                    <span>
                      {formData.hasEnglishTest === "no" 
                        ? "No test taken" 
                        : `${formData.englishTest} (${formData.testYear}) - ${formData.testScore}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Work Experience:</span>
                    <span>{formData.workExperience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tuition Preference:</span>
                    <Badge variant="outline">
                      {formData.tuitionPreference === "low" && "Low Cost"}
                      {formData.tuitionPreference === "no-matter" && "Doesn't Matter"}
                      {formData.tuitionPreference === "high-quality" && "High Quality Education"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) => updateFormData("acceptTerms", e.target.checked)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I accept the <span className="text-blue-600 hover:underline cursor-pointer">Terms and Conditions</span>
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="dataProcessing"
                  checked={formData.acceptDataProcessing}
                  onChange={(e) => updateFormData("acceptDataProcessing", e.target.checked)}
                  className="mt-1"
                />
                <Label htmlFor="dataProcessing" className="text-sm leading-relaxed">
                  I consent to the processing of my personal data for application purposes
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Application Form</span>
            <span className="text-sm font-normal text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === totalSteps ? (
            <Button 
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Submit Application
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};