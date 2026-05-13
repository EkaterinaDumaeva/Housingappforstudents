import { useState } from 'react';
import { Settings, LogOut, User as UserIcon, Users, Briefcase, MessageCircle, FileText, Star, MapPin, Calendar, Plus, Edit, Trash2, X, Award, Globe, Link as LinkIcon, GraduationCap, Lightbulb, Send, CheckCircle, XCircle, Shield } from 'lucide-react';
import { User } from './AuthModal';
import { CreateJobModal, NewJob } from './CreateJobModal';
import { SendJobOfferModal } from './SendJobOfferModal';
import { ReliabilityProfile, ReliabilityData } from './ReliabilityProfile';
import { CandidateSearch } from './CandidateSearch';

interface EmployerDashboardProps {
  user: User;
  onAccountSettings: () => void;
  onLogout: () => void;
  onSendJobOffer?: (candidateId: string, offerData: any) => void;
  onVerificationClick: () => void;
}

type EmployerTab = 'jobs' | 'candidates' | 'messages';

export interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  duration: string;
  salary: string;
  applicants: number;
  status: 'active' | 'inactive';
  postedDate: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

// Initial mock job postings
const initialMockJobs: Job[] = [];

// Mock candidates
const mockCandidates: Array<{
  id: string;
  name: string;
  photo: string;
  jobTitle: string;
  location: string;
  visaStatus: string;
  availableFrom: string;
  status: 'applied' | 'interviewing';
}> = [];

// Mock messages
const mockMessages: Array<{
  id: string;
  candidateName: string;
  candidatePhoto: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle: string;
}> = [];

