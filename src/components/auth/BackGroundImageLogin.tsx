import { useEffect, useState } from 'react';

const BackGroundImageLogin = () => {
  const [currentImageSet, setCurrentImageSet] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imageSets = [
    [
      '/bg-imgage/photo-9.png',
      '/bg-imgage/photo-4.png',
      '/bg-imgage/photo-3.png',
      '/bg-imgage/photo-1.png',
    ],
    [
      '/bg-imgage/photo-1.png',
      '/bg-imgage/photo-9.png',
      '/bg-imgage/photo-4.png',
      '/bg-imgage/photo-3.png',
    ],
    [
      '/bg-imgage/photo-3.png',
      '/bg-imgage/photo-1.png',
      '/bg-imgage/photo-9.png',
      '/bg-imgage/photo-4.png',
    ],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImageSet((prev) => (prev + 1) % imageSets.length);
        setIsTransitioning(false);
      }, 1500);
    }, 6000);

    return () => clearInterval(interval);
  }, [imageSets.length]);

  return (
    <div className="flex min-h-screen min-w-screen flex-col justify-around">
      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 2 columns */}
      <div className="mx-4 flex flex-col justify-between gap-4 md:mx-20 md:flex-row md:gap-6 xl:mx-40 xl:gap-0">
        <div className="h-[160px] w-full overflow-hidden rounded-lg md:h-[220px] md:w-[400px] xl:w-[400px]">
          <img
            src={imageSets[currentImageSet][0]}
            alt="Service 1"
            className={`h-full w-full transform object-cover transition-all duration-[1500ms] ease-in-out ${
              isTransitioning ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
        </div>
        <div className="h-[160px] w-full overflow-hidden rounded-lg md:h-[220px] md:w-[500px] xl:w-[500px]">
          <img
            src={imageSets[currentImageSet][1]}
            alt="Service 2"
            className={`h-full w-full transform object-cover transition-all duration-[1500ms] ease-in-out ${
              isTransitioning ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
        </div>
      </div>
      <div className="mx-4 mb-10 flex flex-col justify-between gap-4 md:mx-20 md:flex-row md:gap-6 xl:mx-40 xl:gap-0">
        <div className="h-[160px] w-full overflow-hidden rounded-lg md:h-[220px] md:w-[500px] xl:w-[500px]">
          <img
            src={imageSets[currentImageSet][2]}
            alt="Service 3"
            className={`h-full w-full transform object-cover transition-all duration-[1500ms] ease-in-out ${
              isTransitioning ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
        </div>
        <div className="h-[160px] w-full overflow-hidden rounded-lg md:h-[220px] md:w-[400px] xl:w-[400px]">
          <img
            src={imageSets[currentImageSet][3]}
            alt="Service 4"
            className={`h-full w-full transform object-cover transition-all duration-[1500ms] ease-in-out ${
              isTransitioning ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default BackGroundImageLogin;
