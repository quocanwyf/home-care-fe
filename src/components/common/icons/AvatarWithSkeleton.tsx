import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface AvatarWithSkeletonProps {
  src: string;
  alt?: string;
  size?: number;
}

const AvatarWithSkeleton = ({
  src,
  alt = 'Avatar',
  size = 40,
}: AvatarWithSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {!loaded && <Skeleton className="h-full w-full rounded-full" />}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full rounded-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'absolute opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/bg-imgage/deny.gif';
          setLoaded(true);
        }}
      />
    </div>
  );
};

export default AvatarWithSkeleton;
