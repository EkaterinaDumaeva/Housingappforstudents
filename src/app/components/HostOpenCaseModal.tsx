import { useState } from 'react';
import { X, AlertTriangle, DollarSign, FileText, Scale } from 'lucide-react';

interface HostOpenCaseModalProps {
  onClose: () => void;
  onSubmit: (caseData: HostCaseData) => void;
  participantName: string;
  participantEmail: string;
  reservationId: string;
  listingTitle: string;
}

export interface HostCaseData {
  category: string;
  description: string;
  urgency: string;
  includeFine: boolean;
  fineAmount?: number;
  fineReason?: string;
  evidence?: string;
}

const caseCategories = [
  {
    value: 'property-damage',
    label: 'Property Damage',
    description: 'Participant caused damage to the property',
    canIncludeFine: true
  },
  {
    value: 'noise-complaint',
    label: 'Noise Complaint',
    description: 'Excessive noise or disturbance',
    canIncludeFine: true
  },
  {
    value: 'unauthorized-participants',
    label: 'Unauthorized Participants',
    description: 'Participant brought unauthorized people',
    canIncludeFine: true
  },
  {
    value: 'smoking-violation',
    label: 'Smoking Violation',
    description: 'Smoking in non-smoking property',
    canIncludeFine: true
  },
  {
    value: 'pet-violation',
    label: 'Pet Violation',
    description: 'Unauthorized pets on property',
    canIncludeFine: true
  },
  {
    value: 'late-payment',
    label: 'Late Payment',
    description: 'Rent or fees paid late',
    canIncludeFine: true
  },
  {
    value: 'rule-violation',
    label: 'House Rules Violation',
    description: 'Violated agreed-upon house rules',
    canIncludeFine: true
  },
  {
    value: 'cleanliness',
    label: 'Cleanliness Issues',
    description: 'Property left in poor condition',
    canIncludeFine: true
  },
  {
    value: 'parking-violation',
    label: 'Parking Violation',
    description: 'Unauthorized parking or violations',
    canIncludeFine: true
  },
  {
    value: 'safety-concern',
    label: 'Safety Concern',
    description: 'Actions that compromised safety',
    canIncludeFine: false
  },
  {
    value: 'other',
    label: 'Other Issue',
    description: 'Other concerns not listed above',
    canIncludeFine: true
  }
];

export function HostOpenCaseModal({
  onClose,
  onSubmit,
  participantName,
  participantEmail,
  reservationId,
  listingTitle
}: HostOpenCaseModalProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [includeFine, setIncludeFine] = useState(false);
  const [fineAmount, setFineAmount] = useState('');
  const [fineReason, setFineReason] = useState('');
  const [evidence, setEvidence] = useState('');

  const selectedCategory = caseCategories.find(c => c.value === category);
  const canIncludeFine = selectedCategory?.canIncludeFine || false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const caseData: HostCaseData = {
      category,
      description,
      urgency,
      includeFine,
      ...(includeFine && {
        fineAmount: parseFloat(fineAmount),
        fineReason
      }),
      evidence
    };

    onSubmit(caseData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Open Case Against Participant</h2>
            </div>
            <div className="text-sm text-white/90 space-y-1">
              <p><strong>Participant:</strong> {participantName} ({participantEmail})</p>
              <p><strong>Property:</strong> {listingTitle}</p>
              <p><strong>Reservation ID:</strong> {reservationId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold mb-1">Important Legal Notice</p>
              <p>Cases should only be opened for legitimate concerns with valid evidence. False or frivolous claims may result in penalties. All cases are reviewed by Voya support team and may be subject to arbitration.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Case Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {caseCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setCategory(cat.value);
                    if (!cat.canIncludeFine) {
                      setIncludeFine(false);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    category === cat.value
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white mb-1">
                    {cat.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {cat.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Urgency Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Low', color: 'green', desc: 'Non-urgent, can wait' },
                { value: 'medium', label: 'Medium', color: 'yellow', desc: 'Should be addressed soon' },
                { value: 'high', label: 'High', color: 'red', desc: 'Urgent attention needed' }
              ].map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setUrgency(level.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    urgency === level.value
                      ? `border-${level.color}-500 bg-${level.color}-50 dark:bg-${level.color}-900/20 shadow-lg`
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`font-semibold mb-1 ${
                    urgency === level.value
                      ? `text-${level.color}-700 dark:text-${level.color}-300`
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {level.label}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {level.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide a detailed description of the issue, including dates, times, and specific incidents..."
              required
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Be specific and factual. Include dates, times, and relevant details.
            </p>
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Supporting Evidence
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Describe any evidence you have (photos, videos, witness statements, messages, etc.). Note: Actual files can be submitted to support after case is created."
                rows={4}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Evidence strengthens your case and helps with resolution.
            </p>
          </div>

          {/* Fine Section */}
          {canIncludeFine && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  id="includeFine"
                  checked={includeFine}
                  onChange={(e) => setIncludeFine(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="includeFine" className="font-semibold text-slate-900 dark:text-white cursor-pointer">
                    Include Fine/Charge
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Request financial compensation for damages, violations, or extra costs incurred
                  </p>
                </div>
              </div>

              {includeFine && (
                <div className="space-y-4 pl-7 border-l-2 border-primary">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Fine Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={fineAmount}
                        onChange={(e) => setFineAmount(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required={includeFine}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      The amount will be reviewed and may be adjusted by support team
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Justification for Fine <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={fineReason}
                      onChange={(e) => setFineReason(e.target.value)}
                      placeholder="Explain why this fine is reasonable and provide breakdown if applicable (e.g., repair costs $150, cleaning $50, total $200)..."
                      required={includeFine}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Provide itemized breakdown and reasonable justification. Include receipts or estimates in evidence.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fair Use Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Fair Use Reminder</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Only file cases for legitimate issues</li>
                  <li>Provide honest and accurate information</li>
                  <li>Fines must be reasonable and justified</li>
                  <li>All cases are subject to review and mediation</li>
                  <li>False claims may result in penalties</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!category || !description}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                !category || !description
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
              }`}
            >
              Submit Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
