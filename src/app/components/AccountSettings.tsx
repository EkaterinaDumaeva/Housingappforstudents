import { useState } from 'react';
import { User, Mail, Phone, Briefcase, MapPin, Calendar, FileText, Building2, Edit, Save, X, Shield } from 'lucide-react';
import { User as UserType } from './AuthModal';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { ReliabilityProfile, ReliabilityData } from './ReliabilityProfile';
import { JobSeekingStatus } from './JobSeekingStatus';

interface AccountSettingsProps {
  user: UserType;
  onPhotoChange?: (photoUrl: string) => void;
  onUpdateProfile?: (updatedData: Partial<UserType>) => void;
}

export function AccountSettings({ user, onPhotoChange, onUpdateProfile }: AccountSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>(user);

  // Mock reliability data - in production this would come from the backend
  const getUserReliability = (): ReliabilityData => {
    if (user.reliability) {
      return user.reliability;
    }

    // Default reliability for new users
    return {
      reliabilityScore: 100,
      cancellationRate: 0,
      totalCancellations: 0,
      responseRate: 100,
      averageResponseTime: 'N/A',
      casesOpened: 0,
      casesResolved: 0,
      totalReservations: 0,
      verifications: {
        email: true,
        phone: false,
        identity: false,
        government: user.isVerified || false
      },
      strikes: 0,
      warnings: 0,
      badges: user.isVerified
        ? (user.userType === 'employer' ? ['Verified Employer'] : user.userType === 'host' ? ['Verified Host'] : [])
        : []
    };
  };
  const getStatusBadgeColor = (status: string, type: 'visa' | 'job') => {
    if (type === 'visa') {
      if (status === 'visa-approved') return 'bg-green-100 text-green-700 border-green-300';
      if (status === 'visa-not-required' || status === 'work-authorization') return 'bg-blue-100 text-blue-700 border-blue-300';
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else {
      if (status === 'job-confirmed') return 'bg-green-100 text-green-700 border-green-300';
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getHostTypeLabel = (value?: string) => {
    if (!value) return '';
    const labels: Record<string, string> = {
      'property-owner': 'Property Owner',
      'property-manager': 'Property Manager',
      'company': 'Company',
      'other': 'Other'
    };
    return labels[value] || value;
  };

  const getParticipantTypeLabel = (value: string) => {
    const labels: Record<string, string> = {
      'student-j1': 'Student J1',
      'seasonal-worker': 'Seasonal Worker',
      'intern-trainee': 'Intern/Trainee',
      'exchange-program': 'Exchange Program Participant',
      'temporary-worker': 'Temporary Worker',
      'other': 'Other'
    };
    return labels[value] || value;
  };

  const getJobStatusLabel = (value: string) => {
    const labels: Record<string, string> = {
      'job-confirmed': 'Job Confirmed',
      'waiting-confirmation': 'Waiting for Job Confirmation',
      'looking-for-job': 'Looking for Job',
      'self-employed': 'Self-Employed',
      'not-working': 'Not Working'
    };
    return labels[value] || value;
  };

  const getVisaStatusLabel = (value: string) => {
    const labels: Record<string, string> = {
      'visa-approved': 'Visa Approved',
      'interview-scheduled': 'Interview Scheduled',
      'waiting-approval': 'Waiting Approval',
      'visa-not-required': 'Visa Not Required',
      'work-authorization': 'Work Authorization Already Available',
      'other': 'Other'
    };
    return labels[value] || value;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="mb-2">Account Information</h2>
            <p className="text-sm text-muted-foreground">
              {user.userType === 'host' ? 'Host Account' : user.userType === 'employer' ? 'Employer Account' : 'Participant Account'}
            </p>
          </div>

          {/* Edit Info Button - Only for Host and Employer */}
          {(user.userType === 'host' || user.userType === 'employer') && onUpdateProfile && (
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Info
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Profile Photo */}
        {onPhotoChange && (
          <div className="mb-4 flex justify-center">
            <ProfilePhotoUpload
              currentPhoto={user.profilePhoto}
              userName={user.name}
              onPhotoChange={onPhotoChange}
            />
          </div>
        )}

        {/* Status Badges for Participants */}
        {user.userType === 'participant' && user.participantProfile && (
          <div className="flex flex-wrap gap-2 justify-center">
            <div className={`px-3 py-1.5 rounded-full text-xs border ${getStatusBadgeColor(user.participantProfile.visaStatus, 'visa')}`}>
              {getVisaStatusLabel(user.participantProfile.visaStatus)}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs border ${getStatusBadgeColor(user.participantProfile.jobStatus, 'job')}`}>
              {getJobStatusLabel(user.participantProfile.jobStatus)}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Job Seeking Status for Participants */}
        {user.userType === 'participant' && (
          <JobSeekingStatus
            currentStatus={user.participantProfile?.jobSeekingStatus}
            onStatusChange={(status) => {
              if (onUpdateProfile) {
                onUpdateProfile({
                  participantProfile: {
                    ...user.participantProfile!,
                    jobSeekingStatus: status
                  }
                });
              }
            }}
          />
        )}

        {/* Reliability Profile / Rating */}
        <div>
          <h3 className="mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {user.userType === 'employer' ? 'My Rating' : 'My Reliability Profile'}
          </h3>
          <ReliabilityProfile
            userType={user.userType === 'employer' ? 'host' : user.userType}
            data={getUserReliability()}
            customLabel={user.userType === 'employer' ? 'Employer Rating' : undefined}
            isOwnProfile={true}
          />
        </div>

        {/* Basic Account Info */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Full Name</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div>{user.name}</div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Email Address</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {user.email} <span className="text-xs">(cannot be changed)</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Account Type</div>
                <div className="capitalize">{user.userType}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Host-specific information */}
        {user.userType === 'host' && user.hostProfile && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="mb-4">Host Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.hostProfile?.phoneNumber || ''}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        hostProfile: { ...editedUser.hostProfile!, phoneNumber: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div>{user.hostProfile.phoneNumber}</div>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Host Type</div>
                  {isEditing ? (
                    <select
                      value={editedUser.hostProfile?.hostType || ''}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        hostProfile: { ...editedUser.hostProfile!, hostType: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="property-owner">Property Owner</option>
                      <option value="property-manager">Property Manager</option>
                      <option value="company">Company</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div>{getHostTypeLabel(user.hostProfile.hostType)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employer-specific information */}
        {user.userType === 'employer' && user.employerProfile && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="mb-4">Employer Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Business Name</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.employerProfile?.businessName || ''}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        employerProfile: { ...editedUser.employerProfile!, businessName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your Business Name"
                    />
                  ) : (
                    <div>{user.employerProfile.businessName}</div>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.employerProfile?.phoneNumber || ''}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        employerProfile: { ...editedUser.employerProfile!, phoneNumber: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div>{user.employerProfile.phoneNumber}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Participant-specific information */}
        {user.userType === 'participant' && user.participantProfile && (
          <>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="mb-4">Participant Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Participant Type</div>
                    <div>{getParticipantTypeLabel(user.participantProfile.participantType)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="mb-4">Travel & Housing Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Destination City</div>
                    <div>{user.participantProfile.destinationCity}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Arrival Date</div>
                    <div>{formatDate(user.participantProfile.arrivalDate)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Departure Date</div>
                    <div>{formatDate(user.participantProfile.departureDate)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Workplace/Employer</div>
                    <div>{user.participantProfile.workplace}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="mb-4">Job & Visa Status</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-2">Job Status</div>
                    <div className={`inline-block px-3 py-1.5 rounded-full text-sm border ${getStatusBadgeColor(user.participantProfile.jobStatus, 'job')}`}>
                      {getJobStatusLabel(user.participantProfile.jobStatus)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-2">Visa Status</div>
                    <div className={`inline-block px-3 py-1.5 rounded-full text-sm border ${getStatusBadgeColor(user.participantProfile.visaStatus, 'visa')}`}>
                      {getVisaStatusLabel(user.participantProfile.visaStatus)}
                    </div>
                    {user.participantProfile.visaStatus === 'interview-scheduled' && user.participantProfile.interviewDate && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Interview Date: {formatDate(user.participantProfile.interviewDate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-accent/30 border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This information was saved from your registration. All data is securely stored in your account profile.
          </p>
        </div>
      </div>
    </div>
  );
}
