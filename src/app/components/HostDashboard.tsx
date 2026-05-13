import { useState } from 'react';
import { CheckCircle, XCircle, Plus, Edit, Trash2, Settings, Home, DollarSign, Eye, TrendingUp, Star, AlertTriangle, Bell, User as UserIcon, MessageCircle, Calendar, LayoutList, FileText, ScrollText, X } from 'lucide-react';
import { User } from './AuthModal';
import { Housing } from './HousingCard';
import { HostReservations } from './HostReservations';
import { HostOpenCaseModal, HostCaseData } from './HostOpenCaseModal';
import { UploadDocumentModal } from './UploadDocumentModal';

interface HostDashboardProps {
  user: User;
  listings: Housing[];
  onCreateListing: () => void;
  onVerificationClick: () => void;
  onDeleteListing: (id: string) => void;
  onAccountSettings: () => void;
  onViewCases: () => void;
  newCasesCount?: number;
  onUpdateListingDocuments?: (listingId: string, rentalAgreement?: string, houseRules?: string) => void;
}

type HostTab = 'listings' | 'bookings' | 'messages' | 'cases';

interface CaseSubmission {
  reservationId: string;
  participantName: string;
  participantEmail: string;
  listingTitle: string;
}

// Mock bookings data - would come from backend in production
const mockBookings: Array<{
  id: string;
  listingTitle: string;
  participantName: string;
  participantEmail: string;
  participantPhoto: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'in-progress';
  price: number;
  nights: number;
}> = [];

// Mock messages data
const mockMessages: Array<{
  id: string;
  participantName: string;
  participantPhoto: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  listingTitle: string;
}> = [];

