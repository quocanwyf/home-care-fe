import { Upload } from 'lucide-react';

import DragAndDropUpload from '@/components/common/upload-files/DragAndDropUpload';
import type { MaidFormData } from '@/types/schema/maid-form-schema-type';

interface UploadAreaProps {
  onUpdate: (updates: Partial<MaidFormData>) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUpdate }) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const handleAvatarChange = (files: File[]) => {
    onUpdate({ avatar: files });
    // console.log(files);
  };

  const handleHealthCertificatesChange = (files: File[]) => {
    onUpdate({ healthCertificates: files });
  };

  return (
    <div className="bg-overlay-slider/8 mb-6 rounded-lg p-6 pb-24">
      <div className="text-overlay-slider mt-4 mb-5 flex flex-row items-center font-bold">
        <Upload className="-mt-1 mr-2 h-5 w-5" />
        <p className="text-sm">PERSONAL INFORMATION</p>
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
          <p className="mt-3 text-xs text-gray-500">
            Upload up to 5 image files (JPEG, PNG, GIF). Max size per file: 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
