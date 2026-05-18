import { useState } from 'react';
import { Shield, Phone, Mail, User, Globe, AlertTriangle, Lock, Info, CheckCircle } from 'lucide-react';

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  country?: string;
}

interface EmergencyContactFormProps {
  existingContact?: EmergencyContact;
  onSave: (contact: EmergencyContact) => void;
  onCancel?: () => void;
  isRequired?: boolean;
}

const relationshipOptions = [
  'Parent',
  'Sibling',
  'Spouse/Partner',
  'Friend',
  'Guardian',
  'Relative',
  'Other'
];

export function EmergencyContactForm({
  existingContact,
  onSave,
  onCancel,
  isRequired = false
}: EmergencyContactFormProps) {
  const [contact, setContact] = useState<EmergencyContact>(existingContact || {
    name: '',
    relationship: '',
    phoneNumber: '',
    email: '',
    country: ''
  });

  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.relationship || !contact.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(contact);
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Emergency Contact</h2>
            <p className="text-sm text-blue-100">
              {isRequired ? 'Required for all participants' : 'Recommended for your safety'}
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
              Your Privacy is Protected
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
              Emergency contact information is kept strictly confidential and only shared when necessary for safety.
            </p>
            <button
              onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
              className="text-xs font-semibold text-blue-900 dark:text-blue-100 hover:underline"
            >
              {showPrivacyInfo ? 'Hide' : 'Show'} who can see this →
            </button>

            {showPrivacyInfo && (
              <div className="mt-3 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <h5 className="font-semibold text-slate-900 dark:text-white text-xs mb-2">Who Can See Your Emergency Contact:</h5>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Host:</strong> Only after you have a confirmed booking with them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Employer:</strong> Only if you're connected to them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Admin:</strong> Only for safety/emergency support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Never shared:</strong> With general public or other users</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              placeholder="John Smith"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Relationship *
          </label>
          <select
            value={contact.relationship}
            onChange={(e) => setContact({ ...contact, relationship: e.target.value })}
            required
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select relationship</option>
            {relationshipOptions.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              value={contact.phoneNumber}
              onChange={(e) => setContact({ ...contact, phoneNumber: e.target.value })}
              placeholder="+1 (555) 123-4567"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Include country code for international numbers
          </p>
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="emergency@email.com"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Country (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Country <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={contact.country}
              onChange={(e) => setContact({ ...contact, country: e.target.value })}
              placeholder="United States"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Why We Need This */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">
                Why do we need this?
              </h5>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>• In case of emergency, we can contact someone on your behalf</li>
                <li>• If you become unreachable during your stay</li>
                <li>• For urgent situations that require immediate family notification</li>
                <li>• Required by some hosts for safety and liability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {existingContact ? 'Update Emergency Contact' : 'Save Emergency Contact'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Security Note */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
            <Lock className="w-3 h-3" />
            <span>This information is encrypted and securely stored</span>
          </div>
        </div>
      </form>
    </div>
  );
}
