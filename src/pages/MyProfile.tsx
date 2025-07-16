import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  GraduationCap,
  Briefcase,
  Camera,
  Save,
  Plus,
  X,
  Eye,
  EyeOff,
  Shield,
  Link,
  Award
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MyProfile = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: 'Brendan Davies',
    email: 'brendan@gmail.com',
    country: 'Sweden',
    mobile: '+46700123456',
    address: 'Södermalm 45',
    city: 'Stockholm',
    aboutMe: 'I have worked on this job',
    shortDescription: 'Brief description for career background',
    education: 'Data Management',
    university: 'University of Nigeria',
    
    // Portfolio Links
    portfolioLinks: [
      { id: 1, url: 'https://linkedin.com/in/brendan-davies', type: 'LinkedIn' },
      { id: 2, url: 'https://github.com/brendan-davies', type: 'GitHub' },
      { id: 3, url: 'https://brendandavies.com', type: 'Personal Website' }
    ],
    
    // Password
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newLink, setNewLink] = useState({ url: '', type: '' });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPortfolioLink = () => {
    if (newLink.url && newLink.type) {
      const newPortfolioLink = {
        id: Date.now(),
        url: newLink.url,
        type: newLink.type
      };
      setProfileData(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, newPortfolioLink]
      }));
      setNewLink({ url: '', type: '' });
      toast({ title: "Portfolio link added successfully!" });
    }
  };

  const handleRemovePortfolioLink = (id: number) => {
    setProfileData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter(link => link.id !== id)
    }));
    toast({ title: "Portfolio link removed" });
  };

  const handleSaveProfile = () => {
    // Save profile logic here
    toast({ title: "Profile updated successfully!" });
  };

  const handleUpdateEmail = () => {
    // Update email logic here
    toast({ title: "Email update request sent!" });
  };

  const handleChangePassword = () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    // Change password logic here
    toast({ title: "Password changed successfully!" });
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {profileData.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Change
                  </Button>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={profileData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sweden">Sweden</SelectItem>
                        <SelectItem value="Norway">Norway</SelectItem>
                        <SelectItem value="Denmark">Denmark</SelectItem>
                        <SelectItem value="Finland">Finland</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      value={profileData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="+46700123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutMe">About Me</Label>
                  <Textarea
                    id="aboutMe"
                    value={profileData.aboutMe}
                    onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Brief description for career background</Label>
                  <Textarea
                    id="shortDescription"
                    value={profileData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Brief description of your career background..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={profileData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      placeholder="Your field of study"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university">University / Nigeria</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="university"
                        value={profileData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        placeholder="Your university"
                      />
                      <Badge variant="destructive" className="shrink-0">
                        <X className="h-3 w-3" />
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                  <Plus className="h-4 w-4" />
                  Add more
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Portfolio profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Portfolio Links */}
                <div className="space-y-3">
                  {profileData.portfolioLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{link.type}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{link.url}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePortfolioLink(link.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add New Link */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="linkType">Link Type</Label>
                    <Select value={newLink.type} onValueChange={(value) => setNewLink(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="GitHub">GitHub</SelectItem>
                        <SelectItem value="Personal Website">Personal Website</SelectItem>
                        <SelectItem value="Portfolio">Portfolio</SelectItem>
                        <SelectItem value="Behance">Behance</SelectItem>
                        <SelectItem value="Dribbble">Dribbble</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkUrl">URL</Label>
                    <Input
                      id="linkUrl"
                      value={newLink.url}
                      onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <Button 
                    onClick={handleAddPortfolioLink} 
                    className="w-full"
                    disabled={!newLink.url || !newLink.type}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>

                <Button variant="outline" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Update Email Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Update email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Your current email address is <span className="font-medium text-blue-600">{profileData.email}</span>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="newEmail">Enter your new email id</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="newemail@gmail.com"
                  />
                </div>
                <Button onClick={handleUpdateEmail} className="w-full">
                  Update email
                </Button>
              </CardContent>
            </Card>

            {/* Update Password Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Update password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={profileData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Enter your new password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      value={profileData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      value={profileData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleChangePassword} 
                  className="w-full"
                  disabled={!profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword}
                >
                  Change password
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;