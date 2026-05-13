import { useState } from 'react';
import { Save, X, Calendar, MapPin, Briefcase, FileText, User as UserIcon } from 'lucide-react';
import { User } from './AuthModal';

interface EditParticipantProfileProps {
  user: User;
  onSave: (updatedProfile: User['participantProfile']) => void;
  onCancel: () => void;
}

export function EditParticipantProfile({ user, onSave, onCancel }: EditParticipantProfileProps) {
  const [gender, setGender] = useState(user.participantProfile?.gender || 'male');
  const [dateOfBirth, setDateOfBirth] = useState(user.participantProfile?.dateOfBirth || '');
  const [participantType, setParticipantType] = useState(user.participantProfile?.participantType || 'student-j1');
  const [destinationCity, setDestinationCity] = useState(user.participantProfile?.destinationCity || '');
  const [arrivalDate, setArrivalDate] = useState(user.participantProfile?.arrivalDate || '');
  const [departureDate, setDepartureDate] = useState(user.participantProfile?.departureDate || '');
  const [workplace, setWorkplace] = useState(user.participantProfile?.workplace || '');
  const [jobStatus, setJobStatus] = useState(user.participantProfile?.jobStatus || 'job-confirmed');
  const [visaStatus, setVisaStatus] = useState(user.participantProfile?.visaStatus || 'visa-approved');
  const [interviewDate, setInterviewDate] = useState(user.participantProfile?.interviewDate || '');

  const handleSave = () => {
    const newProfile: User['participantProfile'] = {
      firstName: user.participantProfile?.firstName || '',
      lastName: user.participantProfile?.lastName || '',
      gender,
      dateOfBirth,
      participantType,
      destinationCity,
      arrivalDate,
      departureDate,
      workplace,
      jobStatus,
      visaStatus
    };

    // Only include interviewDate if visa status is 'interview-scheduled'
    // This ensures old interviewDate is removed when status changes
    if (visaStatus === 'interview-scheduled') {
      newProfile.interviewDate = interviewDate;
    }

    onSave(newProfile);
  };

  const participantTypeOptions = [
    { value: 'student-j1', label: 'Student J1' },
    { value: 'seasonal-worker', label: 'Seasonal Worker' },
    { value: 'intern-trainee', label: 'Intern/Trainee' },
    { value: 'exchange-program', label: 'Exchange Program Participant' },
    { value: 'temporary-worker', label: 'Temporary Worker' },
    { value: 'other', label: 'Other' }
  ];

  const jobStatusOptions = [
    { value: 'job-confirmed', label: 'Job Confirmed' },
    { value: 'waiting-confirmation', label: 'Waiting for Job Confirmation' },
    { value: 'looking-for-job', label: 'Looking for Job' },
    { value: 'self-employed', label: 'Self-Employed' },
    { value: 'not-working', label: 'Not Working' }
  ];

  const visaStatusOptions = [
    { value: 'visa-approved', label: 'Visa Approved' },
    { value: 'interview-scheduled', label: 'Interview Scheduled' },
    { value: 'waiting-approval', label: 'Waiting Approval' },
    { value: 'visa-not-required', label: 'Visa Not Required' },
    { value: 'work-authorization', label: 'Work Authorization Already Available' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between mb-2">
          <h2>Edit Profile</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Update your travel and work information
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Gender and Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>Gender <span className="text-destructive">*</span></span>
              </div>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date of Birth <span className="text-destructive">*</span></span>
              </div>
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            />
          </div>
        </div>

        {/* Participant Type */}
        <div>
          <label className="block mb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Participant Type</span>
            </div>
          </label>
          <select
            value={participantType}
            onChange={(e) => setParticipantType(e.target.value)}
            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {participantTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Destination City */}
        <div>
          <label className="block mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Destination City <span className="text-destructive">*</span></span>
            </div>
          </label>
          <input
            type="text"
            value={destinationCity}
            onChange={(e) => setDestinationCity(e.target.value)}
            placeholder="New York, NY"
            required
            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Arrival Date <span className="text-destructive">*</span></span>
              </div>
            </label>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            />
          </div>
          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Departure Date <span className="text-destructive">*</span></span>
              </div>
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
              min={arrivalDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            />
          </div>
        </div>

        {/* Workplace */}
        <div>
          <label className="block mb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Workplace/Employer <span className="text-destructive">*</span></span>
            </div>
          </label>
          <input
            type="text"
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            placeholder="Company name or TBD"
            required
            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Job Status */}
        <div>
          <label className="block mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Job Status</span>
            </div>
          </label>
          <select
            value={jobStatus}
            onChange={(e) => setJobStatus(e.target.value)}
            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {jobStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Visa Status */}
        <div>
          <label className="block mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Visa Status</span>
            </div>
          </label>
          <select
            value={visaStatus}
            onChange={(e) => setVisaStatus(e.target.value)}
            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {visaStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Interview Date (conditional) */}
        {visaStatus === 'interview-scheduled' && (
          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Interview Date <span className="text-destructive">*</span></span>
              </div>
            </label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            />
          </div>
        )}

        {/* Save Button */}
        <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t border-border -mx-4 px-4">
          <button
            onClick={handleSave}
            disabled={!gender || !dateOfBirth || !destinationCity || !arrivalDate || !departureDate || !workplace}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
