import { useEffect, useState } from 'react';

const LoadingFallback = () => {
  const [colorIndex, setColorIndex] = useState(0);

  const colors = [
    ['bg-text-linear1', 'bg-text-linear2', 'bg-text-linear3'], // 1-2-3
    ['bg-text-linear2', 'bg-text-linear3', 'bg-text-linear1'], // 2-3-1
    ['bg-text-linear3', 'bg-text-linear1', 'bg-text-linear2'], // 3-1-2
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [colors.length]);

  const currentColors = colors[colorIndex];
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-12 text-gray-600">
        <img
          src="/bg-imgage/loading-picture.gif"
          alt="Loading..."
          className="max-tablet:h-1/2 max-tablet:w-1/2 max-mobile:h-1/4 max-mobile:w-1/4 h-1/3 w-1/6 mix-blend-multiply"
          style={{
            filter: 'contrast(1.1) brightness(1.1)    ',
          }}
        />
        <div className="flex items-center justify-center space-x-4">
          <span className="ml-3 animate-pulse text-lg">Đang tải</span>

          <div className="flex space-x-1">
            <div
              className={`h-3 w-3 animate-bounce rounded-full transition-colors duration-300 ${currentColors[0]}`}
            />
            <div
              className={`h-3 w-3 animate-bounce rounded-full transition-colors duration-300 ${currentColors[1]}`}
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className={`h-3 w-3 animate-bounce rounded-full transition-colors duration-300 ${currentColors[2]}`}
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingFallback;
