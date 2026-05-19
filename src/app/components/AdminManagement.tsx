import { useState } from 'react';
import { Shield, Plus, Trash2, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Crown } from 'lucide-react';

export interface AdminAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  createdBy: string;
  isMaster: boolean;
}

interface AdminManagementProps {
  currentAdminEmail: string;
  admins: AdminAccount[];
  onCreateAdmin: (admin: Omit<AdminAccount, 'id' | 'createdAt' | 'createdBy' | 'isMaster'>) => void;
  onDeleteAdmin: (adminId: string) => void;
}

export function AdminManagement({ currentAdminEmail, admins, onCreateAdmin, onDeleteAdmin }: AdminManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const MASTER_EMAIL = 'ekaterinadumaeva@gmail.com';
  const isMasterAdmin = currentAdminEmail === MASTER_EMAIL;

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!newAdminData.email || !newAdminData.password || !newAdminData.name) {
      setError('All fields are required');
      return;
    }

    if (!newAdminData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (newAdminData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check if email already exists
    if (admins.some(admin => admin.email.toLowerCase() === newAdminData.email.toLowerCase())) {
      setError('An admin with this email already exists');
      return;
    }

    // Check if trying to create another master admin
    if (newAdminData.email.toLowerCase() === MASTER_EMAIL.toLowerCase() && currentAdminEmail !== MASTER_EMAIL) {
      setError('Cannot create master admin account');
      return;
    }

    // Create new admin
    onCreateAdmin(newAdminData);

    // Reset form
    setNewAdminData({ email: '', password: '', name: '' });
    setShowCreateForm(false);
    setSuccess('Admin account created successfully!');

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAdmin = (adminId: string, adminEmail: string) => {
    // Protect master admin
    if (adminEmail === MASTER_EMAIL) {
      setError('Cannot delete master admin account');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (confirm(`Are you sure you want to delete admin account: ${adminEmail}?\n\nThis action cannot be undone.`)) {
      onDeleteAdmin(adminId);
      setSuccess('Admin account deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const togglePasswordVisibility = (adminId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Admin Management
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage administrator accounts and permissions
          </p>
        </div>

        {isMasterAdmin && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create New Admin
          </button>
        )}
      </div>

      {/* Master Admin Only Notice */}
      {!isMasterAdmin && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Limited Access</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Only the master administrator can create or delete admin accounts. You can view the list of administrators below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Create Admin Form */}
      {showCreateForm && isMasterAdmin && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Admin Account</h3>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Password * (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  placeholder="Enter secure password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:outline-none text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Create Admin Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewAdminData({ email: '', password: '', name: '' });
                  setError('');
                }}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Accounts List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Administrator Accounts ({admins.length})
        </h3>

        <div className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className={`p-5 rounded-xl border-2 transition-all ${
                admin.isMaster
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-800'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {admin.isMaster && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-md">
                        <Crown className="w-3.5 h-3.5" />
                        MASTER ADMIN
                      </div>
                    )}
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{admin.name}</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{admin.email}</span>
                    </div>

                    {/* Password field - hidden for master admin */}
                    {!admin.isMaster && isMasterAdmin && (
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 dark:text-slate-300 font-mono">
                          {showPassword[admin.id] ? admin.password : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(admin.id)}
                          className="ml-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                          title={showPassword[admin.id] ? 'Hide password' : 'Show password'}
                        >
                          {showPassword[admin.id] ? (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                      </div>
                    )}

                    {admin.isMaster && (
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-500 dark:text-slate-400 italic">Password protected and hidden</span>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      Created: {new Date(admin.createdAt).toLocaleDateString()} at {new Date(admin.createdAt).toLocaleTimeString()}
                      {admin.createdBy && ` by ${admin.createdBy}`}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4">
                  {!admin.isMaster && isMasterAdmin ? (
                    <button
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                      title="Delete admin account"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  ) : admin.isMaster ? (
                    <div className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Protected
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Master Admin Special Notice */}
              {admin.isMaster && (
                <div className="mt-4 pt-4 border-t-2 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2 text-xs text-yellow-800 dark:text-yellow-300">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      This is the master administrator account with full system privileges. It cannot be deleted or modified by anyone. The password is securely protected and cannot be viewed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {admins.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No admin accounts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
