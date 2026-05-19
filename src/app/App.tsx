import { useState, useEffect } from 'react';
import { SlidersHorizontal, Heart, User as UserIcon, LogOut, LayoutDashboard, Home, Search, MessageCircle, Bookmark, Calendar, Settings, Briefcase, Star, Building2, DollarSign, Clock, Shield, Car, Users, Gift, FileText, Plus, ChevronRight, CheckSquare, Trophy, Scale, Eye } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { HousingCard, Housing } from './components/HousingCard';
import { HousingDetails } from './components/HousingDetails';
import { BookingFlow } from './components/BookingFlow';
import { FilterSheet, FilterOptions } from './components/FilterSheet';
import { AuthModal, User } from './components/AuthModal';
import { HostDashboard } from './components/HostDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { CreateListingModal, NewListing } from './components/CreateListingModal';
import { VerificationModal } from './components/VerificationModal';
import { LaunchScreen } from './components/LaunchScreen';
import { AccountSettings } from './components/AccountSettings';
import { AdvancedFilters, AdvancedFilterOptions } from './components/AdvancedFilters';
import { InteractiveHousingMap } from './components/InteractiveHousingMap';
import { SavedListings } from './components/SavedListings';
import { Messages } from './components/Messages';
import { EditParticipantProfile } from './components/EditParticipantProfile';
import { HelpChat } from './components/HelpChat';
import { Reservations } from './components/Reservations';
import { OpenCaseModal } from './components/OpenCaseModal';
import { HostCases } from './components/HostCases';
import { JobCard, Job } from './components/JobCard';
import { JobDetails } from './components/JobDetails';
import { AgreementModal } from './components/AgreementModal';
import { JobOffersView, JobOffer } from './components/JobOffersView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ServiceHub } from './components/ServiceHub';
import { BecomeProviderModal, ProviderApplication } from './components/BecomeProviderModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ServiceListing } from './components/ServiceListingCard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ServiceProviderDashboard } from './components/ServiceProviderDashboard';
import { TaskCenter } from './components/TaskCenter';
import { CreateTaskModal, TaskData } from './components/CreateTaskModal';
import { Task, TaskCard } from './components/TaskCard';
import { TaskDetailModal } from './components/TaskDetailModal';
import { UploadProofModal } from './components/UploadProofModal';
import { HostReviewTaskModal } from './components/HostReviewTaskModal';
import { RewardSelectionModal } from './components/RewardSelectionModal';
import { GoodCauseSelectionModal } from './components/GoodCauseSelectionModal';
import { ServiceHubModal } from './components/ServiceHubModal';

const initialMockHousings: Array<Housing & {
  description: string;
  amenities: string[];
  images: string[];
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}> = [];

// Mock job data
const initialMockJobs: Job[] = [];

type View = 'home' | 'details' | 'booking' | 'dashboard' | 'account' | 'verification' | 'search' | 'saved' | 'messages' | 'reservations' | 'jobDetails' | 'job-offers' | 'services' | 'providerDashboard' | 'tasks' | 'serviceProviderDashboard';
type SearchMode = 'housing' | 'jobs';

