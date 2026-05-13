import { useState, useEffect } from 'react';
import { SlidersHorizontal, Heart, User as UserIcon, LogOut, LayoutDashboard, Home, Search, MessageCircle, Bookmark, Calendar, Settings, Briefcase, Star, Building2, DollarSign, Clock, Shield } from 'lucide-react';
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

type View = 'home' | 'details' | 'booking' | 'dashboard' | 'account' | 'verification' | 'search' | 'saved' | 'messages' | 'reservations' | 'jobDetails' | 'job-offers';
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
        <HelpChat userName={user.name} />
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
        <HelpChat userName={user.name} />
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

        {/* Create Listing Modal */}
        {showCreateListing && (
          <CreateListingModal
            onClose={() => setShowCreateListing(false)}
            onSubmit={handleCreateListing}
          />
        )}

        <HelpChat userName={user.name} />
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
        <HelpChat userName={user.name} />
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
        <HelpChat userName={user.name} />
      </div>
    );
  }

  // Participant views (search, saved, messages, reservations, profile, account)
  if ((currentView === 'search' || currentView === 'saved' || currentView === 'messages' || currentView === 'reservations' || currentView === 'account' || currentView === 'job-offers') && user?.userType === 'participant') {
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
              <div>
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

        <HelpChat userName={user.name} />
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
        <HelpChat userName={user?.name} />
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
        <HelpChat userName={user?.name} />
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
        <HelpChat userName={user?.name} />
      </div>
    );
  }

  // Home view - only for logged-out users
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/5 overflow-y-auto">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-wide leading-none">VOYA LINK</h1>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-0.5">Your Journey Starts Here</p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95 font-medium text-sm"
          >
            <UserIcon className="w-4 h-4" />
            <span>Get Started</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              🌎 Connecting J1 Students & Seasonal Workers Worldwide
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-primary to-purple-600 dark:from-white dark:via-primary dark:to-purple-400 bg-clip-text text-transparent leading-tight">
            Find Your Perfect Housing<br />& Employment Match
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            The all-in-one platform connecting international students and seasonal workers with trusted housing providers and employers across the United States
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <span className="relative">Start Your Journey Today</span>
          </button>
        </div>
      </section>

      {/* How It Works - Three User Types */}
      <section className="bg-white dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              How VOYA LINK Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose your role and discover how VOYA LINK connects you
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

      {/* Why Choose VOYA LINK */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Why Choose VOYA LINK?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We make finding housing and employment simple and secure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-lg transition-shadow h-full">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Secure Deposit Escrow</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">80% of your deposit held safely on our platform. Protected until move-out or refunded if host violates terms</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Flexible Booking</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Book housing for your exact dates - from a few weeks to several months</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2 text-slate-900 dark:text-white">24/7 Support</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Get help whenever you need it with our dedicated support team</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow h-full">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Trusted Reviews</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Read real reviews from students and workers who've been there</p>
          </div>
        </div>
      </section>

      {/* Deposit Protection Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-3xl border-2 border-blue-200 dark:border-blue-800 p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Your Money is Protected
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              We hold your deposit securely in escrow to protect both tenants and landlords. No more worrying about sending money to strangers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold mb-2 text-slate-900 dark:text-white">20% Non-Refundable</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                A small booking fee goes directly to the host when you book, showing your commitment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold mb-2 text-slate-900 dark:text-white">80% Held in Escrow</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The majority of your deposit stays safely on our platform via Stripe until your lease ends.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Fair Resolution</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If disputes arise, our team reviews the case and releases funds to the rightful party.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-blue-300 dark:border-blue-700">
            <h3 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white mb-2">If You Follow the Rules</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Move out on time, keep the place clean, and follow lease terms → get your full deposit back at the end
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white mb-2">If Host Acts Inappropriately</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Illegal eviction, unsafe conditions, or violates your rights → we refund your deposit immediately
                </p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white mb-2">If You Break the Terms</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Damage property, skip rent, or violate lease → the deposit is released to the host for damages
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary via-purple-600 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of international students and seasonal workers who found their perfect housing and employment through VOYA LINK
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-primary px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                <path d="M20 15 L40 55 L60 15" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="40" cy="20" r="8" fill="white" opacity="0.3"/>
                <circle cx="40" cy="20" r="3" fill="white"/>
              </svg>
              <h1 className="text-xl font-bold tracking-wide">VOYA LINK</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              © 2026 VOYA LINK. Connecting international students and seasonal workers with housing and employment opportunities.
            </p>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      <HelpChat userName={user?.name} />
    </div>
  );
}
