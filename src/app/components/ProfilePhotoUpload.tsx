import { Camera, User } from 'lucide-react';
import { useState } from 'react';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  userName: string;
  onPhotoChange: (photoUrl: string) => void;
}

export function ProfilePhotoUpload({ currentPhoto, userName, onPhotoChange }: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onPhotoChange(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const getInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {currentPhoto ? (
          <img
            src={currentPhoto}
            alt={userName}
            className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-semibold border-4 border-background shadow-lg">
            {getInitials()}
          </div>
        )}

        <label
          htmlFor="profile-photo-upload"
          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md"
        >
          <Camera className="w-4 h-4" />
          <input
            id="profile-photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {isUploading && (
        <p className="text-xs text-muted-foreground">Uploading...</p>
      )}

      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Click the camera icon to upload a profile photo
      </p>
    </div>
  );
}
