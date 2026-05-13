import { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';

interface OpenCaseModalProps {
  listingTitle: string;
  hostName: string;
  hostEmail: string;
  onClose: () => void;
  onSubmit: (caseDetails: { category: string; description: string; urgency: string }) => void;
}

export function OpenCaseModal({ listingTitle, hostName, hostEmail, onClose, onSubmit }: OpenCaseModalProps) {
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    if (!category || !urgency || !description || description.length < 20) {
      return;
    }

    // Send case details including host email for backend processing
    console.log('Sending case to host:', {
      hostName,
      hostEmail,
      listingTitle,
      category,
      urgency,
      description,
      timestamp: new Date().toISOString()
    });

    onSubmit({ category, description, urgency });
  };

  // Check if form is valid
  const isFormValid =
    category.length > 0 &&
    urgency.length > 0 &&
    description.length >= 20;

  const categoryOptions = [
    { value: 'maintenance', label: 'Maintenance Issue' },
    { value: 'safety', label: 'Safety Concern' },
    { value: 'cleanliness', label: 'Cleanliness Issue' },
    { value: 'amenities', label: 'Amenities Not Working' },
    { value: 'noise', label: 'Noise Complaint' },
    { value: 'payment', label: 'Payment/Billing Issue' },
    { value: 'lease', label: 'Lease Agreement Question' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low - Can wait a few days', color: 'text-blue-600' },
    { value: 'normal', label: 'Normal - Within 24-48 hours', color: 'text-yellow-600' },
    { value: 'high', label: 'High - Urgent attention needed', color: 'text-orange-600' },
    { value: 'emergency', label: 'Emergency - Immediate attention', color: 'text-red-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2>Open Case with Host</h2>
              <p className="text-sm text-muted-foreground">{listingTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              This case will be sent to <strong>{hostName}</strong> and the Voya Link support team.
              We'll help mediate and ensure your concerns are addressed promptly.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium">
              Issue Category <span className="text-destructive">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a category...</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block mb-2 font-medium">
              Urgency Level <span className="text-destructive">*</span>
            </label>
            <div className="space-y-2">
              {urgencyOptions.map(option => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                    urgency === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={option.value}
                    checked={urgency === option.value}
                    onChange={(e) => setUrgency(e.target.value)}
                    required
                    className="w-4 h-4"
                  />
                  <span className={`text-sm font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {!urgency && (
              <p className="text-xs text-destructive mt-2">Please select an urgency level</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">
              Detailed Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={20}
              rows={6}
              placeholder="Please provide as much detail as possible about the issue. Include any relevant dates, times, and specific details that will help us resolve this quickly."
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters required
              </p>
              <p className={`text-xs ${description.length >= 20 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {description.length}/20
              </p>
            </div>
          </div>

          {/* Emergency Notice */}
          {urgency === 'emergency' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-1">Emergency Protocol</p>
                  <p className="text-sm text-red-600">
                    For life-threatening emergencies, please call 911 immediately.
                    This case system is monitored but may not provide instant response for critical situations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border hover:bg-accent rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isFormValid
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Case</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
