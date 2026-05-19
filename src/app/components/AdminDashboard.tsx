import { useState } from 'react';
import { Shield, AlertTriangle, Flag, Users, Home, MessageSquare, FileText, CheckCircle, XCircle, Clock, TrendingUp, LogOut, Search, Filter, Eye, Ban, Trash2, CheckSquare, UserPlus, Settings as SettingsIcon, Upload, Download, ChevronRight, ArrowLeft, Phone, Mail, MapPin, Calendar, DollarSign, Image as ImageIcon, AlertCircle, RefreshCw, Send, FileCheck, UserCheck, UserX, ShieldCheck, Star, ThumbsUp, ThumbsDown, Plus, Edit, MoreVertical, Building2 } from 'lucide-react';
import { User } from './AuthModal';
import { AdminManagement, AdminAccount } from './AdminManagement';
import { SupportChats, SupportChat } from './SupportChats';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: string;
  isSystemMessage?: boolean;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  adminAccounts: AdminAccount[];
  onCreateAdmin: (admin: Omit<AdminAccount, 'id' | 'createdAt' | 'createdBy' | 'isMaster'>) => void;
  onDeleteAdmin: (adminId: string) => void;
  supportChats: SupportChat[];
  onAddChatMessage: (chatId: string, message: ChatMessage) => void;
  onUpdateChatStatus: (chatId: string, status: 'active' | 'resolved' | 'pending') => void;
  onAssignChat: (chatId: string, adminEmail: string) => void;
}

type AdminView = 'overview' | 'disputes' | 'disputeDetail' | 'reports' | 'reportedListings' | 'reportedUsers' | 'reportedMessages' | 'reviews' | 'users' | 'userDetail' | 'listings' | 'listingDetail' | 'verifications' | 'verificationDetail' | 'emergencies' | 'emergencyDetail' | 'refunds' | 'refundDetail' | 'cancellations' | 'supportTickets' | 'ticketDetail' | 'adminUsers' | 'activityLog' | 'addAdmin' | 'providers' | 'providerDetail' | 'providerServices' | 'serviceDetail' | 'tasks' | 'taskDetail' | 'taskDisputes' | 'goodCauses' | 'supportChats';

interface Case {
  id: string;
  type: 'deposit' | 'emergency' | 'cancellation' | 'refund';
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  hostName: string;
  hostEmail: string;
  hostPhone: string;
  listingTitle: string;
  listingAddress: string;
  status: 'new' | 'waiting_participant' | 'waiting_host' | 'under_review' | 'approved' | 'partially_approved' | 'rejected' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  description: string;
  amount?: number;
  timeline: { date: string; event: string; actor: string }[];
  participantStatement?: string;
  hostStatement?: string;
  proofUploaded?: string[];
  bookingId: string;
  moveInDate: string;
  bookingAmount: number;
  depositAmount: number;
}

interface Report {
  id: string;
  type: 'listing' | 'user' | 'message';
  reportedBy: string;
  reportedByEmail: string;
  reportedItem: string;
  reportedItemId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  proofUploaded?: string[];
}

interface VerificationRequest {
  id: string;
  hostName: string;
  hostEmail: string;
  hostPhone: string;
  status: 'submitted' | 'under_review' | 'more_info_needed' | 'approved' | 'rejected';
  submittedAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  idUploaded: boolean;
  propertyProofUploaded: boolean;
  propertyPhotos: number;
  internalNotes?: string;
}

