import { type JSX, useEffect, useState } from 'react';

import { Download, RotateCw, Trash, X, ZoomIn, ZoomOut } from 'lucide-react';

interface FilePreviewItemProps {
  show?: boolean;
  onClose?: () => void;
  onDelete?: (index: number) => void;
  fileIndex?: number;
  fileList?: File[];
}

const FilePreviewItem: React.FC<FilePreviewItemProps> = ({
  show = false,
  onClose = () => {},
  onDelete = () => {},
  fileIndex = 0,
  fileList = [],
}) => {
  const [rotate, setRotate] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(fileIndex);

  const currentFile = fileList[currentIndex];

  useEffect(() => {
    setRotate(0);
    setZoom(1);
  }, [currentIndex]);

  useEffect(() => {
    setCurrentIndex(fileIndex);
  }, [fileIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!show || !currentFile) return null;

  const getPreview = (): JSX.Element => {
    const type = currentFile.type;

    const commonStyle: React.CSSProperties = {
      transform: `scale(${zoom}) rotate(${rotate}deg)`,
      transition: 'all 0.3s ease',
    };

    if (type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(currentFile)}
          alt={currentFile.name}
          style={commonStyle}
          className="mx-auto max-h-[60vh] max-w-full object-contain"
        />
      );
    }

    if (type.startsWith('video/')) {
      return (
        <video
          controls
          src={URL.createObjectURL(currentFile)}
          className="mx-auto max-h-[60vh] max-w-full"
        />
      );
    }

    if (type === 'application/pdf') {
      return (
        <iframe
          src={URL.createObjectURL(currentFile)}
          title="PDF Preview"
          className="h-[60vh] w-full rounded border"
        />
      );
    }

    return <p className="text-center text-gray-600">Không thể preview</p>;
  };

  const handleDownload = (): void => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(currentFile);
    a.download = currentFile.name;
    a.click();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-gray-300/10 backdrop-blur-sm"
    >
      {/* Modal popup */}
      <div
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative z-50 mx-4 w-full max-w-3xl rounded-xl border bg-white p-6 shadow-lg"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-row space-x-2">
            <p className="font-semibold">Preview file:</p>
            <p>{currentFile.name}</p>
          </div>
          <button
            className="cursor-pointer rounded-full p-2 hover:bg-gray-200"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content file */}
        <div className="mb-4 flex max-h-[60vh] items-center justify-center overflow-hidden rounded bg-gray-100 p-2">
          {getPreview()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-full p-2 hover:bg-gray-200"
              onClick={() => setZoom(zoom + 0.2)}
            >
              <ZoomIn size={20} />
            </button>
            <button
              className="cursor-pointer rounded-full p-2 hover:bg-gray-200"
              onClick={() => setZoom(Math.max(1, zoom - 0.2))}
            >
              <ZoomOut size={19} />
            </button>
            <button
              className="cursor-pointer rounded-full p-2 hover:bg-gray-200"
              onClick={() => setRotate(rotate + 90)}
            >
              <RotateCw size={19} />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-full p-2 text-blue-500 hover:bg-gray-200"
              onClick={handleDownload}
            >
              <Download size={19} />
            </button>
            <button
              className="cursor-pointer rounded-full p-2 text-red-500 hover:bg-red-200"
              onClick={() => onDelete(currentIndex)}
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewItem;
