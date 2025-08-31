import { type JSX, useRef, useState } from 'react';

import { Eye, Trash, UploadCloud } from 'lucide-react';

import FilePreviewItem from '@/components/common/upload-files/FilePreviewItem';
import { useToast } from '@/hooks/common/useToast';

import TooltipInfo from '../primitives/TooltipInfo';

interface DragAndDropUploadProps {
  acceptedTypes?: string[];
  maxFileSizeByMB?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  browseText?: string;
  showFileSize?: boolean;
}

const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({
  acceptedTypes = [],
  maxFileSizeByMB = 10,
  maxFiles = 5,
  onFilesChange = () => {},
  browseText = 'Browse',
  showFileSize = true,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles: File[]): void => {
    const validFiles: File[] = [];
    const errorFiles: File[] = [];

    selectedFiles.forEach((file) => {
      const isValidType =
        acceptedTypes.length === 0 || acceptedTypes.includes(file.type);
      const isValidSize = file.size / 1024 / 1024 <= maxFileSizeByMB;

      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        errorFiles.push(file);
      }
    });

    if (errorFiles.length > 0) {
      const names = errorFiles.map((f) => f.name).join(', ');
      showError(`File is invalid: ${names}`);
    }

    // Limit to maxFiles
    const newFiles = [...files, ...validFiles];
    if (newFiles.length > maxFiles) {
      const allowedFiles = newFiles.slice(0, maxFiles);
      showWarning(`Only accept max ${maxFiles} file.`);
      setFiles(allowedFiles);
      onFilesChange(allowedFiles);
    } else {
      setFiles(newFiles);
      onFilesChange(newFiles);
      if (validFiles.length > 0) {
        const names = validFiles.map((f) => f.name).join(', ');
        showSuccess(`Upload successfully: ${names}`);
      }
    }
  };

  const removeFile = (index: number): void => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
    showInfo('Deleted file.');
  };

  const previewFile = (index: number): void => {
    setSelectedIndex(index);
    setPreviewOpen(true);
  };

  const handleDeleteFromPreview = (index: number): void => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
    setPreviewOpen(false);
    showInfo('Đã xoá file trong preview.');
  };

  const renderQuickPreview = (file: File): JSX.Element | null => {
    if (!file) return null;

    const type = file.type;
    const url = URL.createObjectURL(file);

    if (type.startsWith('image/')) {
      return (
        <img
          src={url}
          alt={file.name}
          className="object-fit h-40 w-40 rounded-lg border shadow-md"
        />
      );
    }

    if (type.startsWith('video/')) {
      return (
        <video
          src={url}
          muted
          className="object-fit h-40 w-40 rounded-lg border shadow-md"
        />
      );
    }
    return <></>;
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto h-full w-full max-w-xl rounded-xl border-2 border-dashed border-gray-400 px-2">
      <div
        className="flex h-32 cursor-pointer flex-col items-center justify-center"
        onDragOver={(e: React.DragEvent) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <UploadCloud
          className="text-overlay-slider h-12 w-12"
          strokeWidth={0.8}
        />
        <div className="mt-2 flex flex-row space-x-1 text-sm">
          <p className="font-semibold text-black">Drag & drop files or </p>
          <p className="font-semibold text-purple-800 underline">
            {''} {browseText}
          </p>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>

      <div>
        {files.map((file, index) => (
          <div
            key={index}
            className="mx-4 mb-4 flex items-center justify-between rounded-sm border p-2"
          >
            <div>
              <p
                className="relative ml-4 cursor-pointer font-semibold"
                onClick={() => previewFile(index)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <p className="text-sm">{file.name}</p>
                {hoverIndex === index && (
                  <div className="absolute top-0 -right-42 z-50 ml-2">
                    {renderQuickPreview(file)}
                  </div>
                )}
              </p>
              {showFileSize && (
                <p className="ml-4 text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
            <div className="mr-4 flex flex-row space-x-5">
              <button
                className="cursor-pointer rounded-full text-blue-500"
                onClick={() => previewFile(index)}
              >
                <TooltipInfo content="Preview">
                  <Eye size={15} />
                </TooltipInfo>
              </button>
              <button
                className="cursor-pointer text-red-500"
                onClick={() => removeFile(index)}
              >
                <TooltipInfo content="Delete">
                  <Trash size={14} />
                </TooltipInfo>
              </button>
            </div>
          </div>
        ))}
      </div>
      <FilePreviewItem
        fileList={files}
        fileIndex={selectedIndex}
        show={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onDelete={handleDeleteFromPreview}
      />
    </div>
  );
};

export default DragAndDropUpload;