interface SupportTicket {
  id: string;
  category: 'booking' | 'payment' | 'technical' | 'safety' | 'other';
  userRole: 'participant' | 'host' | 'employer';
  userName: string;
  userEmail: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'open' | 'waiting_user' | 'waiting_admin' | 'resolved' | 'closed';
  subject: string;
  messages: { sender: string; message: string; timestamp: string; isAdmin: boolean }[];
  createdAt: string;
  attachments?: string[];
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'suspended';
  lastActive: string;
  permissions: string[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'participant' | 'host' | 'employer';
  verificationStatus: 'verified' | 'not_verified';
  accountStatus: 'active' | 'warned' | 'suspended' | 'blocked';
  joinedDate: string;
  bookingsCount: number;
  cancellationsCount: number;
  reviewsAverage: number;
  reviewsCount: number;
  reportsAgainst: number;
  casesCount: number;
}

interface ProviderApplication {
  id: string;
  providerType: 'individual' | 'business' | 'student' | 'host_service' | 'employer_service' | 'local_provider';
  fullName: string;
  businessName?: string;
  email: string;
  phone: string;
  serviceCategory: string;
  serviceArea: string;
  description: string;
  pricing: string;
  status: 'pending' | 'approved' | 'rejected' | 'more_info_needed';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  servicesCount?: number;
  rating?: number;
  reviewsCount?: number;
}

interface ServiceListing {
  id: string;
  providerId: string;
  providerName: string;
  category: string;
  title: string;
  status: 'active' | 'paused' | 'reported' | 'suspended';
  reportCount: number;
  createdAt: string;
}

export function AdminDashboard({ user, onLogout, adminAccounts, onCreateAdmin, onDeleteAdmin, supportChats, onAddChatMessage, onUpdateChatStatus, onAssignChat }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderApplication | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);

  // Mock data
  const stats = {
    pendingDisputes: 12,
    depositCases: 7,
    refundExceptions: 5,
    reportedListings: 8,
    reportedUsers: 6,
    reportedMessages: 4,
    reviewModeration: 11,
    hostVerifications: 15,
    emergencyCases: 2,
    cancellationReviews: 9,
    supportTickets: 23,
    suspendedUsers: 3,
    activeUsers: 1247,
    activeListings: 342,
    pendingProviders: 8,
    activeProviders: 45,
    reportedServices: 3,
    taskDisputes: 5,
    reportedTasks: 3,
    activeTasks: 142,
    completedTasks: 856,
    totalRewardsPaid: 12450
  };

  const mockCases: Case[] = [
    {
      id: 'C001',
      type: 'deposit',
      participantName: 'Sarah Johnson',
      participantEmail: 'sarah.j@email.com',
      participantPhone: '+1 305-555-0123',
      hostName: 'Mike Chen',
      hostEmail: 'mike.chen@email.com',
      hostPhone: '+1 305-555-0456',
      listingTitle: 'Cozy Studio in Miami Beach',
      listingAddress: '123 Ocean Drive, Miami Beach, FL',
      status: 'under_review',
      priority: 'high',
      createdAt: '2026-05-17',
      description: 'Host claims damage to furniture, requesting $200 from deposit',
      amount: 200,
      bookingId: 'BK-2024-001',
      moveInDate: '2026-05-01',
      bookingAmount: 1200,
      depositAmount: 500,
      participantStatement: 'The furniture was already damaged when I moved in. I took photos on day 1 which show the existing scratches.',
      hostStatement: 'The coffee table was in perfect condition before Sarah moved in. She admitted to having guests over which is when the damage occurred.',
      proofUploaded: ['furniture_damage_1.jpg', 'furniture_damage_2.jpg', 'participant_move_in_photos.jpg'],
      timeline: [
        { date: '2026-05-17 14:23', event: 'Case opened by host', actor: 'Mike Chen' },
        { date: '2026-05-17 16:45', event: 'Participant uploaded evidence', actor: 'Sarah Johnson' },
        { date: '2026-05-18 09:12', event: 'Case under admin review', actor: 'Admin' }
      ]
    },
    {
      id: 'C002',
      type: 'emergency',
      participantName: 'Anna Kowalski',
      participantEmail: 'anna.k@email.com',
      participantPhone: '+1 407-555-0789',
      hostName: 'John Smith',
      hostEmail: 'john.smith@email.com',
      hostPhone: '+1 407-555-0321',
      listingTitle: 'Shared Room - Orlando',
      listingAddress: '456 International Drive, Orlando, FL',
      status: 'new',
      priority: 'urgent',
      createdAt: '2026-05-18',
      description: 'Participant arrived but host not responding, needs immediate housing',
      bookingId: 'BK-2024-002',
      moveInDate: '2026-05-18',
      bookingAmount: 800,
      depositAmount: 300,
      timeline: [
        { date: '2026-05-18 08:15', event: 'Emergency case opened', actor: 'Anna Kowalski' }
      ]
    }
  ];

