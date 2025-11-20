import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { User, Calendar, Phone, Mail, FileText, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  notes: string;
}

export function ProfileManager() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Lisinopril 10mg daily'],
    medicalConditions: ['Hypertension'],
    notes: 'Patient prefers morning appointments. Has history of anxiety during medical procedures.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (type: 'allergies' | 'medications' | 'medicalConditions', value: string) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    if (type === 'allergies') setNewAllergy('');
    if (type === 'medications') setNewMedication('');
    if (type === 'medicalConditions') setNewCondition('');
  };

  const removeItem = (type: 'allergies' | 'medications' | 'medicalConditions', index: number) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to a backend/database
    console.log('Profile saved:', profile);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Your medical information is stored locally for demonstration purposes. In a production app, this would be securely stored and encrypted.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Medical Profile</h2>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'outline' : 'default'}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Input
                id="bloodType"
                value={profile.bloodType}
                onChange={(e) => handleInputChange('bloodType', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact Name</Label>
              <Input
                id="emergencyContact"
                value={profile.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Contact Phone</Label>
              <Input
                id="emergencyPhone"
                value={profile.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allergies */}
          <div className="space-y-3">
            <Label>Allergies</Label>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="flex items-center gap-1">
                  {allergy}
                  {isEditing && (
                    <button
                      onClick={() => removeItem('allergies', index)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {profile.allergies.length === 0 && <span className="text-muted-foreground text-sm">No allergies recorded</span>}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add allergy..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('allergies', newAllergy)}
                />
                <Button
                  onClick={() => addItem('allergies', newAllergy)}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Current Medications */}
          <div className="space-y-3">
            <Label>Current Medications</Label>
            <div className="flex flex-wrap gap-2">
              {profile.medications.map((medication, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {medication}
                  {isEditing && (
                    <button
                      onClick={() => removeItem('medications', index)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {profile.medications.length === 0 && <span className="text-muted-foreground text-sm">No medications recorded</span>}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add medication..."
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('medications', newMedication)}
                />
                <Button
                  onClick={() => addItem('medications', newMedication)}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Medical Conditions */}
          <div className="space-y-3">
            <Label>Medical Conditions</Label>
            <div className="flex flex-wrap gap-2">
              {profile.medicalConditions.map((condition, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {condition}
                  {isEditing && (
                    <button
                      onClick={() => removeItem('medicalConditions', index)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {profile.medicalConditions.length === 0 && <span className="text-muted-foreground text-sm">No conditions recorded</span>}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add medical condition..."
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('medicalConditions', newCondition)}
                />
                <Button
                  onClick={() => addItem('medicalConditions', newCondition)}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional medical information, preferences, or notes..."
              value={profile.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}