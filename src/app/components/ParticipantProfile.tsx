import { User, Calendar, Briefcase, MapPin, FileText, CheckCircle, Settings } from 'lucide-react';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';

interface ParticipantProfileProps {
  user: import('./AuthModal').User;
  onAccountSettings: () => void;
  onPhotoChange: (photoUrl: string) => void;
}

export function ParticipantProfile({ user, onAccountSettings, onPhotoChange }: ParticipantProfileProps) {
  const profile = user.participantProfile;

  if (!profile) {
    return null;
  }

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

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderLabel = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
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

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="mb-2">My Profile</h2>
            <p className="text-sm text-muted-foreground">Welcome, {profile.firstName}!</p>
          </div>
          <button
            onClick={onAccountSettings}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Account Info</span>
          </button>
        </div>

        {/* Profile Photo */}
        <div className="mb-4 flex justify-center">
          <ProfilePhotoUpload
            currentPhoto={user.profilePhoto}
            userName={`${profile.firstName} ${profile.lastName}`}
            onPhotoChange={onPhotoChange}
          />
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          <div className={`px-3 py-1.5 rounded-full text-xs border ${getStatusBadgeColor(profile.visaStatus, 'visa')}`}>
            {getVisaStatusLabel(profile.visaStatus)}
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs border ${getStatusBadgeColor(profile.jobStatus, 'job')}`}>
            {getJobStatusLabel(profile.jobStatus)}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div>{profile.firstName} {profile.lastName}</div>
              </div>
            </div>
            {profile.gender && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div>{getGenderLabel(profile.gender)}</div>
                </div>
              </div>
            )}
            {profile.dateOfBirth && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Age</div>
                  <div>{calculateAge(profile.dateOfBirth)} years old</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Participant Type</div>
                <div>{getParticipantTypeLabel(profile.participantType)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="mb-4">Travel & Housing Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Destination</div>
                <div>{profile.destinationCity}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Travel Dates</div>
                <div>{formatDate(profile.arrivalDate)} - {formatDate(profile.departureDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Workplace/Employer</div>
                <div>{profile.workplace}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="mb-4">Job & Visa Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Job Status</div>
                <div className="flex items-center gap-2">
                  {profile.jobStatus === 'job-confirmed' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span>{getJobStatusLabel(profile.jobStatus)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Visa Status</div>
                <div className="flex items-center gap-2">
                  {profile.visaStatus === 'visa-approved' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span>{getVisaStatusLabel(profile.visaStatus)}</span>
                </div>
                {profile.visaStatus === 'interview-scheduled' && profile.interviewDate && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Interview: {formatDate(profile.interviewDate)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent/30 border border-border rounded-xl p-4">
          <h4 className="text-sm mb-2">Next Steps</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            {profile.jobStatus !== 'job-confirmed' && (
              <li>• Confirm your job placement</li>
            )}
            {profile.visaStatus === 'waiting-approval' && (
              <li>• Complete visa application process</li>
            )}
            {profile.visaStatus === 'interview-scheduled' && (
              <li>• Prepare for visa interview</li>
            )}
            <li>• Browse housing options in {profile.destinationCity}</li>
            <li>• Book your housing before {formatDate(profile.arrivalDate)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
