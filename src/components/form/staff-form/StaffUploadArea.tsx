import { ExternalLink, Upload } from 'lucide-react';

import DragAndDropUpload from '@/components/common/upload-files/DragAndDropUpload';

interface StaffUploadAreaProps {
  avatar: File[];
  onAvatarChange: (files: File[]) => void;
  existingAvatar?: string;
  mode?: 'create' | 'edit';
}

const StaffUploadArea: React.FC<StaffUploadAreaProps> = ({
  avatar,
  onAvatarChange,
  existingAvatar,
  mode = 'create',
}) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-overlay-slider/8 shadow-around mb-6 w-full rounded-md px-4 pt-2 pb-4">
      <div className="text-overlay-slider mx-2 mt-4 mb-5 flex flex-row items-center font-bold">
        <Upload className="-mt-1 mr-2 h-5 w-5" />
        <p className="text-sm">AVATAR</p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-md mb-3 font-medium text-gray-700">
            Avatar{' '}
            {mode === 'create' && <span className="text-red-500">*</span>}
            {mode === 'edit' && (
              <span className="text-gray-500">
                (Optional - leave empty to keep current)
              </span>
            )}
          </h4>

          <DragAndDropUpload
            acceptedTypes={imageTypes}
            maxFileSizeByMB={5}
            maxFiles={1}
            onFilesChange={onAvatarChange}
            browseText="Choose Avatar"
            showFileSize={true}
          />

          {/* Show existing avatar in edit mode */}
          {mode === 'edit' && existingAvatar && (
            <div className="my-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">
                  Current avatar is uploaded
                </span>
                <button
                  type="button"
                  onClick={() => openImageInNewTab(existingAvatar)}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  View <ExternalLink className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-gray-500">
            Upload 1 image file (JPEG, PNG, GIF). Max size: 5MB
            {mode === 'edit' && ' - Leave empty to keep current avatar'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffUploadArea;
