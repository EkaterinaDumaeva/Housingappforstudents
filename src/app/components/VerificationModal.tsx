import { useState } from 'react';
import { X, Upload, CheckCircle, Mail, Phone, Video, CreditCard } from 'lucide-react';

interface VerificationModalProps {
  onClose: () => void;
  onSubmit: () => void;
  userEmail?: string;
  userPhone?: string;
}

export function VerificationModal({ onClose, onSubmit, userEmail, userPhone }: VerificationModalProps) {
  const [step, setStep] = useState<'email' | 'phone' | 'documents' | 'success'>('email');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendEmailVerification = () => {
    // Simulate sending email
    setTimeout(() => {
      setEmailVerified(true);
      setTimeout(() => {
        setStep('phone');
      }, 1500);
    }, 1000);
  };

  const handleSendPhoneCode = () => {
    setCodeSent(true);
  };

  const handleVerifyPhone = () => {
    if (phoneCode.length === 6) {
      setPhoneVerified(true);
      setTimeout(() => {
        setStep('documents');
      }, 1500);
    }
  };

  const handleSubmit = () => {
    setStep('success');
    setTimeout(() => {
      onSubmit();
      onClose();
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="w-full">
        <div className="bg-background rounded-2xl w-full p-8 text-center shadow-lg border border-border">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="mb-2">Verification Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your verification is being reviewed. You'll receive an email within 48 hours with the results.
          </p>
          <div className="bg-accent/30 rounded-xl p-3 text-sm text-muted-foreground">
            Please allow up to 48 hours for our team to review your documents and video.
          </div>
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="w-full">
        <div className="bg-background rounded-2xl w-full shadow-lg border border-border">
          <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
            <h2>Email Verification</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2">Step 1: Verify Your Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll send a verification link to your email address
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Email Address</div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{userEmail}</span>
              </div>
            </div>

            {!emailVerified ? (
              <button
                onClick={handleSendEmailVerification}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.98] transition-transform"
              >
                Send Verification Email
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-green-700">Email Verified!</div>
                  <div className="text-xs text-green-600">Proceeding to phone verification...</div>
                </div>
              </div>
            )}

            <div className="bg-accent/30 rounded-xl p-3 text-xs text-muted-foreground">
              <strong>Note:</strong> Check your inbox and spam folder for the verification email.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'phone') {
    return (
      <div className="w-full">
        <div className="bg-background rounded-2xl w-full shadow-lg border border-border">
          <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
            <h2>Phone Verification</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2">Step 2: Verify Your Phone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll send a 6-digit code to your phone number
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{userPhone}</span>
              </div>
            </div>

            {!codeSent ? (
              <button
                onClick={handleSendPhoneCode}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.98] transition-transform"
              >
                Send Verification Code
              </button>
            ) : (
              <>
                {!phoneVerified ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                      Code sent! Check your messages.
                    </div>

                    <div>
                      <label className="block mb-2">Enter 6-Digit Code</label>
                      <input
                        type="text"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-widest"
                      />
                    </div>

                    <button
                      onClick={handleVerifyPhone}
                      disabled={phoneCode.length !== 6}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                    >
                      Verify Code
                    </button>

                    <button
                      onClick={handleSendPhoneCode}
                      className="w-full text-sm text-primary hover:underline"
                    >
                      Resend Code
                    </button>
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-green-700">Phone Verified!</div>
                      <div className="text-xs text-green-600">Proceeding to document upload...</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-background rounded-2xl w-full shadow-lg border border-border">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2>Document Upload</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-2">Step 3: Upload Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please upload your ID and a selfie video for verification
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-primary rounded-full"></div>
          </div>

          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Government-issued ID</span>
              </div>
            </label>
            <div
              onClick={() => setIdUploaded(true)}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                idUploaded
                  ? 'border-green-500 bg-green-50'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              <Upload className={`w-8 h-8 mx-auto mb-2 ${idUploaded ? 'text-green-600' : 'text-muted-foreground'}`} />
              <p className="text-sm">
                {idUploaded ? 'ID Uploaded ✓' : 'Click to upload ID'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Driver's license, passport, or national ID
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Selfie Video</span>
              </div>
            </label>
            <div
              onClick={() => setVideoUploaded(true)}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                videoUploaded
                  ? 'border-green-500 bg-green-50'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              <Video className={`w-8 h-8 mx-auto mb-2 ${videoUploaded ? 'text-green-600' : 'text-muted-foreground'}`} />
              <p className="text-sm">
                {videoUploaded ? 'Video Uploaded ✓' : 'Click to record or upload video'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Record a short video (5-10 seconds) showing your face
              </p>
            </div>
          </div>

          <div className="bg-accent/50 rounded-xl p-4">
            <h4 className="text-sm mb-2">Verification Process</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Our team will review your documents within 48 hours</li>
              <li>• You'll receive an email notification with the results</li>
              <li>• Once verified, you'll get the "Verified" badge on your profile</li>
              <li>• Build trust and increase your credibility on the platform</li>
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!idUploaded || !videoUploaded}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
          >
            Submit for Verification
          </button>

          <div className="text-center text-xs text-muted-foreground">
            All information is encrypted and securely stored
          </div>
        </div>
      </div>
    </div>
  );
}