export function EmployerDashboard({ user, onAccountSettings, onLogout, onSendJobOffer, onVerificationClick }: EmployerDashboardProps) {
  const [activeTab, setActiveTab] = useState<EmployerTab>('jobs');
  const [jobs, setJobs] = useState<Job[]>(initialMockJobs);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<User | typeof mockCandidates[0] | null>(null);
  const [showCandidateProfile, setShowCandidateProfile] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSendOfferModal, setShowSendOfferModal] = useState(false);

  // Mock employer reliability data - in production this would come from the backend
  const employerReliability: ReliabilityData = user.reliability || {
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
    badges: user.isVerified ? ['Verified Employer'] : []
  };

  const handleCreateJob = (newJobData: NewJob) => {
    const newJob: Job = {
      id: `j${Date.now()}`,
      title: newJobData.title,
      location: newJobData.location,
      type: newJobData.type,
      duration: newJobData.duration,
      salary: newJobData.salary,
      applicants: 0,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
      description: newJobData.description,
      requirements: newJobData.requirements,
      benefits: newJobData.benefits
    };
    setJobs([newJob, ...jobs]);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const handleViewProfile = (candidate: typeof mockCandidates[0]) => {
    setSelectedCandidate(candidate);
    setShowCandidateProfile(true);
  };

  const handleMessageCandidate = (candidate: typeof mockCandidates[0]) => {
    setSelectedCandidate(candidate);
    setShowMessageModal(true);
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message to:', selectedCandidate?.name, message);
    // In production, this would call backend API to send message
    alert(`Message sent to ${selectedCandidate?.name}!`);
    setShowMessageModal(false);
    setSelectedCandidate(null);
  };

  const handleSendJobOffer = (offerData: any) => {
    if (selectedCandidate && onSendJobOffer) {
      onSendJobOffer(selectedCandidate.id, {
        ...offerData,
        candidateName: selectedCandidate.name,
        candidateEmail: 'candidate@email.com', // Would come from candidate data
        employerName: user.employerProfile?.businessName || user.name,
        employerPhoto: user.profilePhoto,
        employerVerified: user.isVerified
      });
      alert(`Job offer sent to ${selectedCandidate.name}!`);
      setShowSendOfferModal(false);
    }
  };

  const handleSendOfferClick = (candidate: typeof mockCandidates[0]) => {
    setSelectedCandidate(candidate);
    setShowSendOfferModal(true);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user.name}!
                </h1>
                {user.isVerified && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 rounded-full border border-green-200/60 dark:border-green-800/60">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                    <span className="text-sm font-bold text-green-900 dark:text-green-200">Verified</span>
                  </div>
                )}
              </div>
              {user.employerProfile && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>{user.employerProfile.businessName}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onAccountSettings}
                className="relative w-10 h-10 rounded-full overflow-hidden transition-all hover:scale-105 ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-primary"
                aria-label="Profile Settings"
                title="Profile & Settings"
              >
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Verification Status Banner */}
          {!user.isVerified && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3 mb-4">
              <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm text-orange-900 dark:text-orange-300 mb-1 font-semibold">Complete Your Verification</h3>
                <p className="text-xs text-orange-700 dark:text-orange-400 mb-3">
                  Get verified to build trust with candidates and increase your credibility as an employer
                </p>
                <button
                  onClick={onVerificationClick}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm active:scale-[0.98] transition-transform hover:bg-orange-700"
                >
                  Start Verification
                </button>
              </div>
            </div>
          )}

          {user.isVerified && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-sm text-green-900 dark:text-green-300 font-semibold">Verified Employer</h3>
                <p className="text-xs text-green-700 dark:text-green-400">Your account is verified and trusted by candidates</p>
              </div>
            </div>
          )}

          {/* Employer Rating */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <ReliabilityProfile userType="host" data={employerReliability} compact customLabel="Employer Rating" isOwnProfile={true} />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-around gap-2 border-b border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`group relative flex flex-col items-center justify-center px-4 py-3 transition-all flex-1 ${
                activeTab === 'jobs'
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Job Postings"
            >
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-br from-primary/20 to-purple-500/20 scale-110'
                  : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
              }`}>
                <Briefcase className="w-5 h-5" />
                {jobs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {jobs.length}
                  </span>
                )}
              </div>
              {activeTab === 'jobs' && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`group relative flex flex-col items-center justify-center px-4 py-3 transition-all flex-1 ${
                activeTab === 'candidates'
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Candidates"
            >
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                activeTab === 'candidates'
                  ? 'bg-gradient-to-br from-primary/20 to-purple-500/20 scale-110'
                  : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
              }`}>
                <Users className="w-5 h-5" />
                {mockCandidates.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {mockCandidates.length}
                  </span>
                )}
              </div>
              {activeTab === 'candidates' && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`group relative flex flex-col items-center justify-center px-4 py-3 transition-all flex-1 ${
                activeTab === 'messages'
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Messages"
            >
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-br from-primary/20 to-purple-500/20 scale-110'
                  : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
              }`}>
                <MessageCircle className="w-5 h-5" />
                {mockMessages.filter(m => m.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {mockMessages.filter(m => m.unread).length}
                  </span>
                )}
              </div>
              {activeTab === 'messages' && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'jobs' && (
          <div className="p-6 space-y-4">
            {/* Post New Job Button */}
            <button
              onClick={() => setShowCreateJob(true)}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-purple-700 text-white rounded-xl p-5 hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Post New Job</div>
                  <div className="text-sm text-white/90">Create a job posting to attract qualified candidates</div>
                </div>
              </div>
            </button>

            {/* Job Listings */}
            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">No Job Postings</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Post your first job above
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{job.location}</span>
                          </div>
                          <span>•</span>
                          <span>{job.type}</span>
                          <span>•</span>
                          <span className="font-semibold text-primary">{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          job.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {job.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {job.applicants} applicants
                        </span>
                        <button
                          onClick={() => alert(`Viewing job: ${job.title}\n\nApplicants: ${job.applicants}\nStatus: ${job.status}\nPosted: ${new Date(job.postedDate).toLocaleDateString()}\n\nFull job management interface coming soon!`)}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'candidates' && (
          <CandidateSearch
            onContactCandidate={(candidate) => {
              setShowSendOfferModal(true);
              setSelectedCandidate(candidate);
            }}
          />
        )}

        {activeTab === 'messages' && (
          <div className="p-6 space-y-3">
            {mockMessages.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-1">No Messages Yet</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Candidate messages will appear here
                </p>
              </div>
            ) : (
              <>
                {mockMessages.map((message) => (
                  <div key={message.id} className={`bg-white dark:bg-slate-800 border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group ${
                    message.unread
                      ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={message.candidatePhoto}
                          alt={message.candidateName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                        {message.unread && (
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full ring-2 ring-white dark:ring-slate-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold truncate ${
                              message.unread
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {message.candidateName}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{message.jobTitle}</p>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">{message.timestamp}</span>
                        </div>
                        <p className={`text-sm line-clamp-2 ${
                          message.unread
                            ? 'text-slate-700 dark:text-slate-300 font-medium'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {message.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateJob && (
        <CreateJobModal
          onClose={() => setShowCreateJob(false)}
          onCreate={handleCreateJob}
        />
      )}

      {/* Candidate Profile Modal */}
      {showCandidateProfile && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCandidate.photo}
                  alt={selectedCandidate.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                  <p className="text-sm text-white/90">{selectedCandidate.jobTitle}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCandidateProfile(false);
                  setSelectedCandidate(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Location</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCandidate.location}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Visa Status</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCandidate.visaStatus}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Available From</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCandidate.availableFrom}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Status</span>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedCandidate.status === 'interviewing'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}>
                    {selectedCandidate.status === 'interviewing' ? 'Interviewing' : 'Applied'}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Applied For</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">{selectedCandidate.jobTitle}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCandidateProfile(false);
                    handleSendOfferClick(selectedCandidate);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  Send Job Offer
                </button>
                <button
                  onClick={() => {
                    setShowCandidateProfile(false);
                    handleMessageCandidate(selectedCandidate);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setShowCandidateProfile(false);
                    setSelectedCandidate(null);
                  }}
                  className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Job Offer Modal */}
      {showSendOfferModal && selectedCandidate && (
        <SendJobOfferModal
          onClose={() => {
            setShowSendOfferModal(false);
            setSelectedCandidate(null);
          }}
          onSubmit={handleSendJobOffer}
          candidateName={selectedCandidate.name}
        />
      )}

      {/* Message Candidate Modal */}
      {showMessageModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Send Message</h2>
                  <p className="text-sm text-white/90">To: {selectedCandidate.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedCandidate(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const message = formData.get('message') as string;
                if (message.trim()) {
                  handleSendMessage(message);
                }
              }}
              className="p-6 space-y-4"
            >
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={selectedCandidate.photo}
                    alt={selectedCandidate.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedCandidate.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{selectedCandidate.jobTitle}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={8}
                  required
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMessageModal(false);
                    setSelectedCandidate(null);
                  }}
                  className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
