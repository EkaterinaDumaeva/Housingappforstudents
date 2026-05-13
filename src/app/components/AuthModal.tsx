import { useState } from 'react';
import { X, Mail, Lock, User, Home, Briefcase, Calendar, Eye, EyeOff, Building2 } from 'lucide-react';
import { getSupabaseClient } from '../../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { ReliabilityData } from './ReliabilityProfile';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  onAuthError?: (error: string) => void;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'host' | 'participant' | 'employer';
  isVerified?: boolean;
  profilePhoto?: string;
  reliability?: ReliabilityData;
  participantProfile?: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    participantType: string;
    destinationCity: string;
    arrivalDate: string;
    departureDate: string;
    workplace: string;
    jobStatus: string;
    visaStatus: string;
    interviewDate?: string;
    jobSeekingStatus?: 'actively-looking' | 'open-to-offers' | 'not-looking' | 'employed';
    // Professional Information
    education?: {
      school: string;
      degree: string;
      fieldOfStudy: string;
      graduationDate: string;
    }[];
    skills?: string[];
    workExperience?: {
      jobTitle: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      currentJob: boolean;
      description: string;
    }[];
    desiredJobTypes?: string[];
    desiredSchedule?: string[];
    languages?: string[];
    certifications?: string[];
    bio?: string;
    referencesAvailable?: boolean;
    linkedIn?: string;
    portfolioWebsite?: string;
  };
  hostProfile?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    hostType: string;
  };
  employerProfile?: {
    firstName: string;
    lastName: string;
    businessName: string;
    phoneNumber: string;
  };
}