export function HostDashboard({ user, listings, onCreateListing, onVerificationClick, onDeleteListing, onAccountSettings, onViewCases, newCasesCount = 0, onUpdateListingDocuments }: HostDashboardProps) {
  const [activeTab, setActiveTab] = useState<HostTab>('listings');
  const [showOpenCaseModal, setShowOpenCaseModal] = useState(false);
  const [caseSubmission, setCaseSubmission] = useState<CaseSubmission | null>(null);
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);
  const [uploadDocumentType, setUploadDocumentType] = useState<'rental-agreement' | 'house-rules'>('rental-agreement');
  const [selectedListingForUpload, setSelectedListingForUpload] = useState<Housing | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null);

  const handleOpenCase = (reservationId: string, participantName: string, participantEmail: string, listingTitle: string) => {
    setCaseSubmission({ reservationId, participantName, participantEmail, listingTitle });
    setShowOpenCaseModal(true);
  };

  const handleUploadDocument = (listing: Housing, type: 'rental-agreement' | 'house-rules') => {
    setSelectedListingForUpload(listing);
    setUploadDocumentType(type);
    setShowUploadDocumentModal(true);
  };

  const handleDocumentSubmit = (content: string, type: 'rental-agreement' | 'house-rules') => {
    if (selectedListingForUpload && onUpdateListingDocuments) {
      const currentListing = selectedListingForUpload as any;
      onUpdateListingDocuments(
        selectedListingForUpload.id,
        type === 'rental-agreement' ? content : currentListing.rentalAgreement,
        type === 'house-rules' ? content : currentListing.houseRules
      );
    }
  };

  const handleMessageClick = (message: typeof mockMessages[0]) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const handleSendMessage = (messageText: string) => {
    console.log('Sending message to:', selectedMessage?.participantName, messageText);
    // In production, this would call backend API to send message
    alert(`Message sent to ${selectedMessage?.participantName}!`);
    setShowMessageModal(false);
    setSelectedMessage(null);
  };

  const handleSubmitCase = (caseData: HostCaseData) => {
    if (!caseSubmission) return;

    const fullCaseData = {
      ...caseSubmission,
      ...caseData,
      hostName: user.name,
      hostEmail: user.email,
      submittedAt: new Date().toISOString()
    };

    console.log('Host case submitted:', fullCaseData);

    // TODO: In production, this would call backend API to:
    // 1. Store case in database
    // 2. Send email notification to participant
    // 3. Send notification to Voya Link support team
    // 4. Create notification in participant's account
    // 5. If fine is included, initiate payment collection process

    console.log(`📧 Email notification sent to participant: ${caseSubmission.participantEmail}`);
    console.log(`📧 Email notification sent to Voya Link support team`);

    if (caseData.includeFine) {
      console.log(`💰 Fine of $${caseData.fineAmount} requested`);
      console.log(`📋 Fine reason: ${caseData.fineReason}`);
    }

    setShowOpenCaseModal(false);
    setCaseSubmission(null);

    alert(
      `✓ Case Submitted Successfully!\n\n` +
      `Your case has been sent to:\n` +
      `• Participant: ${caseSubmission.participantName} (${caseSubmission.participantEmail})\n` +
      `• Voya Link Support Team\n\n` +
      (caseData.includeFine ? `Fine Requested: $${caseData.fineAmount}\n` : '') +
      `The case will be reviewed and both parties will be contacted. You can track the status in the Cases section.`
    );
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

  const averageRating = listings.length > 0
    ? (listings.reduce((sum, listing) => sum + listing.rating, 0) / listings.length).toFixed(1)
    : '0.0';

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
                {listings.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-900/10 rounded-full border border-yellow-200/60 dark:border-yellow-800/60">
                    <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500" />
                    <span className="text-sm font-bold text-yellow-900 dark:text-yellow-200">{averageRating}</span>
                  </div>
                )}
              </div>
              {user.hostProfile && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>{getHostTypeLabel(user.hostProfile.hostType)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onViewCases}
                className="relative flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Cases</span>
                {newCasesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {newCasesCount}
                  </span>
                )}
              </button>
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
            </div>
          </div>

          {/* New Cases Notification Banner */}
          {newCasesCount > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 mb-4">
              <Bell className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
              <div className="flex-1">
                <h3 className="text-sm text-red-900 dark:text-red-300 mb-1 font-semibold">
                  {newCasesCount} New Case{newCasesCount > 1 ? 's' : ''} Requiring Your Attention
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400 mb-3">
                  {newCasesCount > 1 ? 'Participants have' : 'A participant has'} reported {newCasesCount > 1 ? 'issues' : 'an issue'} with {newCasesCount > 1 ? 'your properties' : 'your property'}. Please respond promptly to maintain good participant relations.
                </p>
                <button
                  onClick={onViewCases}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm active:scale-[0.98] transition-transform font-medium hover:bg-red-700"
                >
                  View Cases
                </button>
              </div>
            </div>
          )}

          {/* Verification Status Banner */}
          {!user.isVerified && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-3 mb-4">
              <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm text-orange-900 dark:text-orange-300 mb-1 font-semibold">Complete Your Verification</h3>
                <p className="text-xs text-orange-700 dark:text-orange-400 mb-3">
                  Get verified to build trust with participants and increase your booking potential
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
                <h3 className="text-sm text-green-900 dark:text-green-300 font-semibold">Verified Host</h3>
                <p className="text-xs text-green-700 dark:text-green-400">Your account is verified and trusted by participants</p>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => setActiveTab('listings')}
              className={`group relative flex items-center gap-2 px-4 py-3 transition-all ${
                activeTab === 'listings'
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <LayoutList className="w-4.5 h-4.5" />
              <span className="text-sm font-semibold">My Listings</span>
              {activeTab === 'listings' && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`group relative flex items-center gap-2 px-4 py-3 transition-all ${
                activeTab === 'bookings'
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" />
              <span className="text-sm font-semibold">Bookings</span>
              {mockBookings.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-semibold">
                  {mockBookings.length}
                </span>
              )}
              {activeTab === 'bookings' && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`group relative flex items-center gap-2 px-4 py-3 transition-all ${
                activeTab === 'messages'
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span className="text-sm font-semibold">Messages</span>
              {activeTab === 'messages' && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`group relative flex items-center gap-2 px-4 py-3 transition-all ${
                activeTab === 'cases'
                  ? 'text-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <AlertTriangle className="w-4.5 h-4.5" />
              <span className="text-sm font-semibold">Cases</span>
              {newCasesCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full font-semibold">
                  {newCasesCount}
                </span>
              )}
              {activeTab === 'cases' && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'listings' && (
          <div className="p-6 space-y-4">
            {/* Add Listing Button - Compact and prominent */}
            <button
              onClick={onCreateListing}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-purple-700 text-white rounded-xl p-4 hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add New Listing</span>
              </div>
            </button>

            {/* Listings Grid - Compact */}
            {listings.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">No Listings Yet</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Create your first listing above
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg hover:border-primary/50 transition-all group">
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        {listing.hostVerified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-md">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-0.5 truncate text-slate-900 dark:text-white">{listing.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate mb-2">{listing.location}</p>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 font-semibold text-primary">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>${listing.price}/mo</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{listing.rating}</span>
                            <span className="text-xs text-slate-500">({listing.reviewCount})</span>
                          </div>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                            {listing.availability}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onDeleteListing(listing.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Document Upload Buttons */}
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                      <button
                        onClick={() => handleUploadDocument(listing, 'rental-agreement')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          (listing as any).rentalAgreement
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {(listing as any).rentalAgreement ? 'Agreement ✓' : 'Upload Agreement'}
                      </button>
                      <button
                        onClick={() => handleUploadDocument(listing, 'house-rules')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          (listing as any).houseRules
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                        }`}
                      >
                        <ScrollText className="w-3.5 h-3.5" />
                        {(listing as any).houseRules ? 'Rules ✓' : 'Upload Rules'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <HostReservations onOpenCase={handleOpenCase} />
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
                  Participant messages will appear here
                </p>
              </div>
            ) : (
              <>
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`bg-white dark:bg-slate-800 border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group ${
                      message.unread
                        ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={message.participantPhoto}
                          alt={message.participantName}
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
                              {message.participantName}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{message.listingTitle}</p>
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

        {activeTab === 'cases' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cases</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage participant-reported issues and disputes
              </p>
            </div>

            {newCasesCount > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <h3 className="text-sm text-red-900 dark:text-red-300 mb-1 font-semibold">
                      {newCasesCount} Pending Case{newCasesCount > 1 ? 's' : ''}
                    </h3>
                    <p className="text-xs text-red-700 dark:text-red-400 mb-3">
                      {newCasesCount > 1 ? 'Participants have' : 'A participant has'} reported {newCasesCount > 1 ? 'issues' : 'an issue'}. Please respond promptly.
                    </p>
                    <button
                      onClick={onViewCases}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm active:scale-[0.98] transition-transform font-medium hover:bg-red-700"
                    >
                      View All Cases
                    </button>
                  </div>
                </div>
              </div>
            )}

            {newCasesCount === 0 && (
              <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No pending cases at the moment
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Host Open Case Modal */}
      {showOpenCaseModal && caseSubmission && (
        <HostOpenCaseModal
          onClose={() => {
            setShowOpenCaseModal(false);
            setCaseSubmission(null);
          }}
          onSubmit={handleSubmitCase}
          participantName={caseSubmission.participantName}
          participantEmail={caseSubmission.participantEmail}
          reservationId={caseSubmission.reservationId}
          listingTitle={caseSubmission.listingTitle}
        />
      )}

      {/* Upload Document Modal */}
      {showUploadDocumentModal && selectedListingForUpload && (
        <UploadDocumentModal
          onClose={() => {
            setShowUploadDocumentModal(false);
            setSelectedListingForUpload(null);
          }}
          onSubmit={handleDocumentSubmit}
          documentType={uploadDocumentType}
          listingTitle={selectedListingForUpload.title}
          existingContent={
            uploadDocumentType === 'rental-agreement'
              ? (selectedListingForUpload as any).rentalAgreement
              : (selectedListingForUpload as any).houseRules
          }
        />
      )}

      {/* Message Response Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Reply to Message</h2>
                  <p className="text-sm text-white/90">From: {selectedMessage.participantName}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedMessage(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
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
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedMessage.participantPhoto}
                    alt={selectedMessage.participantName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedMessage.participantName}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{selectedMessage.listingTitle}</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{selectedMessage.timestamp}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selectedMessage.lastMessage}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Your Reply
                </label>
                <textarea
                  name="message"
                  rows={8}
                  required
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Send Reply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMessageModal(false);
                    setSelectedMessage(null);
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
