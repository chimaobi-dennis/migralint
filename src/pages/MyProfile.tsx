import { useState } from "react";
import { 
  User, 
  Edit, 
  Plus, 
  Save, 
  X, 
  Camera,
  Linkedin,
  Link,
  Eye,
  EyeOff,
  Trash2,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ApplicationProfile {
  id: string;
  name: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  country: string;
  mobile: string;
  address: string;
  aboutMe: string;
  education: string;
  portfolioUrl: string;
  createdAt: string;
}

const MyProfile = () => {
  const [activeSection, setActiveSection] = useState("edit-profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // General profile state
  const [generalProfile, setGeneralProfile] = useState({
    fullName: "John Smith",
    email: "john.smith@email.com",
    dateOfBirth: "1995-06-15",
    country: "Sweden",
    mobile: "+46123456789",
    address: "Studentgatan 12, Stockholm",
    aboutMe: "I have working on the job.",
    education: "Business Management",
    portfolioUrl: "linkedin.com/in/john-smith"
  });

  // Application profiles state
  const [applicationProfiles, setApplicationProfiles] = useState<ApplicationProfile[]>([
    {
      id: "1",
      name: "Engineering Applications",
      fullName: "John Smith",
      email: "john.engineering@email.com",
      dateOfBirth: "1995-06-15",
      country: "Sweden",
      mobile: "+46123456789",
      address: "Studentgatan 12, Stockholm",
      aboutMe: "Passionate about engineering and technology with strong technical background.",
      education: "Computer Science",
      portfolioUrl: "linkedin.com/in/john-smith-engineer",
      createdAt: "2024-01-15"
    }
  ]);

  // Form states
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState<Partial<ApplicationProfile>>({});

  const handleGeneralProfileUpdate = () => {
    toast.success("General profile updated successfully!");
  };

  const handleCreateApplicationProfile = () => {
    if (!newProfile.name) {
      toast.error("Please enter a profile name");
      return;
    }

    const profile: ApplicationProfile = {
      id: Date.now().toString(),
      name: newProfile.name || "",
      fullName: newProfile.fullName || generalProfile.fullName,
      email: newProfile.email || generalProfile.email,
      dateOfBirth: newProfile.dateOfBirth || generalProfile.dateOfBirth,
      country: newProfile.country || generalProfile.country,
      mobile: newProfile.mobile || generalProfile.mobile,
      address: newProfile.address || generalProfile.address,
      aboutMe: newProfile.aboutMe || generalProfile.aboutMe,
      education: newProfile.education || generalProfile.education,
      portfolioUrl: newProfile.portfolioUrl || generalProfile.portfolioUrl,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setApplicationProfiles([...applicationProfiles, profile]);
    setNewProfile({});
    setEditingProfile(null);
    toast.success("Application profile created successfully!");
  };

  const handleUpdateApplicationProfile = (profileId: string) => {
    setApplicationProfiles(profiles => 
      profiles.map(profile => 
        profile.id === profileId ? { ...profile, ...newProfile } : profile
      )
    );
    setEditingProfile(null);
    setNewProfile({});
    toast.success("Application profile updated successfully!");
  };

  const handleDeleteApplicationProfile = (profileId: string) => {
    setApplicationProfiles(profiles => profiles.filter(p => p.id !== profileId));
    toast.success("Application profile deleted successfully!");
  };

  const handleEmailUpdate = () => {
    if (!newEmail) {
      toast.error("Please enter a new email address");
      return;
    }
    toast.success("Email update request sent! Check your inbox for verification.");
    setNewEmail("");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and application profiles</p>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: "edit-profile", label: "Edit Profile" },
            { id: "portfolio", label: "Portfolio Profile" },
            { id: "email", label: "Update Email" },
            { id: "password", label: "Update Password" }
          ].map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className="text-xs sm:text-sm"
            >
              {section.label}
            </Button>
          ))}
        </div>

        {/* Edit Profile Section */}
        {activeSection === "edit-profile" && (
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
                  onClick={() => toast.info("Profile picture upload feature coming soon!")}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <CardTitle>Edit Profile</CardTitle>
                <p className="text-sm text-gray-600">Update your general profile information</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={generalProfile.fullName}
                    onChange={(e) => setGeneralProfile({...generalProfile, fullName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalProfile.email}
                    onChange={(e) => setGeneralProfile({...generalProfile, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={generalProfile.dateOfBirth}
                    onChange={(e) => setGeneralProfile({...generalProfile, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={generalProfile.country} 
                    onValueChange={(value) => setGeneralProfile({...generalProfile, country: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                      <SelectItem value="Norway">Norway</SelectItem>
                      <SelectItem value="Denmark">Denmark</SelectItem>
                      <SelectItem value="Finland">Finland</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Netherlands">Netherlands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    value={generalProfile.mobile}
                    onChange={(e) => setGeneralProfile({...generalProfile, mobile: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={generalProfile.address}
                  onChange={(e) => setGeneralProfile({...generalProfile, address: e.target.value})}
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <Label htmlFor="aboutMe">About me</Label>
                <Textarea
                  id="aboutMe"
                  value={generalProfile.aboutMe}
                  onChange={(e) => setGeneralProfile({...generalProfile, aboutMe: e.target.value})}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Select 
                  value={generalProfile.education} 
                  onValueChange={(value) => setGeneralProfile({...generalProfile, education: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Business Management">Business Management</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Law">Law</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGeneralProfileUpdate} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Profile Section */}
        {activeSection === "portfolio" && (
          <div className="space-y-4">
            {/* Existing Application Profiles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Application Profiles</span>
                  <Button 
                    size="sm" 
                    onClick={() => setEditingProfile("new")}
                    disabled={editingProfile !== null}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicationProfiles.map((profile) => (
                  <div key={profile.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{profile.name}</h4>
                        <p className="text-sm text-gray-600">Created: {profile.createdAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingProfile(profile.id);
                            setNewProfile(profile);
                          }}
                          disabled={editingProfile !== null}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteApplicationProfile(profile.id)}
                          disabled={editingProfile !== null}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingProfile === profile.id ? (
                      <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Profile Name</Label>
                            <Input
                              value={newProfile.name || ""}
                              onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                              placeholder="Profile name"
                            />
                          </div>
                          <div>
                            <Label>Full Name</Label>
                            <Input
                              value={newProfile.fullName || ""}
                              onChange={(e) => setNewProfile({...newProfile, fullName: e.target.value})}
                              placeholder="Full name"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Email</Label>
                            <Input
                              value={newProfile.email || ""}
                              onChange={(e) => setNewProfile({...newProfile, email: e.target.value})}
                              placeholder="Email"
                            />
                          </div>
                          <div>
                            <Label>Mobile</Label>
                            <Input
                              value={newProfile.mobile || ""}
                              onChange={(e) => setNewProfile({...newProfile, mobile: e.target.value})}
                              placeholder="Mobile"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>About Me</Label>
                          <Textarea
                            value={newProfile.aboutMe || ""}
                            onChange={(e) => setNewProfile({...newProfile, aboutMe: e.target.value})}
                            placeholder="About me"
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateApplicationProfile(profile.id)}
                          >
                            <Save className="w-3 h-3 mr-2" />
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingProfile(null);
                              setNewProfile({});
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Email:</span> {profile.email}
                        </div>
                        <div>
                          <span className="font-medium">Mobile:</span> {profile.mobile}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium">About:</span> {profile.aboutMe}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add New Profile Form */}
                {editingProfile === "new" && (
                  <div className="border rounded-lg p-4 space-y-4 bg-blue-50">
                    <h4 className="font-medium">Create New Application Profile</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Profile Name *</Label>
                        <Input
                          value={newProfile.name || ""}
                          onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                          placeholder="e.g., Engineering Applications"
                        />
                      </div>
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={newProfile.fullName || generalProfile.fullName}
                          onChange={(e) => setNewProfile({...newProfile, fullName: e.target.value})}
                          placeholder="Full name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={newProfile.email || generalProfile.email}
                          onChange={(e) => setNewProfile({...newProfile, email: e.target.value})}
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <Label>Mobile</Label>
                        <Input
                          value={newProfile.mobile || generalProfile.mobile}
                          onChange={(e) => setNewProfile({...newProfile, mobile: e.target.value})}
                          placeholder="Mobile"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>About Me</Label>
                      <Textarea
                        value={newProfile.aboutMe || generalProfile.aboutMe}
                        onChange={(e) => setNewProfile({...newProfile, aboutMe: e.target.value})}
                        placeholder="Customize your about me for this application type"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleCreateApplicationProfile}>
                        <Plus className="w-3 h-3 mr-2" />
                        Create Profile
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setEditingProfile(null);
                          setNewProfile({});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {applicationProfiles.length === 0 && editingProfile !== "new" && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No application profiles yet. Create your first one!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Links */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>LinkedIn Profile URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generalProfile.portfolioUrl}
                      onChange={(e) => setGeneralProfile({...generalProfile, portfolioUrl: e.target.value})}
                      placeholder="linkedin.com/in/your-profile"
                    />
                    <Button size="sm" variant="outline">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Link className="w-4 h-4" />
                    <span>Share a LinkedIn Link</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Eye className="w-4 h-4" />
                    <span>View external portfolio link</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Link className="w-4 h-4" />
                    <span>Use external portfolio link</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Link className="w-4 h-4" />
                    <span>Use external portfolio link</span>
                  </div>
                </div>

                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Update Email Section */}
        {activeSection === "email" && (
          <Card>
            <CardHeader>
              <CardTitle>Update Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Your current email address is <strong>{generalProfile.email}</strong>
                </p>
                
                <div>
                  <Label htmlFor="newEmail">Enter your new email address</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new-email@example.com"
                  />
                </div>
              </div>

              <Button onClick={handleEmailUpdate} className="w-full">
                Update Email
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Update Password Section */}
        {activeSection === "password" && (
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">Enter new password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={handlePasswordChange} className="w-full">
                Change Password
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