export function AuthModal({ onClose, onAuthSuccess, onAuthError }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [userType, setUserType] = useState<'host' | 'participant' | 'employer'>('participant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  // Host-specific fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hostType, setHostType] = useState('property-owner');

  // Employer-specific fields
  const [businessName, setBusinessName] = useState('');

  // Participant-specific fields
  const [gender, setGender] = useState('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [participantType, setParticipantType] = useState('student-j1');
  const [destinationCity, setDestinationCity] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [jobStatus, setJobStatus] = useState('job-confirmed');
  const [visaStatus, setVisaStatus] = useState('visa-approved');
  const [interviewDate, setInterviewDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Get singleton Supabase client
    const supabase = getSupabaseClient();

    if (mode === 'signin') {
      try {
        // Sign in with Supabase Auth
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Incorrect email or password. Please try again.');
          } else {
            setError(signInError.message);
          }
          return;
        }

        if (!data.user) {
          setError('Sign in failed. Please try again.');
          return;
        }

        // Get user profile from backend
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ac1efd/user/${data.user.id}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          setError('Failed to load user profile');
          return;
        }

        const { profile } = await response.json();

        // Successful sign in
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: profile.name,
          userType: profile.userType,
          isVerified: profile.isVerified,
          hostProfile: profile.hostProfile,
          participantProfile: profile.participantProfile,
          employerProfile: profile.employerProfile,
        };

        onAuthSuccess(user);
        onClose();
      } catch (err) {
        console.error('Sign in error:', err);
        setError('Failed to sign in. Please try again.');
      }
    } else {
      // Sign up mode
      const newUser: User & { password: string } = {
        id: '',
        email,
        password,
        name: `${firstName} ${lastName}`,
        userType,
        isVerified: false
      };

      if (userType === 'participant') {
        newUser.participantProfile = {
          firstName,
          lastName,
          gender,
          dateOfBirth,
          participantType,
          destinationCity,
          arrivalDate,
          departureDate,
          workplace,
          jobStatus,
          visaStatus,
          ...(visaStatus === 'interview-scheduled' && { interviewDate })
        };
      }

      if (userType === 'host') {
        newUser.hostProfile = {
          firstName,
          lastName,
          phoneNumber,
          hostType
        };
      }

      if (userType === 'employer') {
        newUser.employerProfile = {
          firstName,
          lastName,
          businessName,
          phoneNumber
        };
      }

      try {
        // Create account via backend API
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ac1efd/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password,
            name: `${firstName} ${lastName}`,
            userType,
            hostProfile: newUser.hostProfile,
            participantProfile: newUser.participantProfile,
            employerProfile: newUser.employerProfile,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Failed to create account');
          return;
        }

        const { user: createdUser } = await response.json();

        // Successful sign up - NOTE: Email verification is auto-confirmed for this prototype
        // In production, users would receive a verification email
        onAuthSuccess(createdUser);
        onClose();
      } catch (err) {
        console.error('Sign up error:', err);
        setError('Failed to create account. Please try again.');
      }
    }
  };

  const hostTypeOptions = [
    { value: 'property-owner', label: 'Property Owner' },
    { value: 'property-manager', label: 'Property Manager' },
    { value: 'company', label: 'Company' },
    { value: 'other', label: 'Other' }
  ];

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <h2>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block mb-2">I am a</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('participant')}
                    className={`p-4 rounded-xl border transition-colors ${
                      userType === 'participant'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:bg-accent'
                    }`}
                  >
                    <Briefcase className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">Participant</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('host')}
                    className={`p-4 rounded-xl border transition-colors ${
                      userType === 'host'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:bg-accent'
                    }`}
                  >
                    <Home className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">Host</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('employer')}
                    className={`p-4 rounded-xl border transition-colors ${
                      userType === 'employer'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:bg-accent'
                    }`}
                  >
                    <Building2 className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm">Employer</div>
                  </button>
                </div>
              </div>

              {userType === 'employer' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2">First Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Last Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Business Name <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="ABC Company Inc."
                      required
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Phone Number <span className="text-destructive">*</span></label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </>
              ) : userType === 'participant' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2">First Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Last Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2">Gender <span className="text-destructive">*</span></label>
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
                      <label className="block mb-2">Date of Birth <span className="text-destructive">*</span></label>
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

                  <div>
                    <label className="block mb-2">Participant Type</label>
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

                  <div className="pt-4 border-t border-border">
                    <h3 className="mb-4">Travel & Housing Info</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2">Destination City <span className="text-destructive">*</span></label>
                        <input
                          type="text"
                          value={destinationCity}
                          onChange={(e) => setDestinationCity(e.target.value)}
                          placeholder="New York, NY"
                          required
                          className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-2">Arrival Date <span className="text-destructive">*</span></label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            <input
                              type="date"
                              value={arrivalDate}
                              onChange={(e) => setArrivalDate(e.target.value)}
                              required
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full pl-11 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-2">Departure Date <span className="text-destructive">*</span></label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            <input
                              type="date"
                              value={departureDate}
                              onChange={(e) => setDepartureDate(e.target.value)}
                              required
                              min={arrivalDate || new Date().toISOString().split('T')[0]}
                              className="w-full pl-11 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2">Workplace/Employer <span className="text-destructive">*</span></label>
                        <input
                          type="text"
                          value={workplace}
                          onChange={(e) => setWorkplace(e.target.value)}
                          placeholder="Company name or TBD"
                          required
                          className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">Job Status</label>
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

                      <div>
                        <label className="block mb-2">Visa Status</label>
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

                      {visaStatus === 'interview-scheduled' && (
                        <div>
                          <label className="block mb-2">Interview Date <span className="text-destructive">*</span></label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            <input
                              type="date"
                              value={interviewDate}
                              onChange={(e) => setInterviewDate(e.target.value)}
                              required
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full pl-11 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2">First Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Last Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Phone Number <span className="text-destructive">*</span></label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Host Type</label>
                    <select
                      value={hostType}
                      onChange={(e) => setHostType(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {hostTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="block mb-2">Email <span className="text-destructive">*</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Password <span className="text-destructive">*</span></label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="bg-accent/30 border border-border rounded-xl p-3 text-xs text-muted-foreground">
              <strong>Note:</strong> All information you provide will be securely saved to your account profile and can be viewed in your account settings.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.98] transition-transform"
          >
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="text-sm text-primary hover:underline"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