  const mockReports: Report[] = [
    {
      id: 'R001',
      type: 'listing',
      reportedBy: 'User #1234',
      reportedByEmail: 'reporter@email.com',
      reportedItem: 'Downtown Apartment',
      reportedItemId: 'L-789',
      reason: 'Wrong photos',
      details: 'The photos shown in the listing are completely different from the actual apartment. The listing shows a modern renovated unit but the actual apartment is outdated.',
      status: 'pending',
      priority: 'high',
      createdAt: '2026-05-17',
      proofUploaded: ['actual_apartment_1.jpg', 'actual_apartment_2.jpg']
    },
    {
      id: 'R002',
      type: 'message',
      reportedBy: 'User #5678',
      reportedByEmail: 'safety@email.com',
      reportedItem: 'Message from Host #9012',
      reportedItemId: 'M-456',
      reason: 'Requesting payment outside platform',
      details: 'Host asked me to send deposit via Venmo instead of through the platform.',
      status: 'pending',
      priority: 'high',
      createdAt: '2026-05-18',
      proofUploaded: ['message_screenshot.jpg']
    }
  ];

  const mockVerifications: VerificationRequest[] = [
    {
      id: 'V001',
      hostName: 'Maria Rodriguez',
      hostEmail: 'maria.r@email.com',
      hostPhone: '+1 786-555-0111',
      status: 'under_review',
      submittedAt: '2026-05-16',
      emailVerified: true,
      phoneVerified: true,
      idUploaded: true,
      propertyProofUploaded: true,
      propertyPhotos: 8
    },
    {
      id: 'V002',
      hostName: 'David Kim',
      hostEmail: 'david.kim@email.com',
      hostPhone: '+1 954-555-0222',
      status: 'submitted',
      submittedAt: '2026-05-18',
      emailVerified: true,
      phoneVerified: true,
      idUploaded: true,
      propertyProofUploaded: false,
      propertyPhotos: 5
    }
  ];

  const mockTickets: SupportTicket[] = [
    {
      id: 'T001',
      category: 'payment',
      userRole: 'participant',
      userName: 'Emma Wilson',
      userEmail: 'emma.w@email.com',
      priority: 'medium',
      status: 'open',
      subject: 'Payment not processed',
      messages: [
        { sender: 'Emma Wilson', message: 'My payment was declined but I was charged. Please help!', timestamp: '2026-05-17 10:30', isAdmin: false },
        { sender: 'Admin Support', message: 'We are looking into this. Can you provide the transaction ID?', timestamp: '2026-05-17 11:15', isAdmin: true },
        { sender: 'Emma Wilson', message: 'Transaction ID: TXN-20260517-001', timestamp: '2026-05-17 11:45', isAdmin: false }
      ],
      createdAt: '2026-05-17',
      attachments: ['payment_receipt.pdf']
    }
  ];

  const mockUsers: UserProfile[] = [
    {
      id: 'U001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 305-555-0123',
      role: 'participant',
      verificationStatus: 'verified',
      accountStatus: 'active',
      joinedDate: '2025-11-15',
      bookingsCount: 5,
      cancellationsCount: 0,
      reviewsAverage: 4.8,
      reviewsCount: 4,
      reportsAgainst: 0,
      casesCount: 1
    }
  ];

