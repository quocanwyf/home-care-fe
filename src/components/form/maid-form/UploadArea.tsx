import { ExternalLink, Upload } from 'lucide-react';

import DragAndDropUpload from '@/components/common/upload-files/DragAndDropUpload';
import type { MaidFormData } from '@/types/schema/maid-form-schema-type';

interface UploadAreaProps {
  data: MaidFormData;
  onUpdate: (updates: Partial<MaidFormData>) => void;
  existingAvatar?: string;
  existingHealthCertificates?: string[];
  mode?: 'create' | 'edit';
}

const UploadArea: React.FC<UploadAreaProps> = ({
  data,
  onUpdate,
  existingAvatar,
  existingHealthCertificates = [],
  mode = 'create',
}) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const handleAvatarChange = (files: File[]) => {
    onUpdate({ avatar: files });
  };

  const handleHealthCertificatesChange = (files: File[]) => {
    onUpdate({ healthCertificates: files });
  };

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-overlay-slider/8 mb-6 rounded-lg p-6 pb-24">
      <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
        <Upload className="-mt-1 mr-2 h-5 w-5" />
        <p className="text-sm">UPLOAD FILES</p>
      </div>

      <div className="max-tablet:grid-cols-1 max-tablet:gap-20 grid grid-cols-2 gap-6">
        {/* Avatar Upload */}
        <div>
          <h4 className="text-md mb-3 font-medium text-gray-700">
            Avatar <span className="text-red-500">*</span>
          </h4>

          <DragAndDropUpload
            acceptedTypes={imageTypes}
            maxFileSizeByMB={5}
            maxFiles={1}
            onFilesChange={handleAvatarChange}
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
          </p>
        </div>

        {/* Health Certificates Upload */}
        <div>
          <h4 className="text-md mb-3 font-medium text-gray-700">
            Health Certificates <span className="text-red-500">*</span>
          </h4>

          <DragAndDropUpload
            acceptedTypes={imageTypes}
            maxFileSizeByMB={10}
            maxFiles={5}
            onFilesChange={handleHealthCertificatesChange}
            browseText="Choose Certificates"
            showFileSize={true}
          />
          {/* Show existing certificates in edit mode */}
          {mode === 'edit' && existingHealthCertificates.length > 0 && (
            <div className="my-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex flex-row justify-between space-y-2">
                <span className="text-sm text-green-700">
                  Current certificates ({existingHealthCertificates.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {existingHealthCertificates.map((cert, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => openImageInNewTab(cert)}
                      className="flex items-center rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Certificate {index + 1}{' '}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Upload up to 5 image files (JPEG, PNG, GIF). Max size per file: 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