export default function App() {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [housings, setHousings] = useState(initialMockHousings);
  const [selectedHousing, setSelectedHousing] = useState<typeof initialMockHousings[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('housing');
  const [jobs] = useState<Job[]>(initialMockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 2000],
    type: [],
    rating: 0
  });
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterOptions>({
    priceRange: [0, 3000],
    genderPreference: [],
    hostVerified: null,
    minRating: 0,
    roomType: [],
    amenities: {
      wifi: false,
      furnished: false,
      ac: false,
      tv: false,
      laundryInUnit: false,
      gatedCommunity: false,
      swimmingPool: false,
      grocery: false,
      bank: false,
      mall: false
    }
  });
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showOpenCaseModal, setShowOpenCaseModal] = useState(false);
  const [caseReservationId, setCaseReservationId] = useState<string>('');
  const [caseListingTitle, setCaseListingTitle] = useState<string>('');
  const [caseHostName, setCaseHostName] = useState<string>('');
  const [caseHostEmail, setCaseHostEmail] = useState<string>('');
  const [showHostCases, setShowHostCases] = useState(false);
  const [newCasesCount, setNewCasesCount] = useState(1); // Mock count - would come from backend
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);

  // Admin mode states
  const [adminMode, setAdminMode] = useState<'login' | 'dashboard' | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);

  // Admin accounts - centralized for login validation
  const MASTER_ADMIN_EMAIL = 'ekaterinadumaeva@gmail.com';
  const MASTER_ADMIN_PASSWORD = 'Rycbarm7006$';

  const [adminAccounts, setAdminAccounts] = useState<Array<{
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: string;
    createdBy: string;
    isMaster: boolean;
  }>>([
    {
      id: 'admin-master',
      email: MASTER_ADMIN_EMAIL,
      password: MASTER_ADMIN_PASSWORD,
      name: 'Ekaterina Dumaeva',
      createdAt: new Date('2026-01-01').toISOString(),
      createdBy: 'System',
      isMaster: true
    }
  ]);

  // Support chat states
  interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot' | 'admin';
    timestamp: string;
    isSystemMessage?: boolean;
  }

  interface SupportChat {
    id: string;
    userId: string | null;
    userName: string;
    userEmail: string;
    userRole: 'participant' | 'host' | 'employer' | 'service-provider' | 'guest';
    category: string;
    status: 'active' | 'resolved' | 'pending';
    priority: 'low' | 'medium' | 'high' | 'critical';
    messages: ChatMessage[];
    createdAt: string;
    lastMessageAt: string;
    assignedAdmin?: string;
  }

  const [supportChats, setSupportChats] = useState<SupportChat[]>([]);

  // Service Hub states
  const [showBecomeProvider, setShowBecomeProvider] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);
  const [userIsProvider, setUserIsProvider] = useState(false); // Mock - would be determined by backend
  const [showServiceHubModal, setShowServiceHubModal] = useState(false);

  // Task & Rewards states
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showUploadProof, setShowUploadProof] = useState(false);
  const [showHostReviewTask, setShowHostReviewTask] = useState(false);
  const [showRewardSelection, setShowRewardSelection] = useState(false);
  const [showGoodCauseSelection, setShowGoodCauseSelection] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      listingId: '1',
      listingName: 'Sunset View Apartment',
      title: 'Clean kitchen after weekend',
      category: 'Kitchen cleaning',
      description: 'Wipe down counters, clean dishes, sweep and mop floor',
      rewardAmount: 25.00,
      deadline: '2026-05-20T18:00:00',
      status: 'open',
      hostName: 'John Smith',
      hostId: 'host-1',
      currentAcceptances: 0,
      createdAt: '2026-05-18T10:00:00'
    },
    {
      id: 'task-2',
      listingId: '1',
      listingName: 'Sunset View Apartment',
      title: 'Take out trash and recycling',
      category: 'Trash/recycling',
      description: 'Take all bins to the curb for pickup tomorrow morning',
      rewardAmount: 15.00,
      deadline: '2026-05-19T20:00:00',
      status: 'accepted',
      hostName: 'John Smith',
      hostId: 'host-1',
      currentAcceptances: 1,
      createdAt: '2026-05-18T08:00:00'
    },
    {
      id: 'task-3',
      listingId: '2',
      listingName: 'Cozy Beach House Share',
      title: 'Organize common area',
      category: 'Organizing common area',
      description: 'Tidy up living room, arrange cushions, organize magazines and remotes',
      rewardAmount: 20.00,
      deadline: '2026-05-21T12:00:00',
      status: 'open',
      hostName: 'Sarah Johnson',
      hostId: 'host-2',
      currentAcceptances: 0,
      maxAcceptances: 2,
      createdAt: '2026-05-18T09:00:00'
    }
  ]);
  const [pendingRewardTask, setPendingRewardTask] = useState<Task | null>(null);

  // Track all bookings with dates
  const [bookings, setBookings] = useState<Array<{
    id: string;
    housingId: string;
    participantEmail: string;
    moveInDate: string;
    moveOutDate: string;
    bookedAt: string;
  }>>([
    // Demo booking for Shared Room to show the availability feature
    {
      id: 'booking-1',
      housingId: '2', // Cozy Beach House Share (capacity 4)
      participantEmail: 'demo1@example.com',
      moveInDate: '2026-06-01',
      moveOutDate: '2026-09-01',
      bookedAt: '2026-05-01'
    },
    {
      id: 'booking-2',
      housingId: '2',
      participantEmail: 'demo2@example.com',
      moveInDate: '2026-06-15',
      moveOutDate: '2026-08-15',
      bookedAt: '2026-05-05'
    },
    {
      id: 'booking-3',
      housingId: '2',
      participantEmail: 'demo3@example.com',
      moveInDate: '2026-07-01',
      moveOutDate: '2026-10-01',
      bookedAt: '2026-05-08'
    }
  ]);

  // Restore user session from localStorage on app load
  useEffect(() => {
    const currentUserKey = 'voyaCurrentUser';
    const savedUser = localStorage.getItem(currentUserKey);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Set appropriate view based on user type
        if (parsedUser.userType === 'host') {
          setCurrentView('dashboard');
        } else if (parsedUser.userType === 'participant') {
          setCurrentView('search');
        } else if (parsedUser.userType === 'employer') {
          setCurrentView('dashboard');
        }
      } catch (error) {
        console.error('Error restoring user session:', error);
        localStorage.removeItem(currentUserKey);
      }
    }
  }, []);

  // Load saved listings and jobs from localStorage when user logs in
  useEffect(() => {
    if (user?.email) {
      const savedListingsKey = `voyaSavedListings_${user.email}`;
      const savedJobsKey = `voyaSavedJobs_${user.email}`;

      const savedListings = localStorage.getItem(savedListingsKey);
      const savedJobs = localStorage.getItem(savedJobsKey);

      if (savedListings) {
        setSavedListingIds(JSON.parse(savedListings));
      }
      if (savedJobs) {
        setSavedJobIds(JSON.parse(savedJobs));
      }
    } else {
      setSavedListingIds([]);
      setSavedJobIds([]);
    }
  }, [user?.email]);

  // Save listings to localStorage whenever savedListingIds changes
  useEffect(() => {
    if (user?.email) {
      const savedKey = `voyaSavedListings_${user.email}`;
      localStorage.setItem(savedKey, JSON.stringify(savedListingIds));
    }
  }, [savedListingIds, user?.email]);

  // Save jobs to localStorage whenever savedJobIds changes
  useEffect(() => {
    if (user?.email) {
      const savedKey = `voyaSavedJobs_${user.email}`;
      localStorage.setItem(savedKey, JSON.stringify(savedJobIds));
    }
  }, [savedJobIds, user?.email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLaunchScreen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Reset edit mode when navigating away from account view
  useEffect(() => {
    if (currentView !== 'account') {
      setIsEditingProfile(false);
    }
  }, [currentView]);

  const userListings = user?.userType === 'host'
    ? housings.filter(h => {
        const hostName = user.hostProfile
          ? `${user.hostProfile.firstName} ${user.hostProfile.lastName}`
          : user.name;
        return h.hostName === hostName;
      })
    : [];

  // Calculate match quality for each housing
  const calculateMatchQuality = (housing: typeof initialMockHousings[0]) => {
    const mismatches: string[] = [];

    // Search (must match - not part of mismatch tolerance)
    const matchesSearch = !searchQuery ||
      housing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      housing.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      housing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      housing.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) {
      return null; // Don't show at all if search doesn't match
    }

    // Price range (allow 20% over budget as near match)
    const matchesPrice = housing.price >= advancedFilters.priceRange[0] &&
      housing.price <= advancedFilters.priceRange[1];
    const priceOverBudget = housing.price > advancedFilters.priceRange[1] &&
      housing.price <= advancedFilters.priceRange[1] * 1.2;

    if (!matchesPrice && priceOverBudget) {
      mismatches.push(`$${housing.price - advancedFilters.priceRange[1]} over budget`);
    } else if (!matchesPrice && !priceOverBudget) {
      return null; // Too far over budget or under budget
    }

    // Gender preference
    const matchesGender = advancedFilters.genderPreference.length === 0 ||
      (housing.genderPreference && advancedFilters.genderPreference.includes(housing.genderPreference));
    if (!matchesGender) {
      mismatches.push('Gender preference');
    }

    // Host verified
    const matchesVerified = advancedFilters.hostVerified === null ||
      housing.hostVerified === advancedFilters.hostVerified;
    if (!matchesVerified) {
      mismatches.push('Host verification');
    }

    // Rating
    const matchesRating = housing.rating >= advancedFilters.minRating;
    if (!matchesRating && advancedFilters.minRating > 0) {
      mismatches.push(`Rating (${housing.rating} vs ${advancedFilters.minRating}+)`);
    }

    // Room type
    const matchesRoomType = advancedFilters.roomType.length === 0 ||
      advancedFilters.roomType.includes(housing.type);
    if (!matchesRoomType) {
      mismatches.push('Room type');
    }

    // Amenities
    const amenityMismatches: string[] = [];
    if (advancedFilters.amenities.wifi && !housing.amenities.wifi) amenityMismatches.push('WiFi');
    if (advancedFilters.amenities.furnished && !housing.amenities.furnished) amenityMismatches.push('Furnished');
    if (advancedFilters.amenities.ac && !housing.amenities.ac) amenityMismatches.push('AC');
    if (advancedFilters.amenities.tv && !housing.amenities.tv) amenityMismatches.push('TV');
    if (advancedFilters.amenities.laundryInUnit && !housing.amenities.laundryInUnit) amenityMismatches.push('Laundry');
    if (advancedFilters.amenities.gatedCommunity && !housing.amenities.gatedCommunity) amenityMismatches.push('Gated Community');
    if (advancedFilters.amenities.swimmingPool && !housing.amenities.swimmingPool) amenityMismatches.push('Pool');
    if (advancedFilters.amenities.grocery && !housing.amenities.grocery) amenityMismatches.push('Grocery');
    if (advancedFilters.amenities.bank && !housing.amenities.bank) amenityMismatches.push('Bank');
    if (advancedFilters.amenities.mall && !housing.amenities.mall) amenityMismatches.push('Mall');

    if (amenityMismatches.length > 0) {
      mismatches.push(...amenityMismatches.map(a => `No ${a}`));
    }

    return {
      housing,
      isExactMatch: mismatches.length === 0,
      mismatches
    };
  };

  const housingsWithMatches = housings
    .map(calculateMatchQuality)
    .filter(result => result !== null) as Array<{
      housing: typeof initialMockHousings[0];
      isExactMatch: boolean;
      mismatches: string[];
    }>;

  const exactMatches = housingsWithMatches.filter(h => h.isExactMatch);
  const nearMatches = housingsWithMatches.filter(h => !h.isExactMatch && h.mismatches.length <= 3);

  const filteredHousings = [...exactMatches, ...nearMatches];

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    // Save user to localStorage to persist login
    const currentUserKey = 'voyaCurrentUser';
    localStorage.setItem(currentUserKey, JSON.stringify(newUser));

    if (newUser.userType === 'host') {
      setCurrentView('dashboard');
    } else if (newUser.userType === 'participant') {
      setCurrentView('search');
    } else if (newUser.userType === 'employer') {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    // Clear user from localStorage on explicit logout
    const currentUserKey = 'voyaCurrentUser';
    localStorage.removeItem(currentUserKey);
  };

  // Admin handlers
  const handleAdminLogin = (email: string, password: string) => {
    // Find the admin account
    const adminAccount = adminAccounts.find(
      admin => admin.email === email && admin.password === password
    );

    if (!adminAccount) {
      console.error('Admin account not found');
      return;
    }

    // Create admin user object
    const admin: User = {
      id: adminAccount.id,
      name: adminAccount.name,
      email: email,
      userType: 'participant', // Use participant type to avoid conflicts
      isVerified: true,
      profilePhoto: '',
      participantProfile: undefined,
      hostProfile: undefined
    };
    setAdminUser(admin);
    setAdminMode('dashboard');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setAdminMode(null);
    setAdminClickCount(0);
  };

  // Task handlers
  const handleCreateTask = (taskData: TaskData) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      listingId: taskData.listingId || '1',
      listingName: 'Current Listing',
      title: taskData.title,
      category: taskData.category === 'other' && taskData.customCategory ? taskData.customCategory : taskData.category,
      description: taskData.description,
      rewardAmount: taskData.rewardAmount,
      deadline: taskData.deadline,
      status: 'open',
      hostName: user?.name || 'Host',
      hostId: user?.email || 'host-id',
      currentAcceptances: 0,
      maxAcceptances: taskData.maxAcceptances,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const handleAcceptTask = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: 'accepted', currentAcceptances: t.currentAcceptances + 1 } : t
    ));
  };

  const handleSubmitProof = (taskId: string, proof: { photos: File[]; videos: File[]; note: string }) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? {
        ...t,
        status: 'submitted',
        submittedProof: {
          photos: proof.photos.map(f => f.name),
          videos: proof.videos.map(f => f.name),
          note: proof.note,
          submittedAt: new Date().toISOString()
        }
      } : t
    ));
  };

  const handleApproveTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: 'approved' } : t
      ));
      setPendingRewardTask(task);
      setShowRewardSelection(true);
    }
  };

  const handleRejectTask = (taskId: string, reason: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: 'rejected' } : t
    ));
  };

  const handleRequestRevision = (taskId: string, feedback: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: 'in_progress' } : t
    ));
  };

  const handleCashOut = () => {
    if (pendingRewardTask) {
      setTasks(tasks.map(t =>
        t.id === pendingRewardTask.id ? { ...t, status: 'completed' } : t
      ));
      setPendingRewardTask(null);
    }
    setShowRewardSelection(false);
  };

  const handleSupportCause = () => {
    setShowRewardSelection(false);
    setShowGoodCauseSelection(true);
  };

  const handleConfirmCause = (causeId: string) => {
    if (pendingRewardTask) {
      setTasks(tasks.map(t =>
        t.id === pendingRewardTask.id ? { ...t, status: 'completed' } : t
      ));
      setPendingRewardTask(null);
    }
    setShowGoodCauseSelection(false);
  };

  const handleLogoClick = () => {
    setAdminClickCount(prev => prev + 1);
    if (adminClickCount + 1 === 5) {
      setAdminMode('login');
      setAdminClickCount(0);
    }
  };

  const handleSendJobOffer = (candidateId: string, offerData: any) => {
    const newOffer: JobOffer = {
      id: `offer-${Date.now()}`,
      ...offerData,
      sentDate: new Date().toISOString(),
      status: 'pending'
    };
    setJobOffers([...jobOffers, newOffer]);
    console.log('Job offer sent to candidate:', candidateId, newOffer);
  };

  const handleUploadSignedOffer = (offerId: string, signedDocument: string) => {
    setJobOffers(jobOffers.map(offer =>
      offer.id === offerId
        ? { ...offer, signedDocument, status: 'accepted' as const }
        : offer
    ));
    console.log('Signed offer uploaded for:', offerId);
    alert('Signed job offer submitted successfully! The employer will be notified.');
  };

  const handleDeclineOffer = (offerId: string) => {
    setJobOffers(jobOffers.map(offer =>
      offer.id === offerId
        ? { ...offer, status: 'declined' as const }
        : offer
    ));
    console.log('Offer declined:', offerId);
    alert('Job offer declined.');
  };

  const handleSaveParticipantProfile = (updatedProfile: User['participantProfile']) => {
    if (user && user.userType === 'participant') {
      // Create completely new user object to ensure old data is removed
      const updatedUser: User = {
        email: user.email,
        name: user.name,
        userType: user.userType,
        participantProfile: updatedProfile,
        profilePhoto: user.profilePhoto,
        isVerified: user.isVerified
      };
      setUser(updatedUser);
      setIsEditingProfile(false);

      // Update in localStorage - completely replace old user data
      const currentUserKey = 'voyaCurrentUser';
      localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));

      const usersKey = 'voyaUsers';
      const existingUsers = localStorage.getItem(usersKey);
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const userIndex = users.findIndex((u: User) => u.email === user.email);
        if (userIndex !== -1) {
          // Completely replace the user at this index to remove all old data
          users[userIndex] = updatedUser;
          localStorage.setItem(usersKey, JSON.stringify(users));
        }
      }
    }
  };

  const handlePhotoChange = (photoUrl: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        profilePhoto: photoUrl
      };
      setUser(updatedUser);

      // Update current user session in localStorage
      const currentUserKey = 'voyaCurrentUser';
      localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));

      // Also update in users array
      const usersKey = 'voyaUsers';
      const existingUsers = localStorage.getItem(usersKey);
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const userIndex = users.findIndex((u: User) => u.email === user.email);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem(usersKey, JSON.stringify(users));
        }
      }
    }
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...updatedData
      };
      setUser(updatedUser);

      // Update current user session in localStorage
      const currentUserKey = 'voyaCurrentUser';
      localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));

      // Also update in users array
      const usersKey = 'voyaUsers';
      const existingUsers = localStorage.getItem(usersKey);
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const userIndex = users.findIndex((u: User) => u.email === user.email);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem(usersKey, JSON.stringify(users));
        }
      }
    }
  };

  const handleCreateListing = (newListing: NewListing) => {
    const hostName = user?.hostProfile
      ? `${user.hostProfile.firstName} ${user.hostProfile.lastName}`
      : user?.name || '';

    const listing: typeof initialMockHousings[0] = {
      id: Math.random().toString(36).substr(2, 9),
      title: newListing.title,
      location: `${newListing.address.city}, ${newListing.address.state}`,
      city: newListing.address.city,
      state: newListing.address.state,
      country: newListing.address.country,
      coordinates: { lat: 40.7128, lng: -74.0060 }, // Default coordinates - in production would use geocoding
      price: newListing.price,
      type: newListing.roomType,
      description: newListing.description,
      availability: newListing.availability,
      rating: 0,
      reviewCount: 0,
      image: newListing.photos.length > 0 ? newListing.photos[0] : 'https://images.unsplash.com/photo-1666282167632-c613fbeb163c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Nzg0NDE3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      hostVerified: user?.isVerified || false,
      hostName: hostName,
      genderPreference: newListing.genderPreference,
      amenities: {
        wifi: newListing.amenities.wifi,
        furnished: newListing.amenities.furnished,
        ac: newListing.amenities.ac,
        tv: newListing.amenities.tv,
        laundryInUnit: newListing.amenities.laundryInUnit,
        gatedCommunity: newListing.amenities.gatedCommunity,
        swimmingPool: newListing.amenities.swimmingPool,
        grocery: newListing.nearbyPlaces.grocery,
        bank: newListing.nearbyPlaces.bank,
        mall: newListing.nearbyPlaces.mall
      },
      transport: newListing.transport,
      images: newListing.photos.length > 0 ? newListing.photos : ['https://images.unsplash.com/photo-1666282167632-c613fbeb163c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Nzg0NDE3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080'],
      reviews: []
    };
    setHousings([...housings, listing]);
  };

  const handleDeleteListing = (id: string) => {
    setHousings(housings.filter(h => h.id !== id));
  };

  const handleVerificationSubmit = () => {
    if (user) {
      const hostName = user.hostProfile
        ? `${user.hostProfile.firstName} ${user.hostProfile.lastName}`
        : user.name;

      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);

      // Update in localStorage to persist verification status
      const currentUserKey = 'voyaCurrentUser';
      localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));

      const usersKey = 'voyaUsers';
      const existingUsers = localStorage.getItem(usersKey);
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const userIndex = users.findIndex((u: User) => u.email === user.email);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem(usersKey, JSON.stringify(users));
        }
      }

      setHousings(housings.map(h =>
        h.hostName === hostName ? { ...h, hostVerified: true } : h
      ));
      setCurrentView('dashboard');
    }
  };

  const handleHousingClick = (housing: typeof initialMockHousings[0]) => {
    setSelectedHousing(housing);
    setCurrentView('details');
  };

  const handleToggleSave = (housingId: string) => {
    setSavedListingIds(prev => {
      if (prev.includes(housingId)) {
        return prev.filter(id => id !== housingId);
      } else {
        return [...prev, housingId];
      }
    });
  };

  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('jobDetails');
  };

  const handleApplyJob = () => {
    alert('Application submitted! The employer will review your profile and contact you soon.');
    setCurrentView('search');
    setSelectedJob(null);
  };

  const handleBook = () => {
    // Check if the selected housing has rental agreement or house rules
    if (selectedHousing) {
      const hasDocuments = (selectedHousing as any).rentalAgreement || (selectedHousing as any).houseRules;
      if (hasDocuments) {
        setShowAgreementModal(true);
      } else {
        setCurrentView('booking');
      }
    }
  };

  const handleAgreementAccept = () => {
    setShowAgreementModal(false);
    setCurrentView('booking');
  };

  const handleAgreementDecline = () => {
    setShowAgreementModal(false);
    alert('You must agree to the terms to proceed with the booking.');
  };

  const handleUpdateListingDocuments = (listingId: string, rentalAgreement?: string, houseRules?: string) => {
    setHousings(housings.map(housing => {
      if (housing.id === listingId) {
        return {
          ...housing,
          rentalAgreement,
          houseRules
        } as any;
      }
      return housing;
    }));
  };

  // Check available capacity for a housing during a specific date range
  const checkAvailability = (housingId: string, startDate: string, endDate: string): number => {
    const housing = housings.find(h => h.id === housingId);
    if (!housing || !housing.maxCapacity) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Count overlapping bookings
    const overlappingBookings = bookings.filter(booking => {
      if (booking.housingId !== housingId) return false;

      const bookingStart = new Date(booking.moveInDate);
      const bookingEnd = new Date(booking.moveOutDate);

      // Check if date ranges overlap
      return (start < bookingEnd && end > bookingStart);
    });

    const availableSpaces = housing.maxCapacity - overlappingBookings.length;
    return Math.max(0, availableSpaces);
  };

  // Get current available spaces for a housing (overall)
  const getAvailableSpaces = (housingId: string): number => {
    const housing = housings.find(h => h.id === housingId);
    if (!housing || !housing.maxCapacity) return 0;

    const today = new Date().toISOString().split('T')[0];
    // Check availability for next 6 months as a general indicator
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    return checkAvailability(housingId, today, sixMonthsLater.toISOString().split('T')[0]);
  };

  const handleBookingComplete = (bookingData: {
    moveInDate: string;
    duration: number;
    paymentOption: 'with-deposit' | 'without-deposit';
  }) => {
    if (selectedHousing && user) {
      // Calculate move-out date
      const moveOutDate = new Date(bookingData.moveInDate);
      moveOutDate.setMonth(moveOutDate.getMonth() + bookingData.duration);

      // Create new booking
      const newBooking = {
        id: `booking-${Date.now()}`,
        housingId: selectedHousing.id,
        participantEmail: user.email,
        moveInDate: bookingData.moveInDate,
        moveOutDate: moveOutDate.toISOString().split('T')[0],
        bookedAt: new Date().toISOString()
      };

      setBookings([...bookings, newBooking]);
      console.log('New booking created:', newBooking);
    }

    setCurrentView('home');
    setSelectedHousing(null);
  };

  const handleBack = () => {
    if (currentView === 'booking') {
      setCurrentView('details');
    } else if (currentView === 'jobDetails') {
      setCurrentView('search');
      setSelectedJob(null);
    } else {
      // Navigate back to appropriate view based on user type
      if (user?.userType === 'participant') {
        setCurrentView('search');
      } else {
        setCurrentView('home');
      }
      setSelectedHousing(null);
    }
  };

  const handleOpenCase = (reservationId: string, listingTitle: string, hostName: string, hostEmail: string) => {
    setCaseReservationId(reservationId);
    setCaseListingTitle(listingTitle);
    setCaseHostName(hostName);
    setCaseHostEmail(hostEmail);
    setShowOpenCaseModal(true);
  };

  const handleSubmitCase = (caseDetails: { category: string; description: string; urgency: string }) => {
    const caseData = {
      reservationId: caseReservationId,
      listingTitle: caseListingTitle,
      hostName: caseHostName,
      hostEmail: caseHostEmail,
      participantName: user?.name,
      participantEmail: user?.email,
      ...caseDetails,
      submittedAt: new Date().toISOString()
    };

    console.log('Case submitted and sent to:', caseData);

    // TODO: In production, this would call backend API to:
    // 1. Store case in database
    // 2. Send email notification to host at caseHostEmail
    // 3. Send notification to Voya Link support team
    // 4. Create notification in host's account dashboard

    // Simulate sending email to host
    console.log(`📧 Email notification sent to host: ${caseHostEmail}`);
    console.log(`📧 Email notification sent to Voya Link support team`);

    // Increment host notification count (simulating host receiving notification in their account)
    setNewCasesCount(prev => prev + 1);

    setShowOpenCaseModal(false);

    // Show success message with more details
    alert(
      `✓ Case Submitted Successfully!\n\n` +
      `Your case has been sent to:\n` +
      `• Host: ${caseHostName} (${caseHostEmail})\n` +
      `• Voya Link Support Team\n\n` +
      `They will respond to your case shortly. You can track the status in your Messages tab.`
    );
  };

  // Admin create/delete handlers
  const handleCreateAdmin = (newAdmin: Omit<typeof adminAccounts[0], 'id' | 'createdAt' | 'createdBy' | 'isMaster'>) => {
    const adminAccount = {
      id: `admin-${Date.now()}`,
      ...newAdmin,
      createdAt: new Date().toISOString(),
      createdBy: adminUser?.email || 'Unknown',
      isMaster: false
    };

    setAdminAccounts([...adminAccounts, adminAccount]);
  };

  const handleDeleteAdmin = (adminId: string) => {
    setAdminAccounts(adminAccounts.filter(admin => admin.id !== adminId));
  };

  // Support chat handlers
  const handleCreateSupportChat = (
    userName: string,
    userEmail: string,
    userRole: 'participant' | 'host' | 'employer' | 'service-provider' | 'guest',
    category: string,
    initialMessage: string,
    priority: 'low' | 'medium' | 'high' | 'critical'
  ) => {
    const chatId = `chat-${Date.now()}`;
    const newChat: SupportChat = {
      id: chatId,
      userId: user?.email || null,
      userName,
      userEmail,
      userRole,
      category,
      status: 'active',
      priority,
      messages: [
        {
          id: `msg-${Date.now()}`,
          text: initialMessage,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
      ],
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString()
    };
    setSupportChats(prev => [newChat, ...prev]);
    return chatId;
  };

  const handleAddChatMessage = (chatId: string, message: ChatMessage) => {
    setSupportChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessageAt: new Date().toISOString()
        };
      }
      return chat;
    }));
  };

  const handleUpdateChatStatus = (chatId: string, status: 'active' | 'resolved' | 'pending') => {
    setSupportChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, status } : chat
    ));
  };

  const handleAssignChat = (chatId: string, adminEmail: string) => {
    setSupportChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, assignedAdmin: adminEmail } : chat
    ));
  };

  // Find existing chat for current user
  const userChat = user ? supportChats.find(chat => chat.userEmail === user.email) : null;
  const guestChat = !user ? supportChats.find(chat => chat.userRole === 'guest') : null;
  const currentChat = userChat || guestChat;

  // Admin mode interface
  if (adminMode === 'login') {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={() => setAdminMode(null)}
        adminAccounts={adminAccounts}
      />
    );
  }

  if (adminMode === 'dashboard' && adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        adminAccounts={adminAccounts}
        onCreateAdmin={handleCreateAdmin}
        onDeleteAdmin={handleDeleteAdmin}
        supportChats={supportChats}
        onAddChatMessage={handleAddChatMessage}
        onUpdateChatStatus={handleUpdateChatStatus}
        onAssignChat={handleAssignChat}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (showLaunchScreen) {
    return <LaunchScreen />;
  }

  if (currentView === 'verification' && user) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto flex items-start justify-center p-4">
          <div className="w-full max-w-2xl">
            <VerificationModal
              onClose={() => setCurrentView('dashboard')}
              onSubmit={handleVerificationSubmit}
              userEmail={user.email}
              userPhone={user.hostProfile?.phoneNumber || user.employerProfile?.phoneNumber}
            />
          </div>
        </div>
        <HelpChat
          userName={user.name}
          userEmail={user.email}
          userRole={user.userType}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
          existingChatId={currentChat?.id}
          existingMessages={currentChat?.messages}
        />
      </div>
    );
  }

  // Account view for hosts only (participants use tabbed interface)
  if (currentView === 'account' && user?.userType === 'host') {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <AccountSettings user={user} onPhotoChange={handlePhotoChange} onUpdateProfile={handleUpdateProfile} />
        </div>
        <HelpChat
          userName={user.name}
          userEmail={user.email}
          userRole={user.userType}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
          existingChatId={currentChat?.id}
          existingMessages={currentChat?.messages}
        />
      </div>
    );
  }

  if (currentView === 'dashboard' && user?.userType === 'host') {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setCurrentView('home')}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Listings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <HostDashboard
            user={user}
            listings={userListings}
            onCreateListing={() => setShowCreateListing(true)}
            onVerificationClick={() => setCurrentView('verification')}
            onDeleteListing={handleDeleteListing}
            onAccountSettings={() => setCurrentView('account')}
            onViewCases={() => setShowHostCases(true)}
            newCasesCount={newCasesCount}
            onUpdateListingDocuments={handleUpdateListingDocuments}
          />
        </div>

        {/* Host Cases Modal */}
        {showHostCases && (
          <HostCases
            hostName={user.name}
            onClose={() => {
              setShowHostCases(false);
              // Mark all cases as viewed when modal is opened
              setNewCasesCount(0);
            }}
          />
        )}

        {/* Host Task Modals */}
        {showCreateTask && user.userType === 'host' && (
          <CreateTaskModal
            listingId="1"
            listingName="Your Listing"
            onClose={() => setShowCreateTask(false)}
            onSubmit={handleCreateTask}
          />
        )}

        {showHostReviewTask && selectedTask && user.userType === 'host' && (
          <HostReviewTaskModal
            task={selectedTask}
            onClose={() => {
              setShowHostReviewTask(false);
              setSelectedTask(null);
            }}
            onApprove={handleApproveTask}
            onReject={handleRejectTask}
            onRequestRevision={handleRequestRevision}
          />
        )}

        {/* Create Listing Modal */}
        {showCreateListing && (
          <CreateListingModal
            onClose={() => setShowCreateListing(false)}
            onSubmit={handleCreateListing}
          />
        )}

        <HelpChat
          userName={user.name}
          userEmail={user.email}
          userRole={user.userType}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
          existingChatId={currentChat?.id}
          existingMessages={currentChat?.messages}
        />
      </div>
    );
  }

  if (currentView === 'dashboard' && user?.userType === 'employer') {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="flex-1 overflow-hidden">
          <EmployerDashboard
            user={user}
            onAccountSettings={() => setCurrentView('account')}
            onLogout={handleLogout}
            onSendJobOffer={handleSendJobOffer}
            onVerificationClick={() => setCurrentView('verification')}
          />
        </div>
        <HelpChat
          userName={user.name}
          userEmail={user.email}
          userRole={user.userType}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
          existingChatId={currentChat?.id}
          existingMessages={currentChat?.messages}
        />
      </div>
    );
  }

  // Account view for employers
  if (currentView === 'account' && user?.userType === 'employer') {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <AccountSettings user={user} onPhotoChange={handlePhotoChange} onUpdateProfile={handleUpdateProfile} />
        </div>
        <HelpChat
          userName={user.name}
          userEmail={user.email}
          userRole={user.userType}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
          existingChatId={currentChat?.id}
          existingMessages={currentChat?.messages}
        />
      </div>
    );
  }

  // Participant views (search, saved, messages, reservations, profile, account, services)
  if ((currentView === 'search' || currentView === 'saved' || currentView === 'messages' || currentView === 'reservations' || currentView === 'account' || currentView === 'job-offers' || currentView === 'services' || currentView === 'tasks') && user?.userType === 'participant') {
    const savedListings = housings.filter(h => savedListingIds.includes(h.id));
    const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));

    // Filter jobs based on search query
    const filteredJobs = jobs.filter(job => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    });

    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5 flex flex-col">
        {/* Participant Navigation Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 z-10 shadow-sm">
          {/* Logo and Actions Bar */}
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
                <div className="relative bg-gradient-to-br from-primary to-purple-600 p-2 rounded-xl shadow-lg">
                  <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                    <path d="M20 15 L40 55 L60 15" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="40" cy="20" r="8" fill="white" opacity="0.3"/>
                    <circle cx="40" cy="20" r="3" fill="white"/>
                  </svg>
                </div>
              </div>
              <div onClick={handleLogoClick} className="cursor-pointer">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-wide">VOYA LINK</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">Your Journey Starts Here</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('account')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Info</span>
              </button>
              <button
                onClick={() => setCurrentView('account')}
                className="relative w-9 h-9 rounded-full overflow-hidden transition-all hover:scale-105 ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-primary"
                aria-label="Account Settings"
              >
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-600">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pb-0">
            <div className="flex items-end gap-2">
              <button
                onClick={() => setCurrentView('search')}
                className={`group relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all ${
                  currentView === 'search'
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                  currentView === 'search'
                    ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-inner'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}>
                  <Search className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">{currentView === 'search' ? 'Search' : 'Search'}</span>
                {currentView === 'search' && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
                )}
              </button>

              <button
                onClick={() => setCurrentView('saved')}
                className={`group relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all ${
                  currentView === 'saved'
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                  currentView === 'saved'
                    ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-inner'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}>
                  <Bookmark className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Saved</span>
                {currentView === 'saved' && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
                )}
              </button>

              <button
                onClick={() => setCurrentView('messages')}
                className={`group relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all ${
                  currentView === 'messages'
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                  currentView === 'messages'
                    ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-inner'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}>
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Messages</span>
                {currentView === 'messages' && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
                )}
              </button>

              <button
                onClick={() => setCurrentView('reservations')}
                className={`group relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all ${
                  currentView === 'reservations'
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                  currentView === 'reservations'
                    ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-inner'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}>
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Bookings</span>
                {currentView === 'reservations' && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
                )}
              </button>

              <button
                onClick={() => setCurrentView('job-offers')}
                className={`group relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all ${
                  currentView === 'job-offers'
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                  currentView === 'job-offers'
                    ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-inner'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}>
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Offers</span>
                {currentView === 'job-offers' && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
                )}
                {jobOffers.filter(o => o.status === 'pending').length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {jobOffers.filter(o => o.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('tasks')}
                className={`group relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all ${
                  currentView === 'tasks'
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className={`relative transition-transform group-hover:scale-110 ${
                  currentView === 'tasks' ? 'scale-110' : ''
                }`}>
                  <CheckSquare className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Tasks</span>
                {currentView === 'tasks' && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
                )}
                {tasks.filter(t => t.status === 'open').length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {tasks.filter(t => t.status === 'open').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('services')}
                className={`group relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all ${
                  currentView === 'services'
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                  currentView === 'services'
                    ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 shadow-inner'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                }`}>
                  <Star className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide">Services</span>
                {currentView === 'services' && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'account' && (
            <>
              {isEditingProfile ? (
                <EditParticipantProfile
                  user={user}
                  onSave={handleSaveParticipantProfile}
                  onCancel={() => setIsEditingProfile(false)}
                />
              ) : (
                <div className="h-full overflow-y-auto bg-background">
                  <div className="p-4 border-b border-border flex items-center justify-end">
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm active:scale-[0.98] transition-transform"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <AccountSettings user={user} onPhotoChange={handlePhotoChange} onUpdateProfile={handleUpdateProfile} />
                </div>
              )}
            </>
          )}
          {currentView === 'job-offers' && (
            <JobOffersView
              offers={jobOffers}
              onUploadSignedOffer={handleUploadSignedOffer}
              onDeclineOffer={handleDeclineOffer}
            />
          )}
          {currentView === 'saved' && (
            <SavedListings
              savedListings={savedListings}
              savedJobs={savedJobs}
              onRemoveHousing={(id) => setSavedListingIds(savedListingIds.filter(sid => sid !== id))}
              onRemoveJob={(id) => setSavedJobIds(savedJobIds.filter(jid => jid !== id))}
              onViewListing={(housing) => {
                setSelectedHousing(housing);
                setCurrentView('details');
              }}
              onViewJob={(job) => {
                setSelectedJob(job);
                setCurrentView('jobDetails');
              }}
              getAvailableSpaces={getAvailableSpaces}
            />
          )}
          {currentView === 'messages' && (
            <Messages userName={user.name} />
          )}
          {currentView === 'reservations' && (
            <Reservations userName={user.name} onOpenCase={handleOpenCase} />
          )}
          {currentView === 'tasks' && (
            <TaskCenter
              viewMode="participant"
              tasks={tasks}
              onSelectTask={(taskId) => {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                  setSelectedTask(task);
                  setShowTaskDetail(true);
                }
              }}
            />
          )}

          {currentView === 'services' && (
            <div className="h-full overflow-y-auto">
              <ServiceHub
                onBecomeProvider={() => {
                  if (userIsProvider) {
                    setCurrentView('providerDashboard');
                  } else {
                    setShowBecomeProvider(true);
                  }
                }}
                onSelectService={(serviceId) => {
                  // Mock service data - would come from backend
                  setSelectedService({
                    id: serviceId,
                    category: 'airport_transfers',
                    title: 'Charleston Airport Transfer',
                    description: 'Comfortable transfer service with experienced driver',
                    price: '$45',
                    location: 'Charleston, SC',
                    provider: {
                      id: '1',
                      name: 'John Driver',
                      type: 'individual',
                      rating: 4.8,
                      reviewCount: 24,
                      verified: true,
                    },
                    photos: [],
                    status: 'active',
                    createdAt: '2026-05-01',
                    pickupLocation: 'Charleston Airport',
                    dropoffLocation: 'Myrtle Beach',
                    vehicleType: 'SUV',
                    seatsAvailable: 4,
                  });
                  setShowServiceDetail(true);
                }}
              />
            </div>
          )}
          {currentView === 'search' && (
            <div className="h-full flex flex-col">
              {/* Search Mode Toggle */}
              <div className="px-6 pt-5 pb-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSearchMode('housing')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-semibold ${
                      searchMode === 'housing'
                        ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary shadow-lg'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Homes</span>
                  </button>
                  <button
                    onClick={() => setSearchMode('jobs')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-semibold ${
                      searchMode === 'jobs'
                        ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary shadow-lg'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Jobs</span>
                  </button>
                </div>
              </div>

              {/* Search Controls */}
              <div className="px-6 py-5 space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onLocationClick={() => {}}
                    />
                  </div>
                  {searchMode === 'housing' && (
                    <button
                      onClick={() => setShowAdvancedFilters(true)}
                      className="px-5 py-3 bg-gradient-to-br from-primary via-purple-600 to-purple-700 text-white rounded-xl hover:shadow-xl hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-medium"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      <span className="hidden sm:inline text-sm">Filters</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {searchMode === 'housing' ? filteredHousings.length : filteredJobs.length}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {searchMode === 'housing'
                        ? (filteredHousings.length === 1 ? 'property available' : 'properties available')
                        : (filteredJobs.length === 1 ? 'job available' : 'jobs available')
                      }
                    </span>
                  </div>
                  {searchMode === 'housing' && (advancedFilters.roomType.length > 0 || advancedFilters.genderPreference.length > 0 || advancedFilters.minRating > 0) && (
                    <button
                      onClick={() => setAdvancedFilters({
                        priceRange: [0, 3000],
                        genderPreference: [],
                        hostVerified: null,
                        minRating: 0,
                        roomType: [],
                        amenities: {
                          wifi: false,
                          furnished: false,
                          ac: false,
                          tv: false,
                          laundryInUnit: false,
                          gatedCommunity: false,
                          swimmingPool: false,
                          grocery: false,
                          bank: false,
                          mall: false
                        }
                      })}
                      className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-purple-600 bg-primary/10 hover:bg-primary/20 rounded-lg transition-all hover:shadow-md"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {searchMode === 'housing' ? (
                <>
                  {/* Map View - Upper Half */}
                  <div className="h-1/2 px-6 pt-5 pb-3">
                    <div className="h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/60 dark:ring-slate-800/60">
                      <InteractiveHousingMap
                        housings={filteredHousings.map(h => h.housing)}
                        selectedId={selectedHousing?.id}
                        onSelectHousing={handleHousingClick}
                      />
                    </div>
                  </div>

                  {/* Location Identifier */}
                  <div className="px-6 py-3.5 border-y border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/80 via-white/50 to-transparent dark:from-slate-900/80 dark:via-slate-800/50 backdrop-blur-sm">
                    {searchQuery ? (
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                          Search: <span className="text-primary">"{searchQuery}"</span>
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {filteredHousings.length} {filteredHousings.length === 1 ? 'result' : 'results'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                          {filteredHousings.length > 0 ? (
                            <>
                              {Array.from(new Set(filteredHousings.map(h => `${h.housing.city}, ${h.housing.state}`))).slice(0, 3).join(' • ')}
                              {Array.from(new Set(filteredHousings.map(h => `${h.housing.city}, ${h.housing.state}`))).length > 3 && ` +${Array.from(new Set(filteredHousings.map(h => `${h.housing.city}, ${h.housing.state}`))).length - 3} more`}
                            </>
                          ) : (
                            'All Locations'
                          )}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Showing {filteredHousings.length} {filteredHousings.length === 1 ? 'property' : 'properties'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Listings - Lower Half */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50">
                    {exactMatches.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">Perfect Matches</h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-200/50 to-transparent dark:from-slate-700 dark:via-slate-700/50"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {exactMatches.map(({ housing }) => (
                            <div key={housing.id} className="transform transition-all hover:scale-[1.02]">
                              <HousingCard
                                housing={housing}
                                onClick={() => handleHousingClick(housing)}
                                isSaved={savedListingIds.includes(housing.id)}
                                onToggleSave={() => handleToggleSave(housing.id)}
                                showSaveButton={true}
                                availableSpaces={housing.maxCapacity ? getAvailableSpaces(housing.id) : undefined}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nearMatches.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-1 w-1 rounded-full bg-orange-500"></div>
                          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
                            {exactMatches.length > 0 ? 'Similar Options' : 'Close Matches'}
                          </h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {nearMatches.map(({ housing, mismatches }) => (
                            <div key={housing.id} className="transform transition-all hover:scale-[1.02]">
                              <HousingCard
                                housing={housing}
                                onClick={() => handleHousingClick(housing)}
                                isSaved={savedListingIds.includes(housing.id)}
                                onToggleSave={() => handleToggleSave(housing.id)}
                                showSaveButton={true}
                                mismatches={mismatches}
                                availableSpaces={housing.maxCapacity ? getAvailableSpaces(housing.id) : undefined}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredHousings.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                          <Search className="w-10 h-10 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                          Try adjusting your search criteria or filters to find more options
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Jobs List View */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50">
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        {searchQuery ? `Search: "${searchQuery}"` : 'All Job Opportunities'}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
                      </p>
                    </div>

                    {filteredJobs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                          <Briefcase className="w-10 h-10 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                          Try adjusting your search to find more job opportunities
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            onClick={() => handleJobClick(job)}
                            isSaved={savedJobIds.includes(job.id)}
                            onToggleSave={() => handleToggleSaveJob(job.id)}
                            showSaveButton={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Advanced Filters Modal for Participant */}
        {showAdvancedFilters && (
          <AdvancedFilters
            filters={advancedFilters}
            onChange={setAdvancedFilters}
            onClose={() => setShowAdvancedFilters(false)}
          />
        )}

        {/* Open Case Modal */}
        {showOpenCaseModal && (
          <OpenCaseModal
            listingTitle={caseListingTitle}
            hostName={caseHostName}
            hostEmail={caseHostEmail}
            onClose={() => setShowOpenCaseModal(false)}
            onSubmit={handleSubmitCase}
          />
        )}

        {/* Become Provider Modal */}
        {showBecomeProvider && (
          <BecomeProviderModal
            onClose={() => setShowBecomeProvider(false)}
            onSubmit={(application: ProviderApplication) => {
              console.log('Provider application submitted:', application);

              // In production, this would send to backend for review
              // For now, auto-approve and create service provider account
              const serviceProviderUser: User = {
                id: `provider-${Date.now()}`,
                email: application.email,
                name: application.fullName,
                userType: 'service-provider',
                isVerified: false,
                profilePhoto: undefined
              };

              setUser(serviceProviderUser);
              setShowBecomeProvider(false);
              setCurrentView('serviceProviderDashboard');

              alert('🎉 Welcome to VOYA LINK Service Provider!\n\nYour application has been submitted. You can now start creating your services.\n\nYou will receive an email notification once your account is fully verified (typically 2-3 business days).');
            }}
          />
        )}

        {/* Service Detail Modal */}
        {showServiceDetail && selectedService && (
          <ServiceDetailModal
            listing={selectedService}
            onClose={() => {
              setShowServiceDetail(false);
              setSelectedService(null);
            }}
            onBook={(listingId, details) => {
              // Create booking confirmation
              alert(`Service booked successfully!\n\nService: ${selectedService?.title}\nProvider: ${selectedService?.provider.name}\n\nYou'll receive a confirmation email shortly.`);
              setShowServiceDetail(false);
              setSelectedService(null);
            }}
            onJoin={(listingId) => {
              // Join event/trip
              alert(`You've joined this ${selectedService?.category === 'events' ? 'event' : 'trip'}!\n\n${selectedService?.title}\n\nCheck your email for details and updates.`);
              setShowServiceDetail(false);
              setSelectedService(null);
            }}
            onContact={(providerId) => {
              // Open messaging - in real app would open message thread
              alert(`Opening chat with ${selectedService?.provider.name}...\n\nIn the full version, this would open a secure messaging thread.`);
            }}
            onReport={(listingId) => {
              // Report service
              const reason = prompt('Please describe why you\'re reporting this listing:');
              if (reason) {
                alert('Thank you for your report. Our team will review this listing within 24 hours.');
              }
            }}
            onShare={(listingId) => {
              // Share service
              const shareText = `Check out this service on VOYA LINK: ${selectedService?.title}`;
              if (navigator.share) {
                navigator.share({
                  title: selectedService?.title,
                  text: shareText,
                  url: window.location.href
                }).catch(() => {
                  // Fallback to copy to clipboard
                  navigator.clipboard.writeText(shareText);
                  alert('Link copied to clipboard!');
                });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Link copied to clipboard!');
              }
            }}
          />
        )}

        {/* Task Modals */}
        {showTaskDetail && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            viewMode="participant"
            onClose={() => {
              setShowTaskDetail(false);
              setSelectedTask(null);
            }}
            onAccept={handleAcceptTask}
            onDecline={(taskId) => {
              setShowTaskDetail(false);
              setSelectedTask(null);
            }}
            onSubmitCompletion={(taskId) => {
              setShowTaskDetail(false);
              setShowUploadProof(true);
            }}
            onAskQuestion={(taskId, question) => {
              console.log('Question for task:', taskId, question);
            }}
          />
        )}

        {showUploadProof && selectedTask && (
          <UploadProofModal
            taskId={selectedTask.id}
            taskTitle={selectedTask.title}
            onClose={() => setShowUploadProof(false)}
            onSubmit={(proof) => {
              handleSubmitProof(selectedTask.id, proof);
              setShowUploadProof(false);
              setSelectedTask(null);
            }}
          />
        )}

        {showRewardSelection && pendingRewardTask && (
          <RewardSelectionModal
            taskTitle={pendingRewardTask.title}
            rewardAmount={pendingRewardTask.rewardAmount}
            onClose={() => {
              setShowRewardSelection(false);
              setPendingRewardTask(null);
            }}
            onCashOut={handleCashOut}
            onSupportCause={handleSupportCause}
          />
        )}

        {showGoodCauseSelection && pendingRewardTask && (
          <GoodCauseSelectionModal
            rewardAmount={pendingRewardTask.rewardAmount}
            onClose={() => {
              setShowGoodCauseSelection(false);
              setPendingRewardTask(null);
            }}
            onConfirm={handleConfirmCause}
          />
        )}

        <HelpChat
          userName={user.name}
          userEmail={user.email}
          userRole={user.userType}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
          existingChatId={currentChat?.id}
          existingMessages={currentChat?.messages}
        />
      </div>
    );
  }

  if (currentView === 'booking' && selectedHousing) {
    return (
      <div className="h-screen bg-background">
        <BookingFlow
          housing={selectedHousing}
          onBack={handleBack}
          onComplete={handleBookingComplete}
          availableSpaces={selectedHousing.maxCapacity ? getAvailableSpaces(selectedHousing.id) : undefined}
          onCheckAvailability={(startDate, endDate) => checkAvailability(selectedHousing.id, startDate, endDate)}
        />
        <HelpChat
          userName={user?.name || 'Guest'}
          userEmail={user?.email || 'guest@unknown'}
          userRole={user?.userType || 'guest'}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
        />
      </div>
    );
  }

  if (currentView === 'details' && selectedHousing) {
    return (
      <div className="h-screen bg-background">
        <HousingDetails
          housing={selectedHousing}
          onBack={handleBack}
          onBook={handleBook}
          isSaved={savedListingIds.includes(selectedHousing.id)}
          onToggleSave={user?.userType === 'participant' ? () => handleToggleSave(selectedHousing.id) : undefined}
          availableSpaces={selectedHousing.maxCapacity ? getAvailableSpaces(selectedHousing.id) : undefined}
        />
        {showAgreementModal && (
          <AgreementModal
            rentalAgreement={(selectedHousing as any).rentalAgreement}
            houseRules={(selectedHousing as any).houseRules}
            listingTitle={selectedHousing.title}
            hostName={selectedHousing.hostName}
            onAgree={handleAgreementAccept}
            onDecline={handleAgreementDecline}
          />
        )}
        <HelpChat
          userName={user?.name || 'Guest'}
          userEmail={user?.email || 'guest@unknown'}
          userRole={user?.userType || 'guest'}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
        />
      </div>
    );
  }

  if (currentView === 'jobDetails' && selectedJob) {
    return (
      <div className="h-screen bg-background">
        <JobDetails
          job={selectedJob}
          onBack={handleBack}
          onApply={handleApplyJob}
          isSaved={savedJobIds.includes(selectedJob.id)}
          onToggleSave={user?.userType === 'participant' ? () => handleToggleSaveJob(selectedJob.id) : undefined}
        />
        <HelpChat
          userName={user?.name || 'Guest'}
          userEmail={user?.email || 'guest@unknown'}
          userRole={user?.userType || 'guest'}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
        />
      </div>
    );
  }

  // Provider Dashboard view
  if (currentView === 'providerDashboard' && userIsProvider && user?.userType === 'participant') {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setCurrentView('services')}
            className="text-sm text-primary hover:underline flex items-center gap-2"
          >
            ← Back to Services
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ProviderDashboard
            providerId={user?.id || '1'}
            onCreateService={() => {
              console.log('Create service clicked');
            }}
            onEditService={(serviceId) => {
              console.log('Edit service:', serviceId);
            }}
          />
        </div>
        <HelpChat
          userName={user?.name || 'Guest'}
          userEmail={user?.email || 'guest@unknown'}
          userRole={user?.userType || 'guest'}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
        />
      </div>
    );
  }

  // Service Provider Dashboard view
  if (currentView === 'serviceProviderDashboard' && user?.userType === 'service-provider') {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="relative group" onClick={handleLogoClick}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
              <div className="relative bg-gradient-to-br from-primary to-purple-600 p-2 rounded-xl shadow-lg cursor-pointer">
                <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                  <path d="M20 15 L40 55 L60 15" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="40" cy="20" r="8" fill="white" opacity="0.3"/>
                  <circle cx="40" cy="20" r="3" fill="white"/>
                </svg>
              </div>
            </div>
            <div onClick={handleLogoClick} className="cursor-pointer">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-wide">VOYA LINK</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">Service Provider</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ServiceProviderDashboard
            providerId={user?.id || '1'}
            providerName={user?.name || 'Provider'}
            onCreateService={() => {
              alert('Create Service form would open here.\n\nIn production, this would open a detailed form to create a new service listing with photos, pricing, availability, etc.');
            }}
            onEditService={(serviceId) => {
              alert(`Edit Service ${serviceId} form would open here.\n\nIn production, this would open the service editor with pre-filled data.`);
            }}
          />
        </div>
        <HelpChat
          userName={user?.name || 'Guest'}
          userEmail={user?.email || 'guest@unknown'}
          userRole={user?.userType || 'guest'}
          onCreateChat={handleCreateSupportChat}
          onAddMessage={handleAddChatMessage}
        />
      </div>
    );
  }

  // Home view - only for logged-out users
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5 overflow-y-auto">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
              <div className="relative bg-gradient-to-br from-primary to-purple-600 p-2.5 rounded-xl shadow-lg">
                <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                  <path d="M20 15 L40 55 L60 15" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="40" cy="20" r="8" fill="white" opacity="0.3"/>
                  <circle cx="40" cy="20" r="3" fill="white"/>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-wide leading-none">VOYA LINK</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase mt-1">Your Journey Starts Here</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => setShowServiceHubModal(true)}
              className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold transition-colors flex items-center gap-2 text-sm lg:text-base"
            >
              <Star className="w-4 h-4" />
              Services
            </button>
            <a
              href="#how-it-works"
              className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold transition-colors text-sm lg:text-base"
            >
              How It Works
            </a>
            <button
              onClick={() => setShowBecomeProvider(true)}
              className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold transition-colors flex items-center gap-2 text-sm lg:text-base"
            >
              <Plus className="w-4 h-4" />
              Become a Provider
            </button>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 font-bold text-sm lg:text-base"
          >
            <UserIcon className="w-4 h-4" />
            <span>Get Started</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-8 animate-fade-in">
            <span className="px-5 py-2.5 bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 text-primary rounded-full text-sm font-semibold shadow-sm">
              🌎 Connecting J1 Students & Seasonal Workers Worldwide
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-slate-900 via-primary to-purple-600 dark:from-white dark:via-primary dark:to-purple-400 bg-clip-text text-transparent leading-tight tracking-tight">
            Find Your Perfect<br />Housing & Jobs
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            The trusted platform connecting international students and seasonal workers with verified housing and employment opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-purple-700 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 min-w-[240px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <span className="relative">Get Started Free</span>
            </button>
            <a
              href="#how-it-works"
              className="group px-10 py-5 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-lg font-bold hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all hover:scale-105 active:scale-95 min-w-[240px]"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works - Three User Types */}
      <section id="how-it-works" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Simple & Secure
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">
              How VOYA LINK Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Choose your path and start your journey today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* For Students/Workers */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For J1 Students</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Coming to the US for work & travel? Find affordable housing near your workplace and connect with employers looking for seasonal workers.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Search verified housing near your job</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Browse job opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Book instantly & securely</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Find Housing & Jobs
                </button>
              </div>
            </div>

            {/* For Hosts */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Hosts</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Have a spare room or property? Earn extra income by hosting international students and seasonal workers.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">List your property for free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Set your own prices & availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Connect with verified participants</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Become a Host
                </button>
              </div>
            </div>

            {/* For Employers */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Employers</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Looking for seasonal workers? Connect with motivated international students ready to work.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Post job opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Review qualified candidates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Hire seasonal staff efficiently</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  Post a Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Hub Section */}
      <section id="services" className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-24 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-5 py-2.5 bg-white/25 backdrop-blur-md text-white rounded-full text-sm font-bold shadow-lg border border-white/30">
                ✨ NEW: Service Hub
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
              Beyond Housing & Jobs
            </h2>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-2 font-medium leading-relaxed">
              Access essential services, local support, discounts, and community events
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              to make your J1 experience unforgettable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            <button
              onClick={() => setShowAuthModal(true)}
              className="group bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-2xl p-7 hover:bg-white/25 hover:border-white/50 transition-all hover:scale-105 active:scale-95 text-left shadow-xl"
            >
              <div className="w-14 h-14 bg-white/25 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Airport Transfers</h3>
              <p className="text-sm text-white/90 leading-relaxed">Get picked up from the airport and transported safely to your accommodation</p>
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="group bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-2xl p-7 hover:bg-white/25 hover:border-white/50 transition-all hover:scale-105 active:scale-95 text-left shadow-xl"
            >
              <div className="w-14 h-14 bg-white/25 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Group Trips & Events</h3>
              <p className="text-sm text-white/90 leading-relaxed">Join trips and social events organized by students and local providers</p>
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="group bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-2xl p-7 hover:bg-white/25 hover:border-white/50 transition-all hover:scale-105 active:scale-95 text-left shadow-xl"
            >
              <div className="w-14 h-14 bg-white/25 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Student Discounts</h3>
              <p className="text-sm text-white/90 leading-relaxed">Save money with exclusive discounts from local businesses and partners</p>
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              className="group bg-white/15 backdrop-blur-md border-2 border-white/30 rounded-2xl p-7 hover:bg-white/25 hover:border-white/50 transition-all hover:scale-105 active:scale-95 text-left shadow-xl"
            >
              <div className="w-14 h-14 bg-white/25 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Essential Services</h3>
              <p className="text-sm text-white/90 leading-relaxed">Tax help, SIM cards, bedding kits, cleaning, and more</p>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative overflow-hidden bg-white text-purple-600 px-10 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 active:scale-95 min-w-[240px]"
            >
              <span className="relative flex items-center gap-2 justify-center">
                <Star className="w-5 h-5" />
                Browse All Services
              </span>
            </button>
            <button
              onClick={() => setShowBecomeProvider(true)}
              className="group relative overflow-hidden bg-white/20 backdrop-blur-md border-2 border-white/50 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-white/30 hover:border-white transition-all hover:scale-105 active:scale-95 min-w-[240px]"
            >
              <span className="relative flex items-center gap-2 justify-center">
                <Plus className="w-5 h-5" />
                Become a Provider
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose VOYA LINK */}
      <section className="bg-white dark:bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Trusted Platform
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">
              Why Choose VOYA LINK?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We make finding housing and employment simple, secure, and transparent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-3 text-slate-900 dark:text-white text-lg">Secure Deposit Escrow</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">80% of your deposit held safely. Protected until move-out or refunded if host violates terms</p>
            </div>

            <div className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all h-full">
              <div className="w-14 h-14 bg-primary/15 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-3 text-slate-900 dark:text-white text-lg">Flexible Booking</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Book housing for your exact dates - from a few weeks to several months</p>
            </div>

            <div className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all h-full">
              <div className="w-14 h-14 bg-primary/15 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-3 text-slate-900 dark:text-white text-lg">24/7 Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Get help whenever you need it with our dedicated support team</p>
            </div>

            <div className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all h-full">
              <div className="w-14 h-14 bg-primary/15 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold mb-3 text-slate-900 dark:text-white text-lg">Trusted Reviews</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Read real reviews from students and workers who've been there</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Values */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/25 backdrop-blur-md rounded-2xl mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                Our Commitment to You
              </h2>
              <p className="text-xl md:text-2xl text-white/95 leading-relaxed max-w-4xl mx-auto font-semibold">
                Everyone here has rights. Everyone here has responsibilities. Our goal is to make the experience safer, fairer, and more transparent for all sides.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 hover:bg-white/25 transition-all shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 shadow-md">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl mb-2">Safer</h3>
                    <p className="text-sm text-white/90">Protected platform for all users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 hover:bg-white/25 transition-all shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 shadow-md">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl mb-2">Fairer</h3>
                    <p className="text-sm text-white/90">Equal treatment for everyone</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 hover:bg-white/25 transition-all shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 shadow-md">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl mb-2">Transparent</h3>
                    <p className="text-sm text-white/90">Clear and open processes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gradient-to-r from-primary via-purple-600 to-purple-700 py-28 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            Join thousands of international students and seasonal workers who found their perfect housing and employment through VOYA LINK
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative overflow-hidden bg-white text-primary px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 active:scale-95 min-w-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-primary/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <span className="relative">Get Started Free</span>
            </button>
          </div>
          <p className="text-white/80 text-sm mt-6">No credit card required • Takes less than 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-primary to-purple-600 p-2.5 rounded-xl shadow-lg">
                <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                  <path d="M20 15 L40 55 L60 15" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="40" cy="20" r="8" fill="white" opacity="0.3"/>
                  <circle cx="40" cy="20" r="3" fill="white"/>
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold tracking-wide">VOYA LINK</h1>
            </div>
            <p className="text-slate-400 text-base max-w-3xl mx-auto mb-8 leading-relaxed">
              Connecting international students and seasonal workers with trusted housing providers and employers across the United States.
            </p>
            <div className="flex flex-wrap gap-6 justify-center mb-8">
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors font-medium">
                How It Works
              </a>
              <button
                onClick={() => setShowServiceHubModal(true)}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Services
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Become a Host
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Post Jobs
              </button>
            </div>
            <div className="border-t border-slate-800 pt-8">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm">
                  © 2026 VOYA LINK. All rights reserved.
                </p>
                <button
                  onClick={() => setAdminMode('login')}
                  className="text-slate-700 hover:text-slate-500 text-xs transition-colors"
                  title="Admin Access"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showServiceHubModal && (
        <ServiceHubModal
          onClose={() => setShowServiceHubModal(false)}
          onBrowseServices={() => {
            setShowServiceHubModal(false);
            if (user) {
              setCurrentView('services');
            } else {
              setShowAuthModal(true);
            }
          }}
          onBecomeProvider={() => {
            setShowServiceHubModal(false);
            if (user) {
              if (userIsProvider) {
                setCurrentView('providerDashboard');
              } else {
                setShowBecomeProvider(true);
              }
            } else {
              setShowAuthModal(true);
            }
          }}
          onSelectCategory={(category) => {
            setShowServiceHubModal(false);
            if (user) {
              setCurrentView('services');
            } else {
              setShowAuthModal(true);
            }
          }}
        />
      )}

      <HelpChat
        userName={user?.name || 'Guest'}
        userEmail={user?.email || 'guest@unknown'}
        userRole={user?.userType || 'guest'}
        isPublic={!user}
        onCreateChat={handleCreateSupportChat}
        onAddMessage={handleAddChatMessage}
        existingChatId={currentChat?.id}
        existingMessages={currentChat?.messages}
      />
    </div>
  );
}
