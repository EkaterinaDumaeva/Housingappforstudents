import { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';

interface SendJobOfferModalProps {
  onClose: () => void;
  onSubmit: (offerData: {
    jobTitle: string;
    salary: string;
    startDate: string;
    endDate: string;
    location: string;
    additionalDetails: string;
    offerDocument?: string;
  }) => void;
  candidateName: string;
}

export function SendJobOfferModal({
  onClose,
  onSubmit,
  candidateName
}: SendJobOfferModalProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [offerDocument, setOfferDocument] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setOfferDocument(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      jobTitle,
      salary,
      startDate,
      endDate,
      location,
      additionalDetails,
      offerDocument: offerDocument || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Send Job Offer</h2>
            </div>
            <p className="text-sm text-white/90">
              <strong>Candidate:</strong> {candidateName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Important Information</p>
              <p>
                This job offer will be sent to the candidate for review and signature. Make sure all details are accurate and complete.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Summer Marketing Intern"
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Salary/Compensation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g., $18/hour or $3,000/month"
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Work Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 123 Main St, New York, NY 10001"
              required
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Additional Details
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Include any additional information such as benefits, work schedule, responsibilities, etc."
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Upload Formal Offer Document (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Upload Formal Offer Letter (Optional)
            </label>
            <label className="block">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  Click to upload offer letter
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Supported: TXT, PDF, DOC, DOCX
                </p>
                {fileName && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{fileName}</span>
                  </div>
                )}
              </div>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              You can upload a formal offer letter document or the candidate will receive the offer based on the information provided above.
            </p>
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
              className="px-6 py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
            >
              Send Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