  const mockProviders: ProviderApplication[] = [
    {
      id: 'P001',
      providerType: 'individual',
      fullName: 'John Driver',
      email: 'john.driver@email.com',
      phone: '+1 843-555-0100',
      serviceCategory: 'Airport Transfers',
      serviceArea: 'Charleston to Myrtle Beach',
      description: 'Professional transfer service with comfortable vehicles',
      pricing: '$45 per ride',
      status: 'pending',
      submittedAt: '2026-05-17',
    },
    {
      id: 'P002',
      providerType: 'business',
      fullName: 'Maria Santos',
      businessName: 'Clean Home Services',
      email: 'maria@cleanhome.com',
      phone: '+1 843-555-0200',
      serviceCategory: 'Cleaning Services',
      serviceArea: 'Myrtle Beach area',
      description: 'Professional cleaning services for student housing',
      pricing: '$80 per cleaning',
      status: 'approved',
      submittedAt: '2026-05-10',
      reviewedBy: 'Admin',
      reviewedAt: '2026-05-11',
      servicesCount: 3,
      rating: 4.9,
      reviewsCount: 15,
    },
    {
      id: 'P003',
      providerType: 'student',
      fullName: 'Alex Chen',
      email: 'alex.chen@email.com',
      phone: '+1 843-555-0300',
      serviceCategory: 'Events',
      serviceArea: 'Myrtle Beach',
      description: 'Organizing beach volleyball tournaments and social events',
      pricing: 'Free events',
      status: 'approved',
      submittedAt: '2026-05-08',
      reviewedBy: 'Admin',
      reviewedAt: '2026-05-09',
      servicesCount: 2,
      rating: 4.7,
      reviewsCount: 8,
    },
  ];

  const mockProviderServices: ServiceListing[] = [
    {
      id: 'S001',
      providerId: 'P002',
      providerName: 'Clean Home Services',
      category: 'Cleaning',
      title: 'Student Housing Deep Cleaning',
      status: 'active',
      reportCount: 0,
      createdAt: '2026-05-11',
    },
    {
      id: 'S002',
      providerId: 'P003',
      providerName: 'Alex Chen',
      category: 'Events',
      title: 'Beach Volleyball Tournament',
      status: 'active',
      reportCount: 0,
      createdAt: '2026-05-10',
    },
    {
      id: 'S003',
      providerId: 'P002',
      providerName: 'Clean Home Services',
      category: 'Cleaning',
      title: 'Move-Out Cleaning Service',
      status: 'reported',
      reportCount: 1,
      createdAt: '2026-05-12',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'approved':
      case 'verified':
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'under_review':
      case 'reviewing':
      case 'open':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'rejected':
      case 'blocked':
      case 'suspended':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'waiting_participant':
      case 'waiting_host':
      case 'waiting_user':
      case 'waiting_admin':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'new':
      case 'pending':
      case 'submitted':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
    }
  };

