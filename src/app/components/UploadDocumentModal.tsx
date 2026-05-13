import { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadDocumentModalProps {
  onClose: () => void;
  onSubmit: (documentContent: string, documentType: 'rental-agreement' | 'house-rules') => void;
  documentType: 'rental-agreement' | 'house-rules';
  listingTitle: string;
  existingContent?: string;
}

export function UploadDocumentModal({
  onClose,
  onSubmit,
  documentType,
  listingTitle,
  existingContent = ''
}: UploadDocumentModalProps) {
  const [content, setContent] = useState(existingContent);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, documentType);
      onClose();
    }
  };

  const title = documentType === 'rental-agreement' ? 'Rental Agreement' : 'House Rules';
  const icon = documentType === 'rental-agreement' ? '📄' : '📋';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{icon}</span>
              <h2 className="text-2xl font-bold">Upload {title}</h2>
            </div>
            <p className="text-sm text-white/90">
              <strong>Property:</strong> {listingTitle}
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
                {documentType === 'rental-agreement'
                  ? 'Participants will be required to read and agree to this rental agreement before completing their reservation. Make sure all terms are clear and legally compliant.'
                  : 'Participants must review and accept these house rules before booking. Include all important guidelines for staying at your property.'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload from File */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Upload from File (Optional)
            </label>
            <label className="block">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  Click to upload a file
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
          </div>

          {/* Text Editor */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {title} Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                documentType === 'rental-agreement'
                  ? `Enter your rental agreement here...\n\nExample:\n\nRENTAL AGREEMENT\n\n1. Term of Lease\nThis agreement is for the period of [dates]...\n\n2. Rent Payment\nMonthly rent is $[amount] due on the [day] of each month...\n\n3. Security Deposit\nA deposit of $[amount] is required...\n\n4. Responsibilities\n- Tenant responsibilities...\n- Landlord responsibilities...`
                  : `Enter your house rules here...\n\nExample:\n\nHOUSE RULES\n\n1. Quiet Hours: 10 PM - 8 AM\n2. No smoking inside the property\n3. Maximum [number] guests\n4. No parties or events\n5. Keep common areas clean\n6. Respect neighbors\n7. No pets allowed\n8. Check-out time: 11 AM`
              }
              required
              rows={20}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {content.length} characters • {content.split('\n').length} lines
            </p>
          </div>

          {/* Preview */}
          {content && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Preview</h3>
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                {content}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="text-red-500">*</span> Participants must agree to this before booking
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
              disabled={!content.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                !content.trim()
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              Save {title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