  const viewDisputeDetail = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setCurrentView('disputeDetail');
  };

  const viewReportDetail = (report: Report) => {
    setSelectedReport(report);
    if (report.type === 'listing') setCurrentView('reportedListings');
    if (report.type === 'message') setCurrentView('reportedMessages');
    if (report.type === 'user') setCurrentView('reportedUsers');
  };

  const viewVerificationDetail = (verification: VerificationRequest) => {
    setSelectedVerification(verification);
    setCurrentView('verificationDetail');
  };

  const viewTicketDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setCurrentView('ticketDetail');
  };

  const viewUserDetail = (userProfile: UserProfile) => {
    setSelectedUser(userProfile);
    setCurrentView('userDetail');
  };

  // Overview Dashboard
  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>

      {/* Action Required Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('emergencies')}
          className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-red-600">{stats.emergencyCases}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Emergency Housing Cases</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Requires immediate action</p>
        </button>

        <button
          onClick={() => setCurrentView('disputes')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-orange-600">{stats.depositCases}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Deposit Disputes</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Pending resolution</p>
        </button>

        <button
          onClick={() => setCurrentView('refunds')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              <RefreshCw className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-blue-600">{stats.refundExceptions}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Refund Exception Requests</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Awaiting review</p>
        </button>

        <button
          onClick={() => setCurrentView('reports')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
              <Flag className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-purple-600">{stats.reportedListings}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Reported Listings</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Needs moderation</p>
        </button>

        <button
          onClick={() => setCurrentView('reportedUsers')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white">
              <UserX className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-pink-600">{stats.reportedUsers}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Reported Users</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">User reports</p>
        </button>

        <button
          onClick={() => setCurrentView('reportedMessages')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-red-600">{stats.reportedMessages}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Reported Messages</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Safety review needed</p>
        </button>

        <button
          onClick={() => setCurrentView('reviews')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-yellow-600">{stats.reviewModeration}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Review Moderation</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Flagged reviews</p>
        </button>

        <button
          onClick={() => setCurrentView('verifications')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-green-600">{stats.hostVerifications}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Host Verification Applications</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Pending approval</p>
        </button>

        <button
          onClick={() => setCurrentView('cancellations')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
              <XCircle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-indigo-600">{stats.cancellationReviews}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Cancellation Reviews</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Policy enforcement</p>
        </button>

        <button
          onClick={() => setCurrentView('supportTickets')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-cyan-600">{stats.supportTickets}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Open Support Tickets</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">User inquiries</p>
        </button>

        <button
          onClick={() => setCurrentView('supportChats')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-blue-600">{supportChats.length}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Support Chats</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Live help conversations</p>
        </button>

        <button
          onClick={() => setCurrentView('users')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center text-white">
              <Ban className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-slate-600">{stats.suspendedUsers}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Suspended Users</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Account restrictions</p>
        </button>

        <button
          onClick={() => setCurrentView('activityLog')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-teal-600">View Log</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Recent Admin Actions</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Activity history</p>
        </button>

        <button
          onClick={() => setCurrentView('providers')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center text-white">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-violet-600">{stats.pendingProviders}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Provider Applications</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Pending approval</p>
        </button>

        <button
          onClick={() => setCurrentView('taskDisputes')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-amber-600">{stats.taskDisputes}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Task Disputes</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Reward & completion issues</p>
        </button>

        <button
          onClick={() => setCurrentView('tasks')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-emerald-600">{stats.reportedTasks}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Reported Tasks</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Inappropriate or unsafe</p>
        </button>

        <button
          onClick={() => setCurrentView('goodCauses')}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-pink-600">${(stats.totalRewardsPaid * 0.15).toFixed(0)}</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Good Causes Fund</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Community contributions</p>
        </button>
      </div>

      {/* Platform Stats */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Platform Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.activeUsers}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.activeListings}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Listings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600">{stats.activeProviders}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.reportedServices}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Reported Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">94%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Resolution Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">2.4h</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Disputes List
  const renderDisputes = () => (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('overview')}
        className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Disputes & Cases</h2>
      </div>

      {mockCases.map((caseItem) => (
        <div key={caseItem.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-400">#{caseItem.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(caseItem.priority)}`}>
                  {caseItem.priority.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseItem.status)}`}>
                  {caseItem.status.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                  {caseItem.type.toUpperCase()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{caseItem.listingTitle}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{caseItem.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Participant:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{caseItem.participantName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Host:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{caseItem.hostName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Filed:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                </div>
                {caseItem.amount && (
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Amount:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">${caseItem.amount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => viewDisputeDetail(caseItem)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Review Full Case
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Dispute Detail View
  const renderDisputeDetail = () => {
    if (!selectedCase) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('disputes')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Disputes
        </button>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Case #{selectedCase.id}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(selectedCase.priority)}`}>
                  {selectedCase.priority.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedCase.status)}`}>
                  {selectedCase.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{selectedCase.description}</p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Booking Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-semibold">Booking ID:</span> {selectedCase.bookingId}
              </div>
              <div>
                <span className="font-semibold">Listing:</span> {selectedCase.listingTitle}
              </div>
              <div>
                <span className="font-semibold">Address:</span> {selectedCase.listingAddress}
              </div>
              <div>
                <span className="font-semibold">Move-in Date:</span> {new Date(selectedCase.moveInDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold">Booking Amount:</span> ${selectedCase.bookingAmount}
              </div>
              <div>
                <span className="font-semibold">Deposit Amount:</span> ${selectedCase.depositAmount}
              </div>
            </div>
          </div>

          {/* Parties Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Participant</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>{selectedCase.participantName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedCase.participantEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedCase.participantPhone}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Host</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>{selectedCase.hostName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedCase.hostEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedCase.hostPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statements */}
          {selectedCase.participantStatement && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Participant Statement</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{selectedCase.participantStatement}</p>
            </div>
          )}

          {selectedCase.hostStatement && (
            <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Host Statement</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{selectedCase.hostStatement}</p>
            </div>
          )}

          {/* Uploaded Proof */}
          {selectedCase.proofUploaded && selectedCase.proofUploaded.length > 0 && (
            <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Uploaded Evidence</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedCase.proofUploaded.map((file, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{file}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Case Timeline</h3>
            <div className="space-y-3">
              {selectedCase.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{event.event}</p>
                    <p className="text-xs text-slate-500">{event.actor} • {event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Decision Panel */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Decision Panel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                <CheckCircle className="w-5 h-5" />
                Approve Participant Refund
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <CheckCircle className="w-5 h-5" />
                Approve Host Claim
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                <CheckSquare className="w-5 h-5" />
                Partially Approve
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                <XCircle className="w-5 h-5" />
                Reject Claim
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                <Upload className="w-5 h-5" />
                Request More Evidence
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
                <CheckSquare className="w-5 h-5" />
                Mark Resolved
              </button>
            </div>

            {/* Internal Admin Note */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Internal Admin Note (visible only to admins)
              </label>
              <textarea
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Add internal notes about this decision..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Reports Overview
  const renderReports = () => (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('overview')}
        className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Reports</h2>

      {mockReports.map((report) => (
        <div key={report.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-400">#{report.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                  {report.status.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(report.priority)}`}>
                  {report.priority.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                  {report.type.toUpperCase()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{report.reportedItem}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                <span className="font-semibold">Reason:</span> {report.reason}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{report.details}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Reported by:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{report.reportedBy}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Date:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Eye className="w-4 h-4" />
              Investigate
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Trash2 className="w-4 h-4" />
              Remove Content
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Ban className="w-4 h-4" />
              Suspend User
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Dismiss Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Verifications List
  const renderVerifications = () => (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('overview')}
        className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Host Verification Applications</h2>

      {mockVerifications.map((verification) => (
        <div key={verification.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-400">#{verification.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(verification.status)}`}>
                  {verification.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{verification.hostName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{verification.hostEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{verification.hostPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className={`flex items-center gap-2 text-sm ${verification.emailVerified ? 'text-green-600' : 'text-slate-400'}`}>
                  {verification.emailVerified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  Email Verified
                </div>
                <div className={`flex items-center gap-2 text-sm ${verification.phoneVerified ? 'text-green-600' : 'text-slate-400'}`}>
                  {verification.phoneVerified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  Phone Verified
                </div>
                <div className={`flex items-center gap-2 text-sm ${verification.idUploaded ? 'text-green-600' : 'text-slate-400'}`}>
                  {verification.idUploaded ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  ID Uploaded
                </div>
                <div className={`flex items-center gap-2 text-sm ${verification.propertyProofUploaded ? 'text-green-600' : 'text-slate-400'}`}>
                  {verification.propertyProofUploaded ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  Property Proof
                </div>
                <div className={`flex items-center gap-2 text-sm ${verification.propertyPhotos >= 5 ? 'text-green-600' : 'text-slate-400'}`}>
                  {verification.propertyPhotos >= 5 ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  Photos ({verification.propertyPhotos})
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => viewVerificationDetail(verification)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Review Application
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Approve Verification
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <Upload className="w-4 h-4" />
              Request More Docs
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Support Tickets List
  const renderSupportTickets = () => (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('overview')}
        className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h2>

      {mockTickets.map((ticket) => (
        <div key={ticket.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-400">#{ticket.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {ticket.category.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                  {ticket.userRole.toUpperCase()}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{ticket.subject}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Last message: "{ticket.messages[ticket.messages.length - 1].message.substring(0, 100)}..."
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">User:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{ticket.userName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Messages:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{ticket.messages.length}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Created:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => viewTicketDetail(ticket)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              View & Reply
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Resolve Ticket
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Ticket Detail View
  const renderTicketDetail = () => {
    if (!selectedTicket) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentView('supportTickets')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Tickets
        </button>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTicket.subject}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span>Ticket #{selectedTicket.id}</span>
                <span>•</span>
                <span>{selectedTicket.userName}</span>
                <span>•</span>
                <span>{selectedTicket.category}</span>
              </div>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="mb-6 space-y-4">
            {selectedTicket.messages.map((message, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  message.isAdmin
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {message.isAdmin ? '🛡️ ' : ''}{message.sender}
                  </span>
                  <span className="text-xs text-slate-500">{message.timestamp}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{message.message}</p>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Reply to User
            </label>
            <textarea
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
              rows={4}
              placeholder="Type your response..."
            />
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Send className="w-4 h-4" />
                Send Reply
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Resolve & Close
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <AlertTriangle className="w-4 h-4" />
                Escalate to Case
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Users List
  const renderUsers = () => (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('overview')}
        className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          All Users
        </button>
        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Participants
        </button>
        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Hosts
        </button>
        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          Employers
        </button>
        <button className="px-4 py-2 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          Suspended ({stats.suspendedUsers})
        </button>
      </div>

      {mockUsers.map((userProfile) => (
        <div key={userProfile.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{userProfile.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(userProfile.accountStatus)}`}>
                  {userProfile.accountStatus.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(userProfile.verificationStatus)}`}>
                  {userProfile.verificationStatus === 'verified' ? '✓ VERIFIED' : 'NOT VERIFIED'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {userProfile.role.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{userProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Joined {new Date(userProfile.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Bookings:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{userProfile.bookingsCount}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Reviews:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{userProfile.reviewsAverage} ({userProfile.reviewsCount})</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Reports:</span>{' '}
                  <span className={userProfile.reportsAgainst > 0 ? 'text-red-600 font-semibold' : 'text-slate-600 dark:text-slate-400'}>
                    {userProfile.reportsAgainst}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Cases:</span>{' '}
                  <span className={userProfile.casesCount > 0 ? 'text-orange-600 font-semibold' : 'text-slate-600 dark:text-slate-400'}>
                    {userProfile.casesCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => viewUserDetail(userProfile)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Full Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <AlertCircle className="w-4 h-4" />
              Warn User
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Ban className="w-4 h-4" />
              Suspend Account
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Activity Log
  const renderActivityLog = () => (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('overview')}
        className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Activity Log</h2>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {[
          { admin: 'Admin User', action: 'Approved host verification', target: 'Maria Rodriguez (V001)', time: '2 hours ago', type: 'success' },
          { admin: 'Admin User', action: 'Resolved deposit dispute', target: 'Case #C123', time: '3 hours ago', type: 'success' },
          { admin: 'Admin User', action: 'Removed reported listing', target: 'Downtown Apartment (L-789)', time: '5 hours ago', type: 'warning' },
          { admin: 'Admin User', action: 'Suspended user account', target: 'User #4567', time: '6 hours ago', type: 'error' },
          { admin: 'Admin User', action: 'Approved partial refund', target: 'Case #C098', time: '1 day ago', type: 'success' },
          { admin: 'Admin User', action: 'Requested more evidence', target: 'Case #C045', time: '1 day ago', type: 'info' },
          { admin: 'Admin User', action: 'Dismissed report', target: 'Report #R234', time: '2 days ago', type: 'info' }
        ].map((log, idx) => (
          <div key={idx} className="p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                log.type === 'success' ? 'bg-green-500' :
                log.type === 'warning' ? 'bg-orange-500' :
                log.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">
                  <span className="font-semibold">{log.admin}</span> {log.action}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{log.target}</p>
                <p className="text-xs text-slate-500 mt-1">{log.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProviders = () => (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentView('overview')}
        className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Provider Applications</h2>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-lg font-medium">
          Pending ({mockProviders.filter(p => p.status === 'pending').length})
        </button>
        <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          Approved ({mockProviders.filter(p => p.status === 'approved').length})
        </button>
        <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          All ({mockProviders.length})
        </button>
      </div>

      <div className="space-y-3">
        {mockProviders.map((provider) => (
          <div key={provider.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {provider.businessName || provider.fullName}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    provider.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                    provider.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    provider.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                    'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                  }`}>
                    {provider.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {provider.serviceCategory} • {provider.serviceArea}
                </div>
                <div className="text-sm text-slate-500 capitalize">
                  {provider.providerType.replace('_', ' ')} provider
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">
                Submitted {new Date(provider.submittedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedProvider(provider);
                    setCurrentView('providerDetail');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProviderDetail = () => {
    if (!selectedProvider) return null;

    return (
      <div className="space-y-4">
        <button
          onClick={() => {
            setSelectedProvider(null);
            setCurrentView('providers');
          }}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Providers
        </button>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {selectedProvider.businessName || selectedProvider.fullName}
              </h2>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                selectedProvider.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                selectedProvider.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                selectedProvider.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
              }`}>
                {selectedProvider.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Provider Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Name:</span>
                  <span className="text-slate-900 dark:text-white">{selectedProvider.fullName}</span>
                </div>
                {selectedProvider.businessName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Business:</span>
                    <span className="text-slate-900 dark:text-white">{selectedProvider.businessName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Email:</span>
                  <span className="text-slate-900 dark:text-white">{selectedProvider.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Phone:</span>
                  <span className="text-slate-900 dark:text-white">{selectedProvider.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Service Area:</span>
                  <span className="text-slate-900 dark:text-white">{selectedProvider.serviceArea}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Service Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Category:</span>
                  <div className="text-slate-900 dark:text-white">{selectedProvider.serviceCategory}</div>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Provider Type:</span>
                  <div className="text-slate-900 dark:text-white capitalize">{selectedProvider.providerType.replace('_', ' ')}</div>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Pricing:</span>
                  <div className="text-slate-900 dark:text-white">{selectedProvider.pricing}</div>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Submitted:</span>
                  <div className="text-slate-900 dark:text-white">{new Date(selectedProvider.submittedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-400">{selectedProvider.description}</p>
          </div>

          {selectedProvider.status === 'pending' && (
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {}}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Application
              </button>
              <button
                onClick={() => {}}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Request More Info
              </button>
              <button
                onClick={() => {}}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-purple-100">{user.name} - Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('adminUsers')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Manage Admins</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Only show on overview */}
      {currentView === 'overview' && (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{stats.pendingDisputes}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Total Disputes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{stats.emergencyCases}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Emergencies</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{stats.reportedListings + stats.reportedUsers + stats.reportedMessages}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.hostVerifications}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Verifications</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cyan-600">{stats.supportTickets}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Support Tickets</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-slate-600">{stats.suspendedUsers}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Suspended</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Search and Filters - Hide on detail views */}
        {!currentView.includes('Detail') && currentView !== 'overview' && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        )}

        {/* Render Current View */}
        {currentView === 'overview' && renderOverview()}
        {currentView === 'disputes' && renderDisputes()}
        {currentView === 'disputeDetail' && renderDisputeDetail()}
        {currentView === 'reports' && renderReports()}
        {currentView === 'verifications' && renderVerifications()}
        {currentView === 'supportTickets' && renderSupportTickets()}
        {currentView === 'ticketDetail' && renderTicketDetail()}
        {currentView === 'users' && renderUsers()}
        {currentView === 'activityLog' && renderActivityLog()}
        {currentView === 'providers' && renderProviders()}
        {currentView === 'providerDetail' && renderProviderDetail()}

        {/* Admin Management */}
        {currentView === 'adminUsers' && (
          <div>
            <button
              onClick={() => setCurrentView('overview')}
              className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <AdminManagement
              currentAdminEmail={user.email}
              admins={adminAccounts}
              onCreateAdmin={onCreateAdmin}
              onDeleteAdmin={onDeleteAdmin}
            />
          </div>
        )}

        {/* Support Chats */}
        {currentView === 'supportChats' && (
          <div>
            <button
              onClick={() => setCurrentView('overview')}
              className="flex items-center gap-2 text-primary hover:text-purple-700 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <SupportChats
              chats={supportChats}
              currentAdminEmail={user.email}
              onAddMessage={onAddChatMessage}
              onUpdateStatus={onUpdateChatStatus}
              onAssignChat={onAssignChat}
            />
          </div>
        )}

        {/* Placeholder for other views */}
        {['reportedListings', 'reportedUsers', 'reportedMessages', 'reviews', 'emergencies', 'refunds', 'cancellations', 'listings', 'providerServices', 'serviceDetail', 'tasks', 'taskDetail', 'taskDisputes', 'goodCauses'].includes(currentView) && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace(/([A-Z])/g, ' $1')} Section
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              This section displays {currentView.replace(/([A-Z])/g, ' $1').toLowerCase()} management interface
            </p>
            <button
              onClick={() => setCurrentView('overview')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
